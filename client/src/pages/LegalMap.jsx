import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  FaMapLocationDot,
  FaBuildingColumns,
  FaShieldHalved,
  FaBuilding,
  FaPhone,
  FaLocationDot,
  FaRoute,
  FaMagnifyingGlass,
  FaClock,
  FaChevronRight,
  FaCircleInfo,
  FaXmark,
  FaMap,
  FaListUl,
  FaFilter,
} from 'react-icons/fa6';

export const LEGAL_LOCATIONS = [
  { id: 'loc-1', name: 'Superior Court Complex (Hulftsdorp)', type: 'court', typeName: 'Supreme Court & Court of Appeal', district: 'Colombo', address: 'Hulftsdorp Street, Colombo 12', lat: 6.9344, lng: 79.8569, phone: '+94 11 243 5149', hours: '8:30 AM - 4:15 PM (Mon-Fri)', details: 'Primary apex court of Sri Lanka. Houses the Supreme Court, Court of Appeal, and High Courts of Colombo.', googleMapsUrl: 'https://maps.google.com/?q=Superior+Court+Complex+Hulftsdorp+Colombo' },
  { id: 'loc-2', name: 'Legal Aid Commission of Sri Lanka (Head Office)', type: 'legalaid', typeName: 'Free State Legal Aid Centre', district: 'Colombo', address: 'No. 129, Superior Court Complex, Hulftsdorp Street, Colombo 12', lat: 6.9342, lng: 79.8572, phone: '1970 / +94 11 533 5329', hours: '8:30 AM - 4:30 PM (Mon-Fri)', details: 'Statutory institution established under Act No. 27 of 1978. Provides free legal advice, court representation, and mediation for citizens.', googleMapsUrl: 'https://maps.google.com/?q=Legal+Aid+Commission+Sri+Lanka+Colombo' },
  { id: 'loc-3', name: 'Colombo Fort Police Station Headquarters', type: 'police', typeName: 'Central Police Station', district: 'Colombo', address: 'Chaithya Road, Fort, Colombo 01', lat: 6.9366, lng: 79.8448, phone: '+94 11 243 3333 / 119 Emergency', hours: '24 Hours Emergency Service', details: 'District central police headquarters handling criminal complaints, fundamental rights compliance, and emergency assistance.', googleMapsUrl: 'https://maps.google.com/?q=Fort+Police+Station+Colombo' },
  { id: 'loc-4', name: 'Kandy Gatambe Court Complex', type: 'court', typeName: 'High & District Court Complex', district: 'Kandy', address: 'New Court Complex, Gatambe, Peradeniya, Kandy', lat: 7.2721, lng: 80.6015, phone: '+94 81 238 8200', hours: '8:30 AM - 4:15 PM (Mon-Fri)', details: 'Principal judicial complex for Central Province housing High Courts, District Courts, and Magistrate Courts of Kandy.', googleMapsUrl: 'https://maps.google.com/?q=Gatambe+Court+Complex+Kandy' },
  { id: 'loc-5', name: 'Kandy Legal Aid Commission Centre', type: 'legalaid', typeName: 'Regional Legal Aid Office', district: 'Kandy', address: 'New Court Complex, Gatambe, Peradeniya, Kandy', lat: 7.2725, lng: 80.6018, phone: '+94 81 238 8978', hours: '8:30 AM - 4:30 PM (Mon-Fri)', details: 'Provides free legal consultation and court aid representation for qualifying citizens in Kandy and surrounding central areas.', googleMapsUrl: 'https://maps.google.com/?q=Legal+Aid+Center+Gatambe+Kandy' },
  { id: 'loc-6', name: 'Kandy Central Police Station', type: 'police', typeName: 'Central Police Station', district: 'Kandy', address: 'D.S. Senanayake Veediya, Kandy', lat: 7.2906, lng: 80.6337, phone: '+94 81 222 2222 / 119', hours: '24 Hours Emergency Service', details: 'Central divisional headquarters for police protection, complaint registration, and emergency response in Kandy.', googleMapsUrl: 'https://maps.google.com/?q=Kandy+Central+Police+Station' },
  { id: 'loc-7', name: 'Galle Fort Judicial Complex', type: 'court', typeName: 'High & Magistrate Court Complex', district: 'Galle', address: 'Court Square, Fort, Galle', lat: 6.0267, lng: 80.2170, phone: '+94 91 223 4100', hours: '8:30 AM - 4:15 PM (Mon-Fri)', details: 'Historical southern provincial court complex handling civil disputes, admiralty law, land litigation, and criminal trials.', googleMapsUrl: 'https://maps.google.com/?q=Court+Complex+Fort+Galle' },
  { id: 'loc-8', name: 'Galle Legal Aid Centre', type: 'legalaid', typeName: 'Regional Legal Aid Office', district: 'Galle', address: 'Court Complex, Fort, Galle', lat: 6.0270, lng: 80.2173, phone: '+94 91 222 6124', hours: '8:30 AM - 4:30 PM (Mon-Fri)', details: 'Free legal advice desk aiding low-income individuals with family disputes, tenancy issues, and labor claims in Southern Province.', googleMapsUrl: 'https://maps.google.com/?q=Legal+Aid+Fort+Galle' },
  { id: 'loc-8b', name: 'Galle Fort Police Station', type: 'police', typeName: 'Divisional Police HQ', district: 'Galle', address: 'Hospital Road, Fort, Galle', lat: 6.0286, lng: 80.2166, phone: '+94 91 222 2222 / 119', hours: '24 Hours Emergency Service', details: 'Main police station for Galle district, handling criminal cases, traffic incidents, and emergency response for the Southern coastal area.', googleMapsUrl: 'https://maps.google.com/?q=Galle+Fort+Police+Station' },
  { id: 'loc-9', name: 'Jaffna District Court Complex', type: 'court', typeName: 'High & District Court Complex', district: 'Jaffna', address: 'Main Street, Jaffna', lat: 9.6615, lng: 80.0255, phone: '+94 21 222 2100', hours: '8:30 AM - 4:15 PM (Mon-Fri)', details: 'Northern provincial judicial headquarters conducting proceedings in Tamil and English for land, civil, and criminal matters.', googleMapsUrl: 'https://maps.google.com/?q=District+Court+Jaffna' },
  { id: 'loc-10', name: 'Jaffna Legal Aid Commission Centre', type: 'legalaid', typeName: 'Regional Legal Aid Office', district: 'Jaffna', address: 'District Court Complex, Main Street, Jaffna', lat: 9.6618, lng: 80.0258, phone: '+94 21 222 4545', hours: '8:30 AM - 4:30 PM (Mon-Fri)', details: 'Bilingual Tamil & English legal aid office offering free advice, court representation, and mediation in Jaffna district.', googleMapsUrl: 'https://maps.google.com/?q=Legal+Aid+Center+Jaffna' },
  { id: 'loc-10b', name: 'Jaffna Central Police Station', type: 'police', typeName: 'Divisional Police HQ', district: 'Jaffna', address: 'Stanley Road, Jaffna', lat: 9.6622, lng: 80.0204, phone: '+94 21 222 2444 / 119', hours: '24 Hours Emergency Service', details: 'Main police headquarters for the Jaffna district providing community policing, criminal investigation, and emergency services in Northern Province.', googleMapsUrl: 'https://maps.google.com/?q=Jaffna+Central+Police+Station' },
  { id: 'loc-11', name: 'Kurunegala District Court Complex', type: 'court', typeName: 'High & Magistrate Court Complex', district: 'Kurunegala', address: 'Court Hill, Kurunegala', lat: 7.4863, lng: 80.3647, phone: '+94 37 222 2300', hours: '8:30 AM - 4:15 PM (Mon-Fri)', details: 'North Western province judicial complex overseeing agricultural land disputes, debt recovery, and magistrate proceedings.', googleMapsUrl: 'https://maps.google.com/?q=Court+Complex+Kurunegala' },
  { id: 'loc-12', name: 'Kurunegala Legal Aid Commission Centre', type: 'legalaid', typeName: 'Regional Legal Aid Office', district: 'Kurunegala', address: 'Court Complex, Kurunegala', lat: 7.4865, lng: 80.3650, phone: '+94 37 222 9641', hours: '8:30 AM - 4:30 PM (Mon-Fri)', details: 'Government legal aid center for North Western province assisting with land rights, domestic relations, and debt relief.', googleMapsUrl: 'https://maps.google.com/?q=Legal+Aid+Kurunegala' },
  { id: 'loc-12b', name: 'Kurunegala Central Police Station', type: 'police', typeName: 'Divisional Police HQ', district: 'Kurunegala', address: 'Old Town, Kurunegala', lat: 7.4861, lng: 80.3631, phone: '+94 37 222 2222 / 119', hours: '24 Hours Emergency Service', details: 'Central police division for Kurunegala handling crimes, traffic management, and public order in North Western Province.', googleMapsUrl: 'https://maps.google.com/?q=Kurunegala+Police+Station' },
  { id: 'loc-13', name: 'Anuradhapura District Court Complex', type: 'court', typeName: 'High & District Court Complex', district: 'Anuradhapura', address: 'Court Road, Anuradhapura', lat: 8.3114, lng: 80.4037, phone: '+94 25 222 2300', hours: '8:30 AM - 4:15 PM (Mon-Fri)', details: 'North Central Province judicial complex for land rights (especially in archaeological buffer zones), criminal, and civil proceedings.', googleMapsUrl: 'https://maps.google.com/?q=Court+Complex+Anuradhapura' },
  { id: 'loc-14', name: 'Anuradhapura Legal Aid Centre', type: 'legalaid', typeName: 'Regional Legal Aid Office', district: 'Anuradhapura', address: 'Court Road, Anuradhapura', lat: 8.3117, lng: 80.4040, phone: '+94 25 222 5500', hours: '8:30 AM - 4:30 PM (Mon-Fri)', details: 'Free legal assistance focusing on land boundary disputes, heritage zone rights, and civil matters across North Central Province.', googleMapsUrl: 'https://maps.google.com/?q=Legal+Aid+Anuradhapura' },
  { id: 'loc-14b', name: 'Anuradhapura Police Headquarters', type: 'police', typeName: 'Provincial Police HQ', district: 'Anuradhapura', address: 'Kurunegala Road, Anuradhapura', lat: 8.3108, lng: 80.4010, phone: '+94 25 222 2222 / 119', hours: '24 Hours Emergency Service', details: 'Provincial police headquarters for North Central Province, coordinating law enforcement across Anuradhapura and Polonnaruwa districts.', googleMapsUrl: 'https://maps.google.com/?q=Anuradhapura+Police+Station' },
  { id: 'loc-15', name: 'Matara District Court Complex', type: 'court', typeName: 'High & District Court Complex', district: 'Matara', address: 'Court Road, Matara', lat: 5.9491, lng: 80.5356, phone: '+94 41 222 2250', hours: '8:30 AM - 4:15 PM (Mon-Fri)', details: 'Southern Province court hub for Matara district covering fisheries disputes, coastal land rights, and criminal matters.', googleMapsUrl: 'https://maps.google.com/?q=Court+Complex+Matara' },
  { id: 'loc-16', name: 'Matara Legal Aid Centre', type: 'legalaid', typeName: 'Regional Legal Aid Office', district: 'Matara', address: 'Court Road, Matara', lat: 5.9493, lng: 80.5359, phone: '+94 41 222 3315', hours: '8:30 AM - 4:30 PM (Mon-Fri)', details: 'Free legal assistance for Southern coastal communities, especially for fisheries rights, tsunami recovery land claims, and family disputes.', googleMapsUrl: 'https://maps.google.com/?q=Legal+Aid+Matara' },
  { id: 'loc-17', name: 'Batticaloa District Court Complex', type: 'court', typeName: 'High & District Court Complex', district: 'Batticaloa', address: 'Bar Road, Batticaloa', lat: 7.7102, lng: 81.6924, phone: '+94 65 222 2200', hours: '8:30 AM - 4:15 PM (Mon-Fri)', details: 'Eastern Province judicial hub handling civil, criminal, land, and post-conflict property restitution cases in Batticaloa.', googleMapsUrl: 'https://maps.google.com/?q=District+Court+Batticaloa' },
  { id: 'loc-18', name: 'Batticaloa Legal Aid Commission Centre', type: 'legalaid', typeName: 'Regional Legal Aid Office', district: 'Batticaloa', address: 'Bar Road, Batticaloa', lat: 7.7105, lng: 81.6927, phone: '+94 65 222 4411', hours: '8:30 AM - 4:30 PM (Mon-Fri)', details: 'Bilingual Tamil & English legal aid office with expertise in post-conflict property rights, IDP land claims, and domestic matters.', googleMapsUrl: 'https://maps.google.com/?q=Legal+Aid+Batticaloa' },
  { id: 'loc-18b', name: 'Batticaloa Central Police Station', type: 'police', typeName: 'Divisional Police HQ', district: 'Batticaloa', address: 'Bar Road, Batticaloa', lat: 7.7114, lng: 81.6903, phone: '+94 65 222 2222 / 119', hours: '24 Hours Emergency Service', details: 'Main police division for Batticaloa handling community policing, criminal investigations, and emergency services in Eastern Province.', googleMapsUrl: 'https://maps.google.com/?q=Batticaloa+Police+Station' },
  { id: 'loc-19', name: 'Trincomalee District Court Complex', type: 'court', typeName: 'High & District Court Complex', district: 'Trincomalee', address: 'Court Road, Trincomalee', lat: 8.5874, lng: 81.2152, phone: '+94 26 222 2600', hours: '8:30 AM - 4:15 PM (Mon-Fri)', details: 'Eastern Province court for Trincomalee district covering naval-adjacent property, harbor commerce, and land disputes.', googleMapsUrl: 'https://maps.google.com/?q=District+Court+Trincomalee' },
  { id: 'loc-20', name: 'Trincomalee Legal Aid Centre', type: 'legalaid', typeName: 'Regional Legal Aid Office', district: 'Trincomalee', address: 'Court Road, Trincomalee', lat: 8.5877, lng: 81.2155, phone: '+94 26 222 3800', hours: '8:30 AM - 4:30 PM (Mon-Fri)', details: 'Free legal aid for coastal communities in Trincomalee, specialising in fishing rights, land restitution, and civil matters.', googleMapsUrl: 'https://maps.google.com/?q=Legal+Aid+Trincomalee' },
];

const TYPE_CONFIG = {
  court:   { label: 'Courts',    icon: FaBuildingColumns, color: 'var(--accent-gold)',  bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.35)',  glow: 'rgba(245,158,11,0.18)' },
  legalaid:{ label: 'Legal Aid', icon: FaShieldHalved,    color: 'var(--accent-teal)',  bg: 'rgba(20,184,166,0.12)', border: 'rgba(20,184,166,0.35)', glow: 'rgba(20,184,166,0.18)' },
  police:  { label: 'Police HQ', icon: FaBuilding,        color: '#818cf8',             bg: 'rgba(129,140,248,0.12)',border: 'rgba(129,140,248,0.35)',glow: 'rgba(129,140,248,0.18)' },
};

export const LegalMap = () => {
  const { t } = useLanguage();

  const [selectedType,     setSelectedType]     = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [search,           setSearch]           = useState('');
  const [activeLoc,        setActiveLoc]        = useState(LEGAL_LOCATIONS[0]);
  const [viewMode,         setViewMode]         = useState('split');

  const districts = useMemo(() =>
    ['All', ...new Set(LEGAL_LOCATIONS.map((l) => l.district))],
  []);

  const stats = useMemo(() => ({
    total:    LEGAL_LOCATIONS.length,
    court:    LEGAL_LOCATIONS.filter((l) => l.type === 'court').length,
    legalaid: LEGAL_LOCATIONS.filter((l) => l.type === 'legalaid').length,
    police:   LEGAL_LOCATIONS.filter((l) => l.type === 'police').length,
  }), []);

  const filteredLocations = useMemo(() =>
    LEGAL_LOCATIONS.filter((loc) => {
      if (selectedType !== 'All' && loc.type !== selectedType) return false;
      if (selectedDistrict !== 'All' && loc.district !== selectedDistrict) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          loc.name.toLowerCase().includes(q) ||
          loc.district.toLowerCase().includes(q) ||
          loc.address.toLowerCase().includes(q)
        );
      }
      return true;
    }),
  [selectedType, selectedDistrict, search]);

  const getTypeIcon = (type, size = '1em') => {
    const cfg = TYPE_CONFIG[type];
    if (!cfg) return <FaLocationDot style={{ color: 'var(--text-muted)', fontSize: size }} />;
    const Icon = cfg.icon;
    return <Icon style={{ color: cfg.color, fontSize: size, flexShrink: 0 }} />;
  };

  const getTypeBadge = (type) => {
    const cfg = TYPE_CONFIG[type];
    if (!cfg) return null;
    return (
      <span className="lmap-type-badge" style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}>
        {getTypeIcon(type, '0.72em')} {cfg.label}
      </span>
    );
  };

  const activeCfg = TYPE_CONFIG[activeLoc.type] || {};
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${activeLoc.lng - 0.005}%2C${activeLoc.lat - 0.005}%2C${activeLoc.lng + 0.005}%2C${activeLoc.lat + 0.005}&layer=mapnik&marker=${activeLoc.lat}%2C${activeLoc.lng}`;

  return (
    <div className="lmap-page">

      {/* Header */}
      <div className="lmap-header">
        <div className="container">
          <div className="lmap-header-inner">
            <div className="lmap-header-text">
              <div className="page-badge"><FaMapLocationDot /> National Legal Navigation Map</div>
              <h1 className="lmap-title">Courts, Legal Aid &amp; Police Map</h1>
              <p className="lmap-subtitle">
                Find and navigate to official Sri Lankan court complexes, free legal aid offices,
                and police headquarters across all provinces.
              </p>
            </div>
            <div className="lmap-stats-row">
              <div className="lmap-stat-card">
                <span className="lmap-stat-num">{stats.total}</span>
                <span className="lmap-stat-label">Total Locations</span>
              </div>
              <div className="lmap-stat-card court">
                <FaBuildingColumns />
                <span className="lmap-stat-num">{stats.court}</span>
                <span className="lmap-stat-label">Courts</span>
              </div>
              <div className="lmap-stat-card legalaid">
                <FaShieldHalved />
                <span className="lmap-stat-num">{stats.legalaid}</span>
                <span className="lmap-stat-label">Legal Aid</span>
              </div>
              <div className="lmap-stat-card police">
                <FaBuilding />
                <span className="lmap-stat-num">{stats.police}</span>
                <span className="lmap-stat-label">Police HQ</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="lmap-controls-bar">
        <div className="container">
          <div className="lmap-controls-inner">
            <div className="lmap-type-filters">
              <button className={`lmap-filter-btn ${selectedType === 'All' ? 'active' : ''}`} onClick={() => setSelectedType('All')}>
                All ({stats.total})
              </button>
              {Object.entries(TYPE_CONFIG).map(([key, cfg]) => {
                const Icon = cfg.icon;
                const isActive = selectedType === key;
                return (
                  <button
                    key={key}
                    className={`lmap-filter-btn type-${key} ${isActive ? 'active' : ''}`}
                    style={isActive ? { background: cfg.bg, borderColor: cfg.border, color: cfg.color } : {}}
                    onClick={() => setSelectedType(key)}
                  >
                    <Icon /> {cfg.label} ({stats[key]})
                  </button>
                );
              })}
            </div>

            <div className="lmap-search-group">
              <div className="lmap-search-box">
                <FaMagnifyingGlass className="lmap-search-icon" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search institution, city, district..."
                  className="lmap-search-input"
                />
                {search && (
                  <button className="lmap-clear-btn" onClick={() => setSearch('')}>
                    <FaXmark />
                  </button>
                )}
              </div>

              <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} className="lmap-district-select">
                {districts.map((d) => (
                  <option key={d} value={d}>{d === 'All' ? 'All Districts' : `${d} District`}</option>
                ))}
              </select>

              <div className="lmap-view-toggle">
                <button className={`lmap-view-btn ${viewMode === 'split' ? 'active' : ''}`} onClick={() => setViewMode('split')} title="Split View"><FaFilter /></button>
                <button className={`lmap-view-btn ${viewMode === 'map'  ? 'active' : ''}`} onClick={() => setViewMode('map')}  title="Map Only"><FaMap /></button>
                <button className={`lmap-view-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')} title="List Only"><FaListUl /></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Workspace */}
      <div className={`lmap-workspace view-${viewMode}`}>

        {viewMode !== 'list' && (
          <div className="lmap-map-panel">
            <iframe key={activeLoc.id} title="Sri Lanka Legal Navigation Map" src={mapSrc} className="lmap-osm-iframe" loading="lazy" />

            <div className="lmap-float-card">
              <div className="lmap-float-header">
                <div className="lmap-float-icon-wrap" style={{ background: activeCfg.bg, border: `1.5px solid ${activeCfg.border}` }}>
                  {getTypeIcon(activeLoc.type, '1.2rem')}
                </div>
                <div className="lmap-float-title-block">
                  <h4 className="lmap-float-name">{activeLoc.name}</h4>
                  {getTypeBadge(activeLoc.type)}
                </div>
              </div>
              <div className="lmap-float-meta">
                <div className="lmap-float-meta-row"><FaLocationDot className="lmap-float-meta-icon" /><span>{activeLoc.address}</span></div>
                <div className="lmap-float-meta-row"><FaClock className="lmap-float-meta-icon" /><span>{activeLoc.hours}</span></div>
                <div className="lmap-float-meta-row"><FaPhone className="lmap-float-meta-icon" /><span>{activeLoc.phone}</span></div>
              </div>
              <div className="lmap-float-actions">
                <a href={`tel:${activeLoc.phone.split('/')[0].trim()}`} className="btn btn-secondary btn-sm"><FaPhone /> Call</a>
                <a href={activeLoc.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm"><FaRoute /> Directions</a>
              </div>
            </div>
          </div>
        )}

        {viewMode !== 'map' && (
          <div className="lmap-sidebar">
            <div className="lmap-sidebar-header">
              <h3 className="lmap-sidebar-title">Legal Infrastructure</h3>
              <span className="lmap-sidebar-count">{filteredLocations.length} of {LEGAL_LOCATIONS.length}</span>
            </div>

            <div className="lmap-location-list">
              {filteredLocations.length === 0 ? (
                <div className="lmap-empty-state">
                  <FaCircleInfo className="lmap-empty-icon" />
                  <p>No institutions found for this filter.</p>
                  <button className="btn btn-secondary btn-sm" onClick={() => { setSearch(''); setSelectedType('All'); setSelectedDistrict('All'); }}>
                    Clear Filters
                  </button>
                </div>
              ) : (
                filteredLocations.map((loc) => {
                  const cfg = TYPE_CONFIG[loc.type] || {};
                  const isActive = activeLoc.id === loc.id;
                  return (
                    <div
                      key={loc.id}
                      onClick={() => setActiveLoc(loc)}
                      className={`lmap-loc-card ${isActive ? 'active' : ''}`}
                      style={isActive ? { borderColor: cfg.border, boxShadow: `0 0 0 1px ${cfg.border}, 0 4px 20px ${cfg.glow}` } : {}}
                    >
                      {isActive && <div className="lmap-active-bar" style={{ background: cfg.color }} />}

                      <div className="lmap-loc-top">
                        <div className="lmap-loc-icon-wrap" style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                          {getTypeIcon(loc.type, '1.05rem')}
                        </div>
                        <div className="lmap-loc-title-block">
                          <h5 className="lmap-loc-name">{loc.name}</h5>
                          <div className="lmap-loc-meta-line">
                            <span className="lmap-loc-district"><FaLocationDot style={{ fontSize: '0.68rem' }} /> {loc.district}</span>
                            {getTypeBadge(loc.type)}
                          </div>
                        </div>
                      </div>

                      <p className="lmap-loc-details">{loc.details}</p>

                      <div className="lmap-loc-footer">
                        <div className="lmap-loc-footer-left">
                          <span className="lmap-loc-phone"><FaPhone style={{ fontSize: '0.65rem' }} />{loc.phone.split('/')[0].trim()}</span>
                          <span className="lmap-loc-hours"><FaClock style={{ fontSize: '0.65rem' }} />{loc.hours.includes('24') ? '24/7' : 'Business Hrs'}</span>
                        </div>
                        <button className="lmap-view-map-btn" style={isActive ? { background: cfg.bg, color: cfg.color, borderColor: cfg.border } : {}}>
                          {isActive ? 'On Map' : 'View'} {!isActive && <FaChevronRight style={{ fontSize: '0.65rem' }} />}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LegalMap;