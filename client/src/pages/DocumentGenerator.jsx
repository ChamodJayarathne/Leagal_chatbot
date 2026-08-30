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
  FaFilePen
} from 'react-icons/fa6';

export const DocumentGenerator = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();

  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState({});
  const [generatedDocument, setGeneratedDocument] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

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
      initialData[f.name] = '';
    });
    setFormData(initialData);
    setGeneratedDocument('');
  };

  const handleInputChange = (fieldName, value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
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
        language,
      });

      if (res.data.success) {
        setGeneratedDocument(res.data.document.generatedContent);
      }
    } catch (err) {
      alert('Error generating document draft.');
    } finally {
      setLoading(false);
    }
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
          <title>${selectedTemplate?.title || 'Legal Document'} - Sri Lanka Legal Draft</title>
          <style>
            @page { size: A4; margin: 25mm 20mm 20mm 20mm; }
            body { font-family: 'Times New Roman', Times, serif; color: #111; padding: 20px; line-height: 1.8; font-size: 13pt; background: #fff; }
            .header-emblem { text-align: center; font-size: 18pt; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 5px; border-bottom: 3px double #111; padding-bottom: 12px; }
            .sub-header { text-align: center; font-size: 11pt; font-style: italic; color: #333; margin-bottom: 35px; }
            .doc-body { white-space: pre-wrap; font-family: 'Times New Roman', Times, serif; text-align: justify; font-size: 12.5pt; }
            .signature-container { margin-top: 60px; display: flex; justify-content: space-between; align-items: flex-end; }
            .sig-box { width: 220px; text-align: center; }
            .sig-line { border-top: 1px solid #111; padding-top: 6px; font-size: 11pt; font-weight: bold; }
            .footer-disclaimer { margin-top: 70px; font-size: 9pt; font-style: italic; color: #666; text-align: center; border-top: 1px dashed #aaa; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header-emblem">${selectedTemplate?.title || 'STATUTORY LEGAL INSTRUMENT'}</div>
          <div class="sub-header">DEMOCRATIC SOCIALIST REPUBLIC OF SRI LANKA · OFFICIAL LEGAL DRAFT</div>
          
          <div class="doc-body">${generatedDocument}</div>

          <div class="signature-container">
            <div class="sig-box">
              <div class="sig-line">Signature of Declarant / Party</div>
            </div>
            <div class="sig-box">
              <div class="sig-line">Attorney-at-Law / Notary Public</div>
            </div>
          </div>

          <div class="footer-disclaimer">
            Generated via LegalAI Sri Lanka Automated Statutory Drafting System. Formal legal instruments require attestation before a Commissioner for Oaths or Notary Public.
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

  const handlePrint = () => {
    handleDownloadPdf();
  };

  return (
    <div className="doc-page container">
      {/* Header */}
      <div className="page-header">
        <div className="page-badge">
          <FaFileContract /> Statutory Draft Generator
        </div>
        <h1 className="page-title">Automated Sri Lankan Legal Document Drafting</h1>
        <p className="page-subtitle">
          Generate legally formatted draft Affidavits, Tenancy Contracts, Debt Recovery Letters, and Police Complaints in seconds.
        </p>
      </div>

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
              <h3>
                <FaFilePen /> {selectedTemplate.title}
              </h3>
              <p className="template-desc">{selectedTemplate.description}</p>

              <form onSubmit={handleGenerate} className="doc-fields-form">
                {selectedTemplate.fields.map((field) => (
                  <div key={field.name} className="form-group">
                    <label className="form-label">
                      {field.label} {field.required && <span className="req">*</span>}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        value={formData[field.name] || ''}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        placeholder={`Enter ${field.label.toLowerCase()}...`}
                        required={field.required}
                        className="form-textarea"
                        rows={3}
                      />
                    ) : (
                      <input
                        type={field.type}
                        value={formData[field.name] || ''}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        placeholder={`Enter ${field.label.toLowerCase()}...`}
                        required={field.required}
                        className="form-input"
                      />
                    )}
                  </div>
                ))}

                <button type="submit" disabled={loading} className="btn btn-primary btn-block">
                  <FaWandMagicSparkles /> {loading ? 'Drafting Document...' : 'Generate Formatted Draft'}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right Side: Formatted Document Preview Pane */}
        <div className="doc-preview-pane">
          <div className="preview-card">
            <div className="preview-header">
              <span>Formatted Document Preview</span>
              {generatedDocument && (
                <div className="preview-actions">
                  <button onClick={handleCopy} className="btn btn-secondary btn-sm" title="Copy Text">
                    {copied ? <FaCheck /> : <FaCopy />} {copied ? 'Copied' : 'Copy'}
                  </button>
                  <button onClick={handleDownloadTxt} className="btn btn-secondary btn-sm" title="Download Text">
                    <FaDownload /> Text
                  </button>
                  <button onClick={handleDownloadPdf} className="btn btn-primary btn-sm" title="Export Legal PDF">
                    <FaPrint /> Export PDF
                  </button>
                </div>
              )}
            </div>

            <div className="preview-content">
              {generatedDocument ? (
                <pre className="document-paper">{generatedDocument}</pre>
              ) : (
                <div className="preview-placeholder">
                  <FaFileContract className="placeholder-icon" />
                  <p>Fill in the required details on the left and click "Generate Formatted Draft" to preview your legal document here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentGenerator;
