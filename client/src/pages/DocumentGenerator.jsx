import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { 
  FaFileContract, 
  FaPrint, 
  FaDownload, 
  FaCopy, 
  FaCheck, 
  FaWandMagicSparkles,
  FaFileLines,
  FaFilePen,
  FaPenToSquare,
  FaTrashCan,
  FaFloppyDisk,
  FaRotateLeft,
  FaXmark,
  FaShieldHalved,
  FaCircleCheck,
  FaTriangleExclamation,
  FaCircleInfo,
  FaGlobe,
  FaArrowsRotate,
  FaCloudArrowUp,
  FaSpinner
} from 'react-icons/fa6';

export const DocumentGenerator = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();

  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState({});
  const [generatedDocument, setGeneratedDocument] = useState('');
  const [originalDocument, setOriginalDocument] = useState('');
  const [editableContent, setEditableContent] = useState('');
  const [currentDocId, setCurrentDocId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [saveToast, setSaveToast] = useState(null);
  const [docLanguage, setDocLanguage] = useState(language || 'en');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showVerification, setShowVerification] = useState(true);

  // Sync docLanguage when app language changes if user hasn't explicitly overridden
  useEffect(() => {
    if (language) {
      setDocLanguage(language);
    }
  }, [language]);

  // Fetch templates on mount
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await axios.get('/api/documents/templates');
        setTemplates(res.data);
        if (res.data.length > 0) {
          selectTemplate(res.data[0]);
        }
      } catch (err) {
        console.error('Fetch templates error:', err);
      }
    };
    fetchTemplates();
  }, []);

  const selectTemplate = (template) => {
    setSelectedTemplate(template);
    const initialData = {};
    template.fields.forEach((f) => {
      // Default to first option value if select field
      if (f.type === 'select' && f.options && f.options.length > 0) {
        initialData[f.name] = f.options[0].value;
      } else {
        initialData[f.name] = '';
      }
    });
    setFormData(initialData);
    setGeneratedDocument('');
    setOriginalDocument('');
    setEditableContent('');
    setCurrentDocId(null);
    setIsEditing(false);
  };

  const handleInputChange = (fieldName, value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleClearForm = () => {
    if (!selectedTemplate) return;
    const cleared = {};
    selectedTemplate.fields.forEach((f) => {
      cleared[f.name] = f.type === 'select' && f.options ? f.options[0].value : '';
    });
    setFormData(cleared);
  };

  // Helper: Sri Lankan NIC validation
  const isValidSriLankanNIC = (nic) => {
    if (!nic) return false;
    const clean = nic.trim().toUpperCase();
    return /^[0-9]{9}[VX]$/.test(clean) || /^[0-9]{12}$/.test(clean);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!selectedTemplate) return;

    setLoading(true);
    try {
      const res = await axios.post('/api/documents/generate', {
        templateId: selectedTemplate.id,
        formData,
        userId: user?.id || 'guest_default',
        language: docLanguage,
      });

      if (res.data.success) {
        const content = res.data.document.generatedContent;
        setGeneratedDocument(content);
        setOriginalDocument(content);
        setEditableContent(content);
        setCurrentDocId(res.data.document._id);
        setIsEditing(false);
        setSaveToast({ type: 'success', message: 'Legal document draft generated successfully!' });
        setTimeout(() => setSaveToast(null), 3000);
      }
    } catch (err) {
      console.error('Document generation error:', err);
      alert('Error generating document draft. Please verify all required fields.');
    } finally {
      setLoading(false);
    }
  };

  // Enable Edit Mode
  const handleStartEdit = () => {
    setEditableContent(generatedDocument);
    setIsEditing(true);
  };

  // Save Edits — awaits DB confirmation before updating UI
  const handleSaveEdit = async () => {
    if (isSaving) return; // prevent double-click
    setIsSaving(true);

    try {
      if (currentDocId) {
        // Call DB first — sends both generatedContent AND formData
        const res = await axios.put(`/api/documents/${currentDocId}`, {
          generatedContent: editableContent,
          formData,                                          // ← persist all form fields too
          title: selectedTemplate?.title?.split(' (')[0],
        });

        // Update local state after DB confirms
        setGeneratedDocument(editableContent);
        setIsEditing(false);

        const savedToDb = res.data?.savedToDb !== false;
        const docId = res.data?.document?._id || currentDocId;
        setCurrentDocId(docId);

        setSaveToast({
          type: 'success',
          message: savedToDb
            ? '✅ Document & form data saved to database!'
            : '✅ Saved (memory mode — DB offline).',
        });
      } else {
        // No DB ID yet — save locally only
        setGeneratedDocument(editableContent);
        setIsEditing(false);
        setSaveToast({ type: 'success', message: '✅ Edits saved to local draft.' });
      }
    } catch (err) {
      console.error('Failed to save edited document to database:', err);
      // Still update local view so user doesn't lose work
      setGeneratedDocument(editableContent);
      setIsEditing(false);
      setSaveToast({
        type: 'error',
        message: '⚠️ DB save failed — edits kept locally. Server may be offline.',
      });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveToast(null), 4000);
    }
  };

  // Revert Edits to Original Generated Version
  const handleRevertEdit = () => {
    if (window.confirm('Revert all edits back to the originally generated AI draft?')) {
      setEditableContent(originalDocument);
      setGeneratedDocument(originalDocument);
      setIsEditing(false);
      setSaveToast({ type: 'info', message: 'Reverted to original generated draft.' });
      setTimeout(() => setSaveToast(null), 3000);
    }
  };

  // Cancel Editing
  const handleCancelEdit = () => {
    setEditableContent(generatedDocument);
    setIsEditing(false);
  };

  // Delete / Clear Draft
  const handleConfirmDelete = async () => {
    if (currentDocId) {
      try {
        await axios.delete(`/api/documents/${currentDocId}`);
      } catch (err) {
        console.error('Error deleting document on server:', err);
      }
    }

    setGeneratedDocument('');
    setOriginalDocument('');
    setEditableContent('');
    setCurrentDocId(null);
    setIsEditing(false);
    setShowDeleteModal(false);
    setSaveToast({ type: 'info', message: 'Document preview cleared and deleted.' });
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedDocument);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedDocument], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${selectedTemplate?.id || 'legal_doc'}_draft.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadPdf = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${selectedTemplate?.title || 'Legal Document'} - Sri Lanka Statutory Draft</title>
          <style>
            @page { size: A4; margin: 25mm 20mm 20mm 20mm; }
            body { font-family: 'Times New Roman', Times, serif; color: #111; padding: 25px; line-height: 1.8; font-size: 12.5pt; background: #fff; }
            .header-emblem { text-align: center; font-size: 16pt; font-weight: bold; letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 4px; border-bottom: 3px double #111; padding-bottom: 10px; }
            .sub-header { text-align: center; font-size: 10.5pt; font-style: italic; color: #333; margin-bottom: 30px; }
            .doc-body { white-space: pre-wrap; font-family: 'Times New Roman', Times, serif; text-align: justify; font-size: 12pt; line-height: 1.8; word-break: break-word; }
            .footer-disclaimer { margin-top: 60px; font-size: 9pt; font-style: italic; color: #666; text-align: center; border-top: 1px dashed #aaa; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header-emblem">${selectedTemplate?.title || 'STATUTORY LEGAL INSTRUMENT'}</div>
          <div class="sub-header">DEMOCRATIC SOCIALIST REPUBLIC OF SRI LANKA · STATUTORY LEGAL INSTRUMENT</div>
          
          <div class="doc-body">${generatedDocument}</div>

          <div class="footer-disclaimer">
            Generated and formatted via LegalAI Sri Lanka Statutory Drafting System. Formal legal documents require attestation by a Commissioner for Oaths, Justice of the Peace, or Notary Public.
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const isContentModified = generatedDocument && originalDocument && generatedDocument !== originalDocument;
  const wordCount = (isEditing ? editableContent : generatedDocument).trim() ? (isEditing ? editableContent : generatedDocument).trim().split(/\s+/).length : 0;
  const charCount = (isEditing ? editableContent : generatedDocument).length;

  return (
    <div className="doc-page container">
      {/* Header */}
      <div className="page-header">
        <div className="page-badge">
          <FaFileContract /> Statutory Draft Generator
        </div>
        <h1 className="page-title">Automated Sri Lankan Legal Document Drafting</h1>
        <p className="page-subtitle">
          Generate, verify, edit, and export legally compliant draft Affidavits, Tenancy Contracts, Debt Recovery Letters, Police Complaints, and Vehicle Sale Agreements.
        </p>
      </div>

      {/* Save / Feedback Toast */}
      {saveToast && (
        <div className={`doc-toast ${saveToast.type}`}>
          {saveToast.type === 'success' && <FaCircleCheck />}
          {saveToast.type === 'info' && <FaCircleInfo />}
          {saveToast.type === 'error' && <FaTriangleExclamation />}
          <span>{saveToast.message}</span>
        </div>
      )}

      <div className="doc-generator-layout">
        {/* Left Side: Template Selector & Input Form */}
        <div className="doc-form-pane">
          {/* Template Selection Tabs */}
          <div className="template-tabs">
            {templates.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => selectTemplate(tpl)}
                className={`template-tab ${selectedTemplate?.id === tpl.id ? 'active' : ''}`}
              >
                <FaFileLines />
                <span>{tpl.title.split(' (')[0]}</span>
              </button>
            ))}
          </div>

          {selectedTemplate && (
            <div className="template-form-card">
              <div className="template-form-header">
                <div>
                  <h3>
                    <FaFilePen /> {selectedTemplate.title}
                  </h3>
                  <p className="template-desc">{selectedTemplate.description}</p>
                </div>
                <button 
                  type="button" 
                  onClick={handleClearForm} 
                  className="btn btn-secondary btn-sm"
                  title="Reset form fields"
                >
                  <FaRotateLeft /> Reset Fields
                </button>
              </div>

              {/* Language Selection Selector for Document Output */}
              <div className="doc-lang-selector-group">
                <span className="form-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FaGlobe /> Document Language:
                </span>
                <button
                  type="button"
                  onClick={() => setDocLanguage('en')}
                  className={`doc-lang-pill ${docLanguage === 'en' ? 'active' : ''}`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setDocLanguage('si')}
                  className={`doc-lang-pill ${docLanguage === 'si' ? 'active' : ''}`}
                >
                  සිංහල (Sinhala)
                </button>
                <button
                  type="button"
                  onClick={() => setDocLanguage('ta')}
                  className={`doc-lang-pill ${docLanguage === 'ta' ? 'active' : ''}`}
                >
                  தமிழ் (Tamil)
                </button>
              </div>

              <form onSubmit={handleGenerate} className="doc-fields-form">
                {selectedTemplate.fields.map((field) => {
                  const isNicField = field.name.toLowerCase().includes('nic');
                  const fieldValue = formData[field.name] || '';
                  const hasNicValue = isNicField && fieldValue.length > 0;
                  const isNicValid = hasNicValue ? isValidSriLankanNIC(fieldValue) : null;

                  return (
                    <div key={field.name} className="form-group">
                      <div className="form-label-row">
                        <label className="form-label">
                          {field.label} {field.required && <span className="req">*</span>}
                        </label>
                        {isNicField && hasNicValue && (
                          <span className={`nic-feedback-badge ${isNicValid ? 'valid' : 'invalid'}`}>
                            {isNicValid ? (
                              <><FaCircleCheck /> Valid Sri Lankan NIC</>
                            ) : (
                              <><FaTriangleExclamation /> Format: 9 digits+V/X or 12 digits</>
                            )}
                          </span>
                        )}
                      </div>

                      {field.type === 'select' ? (
                        <select
                          value={fieldValue}
                          onChange={(e) => handleInputChange(field.name, e.target.value)}
                          required={field.required}
                          className="form-input form-select"
                        >
                          {field.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      ) : field.type === 'textarea' ? (
                        <textarea
                          value={fieldValue}
                          onChange={(e) => handleInputChange(field.name, e.target.value)}
                          placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
                          required={field.required}
                          className="form-textarea"
                          rows={4}
                        />
                      ) : (
                        <input
                          type={field.type}
                          value={fieldValue}
                          onChange={(e) => handleInputChange(field.name, e.target.value)}
                          placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
                          required={field.required}
                          className="form-input"
                        />
                      )}
                    </div>
                  );
                })}

                <button type="submit" disabled={loading} className="btn btn-primary btn-block">
                  <FaWandMagicSparkles /> {loading ? 'Drafting & Verifying Document...' : 'Generate Formatted Draft'}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right Side: Formatted Document Preview Pane */}
        <div className="doc-preview-pane">
          <div className="preview-card">
            <div className="preview-header">
              <div className="preview-title-wrap">
                <span>Formatted Document Preview</span>
                {isEditing && (
                  <span className="preview-badge-status editing">
                    <FaPenToSquare /> Editing Mode
                  </span>
                )}
                {!isEditing && isContentModified && (
                  <span className="preview-badge-status edited">
                    <FaCircleCheck /> Custom Edited
                  </span>
                )}
              </div>

              {generatedDocument && (
                <div className="preview-actions">
                  {/* EDIT OPTION */}
                  {!isEditing ? (
                    <button 
                      onClick={handleStartEdit} 
                      className="btn btn-secondary btn-sm" 
                      title="Edit generated document content"
                    >
                      <FaPenToSquare /> Edit Draft
                    </button>
                  ) : (
                    <>
                      <button 
                        onClick={handleSaveEdit} 
                        disabled={isSaving}
                        className="btn btn-success btn-sm" 
                        title={isSaving ? 'Saving to database...' : 'Save edits to database'}
                      >
                        {isSaving ? (
                          <><FaSpinner className="spin-icon" /> Saving to DB...</>
                        ) : (
                          <><FaCloudArrowUp /> Save to Database</>
                        )}
                      </button>
                      <button 
                        onClick={handleRevertEdit} 
                        className="btn btn-secondary btn-sm" 
                        title="Revert back to original generated draft"
                      >
                        <FaRotateLeft /> Revert
                      </button>
                      <button 
                        onClick={handleCancelEdit} 
                        className="btn btn-secondary btn-sm" 
                        title="Cancel editing"
                      >
                        <FaXmark /> Cancel
                      </button>
                    </>
                  )}

                  {/* Standard Export Actions (Only active when not editing) */}
                  {!isEditing && (
                    <>
                      <button onClick={handleCopy} className="btn btn-secondary btn-sm" title="Copy Text">
                        {copied ? <FaCheck /> : <FaCopy />} {copied ? 'Copied' : 'Copy'}
                      </button>
                      <button onClick={handleDownloadTxt} className="btn btn-secondary btn-sm" title="Download as Text file">
                        <FaDownload /> Text
                      </button>
                      <button onClick={handleDownloadPdf} className="btn btn-primary btn-sm" title="Export Formal Printable PDF">
                        <FaPrint /> Export PDF
                      </button>
                      {/* DELETE OPTION */}
                      <button 
                        onClick={() => setShowDeleteModal(true)} 
                        className="btn btn-danger btn-sm" 
                        title="Delete generated draft preview"
                      >
                        <FaTrashCan /> Delete
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="preview-content">
              {generatedDocument ? (
                <>
                  {isEditing ? (
                    <div className="edit-container">
                      <div className="edit-toolbar-banner">
                        <div>
                          <strong>Live Legal Draft Editor:</strong> You can directly modify clauses, correct details, insert notary notes, or add custom terms.
                        </div>
                        <div className="edit-stats">
                          <span>{wordCount} words</span>
                          <span>{charCount} characters</span>
                        </div>
                      </div>
                      <textarea
                        value={editableContent}
                        onChange={(e) => setEditableContent(e.target.value)}
                        className="edit-preview-textarea"
                        rows={22}
                        placeholder="Draft content..."
                        autoFocus
                      />
                    </div>
                  ) : (
                    <pre className="document-paper">{generatedDocument}</pre>
                  )}
                </>
              ) : (
                <div className="preview-placeholder">
                  <FaFileContract className="placeholder-icon" />
                  <h4>No Document Draft Generated Yet</h4>
                  <p>
                    Select a Sri Lankan legal template on the left, fill in the verified party details and NIC, then click <strong>"Generate Formatted Draft"</strong> to preview your statutory instrument here.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Statutory Verification & Legal Validity Checklist */}
          {selectedTemplate && (
            <div className="legal-verification-card">
              <div 
                className="verification-header"
                onClick={() => setShowVerification(!showVerification)}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaShieldHalved style={{ color: '#0d9488' }} /> Sri Lankan Legal Verification & Details Check
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--accent-gold)' }}>
                  {showVerification ? '▲ Hide Details' : '▼ Show Checklist'}
                </span>
              </div>

              {showVerification && (
                <div className="verification-content">
                  <div className="verification-item valid">
                    <FaCircleCheck />
                    <div>
                      <strong>Applicable Sri Lankan Statutory Framework:</strong>{' '}
                      {selectedTemplate.id === 'affidavit-general' && 'Oaths and Affirmations Ordinance No. 9 of 1890 & Civil Procedure Code Section 437/438.'}
                      {selectedTemplate.id === 'lease-agreement' && 'Prevention of Frauds Ordinance No. 7 of 1840 & Rent Act No. 7 of 1972 (as amended).'}
                      {selectedTemplate.id === 'debt-notice' && 'Debt Recovery (Special Provisions) Act No. 2 of 1990 & Civil Procedure Code (Cap 101).'}
                      {selectedTemplate.id === 'police-complaint' && 'Section 109 & 110 of the Code of Criminal Procedure Act No. 15 of 1979.'}
                      {selectedTemplate.id === 'motor-vehicle-sale' && 'Motor Traffic Act (Cap 203 of Sri Lanka) & MTA Transfer Guidelines.'}
                      {selectedTemplate.id === 'poa-special' && 'Powers of Attorney Ordinance No. 4 of 1902 of Sri Lanka.'}
                    </div>
                  </div>

                  <div className="verification-item valid">
                    <FaCircleCheck />
                    <div>
                      <strong>Identity & National Registration Verification:</strong> Validates Sri Lankan 9-digit (V/X) and 12-digit National Identity Cards to ensure legal capacity of executing parties.
                    </div>
                  </div>

                  <div className="verification-item valid">
                    <FaCircleCheck />
                    <div>
                      <strong>Execution & Attestation Clause:</strong> Includes mandatory Justice of the Peace (JP), Commissioner for Oaths, or Notary Public attestation blocks and statutory two-witness signatures.
                    </div>
                  </div>

                  <div className="verification-item note">
                    <FaCircleInfo />
                    <div>
                      <strong>Legal Attestation Requirement:</strong> For court filings, bank submissions, or land registries, remember to have this draft signed before a certified Justice of the Peace (JP), Commissioner for Oaths, or Notary Public.
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="delete-modal-backdrop" onClick={() => setShowDeleteModal(false)}>
          <div className="delete-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-icon">
              <FaTrashCan />
            </div>
            <h3>Delete Generated Draft?</h3>
            <p>
              Are you sure you want to delete this generated legal document draft from the preview? The current draft text and any customized edits will be removed. You can generate a fresh draft at any time.
            </p>
            <div className="delete-modal-actions">
              <button 
                type="button" 
                onClick={() => setShowDeleteModal(false)} 
                className="btn btn-secondary"
              >
                Cancel / Keep Draft
              </button>
              <button 
                type="button" 
                onClick={handleConfirmDelete} 
                className="btn btn-danger"
              >
                <FaTrashCan /> Yes, Delete Draft
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentGenerator;
