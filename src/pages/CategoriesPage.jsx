import React, { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';
import { CategoryCard } from '../components/CategoryCard';
import { Sparkles } from 'lucide-react';

export const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const list = await dataService.getCategories();
        setCategories(list || []);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  return (
    <div style={{ padding: '3.5rem 0 6rem' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem' }}>
          <span className="section-tag"><Sparkles size={14} /> To‘liq To‘plamlar</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.85rem' }}>
            Mebel Kategoriyalari
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>
            Urgut duradgorlik an'analariga binoan xonadoningiz, hovlingiz va ish joyingiz uchun barcha turdagi sifatli mebellar to‘plami
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </div>
    </div>
  );
};
