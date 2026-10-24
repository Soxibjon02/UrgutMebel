import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Edit3 } from 'lucide-react';

export const UrbanNearestStoreBar = () => {
  return (
    <div
      className="urban-nearest-store-bar"
      style={{
        position: 'sticky',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e5e7eb',
        padding: '0.65rem 1rem',
        boxShadow: '0 -4px 15px rgba(0,0,0,0.06)',
        display: 'none',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 890
      }}
    >
      <Link
        to="/stores"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          textDecoration: 'none',
          color: '#1f2937',
          flex: 1
        }}
      >
        <MapPin size={18} color="var(--figma-coral, #FA6D58)" style={{ flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: 600 }}>Nearest Store</div>
          <div style={{ fontSize: '0.84rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Urgut Hunarmandlar Markazi, 24-bino
          </div>
        </div>
        <Edit3 size={15} color="#9ca3af" />
      </Link>

      <style>{`
        @media (max-width: 768px) {
          .urban-nearest-store-bar {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
};
