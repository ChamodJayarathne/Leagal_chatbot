import React, { useState } from 'react';
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
  FaFilter,
  FaStar
} from 'react-icons/fa6';

export const LEGAL_LOCATIONS = [
  {
    id: 'loc-1',
    name: 'Superior Court Complex (Hulftsdorp)',
    type: 'court', // 'court' | 'legalaid' | 'police'
    typeName: 'Supreme Court & Court of Appeal',
    district: 'Colombo',
    address: 'Hulftsdorp Street, Colombo 12',
    lat: 6.9344,
    lng: 79.8569,
    phone: '+94 11 243 5149',
    hours: '8:30 AM - 4:15 PM (Mon-Fri)',
    details: 'Primary apex court of Sri Lanka. Houses the Supreme Court, Court of Appeal, and High Courts of Colombo.',
    googleMapsUrl: 'https://maps.google.com/?q=Superior+Court+Complex+Hulftsdorp+Colombo'
  },
  {
    id: 'loc-2',
    name: 'Legal Aid Commission of Sri Lanka (Head Office)',
    type: 'legalaid',
    typeName: 'Free State Legal Aid Centre',
    district: 'Colombo',
    address: 'No. 129, Superior Court Complex, Hulftsdorp Street, Colombo 12',
    lat: 6.9342,
    lng: 79.8572,
    phone: '1970 / +94 11 533 5329',
    hours: '8:30 AM - 4:30 PM (Mon-Fri)',
    details: 'Statutory institution established under Act No. 27 of 1978. Provides free legal advice, court representation, and mediation for citizens.',
    googleMapsUrl: 'https://maps.google.com/?q=Legal+Aid+Commission+Sri+Lanka+Colombo'
  },
  {
    id: 'loc-3',
    name: 'Colombo Fort Police Station Headquarters',
    type: 'police',
    typeName: 'Central Police Station',
    district: 'Colombo',
    address: 'Chaithya Road, Fort, Colombo 01',
    lat: 6.9366,
    lng: 79.8448,
    phone: '+94 11 243 3333 / 119 Emergency',
    hours: '24 Hours Emergency Service',
    details: 'District central police headquarters handling criminal complaints, fundamental rights compliance, and emergency assistance.',
    googleMapsUrl: 'https://maps.google.com/?q=Fort+Police+Station+Colombo'
  },
  {
    id: 'loc-4',
    name: 'Kandy Gatambe Court Complex',
    type: 'court',
    typeName: 'High & District Court Complex',
    district: 'Kandy',
    address: 'New Court Complex, Gatambe, Peradeniya, Kandy',
    lat: 7.2721,
    lng: 80.6015,
    phone: '+94 81 238 8200',
    hours: '8:30 AM - 4:15 PM (Mon-Fri)',
    details: 'Principal judicial complex for Central Province housing High Courts, District Courts, and Magistrate Courts of Kandy.',
    googleMapsUrl: 'https://maps.google.com/?q=Gatambe+Court+Complex+Kandy'
  },
  {
    id: 'loc-5',
    name: 'Kandy Legal Aid Commission Centre',
    type: 'legalaid',
    typeName: 'Regional Legal Aid Office',
    district: 'Kandy',
    address: 'New Court Complex, Gatambe, Peradeniya, Kandy',
    lat: 7.2725,
    lng: 80.6018,
    phone: '+94 81 238 8978',
    hours: '8:30 AM - 4:30 PM',
    details: 'Provides free legal consultation and court aid representation for qualifying citizens in Kandy and surrounding central areas.',
    googleMapsUrl: 'https://maps.google.com/?q=Legal+Aid+Center+Gatambe+Kandy'
  },
  {
    id: 'loc-6',
    name: 'Kandy Central Police Station',
    type: 'police',
    typeName: 'Central Police Station',
    district: 'Kandy',
    address: 'D.S. Senanayake Veediya, Kandy',
    lat: 7.2906,
    lng: 80.6337,
    phone: '+94 81 222 2222 / 119',
    hours: '24 Hours Emergency Service',
    details: 'Central divisional headquarters for police protection, complaint registration, and emergency response in Kandy.',
    googleMapsUrl: 'https://maps.google.com/?q=Kandy+Central+Police+Station'
  },
  {
    id: 'loc-7',
    name: 'Galle Fort Judicial Complex',
    type: 'court',
    typeName: 'High & Magistrate Court Complex',
    district: 'Galle',
    address: 'Court Square, Fort, Galle',
    lat: 6.0267,
    lng: 80.2170,
    phone: '+94 91 223 4100',
    hours: '8:30 AM - 4:15 PM',
    details: 'Historical southern provincial court complex handling civil disputes, admiralty law, land litigation, and criminal trials.',
    googleMapsUrl: 'https://maps.google.com/?q=Court+Complex+Fort+Galle'
  },
  {
    id: 'loc-8',
    name: 'Galle Legal Aid Centre',
    type: 'legalaid',
    typeName: 'Regional Legal Aid Office',
    district: 'Galle',
    address: 'Court Complex, Fort, Galle',
    lat: 6.0270,
    lng: 80.2173,
    phone: '+94 91 222 6124',
    hours: '8:30 AM - 4:30 PM',
    details: 'Free legal advice desk aiding low-income individuals with family disputes, tenancy issues, and labor claims in Southern Province.',
    googleMapsUrl: 'https://maps.google.com/?q=Legal+Aid+Fort+Galle'
  },
  {
    id: 'loc-9',
    name: 'Jaffna District Court Complex',
    type: 'court',
    typeName: 'High & District Court Complex',
    district: 'Jaffna',
    address: 'Main Street, Jaffna',
    lat: 9.6615,
    lng: 80.0255,
    phone: '+94 21 222 2100',
    hours: '8:30 AM - 4:15 PM',
    details: 'Northern provincial judicial headquarters conducting proceedings in Tamil and English for land, civil, and criminal matters.',
    googleMapsUrl: 'https://maps.google.com/?q=District+Court+Jaffna'
  },
  {
    id: 'loc-10',
    name: 'Jaffna Legal Aid Commission Centre',
    type: 'legalaid',
    typeName: 'Regional Legal Aid Office',
    district: 'Jaffna',
    address: 'District Court Complex, Main Street, Jaffna',
    lat: 9.6618,
    lng: 80.0258,
    phone: '+94 21 222 4545',
    hours: '8:30 AM - 4:30 PM',
    details: 'Bilingual Tamil & English legal aid office offering free advice, court representation, and mediation in Jaffna district.',
    googleMapsUrl: 'https://maps.google.com/?q=Legal+Aid+Center+Jaffna'
  },
  {
    id: 'loc-11',
    name: 'Kurunegala District Court Complex',
    type: 'court',
    typeName: 'High & Magistrate Court Complex',
    district: 'Kurunegala',
    address: 'Court Hill, Kurunegala',
    lat: 7.4863,
    lng: 80.3647,
    phone: '+94 37 222 2300',
    hours: '8:30 AM - 4:15 PM',
    details: 'North Western province judicial complex overseeing agricultural land disputes, debt recovery, and magistrate proceedings.',
    googleMapsUrl: 'https://maps.google.com/?q=Court+Complex+Kurunegala'
  },
  {
    id: 'loc-12',
    name: 'Kurunegala Legal Aid Commission Centre',
    type: 'legalaid',
    typeName: 'Regional Legal Aid Office',
    district: 'Kurunegala',
    address: 'Court Complex, Kurunegala',
    lat: 7.4865,
    lng: 80.3650,
    phone: '+94 37 222 9641',
    hours: '8:30 AM - 4:30 PM',
    details: 'Government legal aid center for North Western province assisting with land rights, domestic relations, and debt relief.',
    googleMapsUrl: 'https://maps.google.com/?q=Legal+Aid+Kurunegala'
  }
];

export const LegalMap = () => {
  const { t } = useLanguage();

  const [selectedType, setSelectedType] = useState('All'); // 'All' | 'court' | 'legalaid' | 'police'
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [search, setSearch] = useState('');
  const [activeLoc, setActiveLoc] = useState(LEGAL_LOCATIONS[0]);

  const districts = ['All', 'Colombo', 'Kandy', 'Galle', 'Jaffna', 'Kurunegala'];

  // Filter locations
  const filteredLocations = LEGAL_LOCATIONS.filter((loc) => {
    const matchesType = selectedType === 'All' || loc.type === selectedType;
    const matchesDistrict = selectedDistrict === 'All' || loc.district === selectedDistrict;
    const matchesSearch =
      !search ||
      loc.name.toLowerCase().includes(search.toLowerCase()) ||
      loc.district.toLowerCase().includes(search.toLowerCase()) ||
      loc.address.toLowerCase().includes(search.toLowerCase());

    return matchesType && matchesDistrict && matchesSearch;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'court':
        return <FaBuildingColumns className="type-icon court" />;
      case 'legalaid':
        return <FaShieldHalved className="type-icon legalaid" />;
      case 'police':
        return <FaBuilding className="type-icon police" />;
      default:
        return <FaLocationDot className="type-icon" />;
    }
  };

  return (
    <div className="map-page container">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-badge">
          <FaMapLocationDot /> National Legal Navigation Map
        </div>
        <h1 className="page-title">Courts, Legal Aid & Police Headquarters Map</h1>
        <p className="page-subtitle">
          Find and navigate to official Sri Lankan Court Complexes, Free Legal Aid Commission offices, and Central Police Headquarters across all provinces.
        </p>
      </div>

      {/* Map Controls & Filters */}
      <div className="map-filter-bar">
        {/* Type Filter Buttons */}
        <div className="type-filter-group">
          <button
            className={`type-btn ${selectedType === 'All' ? 'active' : ''}`}
            onClick={() => setSelectedType('All')}
          >
            All Institutions ({LEGAL_LOCATIONS.length})
          </button>
          <button
            className={`type-btn court ${selectedType === 'court' ? 'active' : ''}`}
            onClick={() => setSelectedType('court')}
          >
            <FaBuildingColumns /> Courts
          </button>
          <button
            className={`type-btn legalaid ${selectedType === 'legalaid' ? 'active' : ''}`}
            onClick={() => setSelectedType('legalaid')}
          >
            <FaShieldHalved /> Free Legal Aid
          </button>
          <button
            className={`type-btn police ${selectedType === 'police' ? 'active' : ''}`}
            onClick={() => setSelectedType('police')}
          >
            <FaBuilding /> Police HQ
          </button>
        </div>

        {/* Search & District Dropdown */}
        <div className="map-inputs-group">
          <div className="search-box">
            <FaMagnifyingGlass className="search-icon" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by institution name, city, or address..."
              className="map-search-input"
            />
          </div>

          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="district-select"
          >
            {districts.map((d) => (
              <option key={d} value={d}>
                {d === 'All' ? 'All Districts' : `${d} District`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Map & Directory Grid */}
      <div className="map-workspace-layout">
        {/* Left Side: Interactive Map View / Canvas */}
        <div className="map-canvas-container">
          {/* Embedded OpenStreetMap Iframe centered on Sri Lanka / Active Location */}
          <iframe
            title="Sri Lanka Legal Navigation Map"
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${activeLoc.lng - 0.08}%2C${activeLoc.lat - 0.08}%2C${activeLoc.lng + 0.08}%2C${activeLoc.lat + 0.08}&layer=mapnik&marker=${activeLoc.lat}%2C${activeLoc.lng}`}
            className="osm-iframe"
          />

          {/* Floating Selected Location Info Card on Top of Map */}
          <div className="map-floating-info-card">
            <div className="info-card-header">
              {getTypeIcon(activeLoc.type)}
              <div>
                <h4>{activeLoc.name}</h4>
                <span className="type-tag">{activeLoc.typeName}</span>
              </div>
            </div>
            <p className="info-address"><FaLocationDot /> {activeLoc.address}</p>
            <p className="info-hours">⏰ {activeLoc.hours}</p>

            <div className="info-actions">
              <a href={`tel:${activeLoc.phone.split('/')[0].trim()}`} className="btn btn-secondary btn-sm">
                <FaPhone /> Call {activeLoc.phone.split('/')[0]}
              </a>
              <a
                href={activeLoc.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
              >
                <FaRoute /> Get Directions
              </a>
            </div>
          </div>
        </div>

        {/* Right Side: Locations Directory List */}
        <div className="map-locations-sidebar">
          <h3 className="sidebar-title">
            Legal Infrastructure ({filteredLocations.length})
          </h3>

          <div className="locations-list">
            {filteredLocations.length === 0 ? (
              <div className="no-loc-found">No matching institutions found for this filter.</div>
            ) : (
              filteredLocations.map((loc) => (
                <div
                  key={loc.id}
                  onClick={() => setActiveLoc(loc)}
                  className={`location-item-card ${activeLoc.id === loc.id ? 'active' : ''}`}
                >
                  <div className="item-top">
                    {getTypeIcon(loc.type)}
                    <div className="item-title-block">
                      <h5>{loc.name}</h5>
                      <span className="item-district">{loc.district} District</span>
                    </div>
                  </div>

                  <p className="item-address">{loc.address}</p>
                  <p className="item-details">{loc.details}</p>

                  <div className="item-footer">
                    <span className="phone-text"><FaPhone /> {loc.phone}</span>
                    <button className="btn-select-pin">
                      {activeLoc.id === loc.id ? 'Selected' : 'View on Map'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalMap;
