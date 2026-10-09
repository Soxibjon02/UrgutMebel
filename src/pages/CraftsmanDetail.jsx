import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { CraftsmanRequestModal } from '../components/CraftsmanRequestModal';
import {
  Star,
  MapPin,
  Award,
  Phone,
  Send,
  ArrowLeft,
  Briefcase,
  CheckCircle,
  MessageSquare
} from 'lucide-react';

export const CraftsmanDetail = () => {
  const { id } = useParams();
  const [craftsman, setCraftsman] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCraftsman = async () => {
      try {
        const found = await dataService.getCraftsmanById(id);
        setCraftsman(found);
      } finally {
        setLoading(false);
      }
    };
    fetchCraftsman();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Usta profili yuklanmoqda...</p>
      </div>
    );
  }

  if (!craftsman) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h2>Usta topilmadi</h2>
        <Link to="/craftsmen" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Ustalar katalogiga qaytish
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '3rem 0 6rem' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        
        {/* Back Link */}
        <Link
          to="/craftsmen"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}
        >
          <ArrowLeft size={16} /> Barcha ustalarga qaytish
        </Link>

        {/* Profile Header Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            padding: '2.5rem',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            gap: '2rem',
            alignItems: 'center',
            flexWrap: 'wrap',
            marginBottom: '3rem'
          }}
        >
          <img
            src={craftsman.photo_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"}
            alt={craftsman.name}
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid var(--wood-light)',
              boxShadow: 'var(--shadow-sm)'
            }}
          />

          <div style={{ flex: '1 1 300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#d97706', marginBottom: '0.35rem' }}>
              <Star size={18} fill="#d97706" />
              <strong style={{ fontSize: '1.1rem' }}>{craftsman.rating || 5.0}</strong>
              <span style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>({craftsman.reviews_count || 32} ta mijoz bahosi)</span>
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              {craftsman.name}
            </h1>

            <div style={{ display: 'flex', gap: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Award size={16} color="var(--wood-amber)" />
                {craftsman.experience_years} yillik duradgorlik tajribasi
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin size={16} color="var(--wood-amber)" />
                {craftsman.location}
              </span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {craftsman.specializations?.map((s, idx) => (
                <span
                  key={idx}
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    padding: '0.25rem 0.65rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', maxWidth: '240px' }}>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem' }}
            >
              <span>Buyurtma Berish</span>
            </button>

            {craftsman.phone && (
              <a
                href={`tel:${craftsman.phone}`}
                className="btn btn-secondary"
                style={{ width: '100%', padding: '0.75rem', gap: '0.5rem' }}
              >
                <Phone size={15} color="var(--wood-amber)" />
                <span>{craftsman.phone}</span>
              </a>
            )}

            {craftsman.telegram && (
              <a
                href={`https://t.me/${craftsman.telegram.replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
                style={{ width: '100%', padding: '0.75rem', gap: '0.5rem' }}
              >
                <Send size={15} color="var(--wood-amber)" />
                <span>Telegram</span>
              </a>
            )}
          </div>
        </div>

        {/* Bio */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            padding: '2.5rem',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '3rem'
          }}
        >
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem' }}>
            Usta Haqida
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '1rem' }}>
            {craftsman.bio}
          </p>
        </div>

        {/* Services & Price Estimates */}
        {craftsman.services?.length > 0 && (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              padding: '2.5rem',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)',
              marginBottom: '3rem'
            }}
          >
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem' }}>
              Xizmatlar va Taxminiy Narxlar
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {craftsman.services.map((srv, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.25rem' }}>{srv.name}</h3>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--wood-amber)', marginBottom: '0.4rem' }}>
                    {srv.price}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{srv.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Portfolio Gallery */}
        {craftsman.portfolio?.length > 0 && (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              padding: '2.5rem',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem' }}>
              Portfolio (Bajarilgan Namunaviy Ishlar)
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
              {craftsman.portfolio.map((item, idx) => (
                <div key={idx} style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  />
                  <div style={{ padding: '1rem', backgroundColor: '#ffffff' }}>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 700 }}>{item.title}</h4>
                    {item.description && (
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal */}
        <CraftsmanRequestModal
          craftsman={craftsman}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
};
