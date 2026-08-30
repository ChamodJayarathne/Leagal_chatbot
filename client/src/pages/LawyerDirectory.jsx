import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import {
  FaUserGroup,
  FaMagnifyingGlass,
  FaPhone,
  FaEnvelope,
  FaLocationDot,
  FaStar,
  FaCalendarCheck,
  FaShieldHalved,
  FaXmark,
  FaCheck,
  FaBuilding,
  FaUser
} from 'react-icons/fa6';

// Law firm and institution names
const FIRM_NAMES = [
  'Legal Aid Commission of Sri Lanka (Head Office)',
  'Legal Aid Commission Centre (Kandy)',
  'Legal Aid Commission Centre (Galle)',
  'Legal Aid Commission Centre (Jaffna)',
  'Legal Aid Commission Centre (Kurunegala)',
  'Julius & Creasy',
  'F. J. & G. de Saram',
  'Nithya Partners',
  'Sudath Perera Associates',
  'Tiruchelvam Associates',
  'Paul Ratnayeke Associates',
  'Varners',
];

const isFirmEntry = (entry) =>
  entry.isLegalAid || FIRM_NAMES.includes(entry.name);

export const LawyerDirectory = () => {
  const { t } = useLanguage();

  const [allData, setAllData]       = useState([]);
  const [tab, setTab]               = useState('lawyers'); // 'lawyers' | 'firms'
  const [district, setDistrict]     = useState('All');
  const [practiceArea, setPracticeArea] = useState('All');
  const [isLegalAidOnly, setIsLegalAidOnly] = useState(false);
  const [search, setSearch]         = useState('');
  const [loading, setLoading]       = useState(true);

  // Booking Modal
  const [selectedLawyer, setSelectedLawyer]   = useState(null);
  const [bookingForm, setBookingForm]         = useState({ clientName: '', clientPhone: '', clientEmail: '', issueSummary: '' });
  const [bookingSuccess, setBookingSuccess]   = useState(null);
  const [bookingLoading, setBookingLoading]   = useState(false);

  const districts    = ['All', 'Colombo', 'Kandy', 'Galle', 'Jaffna', 'Gampaha', 'Kurunegala', 'Kalutara'];
  const practiceAreas = ['All', 'Fundamental Rights', 'Civil Litigation', 'Civil Disputes', 'Family Law',
    'Tenancy & Property', 'Labor Disputes', 'Criminal Defense', 'Constitutional Law',
    'Commercial Law', 'Land & Property', 'Debt Recovery', 'Consumer Protection'];

  useEffect(() => {
    fetchAll();
  }, [district, practiceArea, search]);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/lawyers', {
        params: { district, practiceArea, search },
      });
      setAllData(res.data);
    } catch (err) {
      console.error('Fetch lawyers error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Split data into two distinct categories
  const rawFirms   = allData.filter(isFirmEntry);
  const firmsData  = isLegalAidOnly ? rawFirms.filter(f => f.isLegalAid) : rawFirms;
  const lawyersData = allData.filter((e) => !isFirmEntry(e));
  const displayed   = tab === 'lawyers' ? lawyersData : firmsData;

  const handleOpenBooking = (lawyer) => {
    setSelectedLawyer(lawyer);
    setBookingSuccess(null);
    setBookingForm({ clientName: '', clientPhone: '', clientEmail: '', issueSummary: '' });
  };
  const handleCloseBooking  = () => { setSelectedLawyer(null); setBookingSuccess(null); };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    try {
      const res = await axios.post('/api/lawyers/consultation', {
        lawyerId: selectedLawyer._id || selectedLawyer.id,
        lawyerName: selectedLawyer.name,
        ...bookingForm,
      });
      if (res.data.success) setBookingSuccess(res.data);
    } catch {
      alert('Failed to submit consultation request.');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="lawyers-page container">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-badge"><FaUserGroup /> Official Bar & Legal Aid Registry</div>
        <h1 className="page-title">Sri Lanka Legal Directory</h1>
        <p className="page-subtitle">
          Find registered Attorneys-at-Law and state-sponsored Legal Aid Commission centers across all 25 districts.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="directory-tabs">
        <button
          className={`dir-tab-btn ${tab === 'lawyers' ? 'active' : ''}`}
          onClick={() => setTab('lawyers')}
        >
          <FaUser /> Individual Lawyers
          <span className="tab-count">{lawyersData.length}</span>
        </button>
        <button
          className={`dir-tab-btn ${tab === 'firms' ? 'active' : ''}`}
          onClick={() => setTab('firms')}
        >
          <FaBuilding /> Law Firms & Legal Aid
          <span className="tab-count">{firmsData.length}</span>
        </button>
      </div>

      {/* Filters */}
      <div className="lawyer-filter-box">
        <div className="filter-row-top">
          <div className="search-input-wrapper">
            <FaMagnifyingGlass className="search-icon" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={tab === 'lawyers' ? 'Search by name, firm, or practice area...' : 'Search firm name or location...'}
              className="filter-search-input"
            />
          </div>
          {tab === 'firms' && (
            <label className="legal-aid-checkbox">
              <input type="checkbox" checked={isLegalAidOnly} onChange={(e) => setIsLegalAidOnly(e.target.checked)} />
              <span>Show Free Legal Aid Centers Only</span>
            </label>
          )}
        </div>
        <div className="filter-row-bottom">
          <div className="filter-select-group">
            <label>District:</label>
            <select value={district} onChange={(e) => setDistrict(e.target.value)} className="filter-select">
              {districts.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="filter-select-group">
            <label>Practice Area:</label>
            <select value={practiceArea} onChange={(e) => setPracticeArea(e.target.value)} className="filter-select">
              {practiceAreas.map((pa) => <option key={pa} value={pa}>{pa}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="loading-state">Loading directory...</div>
      ) : displayed.length === 0 ? (
        <div className="empty-state">No results found. Try clearing the filters.</div>
      ) : tab === 'lawyers' ? (
        /* ── Individual Lawyers Grid ── */
        <div className="lawyers-grid">
          {displayed.map((lawyer, idx) => (
            <div key={idx} className="lawyer-card lawyer-individual-card">
              <div className="lawyer-card-top">
                <div className="lawyer-avatar lawyer-person-avatar">
                  {lawyer.name.charAt(0)}
                </div>
                <div className="lawyer-info">
                  <div className="lawyer-name-row">
                    <h3>{lawyer.name}</h3>
                  </div>
                  <p className="lawyer-title">{lawyer.title}</p>
                  <p className="lawyer-org-tag">
                    <FaBuilding style={{ fontSize: '11px', color: 'var(--accent-teal)' }} />
                    &nbsp;{lawyer.organization}
                  </p>
                  <div className="lawyer-meta">
                    <span className="meta-item"><FaLocationDot /> {lawyer.district}</span>
                    <span className="meta-item"><FaStar className="star-icon" /> {lawyer.rating} · {lawyer.experienceYears} yrs exp</span>
                  </div>
                </div>
              </div>

              <p className="lawyer-bio">{lawyer.bio}</p>

              <div className="practice-chips">
                {lawyer.practiceAreas && lawyer.practiceAreas.map((pa, pIdx) => (
                  <span key={pIdx} className="practice-chip">{pa}</span>
                ))}
              </div>

              <div className="lawyer-lang-row">
                {lawyer.languages && lawyer.languages.map((lang, lIdx) => (
                  <span key={lIdx} className="lang-chip">{lang}</span>
                ))}
              </div>

              <div className="contact-strip">
                {lawyer.phone && <span><FaPhone /> {lawyer.phone}</span>}
                {lawyer.email && <span><FaEnvelope /> {lawyer.email}</span>}
              </div>

              <button onClick={() => handleOpenBooking(lawyer)} className="btn btn-primary btn-block btn-sm">
                <FaCalendarCheck /> Request Consultation
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* ── Law Firms & Legal Aid Grid ── */
        <div className="lawyers-grid">
          {displayed.map((firm, idx) => (
            <div key={idx} className={`lawyer-card firm-card ${firm.isLegalAid ? 'legal-aid-card' : ''}`}>
              <div className="lawyer-card-top">
                <div className={`lawyer-avatar ${firm.isLegalAid ? '' : 'firm-avatar'}`}>
                  {firm.isLegalAid ? <FaShieldHalved /> : <FaBuilding />}
                </div>
                <div className="lawyer-info">
                  <div className="lawyer-name-row">
                    <h3>{firm.name}</h3>
                    {firm.isLegalAid && <span className="free-badge">FREE LEGAL AID</span>}
                  </div>
                  <p className="lawyer-title">{firm.title}</p>
                  <div className="lawyer-meta">
                    <span className="meta-item"><FaLocationDot /> {firm.district}, {firm.province}</span>
                    <span className="meta-item"><FaStar className="star-icon" /> {firm.rating} · Est. {new Date().getFullYear() - firm.experienceYears}</span>
                  </div>
                </div>
              </div>

              <p className="lawyer-bio">{firm.bio}</p>

              <div className="practice-chips">
                {firm.practiceAreas && firm.practiceAreas.map((pa, pIdx) => (
                  <span key={pIdx} className="practice-chip">{pa}</span>
                ))}
              </div>

              <div className="lawyer-lang-row">
                {firm.languages && firm.languages.map((lang, lIdx) => (
                  <span key={lIdx} className="lang-chip">{lang}</span>
                ))}
              </div>

              <div className="contact-strip">
                {firm.phone && <span><FaPhone /> {firm.phone}</span>}
                {firm.email && <span><FaEnvelope /> {firm.email}</span>}
              </div>
              {firm.address && (
                <div className="firm-address">
                  <FaLocationDot style={{ color: 'var(--accent-teal)', flexShrink: 0 }} />
                  <span>{firm.address}</span>
                </div>
              )}

              <button onClick={() => handleOpenBooking(firm)} className="btn btn-primary btn-block btn-sm">
                <FaCalendarCheck /> Request Consultation
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {selectedLawyer && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Request Consultation: {selectedLawyer.name}</h3>
              <button onClick={handleCloseBooking} className="close-btn"><FaXmark /></button>
            </div>

            {bookingSuccess ? (
              <div className="booking-success-box">
                <FaCheck className="success-icon-large" />
                <h4>Request Submitted Successfully!</h4>
                <p>{bookingSuccess.message}</p>
                <div className="ref-code-box">
                  Reference Code: <strong>{bookingSuccess.referenceCode}</strong>
                </div>
                <button onClick={handleCloseBooking} className="btn btn-primary">Done</button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="modal-form">
                <div className="form-group">
                  <label className="form-label">Your Full Name *</label>
                  <input type="text" value={bookingForm.clientName}
                    onChange={(e) => setBookingForm({ ...bookingForm, clientName: e.target.value })}
                    required className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input type="tel" value={bookingForm.clientPhone}
                    onChange={(e) => setBookingForm({ ...bookingForm, clientPhone: e.target.value })}
                    required placeholder="+94 77 123 4567" className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" value={bookingForm.clientEmail}
                    onChange={(e) => setBookingForm({ ...bookingForm, clientEmail: e.target.value })}
                    className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Brief Summary of Legal Matter *</label>
                  <textarea value={bookingForm.issueSummary}
                    onChange={(e) => setBookingForm({ ...bookingForm, issueSummary: e.target.value })}
                    required rows={3} className="form-textarea"
                    placeholder="Describe your legal issue..." />
                </div>
                <button type="submit" disabled={bookingLoading} className="btn btn-primary btn-block">
                  {bookingLoading ? 'Submitting...' : 'Submit Request'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LawyerDirectory;
