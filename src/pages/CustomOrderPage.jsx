import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { dataService } from '../services/dataService';
import {
  Ruler,
  User,
  Phone,
  Mail,
  MapPin,
  Upload,
  CheckCircle2,
  DollarSign,
  Palette,
  Layers,
  FileText,
  Sparkles,
  ArrowRight,
  Sliders,
  Image as ImageIcon
} from 'lucide-react';

export const CustomOrderPage = () => {
  const { user, isGuest, openAuthModal } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  // Form States
  const [formData, setFormData] = useState({
    // Customer
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: '',
    // Furniture Specs
    furniture_type: 'Oshxona Garnituri',
    room_type: 'Oshxona',
    quantity: 1,
    length: '',
    width: '',
    height: '',
    // Materials
    material: 'Eman yog‘ochi (tabiiy massiv)',
    color: 'Tabiiy yog‘och va grafit',
    finish: 'Mat himoyalangan lak',
    // Design
    description: '',
    special_requirements: '',
    estimated_budget: ''
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e, category = 'reference') => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedFiles((prev) => [
          ...prev,
          {
            id: `f-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            file_name: file.name,
            file_type: file.type,
            file_category: category,
            file_url: event.target.result // Base64 data URL
          }
        ]);
        addToast(`Fayl qo‘shildi: ${file.name}`, 'info');
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (id) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isGuest) {
      openAuthModal('login', 'Maxsus buyurtma yuborish uchun avval hisobingizga kiring!');
      return;
    }

    setSubmitting(true);
    try {
      const newOrder = await dataService.createCustomOrder({
        ...formData,
        user_id: user.id,
        files: uploadedFiles,
        status: 'NEW'
      });

      setCompletedOrder(newOrder);
      addToast(`Buyurtma muvaffaqiyatli yuborildi! Buyurtma raqami: ${newOrder.order_number}`, 'success');
    } catch (err) {
      console.error("Custom order error:", err);
      addToast('Buyurtma yuborishda xatolik yuz berdi. Qayta urinib ko‘ring.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (completedOrder) {
    return (
      <div style={{ padding: '5rem 0', minHeight: '70vh' }}>
        <div className="container" style={{ maxWidth: '680px', textAlign: 'center' }}>
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-xl)',
              padding: '3.5rem 2.5rem',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--border-subtle)',
              backdropFilter: 'blur(8px)'
            }}
            className="glass-card"
          >
            <div
              style={{
                width: '74px',
                height: '74px',
                borderRadius: '50%',
                backgroundColor: '#ecfdf5',
                color: 'var(--status-success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem'
              }}
            >
              <CheckCircle2 size={42} />
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Buyurtmangiz Qabul Qilindi!
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '2rem' }}>
              Usta-muhandislarimiz sizning chizma va o‘lchamlaringizni ko‘rib chiqib, narx kalkulyatsiyasini tayyorlaydi.
            </p>

            <div
              style={{
                backgroundColor: 'var(--bg-secondary)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-lg)',
                marginBottom: '2rem',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <span style={{ fontSize: '0.82rem', color: 'var(--text-light)', display: 'block', marginBottom: '0.3rem' }}>
                BUYURTMA RAQAMI:
              </span>
              <strong style={{ fontSize: '1.5rem', color: 'var(--wood-amber)', letterSpacing: '0.05em' }}>
                {completedOrder.order_number}
              </strong>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                Holati: <span className="badge badge-wood" style={{ marginLeft: '0.35rem' }}>Yangi (NEW)</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/account?tab=custom" className="btn btn-primary">
                Buyurtmalarimda Kuzatish
              </Link>
              <Link to="/" className="btn btn-secondary">
                Bosh Sahifaga Qaytish
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '3rem 0 6rem' }}>
      <div className="container" style={{ maxWidth: '940px' }}>
        
        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--wood-amber)',
              fontSize: '0.82rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '0.5rem'
            }}
          >
            <Sliders size={16} /> Individual Ishlab Chiqarish
          </div>
          <h1 style={{ fontSize: '2.6rem', fontWeight: 800, marginBottom: '0.85rem' }}>
            Maxsus O‘lchamdagi Mebel Buyurtmasi
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '650px', margin: '0 auto' }}>
            Xonadon o‘lchamlari, siz yoqtirgan yog‘och turi, mato va ranglarni ko‘rsating. Menedjerlarimiz narxni hisoblab taklif yuborishadi.
          </p>
        </div>

        {/* Custom Order Form */}
        <form onSubmit={handleSubmit}>
          
          {/* SECTION 1: CUSTOMER INFORMATION */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-xl)',
              padding: '2rem 2.5rem',
              marginBottom: '2rem',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--border-subtle)',
              backdropFilter: 'blur(8px)'
            }}
            className="glass-card"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
              <User size={20} color="var(--wood-amber)" />
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>1. Mijoz Ma'lumotlari</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">To‘liq Ismingiz *</label>
                <input
                  type="text"
                  required
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="Masalan: Jamshid Aliyev"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Telefon Raqamingiz *</label>
                <input
                  type="tel"
                  required
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+998 90 123 45 67"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Elektron Pochta (Email)</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="elektron@pochta.uz"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Yetkazib Berish Manzili *</label>
                <input
                  type="text"
                  required
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Shahar, tuman, ko‘cha va uy raqami"
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: FURNITURE SPECS */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-xl)',
              padding: '2rem 2.5rem',
              marginBottom: '2rem',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--border-subtle)',
              backdropFilter: 'blur(8px)'
            }}
            className="glass-card"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
              <Ruler size={20} color="var(--wood-amber)" />
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>2. Mebel Turi va O‘lchamlari</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Mebel Turi *</label>
                <select
                  name="furniture_type"
                  value={formData.furniture_type}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="Oshxona Garnituri">Oshxona Garnituri</option>
                  <option value="Mehmonxona Divani">Mehmonxona Divani</option>
                  <option value="Yotoqxona Krovati">Yotoqxona Krovati</option>
                  <option value="Shkaf-Kupe va Garderob">Shkaf-Kupe va Garderob</option>
                  <option value="Bolalar Mebeli">Bolalar Mebeli</option>
                  <option value="Ofis Ish Stoli">Ofis Ish Stoli</option>
                  <option value="Kofe va Ovqatlanish Stoli">Kofe va Ovqatlanish Stoli</option>
                  <option value="Boshqa maxsus mebel">Boshqa maxsus mebel</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Xona Turi *</label>
                <select
                  name="room_type"
                  value={formData.room_type}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="Oshxona">Oshxona</option>
                  <option value="Mehmonxona">Mehmonxona</option>
                  <option value="Yotoqxona">Yotoqxona</option>
                  <option value="Bolalar xonasi">Bolalar xonasi</option>
                  <option value="Ofis / Kabinet">Ofis / Kabinet</option>
                  <option value="Dahliz">Dahliz</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Miqdori (Soni)</label>
                <input
                  type="number"
                  min="1"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>

            {/* Dimensions (Length, Width/Depth, Height in cm) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Uzunligi (sm)</label>
                <input
                  type="number"
                  placeholder="Masalan: 320"
                  name="length"
                  value={formData.length}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Kengligi / Chuqurligi (sm)</label>
                <input
                  type="number"
                  placeholder="Masalan: 60"
                  name="width"
                  value={formData.width}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Balandligi (sm)</label>
                <input
                  type="number"
                  placeholder="Masalan: 240"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: MATERIALS & FINISH */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-xl)',
              padding: '2rem 2.5rem',
              marginBottom: '2rem',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--border-subtle)',
              backdropFilter: 'blur(8px)'
            }}
            className="glass-card"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
              <Layers size={20} color="var(--wood-amber)" />
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>3. Material va Ishlov Berish</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Material Turi *</label>
                <select
                  name="material"
                  value={formData.material}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="Eman yog‘ochi (tabiiy massiv)">Eman yog‘ochi (tabiiy massiv)</option>
                  <option value="Yong‘oq daraxti (tabiiy massiv)">Yong‘oq daraxti (tabiiy massiv)</option>
                  <option value="Qarag‘ay daraxti">Qarag‘ay daraxti</option>
                  <option value="MDF Akril fasadlar">MDF Akril fasadlar</option>
                  <option value="MDF Shpon qoplama">MDF Shpon qoplama</option>
                  <option value="Laminatsiyalangan DSP">Laminatsiyalangan DSP</option>
                  <option value="Metall karkas + Daraxt (Loft)">Metall karkas + Daraxt (Loft)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Rangi / To‘q-ochligi *</label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  placeholder="Masalan: Oq mat, to‘q yong‘oq yoki krem"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Qoplamasi (Finish) *</label>
                <select
                  name="finish"
                  value={formData.finish}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="Mat himoyalangan lak">Mat himoyalangan lak</option>
                  <option value="Yaltiroq (Glossy) lak">Yaltiroq (Glossy) lak</option>
                  <option value="Tabiiy moy (Moy-vosk)">Tabiiy moy (Moy-vosk)</option>
                  <option value="Bo‘yalgan emal">Bo‘yalgan emal</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 4: DESIGN & FILE UPLOADS */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-xl)',
              padding: '2rem 2.5rem',
              marginBottom: '2rem',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--border-subtle)',
              backdropFilter: 'blur(8px)'
            }}
            className="glass-card"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
              <FileText size={20} color="var(--wood-amber)" />
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>4. Dizayn va Chizmalar</h2>
            </div>

            <div className="form-group">
              <label className="form-label">Mebel Tavsifi va Istaklaringiz *</label>
              <textarea
                required
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Xonangiz dizayni, qanday javonlar yoki tortmalar bo‘lishi, o‘ziga xos talablaringiz haqida batafsil yozing..."
                className="form-textarea"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Maxsus Talablar (Fitinglar, mexanizmlar, yoritish)</label>
              <input
                type="text"
                name="special_requirements"
                value={formData.special_requirements}
                onChange={handleInputChange}
                placeholder="Masalan: Blum fitinglari, LED sensor yoritgich, ortopedik panjara"
                className="form-input"
              />
            </div>

            {/* File Upload Zone */}
            <div style={{ marginTop: '1.5rem' }}>
              <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
                Surat, Chizma yoki Xona Rasmlarini Yuklang:
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                {/* 1. Reference Image */}
                <label
                  style={{
                    border: '2px dashed var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.5rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    backgroundColor: 'var(--bg-secondary)'
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileUpload(e, 'reference')}
                    style={{ display: 'none' }}
                  />
                  <ImageIcon size={26} color="var(--wood-amber)" style={{ margin: '0 auto 0.5rem' }} />
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Namuna Rasm (Internetdan)</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>JPG, PNG yuklang</div>
                </label>

                {/* 2. Technical Drawing */}
                <label
                  style={{
                    border: '2px dashed var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.5rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    backgroundColor: 'var(--bg-secondary)'
                  }}
                >
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    multiple
                    onChange={(e) => handleFileUpload(e, 'technical')}
                    style={{ display: 'none' }}
                  />
                  <Ruler size={26} color="var(--wood-amber)" style={{ margin: '0 auto 0.5rem' }} />
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Texnik Chizma / Eskiz</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>O‘lchamli qoralama</div>
                </label>

                {/* 3. Room Image */}
                <label
                  style={{
                    border: '2px dashed var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.5rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    backgroundColor: 'var(--bg-secondary)'
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileUpload(e, 'room')}
                    style={{ display: 'none' }}
                  />
                  <Upload size={26} color="var(--wood-amber)" style={{ margin: '0 auto 0.5rem' }} />
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Xona Rasmi</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Mebel o‘rnatiladigan joy</div>
                </label>
              </div>

              {/* Uploaded Files Previews */}
              {uploadedFiles.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {uploadedFiles.map((f) => (
                    <div
                      key={f.id}
                      style={{
                        position: 'relative',
                        padding: '0.5rem 0.75rem',
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.82rem'
                      }}
                    >
                      {f.file_url && f.file_type?.startsWith('image') ? (
                        <img src={f.file_url} alt="Uploaded" style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover' }} />
                      ) : (
                        <FileText size={18} color="var(--wood-amber)" />
                      )}
                      <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {f.file_name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile(f.id)}
                        style={{ color: '#ef4444', fontWeight: 700, marginLeft: '0.25rem' }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SECTION 5: BUDGET & SUBMISSION */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-xl)',
              padding: '2rem 2.5rem',
              marginBottom: '2.5rem',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--border-subtle)',
              backdropFilter: 'blur(8px)'
            }}
            className="glass-card"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
              <DollarSign size={20} color="var(--wood-amber)" />
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>5. Taxminiy Budjet (Ixtiyoriy)</h2>
            </div>

            <div className="form-group" style={{ maxWidth: '400px' }}>
              <label className="form-label">Kutilayotgan Byudjet Miqdori (so‘m)</label>
              <input
                type="number"
                placeholder="Masalan: 15 000 000"
                name="estimated_budget"
                value={formData.estimated_budget}
                onChange={handleInputChange}
                className="form-input"
              />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
                Mutaxassislarimiz siz ko‘rsatgan byudjetga mos sifatli materiallarni tanlab berishadi.
              </span>
            </div>

            <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
              >
                {submitting ? 'Yuborilmoqda...' : 'Buyurtmani Yuborish va Hisoblash'}
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
