import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ChevronRight,
  Layers
} from 'lucide-react';
import { dataService, getStored } from '../services/dataService';
import { initialCollections } from '../data/mockData';
import { FigmaCollectionCarousel } from '../components/FigmaCollectionCarousel';
import { ProductCard } from '../components/ProductCard';
import { useLanguage } from '../context/LanguageContext';

export const CollectionsPage = () => {
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();

  const [collections, setCollections] = useState(() => getStored('collections', initialCollections));
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [colList, prodList] = await Promise.all([
          dataService.getCollections(),
          dataService.getProducts()
        ]);
        if (colList && colList.length > 0) {
          setCollections(colList);
        }
        setProducts(prodList || []);
      } catch (e) {
        console.error('Error loading collections page data:', e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Live update when Admin edits collections
    const handleUpdate = () => {
      dataService.getCollections().then((cols) => {
        if (cols && cols.length > 0) setCollections(cols);
      });
    };
    window.addEventListener('urgut_store_collections_updated', handleUpdate);
    return () => {
      window.removeEventListener('urgut_store_collections_updated', handleUpdate);
    };
  }, [searchParams]);

  // Helper to get products for a specific collection
  const getCollectionProducts = (col, idx) => {
    if (Array.isArray(col.product_ids) && col.product_ids.length > 0) {
      const matched = products.filter((p) => col.product_ids.includes(p.id));
      if (matched.length > 0) return matched;
    }
    // Fallback: match by collection category_id or slice
    if (col.category_id) {
      const byCat = products.filter((p) => p.category_id === col.category_id);
      if (byCat.length > 0) return byCat.slice(0, 8);
    }
    const start = (idx * 4) % Math.max(1, products.length - 4);
    return products.slice(start, start + 4);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)', minHeight: '100vh', paddingBottom: '6rem' }}>
      
      {/* Minimal Clean Title */}
      <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '1.75rem 1.25rem 0.5rem' }}>
        <h1
          style={{
            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
            fontWeight: 800,
            margin: '0 0 0.25rem',
            color: 'var(--text-main)',
            letterSpacing: '-0.01em'
          }}
        >
          Mebel Kolleksiyalari
        </h1>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.88rem' }}>
          Sara to‘plamlar va mebel kolleksiyalari
        </p>
      </div>

      {/* Sequential Collections List */}
      {loading ? (
        <div style={{ padding: '5rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
          Kolleksiyalar yuklanmoqda...
        </div>
      ) : collections.length === 0 ? (
        <div style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
          <h3>Hozircha faol kolleksiyalar mavjud emas</h3>
        </div>
      ) : (
        <div className="collections-sequential-feed">
          {collections.map((col, index) => {
            const colProducts = getCollectionProducts(col, index);

            return (
              <section
                key={col.id}
                id={`collection-${col.id}`}
                className="collection-feed-section"
                style={{
                  padding: '3rem 1.25rem',
                  borderBottom: index < collections.length - 1 ? '1px solid var(--border-subtle)' : 'none'
                }}
              >
                <div className="container" style={{ maxWidth: '1240px', margin: '0 auto' }}>
                  
                  {/* Collection Title & Meta Header */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'space-between',
                      marginBottom: '1.75rem',
                      flexWrap: 'wrap',
                      gap: '1rem'
                    }}
                    className="collection-section-header"
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.45rem' }}>
                        {col.badge && (
                          <span
                            style={{
                              backgroundColor: 'var(--figma-coral, #FA6D58)',
                              color: '#ffffff',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              textTransform: 'uppercase',
                              letterSpacing: '0.08em',
                              padding: '0.2rem 0.6rem',
                              borderRadius: '4px'
                            }}
                          >
                            {col.badge}
                          </span>
                        )}
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          Kolleksiya #{index + 1}
                        </span>
                      </div>

                      <h2
                        style={{
                          fontSize: 'clamp(1.4rem, 2.8vw, 1.95rem)',
                          fontWeight: 800,
                          margin: '0 0 0.4rem',
                          color: 'var(--text-main)',
                          letterSpacing: '-0.01em'
                        }}
                      >
                        {col.title}
                      </h2>

                      <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '640px', lineHeight: 1.55 }}>
                        {col.description || col.subtitle}
                      </p>
                    </div>

                    <Link
                      to={`/furniture?collection=${col.id}`}
                      className="collection-view-all-link"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        color: 'var(--figma-coral, #FA6D58)',
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        padding: '0.55rem 1.1rem',
                        borderRadius: '999px',
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: 'var(--bg-card)',
                        transition: 'all 0.2s ease',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <span>Katalogda Ko‘rish ({colProducts.length})</span>
                      <ArrowRight size={15} />
                    </Link>
                  </div>

                  {/* Autumn Collection special interactive slideshow */}
                  {col.id === 'col-autumn' && (
                    <div style={{ marginBottom: '2.5rem' }}>
                      <FigmaCollectionCarousel title="Autumn Collection Maxsus Slayder" />
                    </div>
                  )}

                  {/* Products Grid for this collection */}
                  {colProducts.length > 0 ? (
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                        gap: '1.5rem'
                      }}
                      className="collection-products-grid"
                    >
                      {colProducts.map((prod) => (
                        <ProductCard key={prod.id} product={prod} />
                      ))}
                    </div>
                  ) : (
                    <div
                      style={{
                        padding: '3rem 1.5rem',
                        textAlign: 'center',
                        backgroundColor: 'var(--bg-card)',
                        borderRadius: '12px',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      <p style={{ color: 'var(--text-muted)', margin: 0 }}>
                        Ushbu to‘plamga mahsulotlar tez orada qo‘shiladi.
                      </p>
                    </div>
                  )}

                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* Scoped Styles for Clean Transitions and Mobile Adaptability */}
      <style>{`
        .collection-nav-pill {
          padding: 0.4rem 0.85rem;
          border-radius: 999px;
          border: 1px solid var(--border-subtle);
          background-color: var(--bg-primary);
          color: var(--text-main);
          font-size: 0.8rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
        }
        .collection-nav-pill:hover {
          background-color: var(--figma-coral, #FA6D58);
          border-color: var(--figma-coral, #FA6D58);
          color: #ffffff;
          transform: translateY(-1px);
        }
        .collection-nav-pill:hover .collection-pill-badge {
          background-color: rgba(0,0,0,0.25);
          color: #ffffff;
        }
        .collection-pill-badge {
          font-size: 0.68rem;
          background-color: rgba(250, 109, 88, 0.15);
          color: var(--figma-coral, #FA6D58);
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
          font-weight: 800;
        }
        .collection-view-all-link:hover {
          background-color: var(--figma-coral, #FA6D58);
          color: #ffffff !important;
          border-color: var(--figma-coral, #FA6D58);
          transform: translateX(2px);
        }
        @media (max-width: 768px) {
          .collections-page-header {
            padding: 1.5rem 1rem !important;
          }
          .collection-feed-section {
            padding: 2rem 0.85rem !important;
          }
          .collection-section-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 0.75rem !important;
          }
          .collection-view-all-link {
            width: 100% !important;
            justify-content: center !important;
          }
          .collection-products-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.85rem !important;
          }
        }
        @media (max-width: 480px) {
          .collection-products-grid {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
};
