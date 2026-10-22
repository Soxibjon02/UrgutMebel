import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { useSettings } from '../context/SettingsContext';
import { ProductCard } from '../components/ProductCard';
import { FigmaCollectionCarousel } from '../components/FigmaCollectionCarousel';
import { HeaderAfishaSlideshow } from '../components/HeaderAfishaSlideshow';
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';

export const FurnitureCatalog = () => {
  const { settings } = useSettings();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [maxPrice, setMaxPrice] = useState(30000000);
  const [selectedColor, setSelectedColor] = useState('all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [visibleCount, setVisibleCount] = useState(12);

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
        console.error('Error loading products:', e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
    const search = searchParams.get('search');
    if (search) setSearchQuery(search);
  }, [searchParams]);

  // Swatch colors matching Figma
  const figmaColorSwatches = [
    { label: 'Qora / Antrasit', color: '#1F2937', val: 'qora' },
    { label: 'Yalpiz yashil', color: '#A7D7C5', val: 'yashil' },
    { label: 'Shaftoli', color: '#FBC7A7', val: 'shaftoli' },
    { label: 'Moviy osmon', color: '#A0C4E2', val: 'ko‘k' },
    { label: 'Korall qizil', color: '#FA6D58', val: 'qizil' },
    { label: 'Och sarg‘ish', color: '#F7E7CE', val: 'krem' }
  ];

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.material?.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category_id === selectedCategory);
    }

    if (selectedColor !== 'all') {
      result = result.filter((p) => p.colors?.some((c) => c.toLowerCase().includes(selectedColor)));
    }

    result = result.filter((p) => (p.discount_price || p.price) <= maxPrice);

    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => (a.discount_price || a.price) - (b.discount_price || b.price));
        break;
      case 'price_desc':
        result.sort((a, b) => (b.discount_price || b.price) - (a.discount_price || a.price));
        break;
      case 'name_asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return result;
  }, [products, searchQuery, selectedCategory, selectedColor, maxPrice, sortBy]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedColor('all');
    setMaxPrice(30000000);
    setSortBy('newest');
    setSearchParams({});
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', color: 'var(--text-main)' }}>
      
      {/* ==============================================================
          1. FIGMA SPLIT HERO BANNER (Sale Off -35% Sofas and Armchairs)
          ============================================================== */}
      <section style={{ padding: '2rem 1.5rem 3.5rem' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div className="figma-split-hero">
            {/* Left: Soft Pastel Blue with Slideshow */}
            <div
              style={{
                backgroundColor: 'var(--figma-pastel-blue)',
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
                images={settings.sofas_hero_slides && settings.sofas_hero_slides.length > 0 ? settings.sofas_hero_slides : [
                  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80",
                  "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1000&q=80",
                  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80"
                ]}
                alt="Sofas and Armchairs"
                interval={3500}
                objectFit="contain"
              />
            </div>

            {/* Right: Soft Peach Card with -35% badge */}
            <div
              style={{
                backgroundColor: 'var(--figma-pastel-peach)',
                padding: '4rem 3.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                position: 'relative'
              }}
            >
              {/* -35% Circular Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '2.5rem',
                  right: '2.5rem',
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--figma-coral)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.05rem'
                }}
              >
                -35%
              </div>

              <span
                style={{
                  color: 'var(--figma-coral)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  marginBottom: '0.75rem'
                }}
              >
                Sale Off
              </span>
              <h1
                style={{
                  fontSize: 'clamp(2.2rem, 4vw, 3rem)',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  lineHeight: 1.15,
                  margin: '0 0 1rem'
                }}
              >
                Sofas and<br />Armchairs
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '380px', marginBottom: '2rem' }}>
                Eng sara zamonaviy yumshoq mebellar to‘plami. Qulaylik va xonadon go‘zalligi bir joyda.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  window.scrollTo({ top: 600, behavior: 'smooth' });
                }}
                className="btn-figma-coral"
              >
                CHECK ALL ITEMS &gt;
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==============================================================
          2. MAIN CATALOG SECTION WITH SIDEBAR & PRODUCTS
          ============================================================== */}
      <section style={{ padding: '1rem 1.5rem 5rem' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto' }}>
          
          {/* Top Sort & Count Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '1.5rem',
              marginBottom: '2.5rem',
              borderBottom: '1px solid var(--border-subtle)',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Jami <strong>{filteredProducts.length}</strong> ta mebel topildi
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: '0.6rem 1.25rem',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '2px',
                  fontSize: '0.88rem',
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-main)',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="newest">Yangi qo‘shilganlar</option>
                <option value="price_asc">Narx: Arzondan qimmatga</option>
                <option value="price_desc">Narx: Qimmatdan arzonga</option>
                <option value="name_asc">Nomi bo‘yicha (A-Z)</option>
              </select>

              <button
                type="button"
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="btn-figma-dark catalog-mobile-filter-btn"
                style={{ padding: '0.6rem 1rem', fontSize: '0.78rem' }}
              >
                <Filter size={16} /> Filtrlar
              </button>
            </div>
          </div>

          {/* Grid Layout: Sidebar + Products */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '260px 1fr',
              gap: '3.5rem',
              alignItems: 'flex-start'
            }}
            className="catalog-layout"
          >
            {/* Left Filter Sidebar */}
            <aside className={`catalog-filter-sidebar ${mobileFilterOpen ? 'mobile-open' : ''}`}>
              {/* Categories */}
              <div style={{ marginBottom: '2.5rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.25rem' }}>
                  Kategoriyalar
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('all')}
                    style={{
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      fontSize: '0.9rem',
                      fontWeight: selectedCategory === 'all' ? 700 : 500,
                      color: selectedCategory === 'all' ? 'var(--figma-coral)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Barcha Mebellar
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        fontSize: '0.9rem',
                        fontWeight: selectedCategory === cat.id ? 700 : 500,
                        color: selectedCategory === cat.id ? 'var(--figma-coral)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Swatches */}
              <div style={{ marginBottom: '2.5rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.25rem' }}>
                  Ranglar
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
                    Barchasi
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
                  Narx Bo‘yicha Filtrlash
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
                  <span>0 so‘m</span>
                  <span style={{ fontWeight: 700, color: 'var(--figma-coral)' }}>
                    {maxPrice.toLocaleString()} so‘m
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
                <RotateCcw size={15} /> Filtrlarni tozalash
              </button>
            </aside>

            {/* Right Products Grid */}
            <main>
              {loading ? (
                <div style={{ padding: '5rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Mebellar yuklanmoqda...
                </div>
              ) : displayedProducts.length === 0 ? (
                <div
                  style={{
                    padding: '4rem 2rem',
                    textAlign: 'center',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '4px'
                  }}
                >
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                    Mos mebel topilmadi
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    Filtrlarni o‘zgartirib ko‘ring yoki tozalang.
                  </p>
                  <button type="button" onClick={resetFilters} className="btn-figma-coral">
                    Filtrlarni Tozalash
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

                  {/* Centered Load More button */}
                  {visibleCount < filteredProducts.length && (
                    <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
                      <button
                        type="button"
                        onClick={() => setVisibleCount((prev) => prev + 12)}
                        className="btn-figma-coral"
                      >
                        LOAD MORE PRODUCTS
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
          ============================================================== */}
      <FigmaCollectionCarousel title="Autumn Collection" />

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
            background: #FAFAFA;
            border: 1px solid #ECECEC;
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
