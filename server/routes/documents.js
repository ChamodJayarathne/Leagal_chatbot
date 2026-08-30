import express from 'express';
import Document from '../models/Document.js';
import { getDBStatus } from '../config/db.js';

const router = express.Router();
const memoryDocuments = [];

export const DOCUMENT_TEMPLATES = [
  {
    id: 'affidavit-general',
    title: 'General Affidavit (දිවුරුම් පෙත්සම / சத்தியக்கடதாசி)',
    category: 'Sworn Declaration',
    description: 'Sworn legal statement required for lost national identity card (NIC), passport, educational certificates, or income verification in Sri Lanka.',
    fields: [
      { name: 'deponentName', label: 'Full Legal Name of Deponent', type: 'text', required: true },
      { name: 'nicNumber', label: 'NIC / Passport Number', type: 'text', required: true },
      { name: 'address', label: 'Permanent Residential Address', type: 'text', required: true },
      { name: 'purpose', label: 'Purpose of Affidavit (e.g. Lost NIC, Name Variation)', type: 'text', required: true },
      { name: 'statementDetails', label: 'Sworn Declaration Details', type: 'textarea', required: true },
    ]
  },
  {
    id: 'lease-agreement',
    title: 'Residential Lease Agreement (නිවාස බදු ගිවිසුම)',
    category: 'Tenancy & Property',
    description: 'Formal tenancy contract establishing monthly rent, security deposit, maintenance duties, and notice period under Sri Lankan Property Law.',
    fields: [
      { name: 'landlordName', label: 'Landlord Full Name', type: 'text', required: true },
      { name: 'landlordNic', label: 'Landlord NIC Number', type: 'text', required: true },
      { name: 'tenantName', label: 'Tenant Full Name', type: 'text', required: true },
      { name: 'tenantNic', label: 'Tenant NIC Number', type: 'text', required: true },
      { name: 'propertyAddress', label: 'Leased Property Address', type: 'text', required: true },
      { name: 'monthlyRent', label: 'Monthly Rent Amount (LKR)', type: 'number', required: true },
      { name: 'depositAmount', label: 'Security Deposit Amount (LKR)', type: 'number', required: true },
      { name: 'leasePeriodMonths', label: 'Lease Duration (Months)', type: 'number', required: true },
    ]
  },
  {
    id: 'debt-notice',
    title: 'Formal Legal Demand Notice for Debt Recovery',
    category: 'Financial Recovery',
    description: 'Official letter to defaulted debtor demanding payment of overdue loan, dishonoured cheque, or outstanding invoice before court action.',
    fields: [
      { name: 'creditorName', label: 'Creditor / Business Name', type: 'text', required: true },
      { name: 'debtorName', label: 'Debtor Full Name', type: 'text', required: true },
      { name: 'debtorAddress', label: 'Debtor Address', type: 'text', required: true },
      { name: 'amountDue', label: 'Total Amount Owed (LKR)', type: 'number', required: true },
      { name: 'debtReason', label: 'Reason for Debt (Loan / Bounced Cheque / Invoice)', type: 'text', required: true },
      { name: 'deadlineDays', label: 'Payment Deadline (Days)', type: 'number', required: true },
    ]
  },
  {
    id: 'police-complaint',
    title: 'Formal Police Complaint Letter (පොලිස් පැමිණිල්ල)',
    category: 'Criminal & Public Grievance',
    description: 'Structured complaint letter to be lodged at the local Police Station regarding theft, property dispute, harassment, or financial fraud.',
    fields: [
      { name: 'complainantName', label: 'Complainant Full Name', type: 'text', required: true },
      { name: 'complainantNic', label: 'NIC Number', type: 'text', required: true },
      { name: 'policeStation', label: 'Local Police Station Name', type: 'text', required: true },
      { name: 'incidentDate', label: 'Date and Time of Incident', type: 'date', required: true },
      { name: 'suspectInfo', label: 'Suspect Information (If known)', type: 'text' },
      { name: 'incidentDescription', label: 'Detailed Description of Incident', type: 'textarea', required: true },
    ]
  }
];

// Get available templates
router.get('/templates', (req, res) => {
  res.json(DOCUMENT_TEMPLATES);
});

// Generate Legal Document
router.post('/generate', async (req, res) => {
  try {
    const { templateId, formData, userId = 'guest_default', language = 'en' } = req.body;

    const template = DOCUMENT_TEMPLATES.find(t => t.id === templateId);
    if (!template) {
      return res.status(404).json({ message: 'Document template not found.' });
    }

    const generatedText = formatDocumentText(templateId, formData, language);

    let docObj = null;
    if (getDBStatus()) {
      docObj = await Document.create({
        userId,
        templateType: templateId,
        title: `${template.title} - ${new Date().toLocaleDateString()}`,
        formData,
        generatedContent: generatedText,
        language,
      });
    } else {
      docObj = {
        _id: `doc_${Date.now()}`,
        userId,
        templateType: templateId,
        title: `${template.title} - ${new Date().toLocaleDateString()}`,
        formData,
        generatedContent: generatedText,
        language,
        createdAt: new Date(),
      };
      memoryDocuments.push(docObj);
    }

    res.status(201).json({
      success: true,
      document: docObj,
    });
  } catch (error) {
    console.error('Document generation error:', error);
    res.status(500).json({ message: 'Error generating legal document draft.' });
  }
});

// Helper document formatter
function formatDocumentText(templateId, data, language) {
  const currentDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  if (templateId === 'affidavit-general') {
    return `AFFIDAVIT / SWORN DECLARATION
(Under the Oaths and Affirmations Ordinance of Sri Lanka)

I, ${data.deponentName || '[FULL NAME]'}, holder of National Identity Card / Passport No. ${data.nicNumber || '[NIC NUMBER]'}, residing at ${data.address || '[PERMANENT ADDRESS]'}, being a citizen of Sri Lanka, do hereby solemnly, sincerely, and truly declare and affirm as follows:

1. I am the deponent named above and I am well conversant with the facts stated herein.
2. Purpose of Affidavit: ${data.purpose || '[PURPOSE]'}.
3. Statement of Facts:
   ${data.statementDetails || '[DETAILS OF DECLARATION]'}
4. I make this solemn declaration conscientiously believing the same to be true and correct, and in accordance with the Statutory Provisions of Sri Lanka.

Deponent Signature: _______________________
Name: ${data.deponentName || '[NAME]'}
Date: ${currentDate}

Sworn / Affirmed before me at Colombo, Sri Lanka, on this ${currentDate}.

__________________________________________
JUSTICE OF THE PEACE / COMMISSIONER FOR OATHS
(Seal & Signature)`;
  }

  if (templateId === 'lease-agreement') {
    return `TENANCY AGREEMENT FOR RESIDENTIAL PREMISES

THIS AGREEMENT is made on this ${currentDate} at Sri Lanka, by and between:

LANDLORD: ${data.landlordName || '[LANDLORD NAME]'} (NIC No: ${data.landlordNic || '[NIC]'}), hereinafter called the "Lessor".
AND
TENANT: ${data.tenantName || '[TENANT NAME]'} (NIC No: ${data.tenantNic || '[NIC]'}), hereinafter called the "Lessee".

WHEREAS the Lessor is the absolute owner of the premises bearing address:
${data.propertyAddress || '[PROPERTY ADDRESS]'}.

NOW IT IS HEREBY MUTUALLY AGREED AS FOLLOWS:
1. LEASE PERIOD: The lease shall be for a fixed period of ${data.leasePeriodMonths || 12} months commencing from ${currentDate}.
2. RENTAL AMOUNT: The Lessee shall pay a monthly rental of LKR ${data.monthlyRent || '0'} on or before the 5th day of each calendar month.
3. SECURITY DEPOSIT: The Lessee has paid an advance security deposit of LKR ${data.depositAmount || '0'} to the Lessor, refundable upon quiet possession surrender.
4. TERMINATION NOTICE: Either party may terminate this tenancy agreement by providing 2 full calendar months written notice.
5. GOVERNING LAW: This agreement shall be interpreted in accordance with the laws of Sri Lanka and subject to the jurisdiction of the Sri Lankan Courts.

IN WITNESS WHEREOF the parties have set their hands:

Lessor Signature: _______________________    Lessee Signature: _______________________
Name: ${data.landlordName || '[LANDLORD]'}               Name: ${data.tenantName || '[TENANT]'}

Witness 1: ______________________________    Witness 2: ______________________________`;
  }

  if (templateId === 'debt-notice') {
    return `FORMAL LEGAL DEMAND LETTER FOR OUTSTANDING DEBT

Date: ${currentDate}

TO: ${data.debtorName || '[DEBTOR NAME]'}
ADDRESS: ${data.debtorAddress || '[DEBTOR ADDRESS]'}

FROM: ${data.creditorName || '[CREDITOR NAME]'}

DEMAND FOR PAYMENT OF OUTSTANDING SUM OF LKR ${data.amountDue || '0'}

TAKE NOTICE that you are currently indebted to me/our establishment in the total sum of LKR ${data.amountDue || '0'} in respect of: ${data.debtReason || '[REASON FOR DEBT]'}.

Despite repeated verbal requests and reminders, you have failed and neglected to settle the aforementioned outstanding sum.

YOU ARE HEREBY REQUIRED AND DEMANDED to pay the full sum of LKR ${data.amountDue || '0'} within ${data.deadlineDays || 7} days from the date of receipt of this letter.

TAKE FURTHER NOTICE that if you fail to settle the debt within the stipulated time, formal legal proceedings will be initiated against you under the Civil Procedure Code / Debt Recovery (Special Provisions) Act No. 2 of 1990 in the appropriate District Court of Sri Lanka, holding you liable for all legal costs and statutory interest accrued.

Yours faithfully,

__________________________________________
${data.creditorName || '[CREDITOR SIGNATURE]'}`;
  }

  if (templateId === 'police-complaint') {
    return `FORMAL COMPLAINT TO POLICE STATION

Date: ${currentDate}

To: Officer-in-Charge (OIC)
Police Station: ${data.policeStation || '[POLICE STATION NAME]'}
Sri Lanka Police Service

Complainant Details:
Full Name: ${data.complainantName || '[COMPLAINANT NAME]'}
NIC Number: ${data.complainantNic || '[NIC NUMBER]'}

Subject: Formal Complaint Regarding Incident on ${data.incidentDate || '[DATE]'}

Respected Sir/Madam,

I am lodging this formal written complaint regarding the following incident:

1. Incident Date & Time: ${data.incidentDate || '[INCIDENT DATE]'}
2. Suspect Information (If known): ${data.suspectInfo || 'Not identified / Under investigation'}
3. Statement of Incident:
   ${data.incidentDescription || '[DETAILED INCIDENT DESCRIPTION]'}

I kindly request the Sri Lanka Police Service to record this complaint, investigate the matter immediately, and take necessary legal steps under the Code of Criminal Procedure Act of Sri Lanka.

Thanking you,

Yours sincerely,

__________________________________________
${data.complainantName || '[COMPLAINANT SIGNATURE]'}
NIC: ${data.complainantNic || '[NIC]'}`;
  }

  return `LEGAL DOCUMENT DRAFT - ${currentDate}\n\n${JSON.stringify(data, null, 2)}`;
}

export default router;
