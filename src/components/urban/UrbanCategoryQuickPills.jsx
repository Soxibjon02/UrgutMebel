import React from 'react';
import { Link } from 'react-router-dom';

export const UrbanCategoryQuickPills = () => {
  const quickCategories = [
    {
      id: 'cat-new',
      label: 'New',
      isNew: true,
      img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=200&q=80',
      link: '/furniture?filter=new'
    },
    {
      id: 'cat-sofas',
      label: 'Sofas',
      img: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=200&q=80',
      link: '/furniture?category=cat-living'
    },
    {
      id: 'cat-beds',
      label: 'Beds',
      img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=200&q=80',
      link: '/furniture?category=cat-bedroom'
    },
    {
      id: 'cat-dining',
      label: 'Dining Sets',
      img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=200&q=80',
      link: '/furniture?category=cat-dining'
    },
    {
      id: 'cat-lounge',
      label: 'Lounge Chairs',
      img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=200&q=80',
      link: '/furniture?category=cat-living'
    },
    {
      id: 'cat-shoes',
      label: 'Shoe Racks',
      img: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=200&q=80',
      link: '/furniture?category=cat-wardrobe'
    },
    {
      id: 'cat-books',
      label: 'Bookshelves',
      img: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=200&q=80',
      link: '/furniture?category=cat-office'
    },
    {
      id: 'cat-study',
      label: 'Study Tables',
      img: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=200&q=80',
      link: '/furniture?category=cat-office'
    },
    {
      id: 'cat-chest',
      label: 'Chest of Drawers',
      img: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=200&q=80',
      link: '/furniture?category=cat-bedroom'
    },
    {
      id: 'cat-side',
      label: 'Sideboards',
      img: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=200&q=80',
      link: '/furniture?category=cat-dining'
    },
    {
      id: 'cat-mattr',
      label: 'Mattresses',
      img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=200&q=80',
      link: '/furniture?category=cat-bedroom'
    }
  ];

  return (
    <div
      className="urban-category-quickpills"
      style={{
        backgroundColor: 'var(--bg-primary)',
        padding: '1.25rem 0 0.85rem',
        borderBottom: '1px solid var(--border-subtle)'
      }}
    >
      <div
        className="container"
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 1.25rem'
        }}
      >
        {/* Section title on mobile */}
        <div
          className="urban-quickpills-mobile-title"
          style={{
            fontSize: '1rem',
            fontWeight: 800,
            color: 'var(--text-main)',
            marginBottom: '0.85rem'
          }}
        >
          Shop by Categories
        </div>

        {/* Scrollable Row */}
        <div
          className="urban-quickpills-scroll"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1.25rem',
            overflowX: 'auto',
            paddingBottom: '0.5rem',
            scrollbarWidth: 'none'
          }}
        >
          {quickCategories.map((cat) => (
            <Link
              key={cat.id}
              to={cat.link}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textDecoration: 'none',
                flexShrink: 0,
                width: '78px'
              }}
              className="urban-quickpill-item"
            >
              {/* Rounded Square Photo Box */}
              <div
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  position: 'relative',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1.5px solid var(--border-subtle)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.2s ease, border-color 0.2s ease'
                }}
                className="urban-quickpill-imgbox"
              >
                {cat.isNew ? (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: '#3b252c',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      letterSpacing: '0.04em'
                    }}
                  >
                    New
                  </div>
                ) : (
                  <img
                    src={cat.img}
                    alt={cat.label}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=200&q=80';
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}
              </div>

              {/* Label */}
              <span
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  color: 'var(--text-main)',
                  textAlign: 'center',
                  marginTop: '0.45rem',
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '78px'
                }}
              >
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .urban-quickpills-scroll::-webkit-scrollbar {
          display: none;
        }
        .urban-quickpill-item:hover .urban-quickpill-imgbox {
          transform: translateY(-3px);
          border-color: var(--figma-coral, #FA6D58);
        }
        .urban-quickpill-item:hover span {
          color: var(--figma-coral, #FA6D58);
        }
        @media (min-width: 993px) {
          .urban-quickpills-mobile-title {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
