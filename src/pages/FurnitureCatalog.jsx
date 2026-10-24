import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { useSettings } from '../context/SettingsContext';
import { useLanguage } from '../context/LanguageContext';
import { ProductCard } from '../components/ProductCard';
import { FigmaCollectionCarousel } from '../components/FigmaCollectionCarousel';
import { HeaderAfishaSlideshow } from '../components/HeaderAfishaSlideshow';
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  RotateCcw,
  Store,
  Star,
  Tag,
  Percent,
  Sparkles,
  Bed,
  Sofa,
  UtensilsCrossed,
  Layers
} from 'lucide-react';

export const FurnitureCatalog = () => {
  const { settings } = useSettings();
  const { t, language, getLocalized } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States extracted from URL
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedFilter, setSelectedFilter] = useState(searchParams.get('filter') || 'all'); // 'discount' | 'all'
  const [selectedSub, setSelectedSub] = useState(searchParams.get('sub') || ''); // e.g. 'matras'
  const [selectedStore, setSelectedStore] = useState(searchParams.get('store') || 'all');
  const [maxPrice, setMaxPrice] = useState(30000000);
  const [selectedColor, setSelectedColor] = useState('all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'rating_desc');
  const [visibleCount, setVisibleCount] = useState(12);

  // Sub-category filter specifically for discount page
  const [discountCategoryFilter, setDiscountCategoryFilter] = useState('all');

  // Mobile filter sidebar toggle
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState('all');

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [prodList, catList, storeList, colList] = await Promise.all([
          dataService.getProducts(),
          dataService.getCategories(),
          dataService.getStores(),
          dataService.getCollections()
        ]);
        setProducts(prodList || []);
        setCategories(catList || []);
        setStores(storeList || []);
        setCollections(colList || []);
      } catch (e) {
        console.error('Error loading products:', e);
      } finally {
        setLoading(false);
      }
    };
    loadData();

    // Listen to category and collection updates from admin
    const handleCategoryUpdate = () => {
      dataService.getCategories().then((cats) => setCategories(cats || []));
    };
    const handleCollectionsUpdate = () => {
      dataService.getCollections().then((cols) => setCollections(cols || []));
    };
    window.addEventListener('urgut_store_categories_updated', handleCategoryUpdate);
    window.addEventListener('urgut_store_collections_updated', handleCollectionsUpdate);
    return () => {
      window.removeEventListener('urgut_store_categories_updated', handleCategoryUpdate);
      window.removeEventListener('urgut_store_collections_updated', handleCollectionsUpdate);
    };
  }, []);

  // Sync state with URL search parameters
  useEffect(() => {
    const cat = searchParams.get('category') || 'all';
    setSelectedCategory(cat);

    const filter = searchParams.get('filter') || 'all';
    setSelectedFilter(filter);

    const sub = searchParams.get('sub') || '';
    setSelectedSub(sub);

    const search = searchParams.get('search') || '';
    setSearchQuery(search);

    const store = searchParams.get('store') || 'all';
    setSelectedStore(store);

    const col = searchParams.get('collection') || 'all';
    setSelectedCollection(col);

    const sort = searchParams.get('sort') || (filter === 'discount' ? 'discount_desc' : 'rating_desc');
    setSortBy(sort);

    // Scroll top smoothly on category/filter change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchParams]);

  // Color Swatches
  const figmaColorSwatches = [
    { label: 'Qora / Antrasit', color: '#1F2937', val: 'qora' },
    { label: 'Yalpiz yashil', color: '#A7D7C5', val: 'yashil' },
    { label: 'Shaftoli', color: '#FBC7A7', val: 'shaftoli' },
    { label: 'Moviy osmon', color: '#A0C4E2', val: 'ko‘k' },
    { label: 'Korall qizil', color: '#FA6D58', val: 'qizil' },
    { label: 'Och sarg‘ish', color: '#F7E7CE', val: 'krem' }
  ];

  // Helper to match category with aliases
  const isProductInCategory = (prod, targetCategory) => {
    if (!targetCategory || targetCategory === 'all') return true;
    const catLower = targetCategory.toLowerCase();

    if (prod.category_id === targetCategory || prod.category_id?.toLowerCase() === catLower) return true;

    // Check slug from loaded categories
    const matchedCategory = categories.find((c) => c.id === targetCategory || c.slug === targetCategory);
    if (matchedCategory && (prod.category_id === matchedCategory.id || prod.category_id === matchedCategory.slug)) {
      return true;
    }

    // Mehmonxona (cat-1 / cat-living)
    if (catLower === 'cat-1' || catLower === 'mehmonxona' || catLower === 'cat-living') {
      return (
        prod.category_id === 'cat-1' ||
        prod.category_id === 'cat-living' ||
        prod.tags?.some((t) => ['mehmonxona', 'vitrina', 'divan', 'tv podstavka'].includes(t.toLowerCase()))
      );
    }

    // Yotoqxona (cat-2 / cat-bedroom)
    if (catLower === 'cat-2' || catLower === 'yotoqxona' || catLower === 'cat-bedroom') {
      return (
        prod.category_id === 'cat-2' ||
        prod.category_id === 'cat-bedroom' ||
        prod.tags?.some((t) => ['yotoqxona', 'karavot', 'krovat', 'shkaf', 'matras'].includes(t.toLowerCase()))
      );
    }

    // Oshxona (cat-3 / cat-dining / kitchen / cat-dining-sets)
    if (catLower === 'cat-3' || catLower === 'oshxona' || catLower === 'cat-dining' || catLower === 'cat-dining-sets') {
      return (
        prod.category_id === 'cat-3' ||
        prod.category_id === 'cat-dining' ||
        prod.category_id === 'cat-dining-sets' ||
        prod.tags?.some((t) => ['oshxona', 'stol', 'stul', 'garnitur', 'bufet', 'dining'].includes(t.toLowerCase()))
      );
    }

    // Ofis (cat-4 / ofis)
    if (catLower === 'cat-4' || catLower === 'ofis') {
      return (
        prod.category_id === 'cat-4' ||
        prod.tags?.some((t) => ['ofis', 'ish', 'yozuv stoli', 'kreslo'].includes(t.toLowerCase()))
      );
    }

    // Bolalar (cat-5 / bolalar)
    if (catLower === 'cat-5' || catLower === 'bolalar') {
      return (
        prod.category_id === 'cat-5' ||
        prod.tags?.some((t) => ['bolalar', 'karavot', 'kichik'].includes(t.toLowerCase()))
      );
    }

    // Yumshoq mebellar / Divanlar (cat-6 / cat-sofas / yumshoq-mebellar / sofas)
    if (catLower === 'cat-6' || catLower === 'yumshoq-mebellar' || catLower === 'cat-sofas' || catLower === 'divanlar' || catLower === 'sofas') {
      return (
        prod.category_id === 'cat-6' ||
        prod.category_id === 'cat-sofas' ||
        prod.tags?.some((t) => ['divan', 'kreslo', 'yumshoq', 'sofa'].includes(t.toLowerCase())) ||
        prod.name?.toLowerCase().includes('divan')
      );
    }

    // Shoe Racks (cat-shoe-racks / shoe-racks)
    if (catLower === 'cat-shoe-racks' || catLower === 'shoe-racks') {
      return (
        prod.category_id === 'cat-shoe-racks' ||
        prod.tags?.some((t) => ['shoe', 'poyabzal', 'shoe-racks'].includes(t.toLowerCase())) ||
        prod.name?.toLowerCase().includes('poyabzal')
      );
    }

    // Beds / Hydraulic Beds (cat-beds / beds)
    if (catLower === 'cat-beds' || catLower === 'beds' || catLower === 'hydraulic-beds') {
      return (
        prod.category_id === 'cat-beds' ||
        prod.tags?.some((t) => ['bed', 'karavot', 'krovat'].includes(t.toLowerCase())) ||
        prod.name?.toLowerCase().includes('karavot')
      );
    }

    // Lounge Chairs (cat-lounge-chairs / lounge-chairs)
    if (catLower === 'cat-lounge-chairs' || catLower === 'lounge-chairs' || catLower === 'chairs') {
      return (
        prod.category_id === 'cat-lounge-chairs' ||
        prod.tags?.some((t) => ['lounge', 'kreslo', 'chairs'].includes(t.toLowerCase())) ||
        prod.name?.toLowerCase().includes('kreslo')
      );
    }

    // Coffee Tables (cat-coffee-tables / coffee-tables)
    if (catLower === 'cat-coffee-tables' || catLower === 'coffee-tables') {
      return (
        prod.category_id === 'cat-coffee-tables' ||
        prod.tags?.some((t) => ['coffee', 'kofe', 'jurnal'].includes(t.toLowerCase())) ||
        prod.name?.toLowerCase().includes('kofe') || prod.name?.toLowerCase().includes('jurnal')
      );
    }

    // TV Units (cat-tv-units / tv-units)
    if (catLower === 'cat-tv-units' || catLower === 'tv-units') {
      return (
        prod.category_id === 'cat-tv-units' ||
        prod.tags?.some((t) => ['tv', 'tv-units', 'podstavka'].includes(t.toLowerCase())) ||
        prod.name?.toLowerCase().includes('tv')
      );
    }

    // Wardrobes (cat-wardrobes / wardrobes)
    if (catLower === 'cat-wardrobes' || catLower === 'wardrobes') {
      return (
        prod.category_id === 'cat-wardrobes' ||
        prod.tags?.some((t) => ['wardrobe', 'wardrobes', 'shkaf', 'garderob'].includes(t.toLowerCase())) ||
        prod.name?.toLowerCase().includes('shkaf')
      );
    }

    // Chest of Drawers (cat-chest-drawers / chest-of-drawers)
    if (catLower === 'cat-chest-drawers' || catLower === 'chest-of-drawers') {
      return (
        prod.category_id === 'cat-chest-drawers' ||
        prod.tags?.some((t) => ['chest', 'komod', 'tortma'].includes(t.toLowerCase())) ||
        prod.name?.toLowerCase().includes('komod')
      );
    }

    // Mattresses (cat-mattresses / mattresses)
    if (catLower === 'cat-mattresses' || catLower === 'mattresses') {
      return prod.category_id === 'cat-mattresses' || isProductMatras(prod);
    }

    // Study Tables (cat-study-tables / study-tables / study)
    if (catLower === 'cat-study-tables' || catLower === 'study-tables' || catLower === 'study') {
      return (
        prod.category_id === 'cat-study-tables' ||
        prod.tags?.some((t) => ['study', 'yozuv stoli', 'ish stoli'].includes(t.toLowerCase())) ||
        prod.name?.toLowerCase().includes('stol')
      );
    }

    // C-Tables (cat-c-tables / c-tables)
    if (catLower === 'cat-c-tables' || catLower === 'c-tables') {
      return (
        prod.category_id === 'cat-c-tables' ||
        prod.tags?.some((t) => ['c-table', 'c-tables', 'yon stol'].includes(t.toLowerCase())) ||
        prod.name?.toLowerCase().includes('c-')
      );
    }

    // Bookshelves (cat-bookshelves / bookshelves)
    if (catLower === 'cat-bookshelves' || catLower === 'bookshelves') {
      return (
        prod.category_id === 'cat-bookshelves' ||
        prod.tags?.some((t) => ['bookshelf', 'bookshelves', 'kitob'].includes(t.toLowerCase())) ||
        prod.name?.toLowerCase().includes('kitob')
      );
    }

    // Sideboards (cat-sideboards / sideboards)
    if (catLower === 'cat-sideboards' || catLower === 'sideboards') {
      return (
        prod.category_id === 'cat-sideboards' ||
        prod.tags?.some((t) => ['sideboard', 'sideboards', 'bufet'].includes(t.toLowerCase())) ||
        prod.name?.toLowerCase().includes('bufet')
      );
    }

    // Recliners (cat-recliners / recliners)
    if (catLower === 'cat-recliners' || catLower === 'recliners') {
      return (
        prod.category_id === 'cat-recliners' ||
        prod.tags?.some((t) => ['recliner', 'recliners', 'reklayner'].includes(t.toLowerCase())) ||
        prod.name?.toLowerCase().includes('reklayner')
      );
    }

    // Decor (cat-decor / decor)
    if (catLower === 'cat-decor' || catLower === 'decor') {
      return (
        prod.category_id === 'cat-decor' ||
        prod.tags?.some((t) => ['decor', 'dekor', 'chiroq', 'yoruglik'].includes(t.toLowerCase())) ||
        prod.name?.toLowerCase().includes('dekor')
      );
    }

    return false;
  };

  // Helper for matras subcategory
  const isProductMatras = (prod) => {
    const q = 'matras';
    return (
      prod.name?.toLowerCase().includes(q) ||
      prod.tags?.some((t) => t.toLowerCase().includes(q)) ||
      prod.description?.toLowerCase().includes(q) ||
      prod.material?.toLowerCase().includes(q)
    );
  };

  // Check if a product is actually discounted
  const isProductDiscounted = (prod) => {
    return (
      prod.discount_price &&
      Number(prod.discount_price) > 0 &&
      Number(prod.discount_price) < Number(prod.price)
    );
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. DISCOUNT ONLY FILTER (When accessed via /furniture?filter=discount)
    if (selectedFilter === 'discount') {
      result = result.filter(isProductDiscounted);

      // If user toggled a category inside the discount page
      if (discountCategoryFilter !== 'all') {
        result = result.filter((p) => isProductInCategory(p, discountCategoryFilter));
      }
    }

    // 1b. UNDER 1,000,000 SO'M FILTER (When accessed via /furniture?filter=under1m)
    if (selectedFilter === 'under1m') {
      result = result.filter((p) => {
        const effPrice = p.discount_price && Number(p.discount_price) > 0 ? Number(p.discount_price) : Number(p.price);
        return effPrice <= 1000000;
      });
    }

    // 1c. COLLECTION FILTER (When accessed via /furniture?collection=col-id)
    if (selectedCollection && selectedCollection !== 'all') {
      const activeCol = collections.find((c) => c.id === selectedCollection || c.slug === selectedCollection);
      if (activeCol && Array.isArray(activeCol.product_ids) && activeCol.product_ids.length > 0) {
        result = result.filter((p) => activeCol.product_ids.includes(p.id));
      }
    }

    // 2. SUBCATEGORY FILTER (e.g. Matras)
    if (selectedSub === 'matras') {
      result = result.filter(isProductMatras);
    }

    // 3. MAIN CATEGORY FILTER (If not on discount-only page or if specified)
    if (selectedCategory !== 'all' && selectedFilter !== 'discount') {
      result = result.filter((p) => isProductInCategory(p, selectedCategory));
    }

    // 4. SEARCH QUERY
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.material?.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    // 5. COLOR FILTER
    if (selectedColor !== 'all') {
      result = result.filter((p) => p.colors?.some((c) => c.toLowerCase().includes(selectedColor)));
    }

    // 6. STORE FILTER
    if (selectedStore !== 'all') {
      result = result.filter((p) => p.store_id === selectedStore);
    }

    // 7. PRICE FILTER
    result = result.filter((p) => (p.discount_price || p.price) <= maxPrice);

    // 8. SORTING
    switch (sortBy) {
      case 'discount_desc':
        // Sort highest discount percentage first
        result.sort((a, b) => {
          const discountA = a.price ? (a.price - (a.discount_price || a.price)) / a.price : 0;
          const discountB = b.price ? (b.price - (b.discount_price || b.price)) / b.price : 0;
          return discountB - discountA;
        });
        break;
      case 'price_asc':
        result.sort((a, b) => (a.discount_price || a.price) - (b.discount_price || b.price));
        break;
      case 'price_desc':
        result.sort((a, b) => (b.discount_price || b.price) - (a.discount_price || a.price));
        break;
      case 'name_asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        break;
      case 'rating_desc':
      default:
        // Highest stars and review count
        result.sort((a, b) => {
          const ratingA = Number(a.rating) || 0;
          const ratingB = Number(b.rating) || 0;
          if (ratingB !== ratingA) return ratingB - ratingA;
          return (Number(b.reviews_count) || 0) - (Number(a.reviews_count) || 0);
        });
        break;
    }

    return result;
  }, [
    products,
    categories,
    searchQuery,
    selectedCategory,
    selectedFilter,
    selectedSub,
    discountCategoryFilter,
    selectedStore,
    selectedColor,
    maxPrice,
    sortBy
  ]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  // Discount counts by category for the discount pill bar
  const discountStats = useMemo(() => {
    const discountedAll = products.filter(isProductDiscounted);
    return {
      all: discountedAll.length,
      living: discountedAll.filter((p) => isProductInCategory(p, 'cat-1')).length,
      bedroom: discountedAll.filter((p) => isProductInCategory(p, 'cat-2')).length,
      dining: discountedAll.filter((p) => isProductInCategory(p, 'cat-3')).length,
      sofas: discountedAll.filter((p) => isProductInCategory(p, 'cat-6')).length
    };
  }, [products]);

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedFilter('all');
    setSelectedSub('');
    setDiscountCategoryFilter('all');
    setSelectedStore('all');
    setSelectedColor('all');
    setMaxPrice(30000000);
    setSortBy('rating_desc');
    setSearchParams({});
  };

  // =========================================================================
  // DYNAMIC HERO BANNER CONFIGURATION (Replaces hardcoded Sofas and Armchairs)
  // =========================================================================
  const getBannerConfig = () => {
    // 0. Selected Collection
    if (selectedCollection && selectedCollection !== 'all') {
      const colObj = collections.find((c) => c.id === selectedCollection || c.slug === selectedCollection);
      if (colObj) {
        return {
          badgeText: colObj.badge || 'KOLLEKSIYA',
          badgeBg: 'var(--figma-coral, #FA6D58)',
          tagText: 'EKSKLYUZIV KOLLEKSIYA',
          tagColor: 'var(--figma-coral, #FA6D58)',
          title: colObj.title,
          desc: colObj.description || colObj.subtitle || 'Urgut mebellari eksklyuziv to‘plami.',
          btnText: 'TO‘PLAMNI KO‘RISH',
          leftBg: 'var(--figma-pastel-blue, #E8F0F8)',
          rightBg: 'var(--figma-pastel-peach, #FDF0ED)',
          slides: [colObj.cover_image || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80']
        };
      }
    }

    // 1. Aksiya va Chegirmalar
    if (selectedFilter === 'discount') {
      return {
        badgeText: '-50% GACHA',
        badgeBg: '#ef4444',
        tagText: '🔥 KATTA MAVSUMIY AKSIYA',
        tagColor: '#ef4444',
        title: 'Aksiya va Chegirmalar',
        desc: 'Urgut Mebel Markazidagi barcha chegirmali mahsulotlar to‘plami! Eng sara sifatli mebellarni maxsus arzon narxlarda xarid qiling.',
        btnText: 'AKSIYADAGI MEBELLARNI KO‘RISH',
        leftBg: 'rgba(239, 68, 68, 0.08)',
        rightBg: 'rgba(239, 68, 68, 0.04)',
        slides: [
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80'
        ]
      };
    }

    // 2. Matraslar (sub=matras)
    if (selectedSub === 'matras') {
      return {
        badgeText: '💤 ORTOPEDIK',
        badgeBg: '#0ea5e9',
        tagText: 'SOG‘LOM VA OROMBAXSH UYQU',
        tagColor: '#0ea5e9',
        title: 'Ortopedik & Anatomik Matraslar',
        desc: '7-zonaviy mustaqil prujinali, xotirali Memory Foam va tabiiy lateksli premium matraslar. Umurtqa salomatligi uchun ideal tanlov.',
        btnText: 'MATRASLARNI SARALASH',
        leftBg: 'rgba(14, 165, 233, 0.08)',
        rightBg: 'rgba(14, 165, 233, 0.04)',
        slides: [
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1582582621959-48d27397dc69?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80'
        ]
      };
    }

    // 3. Divanlar / Yumshoq Mebellar (cat-6)
    if (selectedCategory === 'cat-6' || selectedCategory === 'yumshoq-mebellar' || selectedCategory === 'cat-sofas') {
      return {
        badgeText: '-35%',
        badgeBg: 'var(--figma-coral, #FA6D58)',
        tagText: 'YUMSHOQ MEBELLAR TO‘PLAMI',
        tagColor: 'var(--figma-coral, #FA6D58)',
        title: 'Sofas and Armchairs (Yumshoq Mebellar)',
        desc: 'Eng sara zamonaviy yumshoq mebellar to‘plami. Hashamatli burchak divanlar, qulay dam olish kreslolari va transformer divanlar.',
        btnText: 'BARCHA DIVANLARNI KO‘RISH',
        leftBg: 'var(--figma-pastel-blue, #E8F0F8)',
        rightBg: 'var(--figma-pastel-peach, #FDF0ED)',
        slides: settings.sofas_hero_slides && settings.sofas_hero_slides.length > 0 ? settings.sofas_hero_slides : [
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80'
        ]
      };
    }

    // 4. Mehmonxona (cat-1)
    if (selectedCategory === 'cat-1' || selectedCategory === 'mehmonxona' || selectedCategory === 'cat-living') {
      const catObj = categories.find((c) => c.id === 'cat-1');
      return {
        badgeText: '👑 SHINAM',
        badgeBg: '#f59e0b',
        tagText: 'MEHMONXONA TO‘PLAMI',
        tagColor: '#f59e0b',
        title: catObj?.name || 'Mehmonxona Mebellari',
        desc: catObj?.description || 'Xonadoningizga fayz bag‘ishlovchi premium yumshoq divanlar, hashamatli vitrinalar, TV podstavkalar va kofe stollari.',
        btnText: 'MEHMONXONANI KO‘RISH',
        leftBg: 'rgba(245, 158, 11, 0.08)',
        rightBg: 'rgba(245, 158, 11, 0.04)',
        slides: [
          catObj?.image_url || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1000&q=80'
        ]
      };
    }

    // 5. Yotoqxona (cat-2)
    if (selectedCategory === 'cat-2' || selectedCategory === 'yotoqxona' || selectedCategory === 'cat-bedroom') {
      const catObj = categories.find((c) => c.id === 'cat-2');
      return {
        badgeText: '✨ LUXURY',
        badgeBg: '#8b5cf6',
        tagText: 'YOTOQXONA MEBELLARI',
        tagColor: '#8b5cf6',
        title: catObj?.name || 'Yotoqxona Mebellari',
        desc: catObj?.description || 'Sokin va qulay uyqu bag‘ishlovchi zamonaviy krovatlar, keng kupe shkaflar, nafis komodlar va tualet stollari.',
        btnText: 'YOTOQXONA TO‘PLAMINI KO‘RISH',
        leftBg: 'rgba(139, 92, 246, 0.08)',
        rightBg: 'rgba(139, 92, 246, 0.04)',
        slides: [
          catObj?.image_url || 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1540518614846-7ede433c4ef4?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80'
        ]
      };
    }

    // 6. Oshxona & Stol (cat-3)
    if (selectedCategory === 'cat-3' || selectedCategory === 'oshxona' || selectedCategory === 'cat-dining') {
      const catObj = categories.find((c) => c.id === 'cat-3');
      return {
        badgeText: '🍽️ BARDOSH',
        badgeBg: '#10b981',
        tagText: 'OSHXONA & OVQATLANISH',
        tagColor: '#10b981',
        title: catObj?.name || 'Oshxona Mebellari & Ovqatlanish Stollari',
        desc: catObj?.description || 'Namlikka va issiqqa chidamli akril garniturlar, tabiiy eman stollar va qulay ovqatlanish stullari to‘plami.',
        btnText: 'OSHXONA MEBELLARINI KO‘RISH',
        leftBg: 'rgba(16, 185, 129, 0.08)',
        rightBg: 'rgba(16, 185, 129, 0.04)',
        slides: [
          catObj?.image_url || 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1000&q=80'
        ]
      };
    }

    // 7. Dynamic match for custom admin categories
    if (selectedCategory !== 'all') {
      const catObj = categories.find((c) => c.id === selectedCategory || c.slug === selectedCategory);
      if (catObj) {
        return {
          badgeText: '⭐️ TO‘PLAM',
          badgeBg: 'var(--figma-coral, #FA6D58)',
          tagText: 'URGUT MEBEL MARKAZI',
          tagColor: 'var(--figma-coral, #FA6D58)',
          title: getLocalized(catObj, 'name') || catObj.name,
          desc: catObj.description || 'Urgutning yetakchi do‘konlari va ustalarining sara mebellari.',
          btnText: 'TO‘PLAMNI KO‘RISH',
          leftBg: 'var(--figma-pastel-blue, #E8F0F8)',
          rightBg: 'var(--figma-pastel-peach, #FDF0ED)',
          slides: catObj.image_url
            ? [catObj.image_url]
            : ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80']
        };
      }
    }

    // 8. Default: Barcha Mebellar Katalogi
    return {
      badgeText: '✨ BARCHASI',
      badgeBg: 'var(--figma-coral, #FA6D58)',
      tagText: 'URGUT MEBEL MARKAZI',
      tagColor: 'var(--figma-coral, #FA6D58)',
      title: 'Barcha Mebellar Katalogi',
      desc: 'Urgut Mebel Markazining barcha do‘konlari va usta hunarmandlari mahsulotlari. Qulay narxlar, yuqori sifat va rasmiy kafolat bilan.',
      btnText: 'MAHSULOTLARNI SARALASH',
      leftBg: 'var(--figma-pastel-blue, #E8F0F8)',
      rightBg: 'var(--figma-pastel-peach, #FDF0ED)',
      slides: [
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80'
      ]
    };
  };

  const bannerConfig = getBannerConfig();

  // Condition to show Autumn Collection (ONLY on unfiltered main catalog)
  const showAutumnCollection =
    selectedCategory === 'all' &&
    selectedFilter !== 'discount' &&
    selectedFilter !== 'under1m' &&
    selectedCollection === 'all' &&
    !selectedSub &&
    !searchQuery.trim();

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', color: 'var(--text-main)' }}>
      
      {/* ==============================================================
          1. DYNAMIC CATEGORY HERO BANNER (Adapted to the active section)
          ============================================================== */}
      <section style={{ padding: '2rem 1.25rem 2.5rem' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div className="figma-split-hero" style={{ borderRadius: '16px', overflow: 'hidden' }}>
            
            {/* Left: Slideshow with tailored background */}
            <div
              style={{
                backgroundColor: bannerConfig.leftBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2.5rem',
                minHeight: '340px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <HeaderAfishaSlideshow
                images={bannerConfig.slides}
                alt={bannerConfig.title}
                interval={3500}
                objectFit="contain"
              />
            </div>

            {/* Right: Info Card with Dynamic Badge & Title */}
            <div
              style={{
                backgroundColor: bannerConfig.rightBg,
                padding: '3.5rem 3rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                position: 'relative'
              }}
            >
              {/* Dynamic Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '2rem',
                  right: '2rem',
                  minWidth: '60px',
                  height: '60px',
                  padding: '0 10px',
                  borderRadius: '30px',
                  backgroundColor: bannerConfig.badgeBg,
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.15)'
                }}
              >
                {bannerConfig.badgeText}
              </div>

              <span
                style={{
                  color: bannerConfig.tagColor,
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  marginBottom: '0.75rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                {bannerConfig.tagText}
              </span>

              <h1
                style={{
                  fontSize: 'clamp(2rem, 3.6vw, 2.8rem)',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  lineHeight: 1.2,
                  margin: '0 0 1rem'
                }}
              >
                {bannerConfig.title}
              </h1>

              <p
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                  maxWidth: '440px',
                  marginBottom: '1.75rem'
                }}
              >
                {bannerConfig.desc}
              </p>

              <button
                type="button"
                onClick={() => {
                  const target = document.getElementById('catalog-products-main');
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  } else {
                    window.scrollTo({ top: 550, behavior: 'smooth' });
                  }
                }}
                className="btn-figma-coral"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.8rem 1.6rem',
                  borderRadius: '980px',
                  fontWeight: 700
                }}
              >
                <span>{bannerConfig.btnText}</span>
                <span>&gt;</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==============================================================
          SPECIAL: DISCOUNT CATEGORY QUICK FILTER PILLS (Only on Aksiya)
          ============================================================== */}
      {selectedFilter === 'discount' && (
        <section style={{ padding: '0 1.25rem 2rem' }}>
          <div className="container" style={{ maxWidth: '1240px', margin: '0 auto' }}>
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: '12px',
                border: '1.5px solid rgba(239, 68, 68, 0.25)',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                boxShadow: '0 4px 20px rgba(239, 68, 68, 0.06)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(239, 68, 68, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ef4444'
                  }}
                >
                  <Percent size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                    Aksiyadagi Mebellar Kategoriyasi
                  </h3>
                  <p style={{ margin: '0.15rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Faqat faol chegirmaga ega sara mebellar ro‘yxati ({discountStats.all} ta mahsulot)
                  </p>
                </div>
              </div>

              {/* Category Pills */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setDiscountCategoryFilter('all')}
                  style={{
                    padding: '0.45rem 0.9rem',
                    borderRadius: '980px',
                    border: '1px solid',
                    borderColor: discountCategoryFilter === 'all' ? '#ef4444' : 'var(--border-subtle)',
                    backgroundColor: discountCategoryFilter === 'all' ? '#ef4444' : 'transparent',
                    color: discountCategoryFilter === 'all' ? '#ffffff' : 'var(--text-main)',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Barcha Aksiyalar ({discountStats.all})
                </button>

                <button
                  type="button"
                  onClick={() => setDiscountCategoryFilter('cat-6')}
                  style={{
                    padding: '0.45rem 0.9rem',
                    borderRadius: '980px',
                    border: '1px solid',
                    borderColor: discountCategoryFilter === 'cat-6' ? '#ef4444' : 'var(--border-subtle)',
                    backgroundColor: discountCategoryFilter === 'cat-6' ? '#ef4444' : 'transparent',
                    color: discountCategoryFilter === 'cat-6' ? '#ffffff' : 'var(--text-main)',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Divanlar & Kreslo ({discountStats.sofas})
                </button>

                <button
                  type="button"
                  onClick={() => setDiscountCategoryFilter('cat-1')}
                  style={{
                    padding: '0.45rem 0.9rem',
                    borderRadius: '980px',
                    border: '1px solid',
                    borderColor: discountCategoryFilter === 'cat-1' ? '#ef4444' : 'var(--border-subtle)',
                    backgroundColor: discountCategoryFilter === 'cat-1' ? '#ef4444' : 'transparent',
                    color: discountCategoryFilter === 'cat-1' ? '#ffffff' : 'var(--text-main)',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Mehmonxona ({discountStats.living})
                </button>

                <button
                  type="button"
                  onClick={() => setDiscountCategoryFilter('cat-2')}
                  style={{
                    padding: '0.45rem 0.9rem',
                    borderRadius: '980px',
                    border: '1px solid',
                    borderColor: discountCategoryFilter === 'cat-2' ? '#ef4444' : 'var(--border-subtle)',
                    backgroundColor: discountCategoryFilter === 'cat-2' ? '#ef4444' : 'transparent',
                    color: discountCategoryFilter === 'cat-2' ? '#ffffff' : 'var(--text-main)',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Yotoqxona ({discountStats.bedroom})
                </button>

                <button
                  type="button"
                  onClick={() => setDiscountCategoryFilter('cat-3')}
                  style={{
                    padding: '0.45rem 0.9rem',
                    borderRadius: '980px',
                    border: '1px solid',
                    borderColor: discountCategoryFilter === 'cat-3' ? '#ef4444' : 'var(--border-subtle)',
                    backgroundColor: discountCategoryFilter === 'cat-3' ? '#ef4444' : 'transparent',
                    color: discountCategoryFilter === 'cat-3' ? '#ffffff' : 'var(--text-main)',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Oshxona & Stol ({discountStats.dining})
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ==============================================================
          2. MAIN CATALOG SECTION WITH SIDEBAR & PRODUCTS
          ============================================================== */}
      <section id="catalog-products-main" style={{ padding: '1rem 1.25rem 5rem' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto' }}>
          
          {/* Top Sort & Count Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '1.5rem',
              marginBottom: '2rem',
              borderBottom: '1px solid var(--border-subtle)',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              {selectedFilter === 'discount' && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    color: '#ef4444',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '6px',
                    fontWeight: 800,
                    marginRight: '0.65rem'
                  }}
                >
                  <Percent size={13} /> AKSIYA
                </span>
              )}
              {selectedSub === 'matras' && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    backgroundColor: 'rgba(14, 165, 233, 0.1)',
                    color: '#0ea5e9',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '6px',
                    fontWeight: 800,
                    marginRight: '0.65rem'
                  }}
                >
                  MATRASLAR
                </span>
              )}
              {language === 'ru'
                ? <>Найдено всего <strong>{filteredProducts.length}</strong> товаров</>
                : language === 'en'
                ? <>Total <strong>{filteredProducts.length}</strong> items found</>
                : <>Jami <strong>{filteredProducts.length}</strong> ta mebel topildi</>}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: '0.6rem 1.25rem',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.88rem',
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-main)',
                  outline: 'none',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                {selectedFilter === 'discount' && (
                  <option value="discount_desc">🔥 Eng katta chegirma foizi bo‘yicha</option>
                )}
                <option value="rating_desc">⭐ {t('catalog.sort_rating', 'Yulduzlar bo‘yicha (Reyting: Yuqoridan pastga)')}</option>
                <option value="price_asc">{t('catalog.sort_price_asc', 'Narx: Arzondan qimmatga')}</option>
                <option value="price_desc">{t('catalog.sort_price_desc', 'Narx: Qimmatdan arzonga')}</option>
                <option value="name_asc">{t('catalog.sort_name_asc', 'Nomi bo‘yicha (A-Z)')}</option>
                <option value="newest">{t('catalog.sort_default', 'Yangi qo‘shilganlar')}</option>
              </select>

              <button
                type="button"
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="btn-figma-dark catalog-mobile-filter-btn"
                style={{ padding: '0.6rem 1rem', fontSize: '0.78rem' }}
              >
                <Filter size={16} /> {t('catalog.filter_by_category', 'Filtrlar')}
              </button>
            </div>
          </div>

          {/* Grid Layout: Sidebar + Products */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '260px 1fr',
              gap: '3rem',
              alignItems: 'flex-start'
            }}
            className="catalog-layout"
          >
            {/* Left Filter Sidebar */}
            <aside className={`catalog-filter-sidebar ${mobileFilterOpen ? 'mobile-open' : ''}`}>
              {/* Categories */}
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>
                  {t('categories.all_categories', 'Kategoriyalar')}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedSub('');
                      if (selectedFilter === 'discount') {
                        setDiscountCategoryFilter('all');
                      }
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      fontSize: '0.9rem',
                      fontWeight: selectedCategory === 'all' && !selectedSub ? 700 : 500,
                      color: selectedCategory === 'all' && !selectedSub ? 'var(--figma-coral)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    {t('catalog.all', 'Barcha Mebellar')}
                  </button>

                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat.id || selectedCategory === cat.slug;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          setSelectedSub('');
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          textAlign: 'left',
                          fontSize: '0.9rem',
                          fontWeight: isSelected ? 700 : 500,
                          color: isSelected ? 'var(--figma-coral)' : 'var(--text-muted)',
                          cursor: 'pointer',
                          padding: 0
                        }}
                      >
                        {getLocalized(cat, 'name') || cat.name}
                      </button>
                    );
                  })}

                  {/* Dedicated Matras subcategory button */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSub('matras');
                      setSelectedCategory('cat-2');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      fontSize: '0.9rem',
                      fontWeight: selectedSub === 'matras' ? 700 : 500,
                      color: selectedSub === 'matras' ? 'var(--figma-coral)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Ortopedik Matraslar
                  </button>
                </div>
              </div>

              {/* Stores Filter */}
              {stores.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Store size={16} style={{ color: 'var(--primary)' }} />
                    {t('catalog.filter_by_store', 'Mebel Do‘konlari')}
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    <button
                      type="button"
                      onClick={() => setSelectedStore('all')}
                      style={{
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        fontSize: '0.88rem',
                        fontWeight: selectedStore === 'all' ? 700 : 500,
                        color: selectedStore === 'all' ? 'var(--figma-coral)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      {t('catalog.all_stores', 'Barcha Do‘konlar')}
                    </button>
                    {stores.map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setSelectedStore(st.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          textAlign: 'left',
                          fontSize: '0.86rem',
                          fontWeight: selectedStore === st.id ? 700 : 500,
                          color: selectedStore === st.id ? 'var(--figma-coral)' : 'var(--text-muted)',
                          cursor: 'pointer',
                          padding: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.5rem'
                        }}
                      >
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {st.name}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: 700, flexShrink: 0 }}>
                          ★ {st.rating}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Swatches */}
              <div style={{ marginBottom: '2.5rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.25rem' }}>
                  {t('catalog.filter_by_color', 'Ranglar')}
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedColor('all')}
                    style={{
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '2px',
                      backgroundColor: selectedColor === 'all' ? 'var(--figma-coral)' : 'var(--bg-card)',
                      color: selectedColor === 'all' ? '#FFFFFF' : 'var(--text-main)',
                      cursor: 'pointer'
                    }}
                  >
                    {t('catalog.all', 'Barchasi')}
                  </button>
                  {figmaColorSwatches.map((sw, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedColor(sw.val)}
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        backgroundColor: sw.color,
                        border: selectedColor === sw.val ? '2px solid var(--figma-coral)' : '1px solid var(--border-subtle)',
                        outline: selectedColor === sw.val ? '2px solid rgba(250, 109, 88, 0.4)' : 'none',
                        cursor: 'pointer'
                      }}
                      title={sw.label}
                    />
                  ))}
                </div>
              </div>

              {/* Price Filter Slider */}
              <div style={{ marginBottom: '2.5rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.25rem' }}>
                  {t('catalog.filter_by_price', 'Narx Bo‘yicha Filtrlash')}
                </h4>
                <input
                  type="range"
                  min={100000}
                  max={30000000}
                  step={200000}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--figma-coral)', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  <span>0 {t('catalog.price_currency', 'so‘m')}</span>
                  <span style={{ fontWeight: 700, color: 'var(--figma-coral)' }}>
                    {maxPrice.toLocaleString()} {t('catalog.price_currency', 'so‘m')}
                  </span>
                </div>
              </div>

              {/* Reset button */}
              <button
                type="button"
                onClick={resetFilters}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                <RotateCcw size={15} /> {t('catalog.reset_filters', 'Filtrlarni tozalash')}
              </button>
            </aside>

            {/* Right Products Grid */}
            <main>
              {loading ? (
                <div style={{ padding: '5rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                  {language === 'ru' ? 'Загрузка мебели...' : language === 'en' ? 'Loading furniture...' : 'Mebellar yuklanmoqda...'}
                </div>
              ) : displayedProducts.length === 0 ? (
                <div
                  style={{
                    padding: '4rem 2rem',
                    textAlign: 'center',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '12px'
                  }}
                >
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                    {t('catalog.no_products_found', 'Mos mebel topilmadi')}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    {t('catalog.no_products_desc', 'Filtrlarni o‘zgartirib ko‘ring yoki tozalang.')}
                  </p>
                  <button type="button" onClick={resetFilters} className="btn-figma-coral">
                    {t('catalog.reset_filters', 'Filtrlarni Tozalash')}
                  </button>
                </div>
              ) : (
                <>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                      gap: '2rem'
                    }}
                  >
                    {displayedProducts.map((prod) => (
                      <ProductCard key={prod.id} product={prod} />
                    ))}
                  </div>

                  {/* Load More Button */}
                  {visibleCount < filteredProducts.length && (
                    <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
                      <button
                        type="button"
                        onClick={() => setVisibleCount((prev) => prev + 12)}
                        className="btn-figma-coral"
                      >
                        {language === 'ru' ? 'ЗАГРУЗИТЬ ЕЩЁ' : language === 'en' ? 'LOAD MORE PRODUCTS' : 'KO‘PROQ MAHSULOTLARNI YUKLASH'}
                      </button>
                    </div>
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </section>

      {/* ==============================================================
          3. SIGNATURE AUTUMN COLLECTION CAROUSEL
          (ONLY displayed on unfiltered main catalog, NEVER on filtered views!)
          ============================================================== */}
      {showAutumnCollection && (
        <FigmaCollectionCarousel title={t('hero.autumn_collection', 'Autumn Collection')} />
      )}

      {/* Responsive layout styles */}
      <style>{`
        @media (max-width: 899px) {
          .catalog-layout {
            grid-template-columns: 1fr !important;
          }
          .catalog-filter-sidebar {
            display: none;
          }
          .catalog-filter-sidebar.mobile-open {
            display: block !important;
            margin-bottom: 2rem;
            padding: 1.5rem;
            background: var(--bg-card);
            border: 1px solid var(--border-subtle);
            border-radius: 12px;
          }
          .catalog-mobile-filter-btn {
            display: inline-flex !important;
          }
        }
        @media (min-width: 900px) {
          .catalog-mobile-filter-btn {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
