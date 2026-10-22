import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { FigmaCollectionCarousel } from '../components/FigmaCollectionCarousel';
import { Search, Plus, Minus, LifeBuoy, MessageSquare } from 'lucide-react';

export const FaqPage = () => {
  const [faqItems, setFaqItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [openIds, setOpenIds] = useState(new Set(['faq-1']));

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const data = await dataService.getFaqItems();
        setFaqItems(data || []);
      } catch (err) {
        console.error('Error loading FAQs:', err);
      }
    };
    fetchFaqs();
  }, []);

  const toggleAccordion = (id) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filteredFaqs = faqItems.filter((item) =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Split into 2 columns like in Figma
  const midPoint = Math.ceil(filteredFaqs.length / 2);
  const leftColFaqs = filteredFaqs.slice(0, midPoint);
  const rightColFaqs = filteredFaqs.slice(midPoint);

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', color: 'var(--text-main)', transition: 'background-color 0.25s ease, color 0.25s ease' }}>
      
      {/* ==============================================================
          1. FIGMA SPLIT HERO: "How can We help You"
          ============================================================== */}
      <section style={{ padding: '2rem 1.5rem 3.5rem' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.1fr 1fr',
              minHeight: '420px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '2px',
              overflow: 'hidden'
            }}
            className="figma-split-hero"
          >
            {/* Left: Soft Pastel Blue Card */}
            <div
              style={{
                backgroundColor: 'var(--figma-pastel-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2.5rem',
                minHeight: '320px'
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=700&q=80"
                alt="Help Center"
                style={{
                  maxWidth: '80%',
                  maxHeight: '300px',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.08))'
                }}
              />
            </div>

            {/* Right: Help Center text & Search input */}
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                padding: '4rem 3.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <span
                style={{
                  color: 'var(--figma-coral)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  marginBottom: '0.75rem',
                  display: 'block'
                }}
              >
                Help center
              </span>
              <h1
                style={{
                  fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  lineHeight: 1.15,
                  margin: '0 0 1rem'
                }}
              >
                How can We<br />help You
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '400px' }}>
                Our help center can instantly give you answers to many frequently asked questions.
              </p>

              {/* Exact Figma Rounded Search Input */}
              <div style={{ position: 'relative', maxWidth: '420px' }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="WHAT CAN WE HELP YOU WITH?"
                  style={{
                    width: '100%',
                    padding: '0.95rem 2.8rem 0.95rem 1.25rem',
                    borderRadius: '2px',
                    border: '1px solid var(--figma-coral)',
                    fontSize: '0.85rem',
                    letterSpacing: '0.04em',
                    outline: 'none',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-main)'
                  }}
                />
                <Search
                  size={18}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--figma-coral)'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==============================================================
          2. FIGMA TWO-COLUMN GENERAL QUESTIONS (ACCORDIONS)
          ============================================================== */}
      <section style={{ padding: '2rem 1.5rem 5rem' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
              gap: '4rem'
            }}
          >
            {/* Column 1 */}
            <div>
              <h3
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  marginBottom: '0.5rem',
                  letterSpacing: '-0.01em'
                }}
              >
                General Questions
              </h3>
              <div
                style={{
                  width: '36px',
                  height: '2px',
                  backgroundColor: 'var(--figma-coral)',
                  marginBottom: '1.75rem'
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {leftColFaqs.map((item) => {
                  const isOpen = openIds.has(item.id);
                  return (
                    <div
                      key={item.id}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        padding: '1.25rem 0',
                        transition: 'background-color 0.2s'
                      }}
                    >
                      <button
                        onClick={() => toggleAccordion(item.id)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          textAlign: 'left',
                          cursor: 'pointer',
                          gap: '1rem'
                        }}
                      >
                        <span
                          style={{
                            fontSize: '1rem',
                            fontWeight: isOpen ? 700 : 500,
                            color: isOpen ? 'var(--text-main)' : 'var(--text-muted)'
                          }}
                        >
                          {item.question}
                        </span>
                        <span style={{ color: isOpen ? 'var(--figma-coral)' : '#9CA3AF', flexShrink: 0 }}>
                          {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                        </span>
                      </button>

                      {isOpen && (
                        <div
                          style={{
                            marginTop: '0.85rem',
                            color: 'var(--text-muted)',
                            fontSize: '0.92rem',
                            lineHeight: 1.6
                          }}
                        >
                          {item.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Column 2 */}
            <div>
              <h3
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  marginBottom: '0.5rem',
                  letterSpacing: '-0.01em'
                }}
              >
                General Questions
              </h3>
              <div
                style={{
                  width: '36px',
                  height: '2px',
                  backgroundColor: 'var(--figma-coral)',
                  marginBottom: '1.75rem'
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {rightColFaqs.map((item) => {
                  const isOpen = openIds.has(item.id);
                  return (
                    <div
                      key={item.id}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        padding: '1.25rem 0',
                        transition: 'background-color 0.2s'
                      }}
                    >
                      <button
                        onClick={() => toggleAccordion(item.id)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          textAlign: 'left',
                          cursor: 'pointer',
                          gap: '1rem'
                        }}
                      >
                        <span
                          style={{
                            fontSize: '1rem',
                            fontWeight: isOpen ? 700 : 500,
                            color: isOpen ? 'var(--text-main)' : 'var(--text-muted)'
                          }}
                        >
                          {item.question}
                        </span>
                        <span style={{ color: isOpen ? 'var(--figma-coral)' : '#9CA3AF', flexShrink: 0 }}>
                          {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                        </span>
                      </button>

                      {isOpen && (
                        <div
                          style={{
                            marginTop: '0.85rem',
                            color: 'var(--text-muted)',
                            fontSize: '0.92rem',
                            lineHeight: 1.6
                          }}
                        >
                          {item.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ==============================================================
              3. FIGMA ACTION CARDS ("Ask in the Forums" & "Visit our Blog")
              ============================================================== */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem',
              marginTop: '5rem'
            }}
          >
            {/* Card 1: Ask in the Forums */}
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                padding: '2.5rem',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1.5rem'
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--figma-coral)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  flexShrink: 0
                }}
              >
                <LifeBuoy size={28} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.5rem' }}>
                  Ask in the Forums
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5, margin: '0 0 1rem' }}>
                  Savolingizga javob topa olmadingizmi? Mutaxassislarimiz bilan to‘g‘ridan-to‘g‘ri maslahatlashing.
                </p>
                <Link
                  to="/contact"
                  style={{
                    color: 'var(--figma-coral)',
                    fontWeight: 700,
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    letterSpacing: '0.05em'
                  }}
                >
                  ALOQAGA CHIQISH &gt;
                </Link>
              </div>
            </div>

            {/* Card 2: Visit our Blog */}
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                padding: '2.5rem',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1.5rem'
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--figma-coral)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  flexShrink: 0
                }}
              >
                <MessageSquare size={28} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.5rem' }}>
                  Visit our Blog
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5, margin: '0 0 1rem' }}>
                  Mebel tanlash, xonadon o‘lchamlari va interyer dizayni sirlari haqidagi maqolalarimizni o‘qing.
                </p>
                <Link
                  to="/blog"
                  style={{
                    color: 'var(--figma-coral)',
                    fontWeight: 700,
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    letterSpacing: '0.05em'
                  }}
                >
                  MAQOLALARNI O‘QISH &gt;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==============================================================
          4. SIGNATURE WINTER COLLECTION CAROUSEL
          ============================================================== */}
      <FigmaCollectionCarousel title="Winter Collection" />
    </div>
  );
};
