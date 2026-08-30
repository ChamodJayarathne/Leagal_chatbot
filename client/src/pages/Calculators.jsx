import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  FaCalculator,
  FaCoins,
  FaClock,
  FaFileInvoiceDollar,
  FaCircleInfo,
  FaTriangleExclamation,
  FaCheck,
  FaScaleBalanced,
  FaArrowRight
} from 'react-icons/fa6';

export const Calculators = () => {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('gratuity'); // 'gratuity' | 'overtime' | 'stampduty'

  // 1. Gratuity Calculator State
  const [gratuityForm, setGratuityForm] = useState({
    basicSalary: '85000',
    yearsWorked: '8',
    establishmentSize: '15+', // '15+' or 'less15'
  });
  const [gratuityResult, setGratuityResult] = useState(null);

  // 2. Overtime Calculator State
  const [otForm, setOtForm] = useState({
    basicSalary: '75000',
    monthlyHours: '195', // standard 195 hrs (45 hrs/week)
    otHours: '16',
  });
  const [otResult, setOtResult] = useState(null);

  // 3. Stamp Duty Estimator State
  const [stampForm, setStampForm] = useState({
    docType: 'deed', // 'deed' | 'lease'
    propertyValue: '15000000',
    leaseDurationMonths: '24',
    monthlyRent: '120000',
  });
  const [stampResult, setStampResult] = useState(null);

  // --- Calculate Gratuity ---
  const calculateGratuity = (e) => {
    e.preventDefault();
    const salary = parseFloat(gratuityForm.basicSalary) || 0;
    const years = parseFloat(gratuityForm.yearsWorked) || 0;

    const isEligible = years >= 5;
    const halfMonthSalary = salary / 2;
    const totalGratuity = isEligible ? halfMonthSalary * years : 0;

    setGratuityResult({
      salary,
      years,
      isEligible,
      halfMonthSalary,
      totalGratuity,
      statutoryDaysLimit: 30,
    });
  };

  // --- Calculate Overtime ---
  const calculateOvertime = (e) => {
    e.preventDefault();
    const salary = parseFloat(otForm.basicSalary) || 0;
    const monthlyHrs = parseFloat(otForm.monthlyHours) || 195;
    const otHrs = parseFloat(otForm.otHours) || 0;

    const hourlyRate = salary / monthlyHrs;
    const otRate = hourlyRate * 1.5;
    const totalOtPay = otRate * otHrs;
    const totalSalaryWithOt = salary + totalOtPay;
    const exceedsWeeklyLimit = otHrs > 48; // 12 hrs/week * 4 weeks

    setOtResult({
      salary,
      monthlyHrs,
      otHrs,
      hourlyRate,
      otRate,
      totalOtPay,
      totalSalaryWithOt,
      exceedsWeeklyLimit,
    });
  };

  // --- Calculate Stamp Duty ---
  const calculateStampDuty = (e) => {
    e.preventDefault();
    let dutyAmount = 0;
    let breakdownText = '';

    if (stampForm.docType === 'deed') {
      const val = parseFloat(stampForm.propertyValue) || 0;
      if (val <= 100000) {
        dutyAmount = val * 0.03;
        breakdownText = `3% of LKR ${val.toLocaleString()}`;
      } else {
        const firstTier = 100000 * 0.03;
        const remainder = val - 100000;
        const secondTier = remainder * 0.04;
        dutyAmount = firstTier + secondTier;
        breakdownText = `3% of first LKR 100,000 (LKR 3,000) + 4% of balance LKR ${remainder.toLocaleString()} (LKR ${secondTier.toLocaleString()})`;
      }
    } else {
      const rent = parseFloat(stampForm.monthlyRent) || 0;
      const months = parseFloat(stampForm.leaseDurationMonths) || 12;
      const totalRent = rent * months;
      dutyAmount = totalRent * 0.01;
      breakdownText = `1% of total lease value LKR ${totalRent.toLocaleString()} (${months} months × LKR ${rent.toLocaleString()})`;
    }

    setStampResult({
      docType: stampForm.docType,
      propertyValue: parseFloat(stampForm.propertyValue) || 0,
      dutyAmount,
      breakdownText,
    });
  };

  return (
    <div className="calculators-page container">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-badge">
          <FaCalculator /> Statutory Legal Calculators
        </div>
        <h1 className="page-title">Sri Lankan Employment & Property Calculators</h1>
        <p className="page-subtitle">
          Calculate your statutory legal entitlements under Sri Lankan Acts (Gratuity Act No. 12 of 1983, Shop & Office Employees Act No. 19 of 1954, and Inland Revenue Stamp Duty Regulations).
        </p>
      </div>

      {/* Tabs */}
      <div className="calc-tab-switcher">
        <button
          className={`calc-tab-btn ${activeTab === 'gratuity' ? 'active' : ''}`}
          onClick={() => setActiveTab('gratuity')}
        >
          <FaCoins className="tab-icon" /> Gratuity Payout Calculator
        </button>
        <button
          className={`calc-tab-btn ${activeTab === 'overtime' ? 'active' : ''}`}
          onClick={() => setActiveTab('overtime')}
        >
          <FaClock className="tab-icon" /> Overtime Pay Calculator
        </button>
        <button
          className={`calc-tab-btn ${activeTab === 'stampduty' ? 'active' : ''}`}
          onClick={() => setActiveTab('stampduty')}
        >
          <FaFileInvoiceDollar className="tab-icon" /> Stamp Duty Estimator
        </button>
      </div>

      {/* Calculator Body */}
      <div className="calc-main-content">
        {/* ====================================================
            1. GRATUITY CALCULATOR
           ==================================================== */}
        {activeTab === 'gratuity' && (
          <div className="calc-grid-layout">
            {/* Input Form */}
            <div className="calc-card">
              <div className="calc-card-header">
                <h3><FaCoins className="accent-icon" /> Payment of Gratuity Calculator</h3>
                <p className="calc-act-ref">Payment of Gratuity Act No. 12 of 1983</p>
              </div>

              <form onSubmit={calculateGratuity} className="calc-form">
                <div className="form-group">
                  <label className="form-label">Last Drawn Monthly Basic Salary (LKR) *</label>
                  <input
                    type="number"
                    value={gratuityForm.basicSalary}
                    onChange={(e) => setGratuityForm({ ...gratuityForm, basicSalary: e.target.value })}
                    required
                    min="1"
                    placeholder="e.g. 85000"
                    className="form-input"
                  />
                  <small className="form-help">Includes basic salary + cost of living allowance (excluding variable bonuses).</small>
                </div>

                <div className="form-group">
                  <label className="form-label">Completed Years of Continuous Service *</label>
                  <input
                    type="number"
                    value={gratuityForm.yearsWorked}
                    onChange={(e) => setGratuityForm({ ...gratuityForm, yearsWorked: e.target.value })}
                    required
                    min="1"
                    max="60"
                    placeholder="e.g. 8"
                    className="form-input"
                  />
                  <small className="form-help">Under Section 5(1), minimum 5 years of service is required for statutory eligibility.</small>
                </div>

                <div className="form-group">
                  <label className="form-label">Workplace Employee Count</label>
                  <select
                    value={gratuityForm.establishmentSize}
                    onChange={(e) => setGratuityForm({ ...gratuityForm, establishmentSize: e.target.value })}
                    className="form-select"
                  >
                    <option value="15+">15 or more employees (Mandatory Statutory Cover)</option>
                    <option value="less15">Fewer than 15 employees</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-primary btn-block">
                  Calculate Statutory Gratuity <FaArrowRight />
                </button>
              </form>
            </div>

            {/* Results Display */}
            <div className="calc-result-pane">
              {gratuityResult ? (
                <div className="result-card fade-in">
                  <div className="result-header">
                    <span>Statutory Gratuity Entitlement</span>
                    <span className={`status-badge ${gratuityResult.isEligible ? 'eligible' : 'ineligible'}`}>
                      {gratuityResult.isEligible ? 'ELIGIBLE' : 'NOT ELIGIBLE (< 5 YRS)'}
                    </span>
                  </div>

                  <div className="result-main-number">
                    <span className="currency">LKR</span>
                    <span className="amount">{gratuityResult.totalGratuity.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>

                  <div className="result-breakdown-list">
                    <div className="breakdown-item">
                      <span>Calculation Basis:</span>
                      <strong>(Half Month Basic) × (Years Served)</strong>
                    </div>
                    <div className="breakdown-item">
                      <span>Half Month Salary (50%):</span>
                      <strong>LKR {gratuityResult.halfMonthSalary.toLocaleString()}</strong>
                    </div>
                    <div className="breakdown-item">
                      <span>Continuous Years Served:</span>
                      <strong>{gratuityResult.years} Years</strong>
                    </div>
                    <div className="breakdown-item">
                      <span>Statutory Payment Deadline:</span>
                      <strong>Within 30 days of termination</strong>
                    </div>
                  </div>

                  {/* Warning / Advice Callout */}
                  {!gratuityResult.isEligible ? (
                    <div className="calc-alert warning">
                      <FaTriangleExclamation className="alert-icon" />
                      <div>
                        <strong>Minimum 5-Year Threshold Not Met:</strong>
                        <p>Under Section 5(1) of the Act, employees who resign or are terminated with less than 5 completed years of service are not entitled to statutory gratuity unless specified in a private employment contract.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="calc-alert success">
                      <FaCheck className="alert-icon" />
                      <div>
                        <strong>Statutory Guarantee under Sri Lankan Law:</strong>
                        <p>Your employer is mandated to pay this amount within 30 days of your resignation/retirement. Failure to pay attracts a 10% per annum default penalty interest enforceable at the Labor Tribunal.</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="calc-result-placeholder">
                  <FaCoins className="placeholder-icon" />
                  <h4>Enter Salary and Service Years</h4>
                  <p>Click "Calculate Statutory Gratuity" to see your exact legal payout calculation and rights under Sri Lankan Labor Law.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ====================================================
            2. OVERTIME PAY CALCULATOR
           ==================================================== */}
        {activeTab === 'overtime' && (
          <div className="calc-grid-layout">
            <div className="calc-card">
              <div className="calc-card-header">
                <h3><FaClock className="accent-icon" /> Overtime Pay Calculator</h3>
                <p className="calc-act-ref">Shop and Office Employees Act No. 19 of 1954</p>
              </div>

              <form onSubmit={calculateOvertime} className="calc-form">
                <div className="form-group">
                  <label className="form-label">Monthly Basic Salary (LKR) *</label>
                  <input
                    type="number"
                    value={otForm.basicSalary}
                    onChange={(e) => setOtForm({ ...otForm, basicSalary: e.target.value })}
                    required
                    min="1"
                    placeholder="e.g. 75000"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Standard Monthly Working Hours</label>
                  <select
                    value={otForm.monthlyHours}
                    onChange={(e) => setOtForm({ ...otForm, monthlyHours: e.target.value })}
                    className="form-select"
                  >
                    <option value="195">195 Hours (Standard Shop & Office 45 hrs/week)</option>
                    <option value="208">208 Hours (Factory / 8 hrs × 26 working days)</option>
                    <option value="240">240 Hours (Security & Specialized Services)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Total Overtime Hours Worked This Month *</label>
                  <input
                    type="number"
                    value={otForm.otHours}
                    onChange={(e) => setOtForm({ ...otForm, otHours: e.target.value })}
                    required
                    min="0"
                    placeholder="e.g. 16"
                    className="form-input"
                  />
                  <small className="form-help">Overtime is paid at 1.5 times the hourly basic rate under Sri Lankan law.</small>
                </div>

                <button type="submit" className="btn btn-primary btn-block">
                  Calculate Overtime Pay <FaArrowRight />
                </button>
              </form>
            </div>

            <div className="calc-result-pane">
              {otResult ? (
                <div className="result-card fade-in">
                  <div className="result-header">
                    <span>Overtime Payout Summary</span>
                    <span className="status-badge eligible">1.5x RATE APPLIED</span>
                  </div>

                  <div className="result-main-number">
                    <span className="currency">LKR</span>
                    <span className="amount">{otResult.totalOtPay.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>

                  <div className="result-breakdown-list">
                    <div className="breakdown-item">
                      <span>Normal Hourly Basic Rate:</span>
                      <strong>LKR {otResult.hourlyRate.toFixed(2)} / hr</strong>
                    </div>
                    <div className="breakdown-item">
                      <span>Statutory Overtime Rate (1.5x):</span>
                      <strong>LKR {otResult.otRate.toFixed(2)} / hr</strong>
                    </div>
                    <div className="breakdown-item">
                      <span>Overtime Hours Worked:</span>
                      <strong>{otResult.otHours} Hours</strong>
                    </div>
                    <div className="breakdown-item">
                      <span>Total Month Payout (Basic + OT):</span>
                      <strong className="text-highlight">LKR {otResult.totalSalaryWithOt.toLocaleString()}</strong>
                    </div>
                  </div>

                  {otResult.exceedsWeeklyLimit && (
                    <div className="calc-alert warning">
                      <FaTriangleExclamation className="alert-icon" />
                      <div>
                        <strong>Weekly Legal OT Limit Notice:</strong>
                        <p>Under Sri Lankan Labor Regulations, total overtime should generally not exceed 12 hours per week without prior permission from the Department of Labor.</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="calc-result-placeholder">
                  <FaClock className="placeholder-icon" />
                  <h4>Enter Salary & OT Hours</h4>
                  <p>Click "Calculate Overtime Pay" to check your hourly pay rate, 1.5x overtime multiplier, and statutory total.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ====================================================
            3. STAMP DUTY ESTIMATOR
           ==================================================== */}
        {activeTab === 'stampduty' && (
          <div className="calc-grid-layout">
            <div className="calc-card">
              <div className="calc-card-header">
                <h3><FaFileInvoiceDollar className="accent-icon" /> Deed & Lease Stamp Duty Estimator</h3>
                <p className="calc-act-ref">Inland Revenue Department & Provincial Council Regulations</p>
              </div>

              <form onSubmit={calculateStampDuty} className="calc-form">
                <div className="form-group">
                  <label className="form-label">Instrument Type</label>
                  <select
                    value={stampForm.docType}
                    onChange={(e) => setStampForm({ ...stampForm, docType: e.target.value })}
                    className="form-select"
                  >
                    <option value="deed">Deed of Transfer (Land / Property Purchase)</option>
                    <option value="lease">Lease Agreement (Residential / Commercial Rent)</option>
                  </select>
                </div>

                {stampForm.docType === 'deed' ? (
                  <div className="form-group">
                    <label className="form-label">Total Land / Property Value (LKR) *</label>
                    <input
                      type="number"
                      value={stampForm.propertyValue}
                      onChange={(e) => setStampForm({ ...stampForm, propertyValue: e.target.value })}
                      required
                      min="1000"
                      placeholder="e.g. 15000000"
                      className="form-input"
                    />
                  </div>
                ) : (
                  <>
                    <div className="form-group">
                      <label className="form-label">Monthly Rental Amount (LKR) *</label>
                      <input
                        type="number"
                        value={stampForm.monthlyRent}
                        onChange={(e) => setStampForm({ ...stampForm, monthlyRent: e.target.value })}
                        required
                        min="1000"
                        placeholder="e.g. 120000"
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Lease Duration (Months) *</label>
                      <input
                        type="number"
                        value={stampForm.leaseDurationMonths}
                        onChange={(e) => setStampForm({ ...stampForm, leaseDurationMonths: e.target.value })}
                        required
                        min="1"
                        placeholder="e.g. 24"
                        className="form-input"
                      />
                    </div>
                  </>
                )}

                <button type="submit" className="btn btn-primary btn-block">
                  Estimate Stamp Duty <FaArrowRight />
                </button>
              </form>
            </div>

            <div className="calc-result-pane">
              {stampResult ? (
                <div className="result-card fade-in">
                  <div className="result-header">
                    <span>Estimated Stamp Duty Liability</span>
                    <span className="status-badge eligible">OFFICIAL TARIFF</span>
                  </div>

                  <div className="result-main-number">
                    <span className="currency">LKR</span>
                    <span className="amount">{stampResult.dutyAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>

                  <div className="result-breakdown-list">
                    <div className="breakdown-item">
                      <span>Tariff Schedule:</span>
                      <strong>{stampResult.breakdownText}</strong>
                    </div>
                    <div className="breakdown-item">
                      <span>Payable To:</span>
                      <strong>Provincial Revenue Department / Registrar of Lands</strong>
                    </div>
                  </div>

                  <div className="calc-alert info">
                    <FaCircleInfo className="alert-icon" />
                    <div>
                      <strong>Notary Note:</strong>
                      <p>In addition to stamp duty, legal conveyancing fees (usually 1% to 2% of property value) plus registration fees at the Land Registry apply.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="calc-result-placeholder">
                  <FaFileInvoiceDollar className="placeholder-icon" />
                  <h4>Enter Property or Lease Details</h4>
                  <p>Click "Estimate Stamp Duty" to view official Provincial Land Registry stamp duty rates in Sri Lanka.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calculators;
