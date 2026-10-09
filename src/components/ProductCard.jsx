import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Star, Heart, ShoppingBag, Eye, CheckCircle2 } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleLike, isLiked } = useWishlist();

  if (!product) return null;

  const discountPercent =
    product.discount_price && product.price
      ? Math.round(((product.price - product.discount_price) / product.price) * 100)
      : null;

  const primaryImage =
    product.images?.[0] ||
    product.image_url ||
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80';

  const liked = isLiked(product.id);

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: 'var(--shadow-sm)'
      }}
      className="product-card"
    >
      {/* Image Container with Badges & Actions */}
      <div
        style={{
          position: 'relative',
          paddingTop: '75%', // 4:3 Aspect ratio
          overflow: 'hidden',
          backgroundColor: '#f5f3ef'
        }}
      >
        <Link to={`/furniture/${product.id}`} style={{ position: 'absolute', inset: 0 }}>
          <img
            src={primaryImage}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            className="product-card-img"
          />
        </Link>

        {/* Badges */}
        <div
          style={{
            position: 'absolute',
            top: '0.85rem',
            left: '0.85rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
            zIndex: 2
          }}
        >
          {discountPercent && (
            <span className="badge badge-discount">-{discountPercent}%</span>
          )}
          {product.is_new && <span className="badge badge-new">Yangi</span>}
        </div>

        {/* Like Button */}
        <button
          type="button"
          onClick={() => toggleLike(product.id)}
          style={{
            position: 'absolute',
            top: '0.85rem',
            right: '0.85rem',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: liked ? '#fee2e2' : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: liked ? '#ef4444' : '#57534e',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            zIndex: 2,
            transition: 'transform 0.2s ease, background 0.2s ease'
          }}
          aria-label="Layk bosish"
        >
          <Heart size={18} fill={liked ? '#ef4444' : 'none'} />
        </button>
      </div>

      {/* Product Content */}
      <div
        style={{
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between'
        }}
      >
        <div>
          {/* Rating & Availability */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.45rem',
              fontSize: '0.8rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#d97706' }}>
              <Star size={14} fill="#d97706" />
              <span style={{ fontWeight: 700 }}>{product.rating || 5.0}</span>
              <span style={{ color: 'var(--text-light)' }}>({product.reviews_count || 12})</span>
            </div>

            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.2rem',
                fontSize: '0.72rem',
                fontWeight: 600,
                color: (product.stock ?? 10) > 0 ? 'var(--status-success)' : '#ea580c'
              }}
            >
              <CheckCircle2 size={12} />
              {(product.stock ?? 10) > 0 ? 'Omborda mavjud' : 'Buyurtmaga'}
            </span>
          </div>

          {/* Product Title */}
          <h3
            style={{
              fontSize: '1.05rem',
              fontWeight: 700,
              color: 'var(--text-main)',
              marginBottom: '0.4rem',
              lineHeight: 1.35
            }}
          >
            <Link to={`/furniture/${product.id}`} style={{ color: 'inherit' }}>
              {product.name}
            </Link>
          </h3>

          {/* Material / Dimensions hint */}
          {product.material && (
            <p
              style={{
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                marginBottom: '0.85rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {product.material}
            </p>
          )}
        </div>

        <div>
          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1rem' }}>
            {product.discount_price ? (
              <>
                <span
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: 'var(--wood-amber)'
                  }}
                >
                  {Number(product.discount_price).toLocaleString()} so‘m
                </span>
                <span
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-light)',
                    textDecoration: 'line-through'
                  }}
                >
                  {Number(product.price).toLocaleString()}
                </span>
              </>
            ) : (
              <span
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: 'var(--text-main)'
                }}
              >
                {Number(product.price).toLocaleString()} so‘m
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => addToCart(product, 1)}
              className="btn btn-primary"
              style={{
                padding: '0.65rem 0.85rem',
                fontSize: '0.86rem',
                borderRadius: 'var(--radius-md)'
              }}
            >
              <ShoppingBag size={15} />
              <span>Savatga</span>
            </button>

            <Link
              to={`/furniture/${product.id}`}
              className="btn btn-secondary"
              style={{
                padding: '0.65rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Batafsil ma'lumot"
            >
              <Eye size={17} />
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .product-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-hover);
          border-color: rgba(194, 109, 46, 0.3);
        }
        .product-card:hover .product-card-img {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};
