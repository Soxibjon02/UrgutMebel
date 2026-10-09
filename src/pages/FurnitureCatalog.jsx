import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { ProductCard } from '../components/ProductCard';
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  Check,
  RotateCcw
} from 'lucide-react';

export const FurnitureCatalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [maxPrice, setMaxPrice] = useState(30000000);
  const [selectedMaterial, setSelectedMaterial] = useState('all');
  const [selectedColor, setSelectedColor] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [onlyDiscount, setOnlyDiscount] = useState(searchParams.get('discount') === 'true');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');

  // Mobile filter sidebar toggle
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [prodList, catList] = await Promise.all([
          dataService.getProducts(),
          dataService.getCategories()
        ]);
        setProducts(prodList || []);
        setCategories(catList || []);
      } catch (e) {
        console.error("Error loading products:", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();

    // Listen to admin product updates
    const handleUpdate = () => loadData();
    window.addEventListener('urgut_store_products_updated', handleUpdate);
    return () => window.removeEventListener('urgut_store_products_updated', handleUpdate);
  }, []);

  // Sync url param if changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
    const search = searchParams.get('search');
    if (search) setSearchQuery(search);
  }, [searchParams]);

  // Extract unique materials & colors
  const allMaterials = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      if (p.material) {
        p.material.split(',').forEach((m) => set.add(m.trim()));
      }
    });
    return Array.from(set);
  }, [products]);

  const allColors = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      p.colors?.forEach((c) => set.add(c));
    });
    return Array.from(set);
  }, [products]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Only published
        if (p.is_published === false) return false;

        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name?.toLowerCase().includes(q);
          const matchDesc = p.description?.toLowerCase().includes(q);
          const matchMat = p.material?.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchMat) return false;
        }

        // Category
        if (selectedCategory !== 'all') {
          const cat = categories.find((c) => c.slug === selectedCategory || c.id === selectedCategory);
          if (cat && p.category_id !== cat.id && !p.tags?.includes(cat.slug)) return false;
        }

        // Price
        const effectivePrice = p.discount_price || p.price;
        if (effectivePrice > maxPrice) return false;

        // Material
        if (selectedMaterial !== 'all') {
          if (!p.material?.toLowerCase().includes(selectedMaterial.toLowerCase())) return false;
        }

        // Color
        if (selectedColor !== 'all') {
          if (!p.colors?.includes(selectedColor)) return false;
        }

        // Rating
        if (minRating > 0 && (p.rating || 0) < minRating) return false;

        // Discount
        if (onlyDiscount && !p.discount_price) return false;

        // Stock
        if (onlyInStock && (p.stock || 0) <= 0) return false;

        return true;
      })
      .sort((a, b) => {
        const priceA = a.discount_price || a.price;
        const priceB = b.discount_price || b.price;

        switch (sortBy) {
          case 'lowest_price':
            return priceA - priceB;
          case 'highest_price':
            return priceB - priceA;
          case 'highest_rated':
            return (b.rating || 0) - (a.rating || 0);
          case 'popular':
            return (b.likes_count || 0) - (a.likes_count || 0);
          case 'newest':
          default:
            return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        }
      });
  }, [
    products,
    categories,
    searchQuery,
    selectedCategory,
    maxPrice,
    selectedMaterial,
    selectedColor,
    minRating,
    onlyDiscount,
    onlyInStock,
    sortBy
  ]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setMaxPrice(30000000);
    setSelectedMaterial('all');
    setSelectedColor('all');
    setMinRating(0);
    setOnlyDiscount(false);
    setOnlyInStock(false);
    setSortBy('newest');
    setSearchParams({});
  };

  return (
    <div style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container">
        
        {/* Breadcrumb & Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginBottom: '0.35rem' }}>
            Bosh sahifa / Mebellar katalogi
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Mebellar Katalogi</h1>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Topildi: <strong>{filteredProducts.length}</strong> ta mahsulot
            </span>
          </div>
        </div>

        {/* Top Control Bar: Search input, Sort Dropdown & Mobile Filter Button */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '2rem'
          }}
        >
          {/* Search Input */}
          <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '400px' }}>
            <Search
              size={18}
              style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }}
            />
            <input
              type="text"
              placeholder="Mebel nomi, turi yoki materialidan izlang..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.5rem', paddingRight: '2rem' }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Sorting select */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ArrowUpDown size={16} color="var(--text-muted)" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-select"
                style={{ width: 'auto', padding: '0.6rem 1rem' }}
              >
                <option value="newest">Yangi qo‘shilganlar</option>
                <option value="popular">Eng ommabop</option>
                <option value="lowest_price">Eng arzon narx</option>
                <option value="highest_price">Eng qimmat narx</option>
                <option value="highest_rated">Yuqori baholangan</option>
              </select>
            </div>

            {/* Mobile Filter Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="btn btn-secondary catalog-mobile-filter-btn"
              style={{ padding: '0.6rem 1rem' }}
            >
              <Filter size={16} />
              <span>Filtrlar</span>
            </button>
          </div>
        </div>

        {/* Catalog Body: Sidebar Filters + Products Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '270px 1fr', gap: '2rem', alignItems: 'start' }} className="catalog-layout">
          
          {/* Filters Sidebar */}
          <aside
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)'
            }}
            className={`catalog-filter-sidebar ${mobileFilterOpen ? 'mobile-open' : ''}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.05rem' }}>
                <SlidersHorizontal size={18} color="var(--wood-amber)" />
                <span>Filtrlar</span>
              </div>
              <button
                type="button"
                onClick={resetFilters}
                style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.78rem', color: 'var(--wood-amber)', fontWeight: 600 }}
              >
                <RotateCcw size={13} />
                <span>Tozalash</span>
              </button>
            </div>

            {/* 1. Category Filter */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.88rem', fontWeight: 700, display: 'block', marginBottom: '0.6rem' }}>
                Kategoriyalar
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.45rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    textAlign: 'left',
                    background: selectedCategory === 'all' ? 'var(--bg-secondary)' : 'transparent',
                    fontWeight: selectedCategory === 'all' ? 700 : 500,
                    color: selectedCategory === 'all' ? 'var(--wood-amber)' : 'var(--text-main)'
                  }}
                >
                  <span>Barcha Mebellar</span>
                  {selectedCategory === 'all' && <Check size={14} />}
                </button>

                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.slug)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.45rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.85rem',
                      textAlign: 'left',
                      background: selectedCategory === cat.slug ? 'var(--bg-secondary)' : 'transparent',
                      fontWeight: selectedCategory === cat.slug ? 700 : 500,
                      color: selectedCategory === cat.slug ? 'var(--wood-amber)' : 'var(--text-main)'
                    }}
                  >
                    <span>{cat.name}</span>
                    {selectedCategory === cat.slug && <Check size={14} />}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Price Range */}
            <div style={{ marginBottom: '1.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
              <label style={{ fontSize: '0.88rem', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>
                Maksimal Narx
              </label>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--wood-amber)', marginBottom: '0.5rem' }}>
                {Number(maxPrice).toLocaleString()} so‘m
              </div>
              <input
                type="range"
                min="1000000"
                max="30000000"
                step="500000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--wood-amber)' }}
              />
            </div>

            {/* 3. Materials Filter */}
            {allMaterials.length > 0 && (
              <div style={{ marginBottom: '1.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 700, display: 'block', marginBottom: '0.6rem' }}>
                  Material
                </label>
                <select
                  value={selectedMaterial}
                  onChange={(e) => setSelectedMaterial(e.target.value)}
                  className="form-select"
                >
                  <option value="all">Barcha materiallar</option>
                  {allMaterials.map((mat, i) => (
                    <option key={i} value={mat}>
                      {mat}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* 4. Colors Filter */}
            {allColors.length > 0 && (
              <div style={{ marginBottom: '1.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 700, display: 'block', marginBottom: '0.6rem' }}>
                  Rang
                </label>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="form-select"
                >
                  <option value="all">Barcha ranglar</option>
                  {allColors.map((col, i) => (
                    <option key={i} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* 5. Rating, Discount & Stock Toggles */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.86rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={onlyDiscount}
                  onChange={(e) => setOnlyDiscount(e.target.checked)}
                  style={{ accentColor: 'var(--wood-amber)', width: '17px', height: '17px' }}
                />
                <span style={{ fontWeight: 600 }}>Faqat chegirmadagi mahsulotlar</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.86rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  style={{ accentColor: 'var(--wood-amber)', width: '17px', height: '17px' }}
                />
                <span style={{ fontWeight: 600 }}>Faqat omborda mavjudlari</span>
              </label>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div>
            {filteredProducts.length === 0 ? (
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: 'var(--radius-lg)',
                  padding: '4rem 2rem',
                  textAlign: 'center',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛋️</div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Mos keluvchi mebel topilmadi
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
                  Filtrlarni o‘zgartirib ko‘ring yoki barcha parametrlarni tozalang.
                </p>
                <button type="button" onClick={resetFilters} className="btn btn-primary">
                  <RotateCcw size={16} />
                  Filtrlarni qayta tiklash
                </button>
              </div>
            ) : (
              <div className="grid-products">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

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
