import React, { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';
import { CraftsmanCard } from '../components/CraftsmanCard';
import { CraftsmanRequestModal } from '../components/CraftsmanRequestModal';
import { Sparkles, Search, Award, MapPin } from 'lucide-react';

export const CraftsmenDirectory = () => {
  const [craftsmen, setCraftsmen] = useState([]);
  const [selectedCraftsman, setSelectedCraftsman] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedSpec, setSelectedSpec] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCraftsmen = async () => {
      try {
        const list = await dataService.getCraftsmen();
        setCraftsmen(list || []);
      } finally {
        setLoading(false);
      }
    };
    fetchCraftsmen();
  }, []);

  const allSpecs = Array.from(
    new Set(craftsmen.flatMap((c) => c.specializations || []))
  );

  const filteredCraftsmen = craftsmen.filter((c) => {
    if (c.is_active === false) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = c.name?.toLowerCase().includes(q);
      const matchBio = c.bio?.toLowerCase().includes(q);
      const matchLoc = c.location?.toLowerCase().includes(q);
      if (!matchName && !matchBio && !matchLoc) return false;
    }
    if (selectedSpec !== 'all') {
      if (!c.specializations?.includes(selectedSpec)) return false;
    }
    return true;
  });

  const handleRequestClick = (c) => {
    setSelectedCraftsman(c);
    setIsModalOpen(true);
  };

  return (
    <div style={{ padding: '3.5rem 0 6rem' }}>
      <div className="container">
        {/* Page Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem' }}>
          <span className="section-tag"><Sparkles size={14} /> Asriy An'analar</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.85rem' }}>
            Urgut Duradgorlari va Ustaxonalar Katalogi
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>
            Urgut qadimdan yog‘och o‘ymakorligi va sifatli mebelchilik markazi bo‘lib kelgan. Bu yerda siz eng sara ustalar portfolio va narxlari bilan tanishib, to‘g‘ridan-to‘g‘ri buyurtma bera olasiz.
          </p>
        </div>

        {/* Filter Controls */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '2.5rem'
          }}
        >
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: '400px' }}>
            <Search
              size={18}
              style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }}
            />
            <input
              type="text"
              placeholder="Usta ismi, sohasi yoki joylashuvi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>

          {/* Specialization selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Ixtisosligi:</span>
            <select
              value={selectedSpec}
              onChange={(e) => setSelectedSpec(e.target.value)}
              className="form-select"
              style={{ width: 'auto' }}
            >
              <option value="all">Barcha sohalar</option>
              {allSpecs.map((s, i) => (
                <option key={i} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Craftsmen Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))', gap: '2rem' }}>
          {filteredCraftsmen.map((c) => (
            <CraftsmanCard
              key={c.id}
              craftsman={c}
              onRequestClick={handleRequestClick}
            />
          ))}
        </div>

        {/* Modal */}
        <CraftsmanRequestModal
          craftsman={selectedCraftsman}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCraftsman(null);
          }}
        />
      </div>
    </div>
  );
};
