import express from 'express';
import Document from '../models/Document.js';
import { getDBStatus } from '../config/db.js';

const router = express.Router();
const memoryDocuments = [];

export const DOCUMENT_TEMPLATES = [
  {
    id: 'affidavit-general',
    title: 'General Affidavit (දිවුරුම් ප්‍රකාශය / சத்தியக்கடதாசி)',
    category: 'Sworn Declaration',
    description: 'Statutory sworn declaration under the Oaths Ordinance No. 9 of 1890 for lost NIC/Passport, educational certificates, income confirmation, or name variation.',
    fields: [
      { name: 'deponentName', label: 'Full Legal Name of Deponent (as in NIC/Passport)', type: 'text', required: true, placeholder: 'e.g. Kankanamge Sunimal Perera' },
      { name: 'nicNumber', label: 'NIC / Passport Number', type: 'text', required: true, placeholder: 'e.g. 198512345678 or 851234567V' },
      { 
        name: 'religion', 
        label: 'Affirmation Type / Religion', 
        type: 'select', 
        required: true,
        options: [
          { value: 'Buddhist', label: 'Buddhist (Solemn Affirmation)' },
          { value: 'Hindu', label: 'Hindu (Solemn Affirmation)' },
          { value: 'Muslim', label: 'Muslim (Solemn Affirmation)' },
          { value: 'Christian', label: 'Christian (Sworn on Oath)' },
          { value: 'Secular / Other', label: 'Secular / Non-religious (Solemn Affirmation)' }
        ]
      },
      { name: 'address', label: 'Permanent Residential Address', type: 'text', required: true, placeholder: 'e.g. No. 45/2, Temple Road, Nugegoda' },
      { name: 'city', label: 'City / District of Execution', type: 'text', required: true, placeholder: 'e.g. Colombo, Kandy, Galle' },
      { name: 'purpose', label: 'Purpose of Affidavit', type: 'text', required: true, placeholder: 'e.g. Loss of National Identity Card (NIC) / Certificate Variation' },
      { name: 'statementDetails', label: 'Detailed Sworn Statement of Facts', type: 'textarea', required: true, placeholder: 'State the precise facts chronologically: (e.g. 1. I lost my NIC on 15th March 2026 while travelling... 2. Inquiries made failed to recover it...)' },
    ]
  },
  {
    id: 'lease-agreement',
    title: 'Residential Tenancy Agreement (නිවාස බදු ගිවිසුම)',
    category: 'Tenancy & Property',
    description: 'Legally enforceable lease contract under the Rent Act No. 7 of 1972 and Prevention of Frauds Ordinance No. 7 of 1840 with mandatory witness blocks.',
    fields: [
      { name: 'landlordName', label: 'Landlord Full Legal Name', type: 'text', required: true, placeholder: 'e.g. Mohomed Farook Rizvi' },
      { name: 'landlordNic', label: 'Landlord NIC Number', type: 'text', required: true, placeholder: 'e.g. 197412345678' },
      { name: 'landlordAddress', label: 'Landlord Permanent Address', type: 'text', required: true, placeholder: 'e.g. No. 12, Queens Road, Colombo 03' },
      { name: 'tenantName', label: 'Tenant Full Legal Name', type: 'text', required: true, placeholder: 'e.g. Chaminda Bandara Senanayake' },
      { name: 'tenantNic', label: 'Tenant NIC Number', type: 'text', required: true, placeholder: 'e.g. 198812345678' },
      { name: 'propertyAddress', label: 'Leased Premises Exact Address (with Assessment No.)', type: 'text', required: true, placeholder: 'e.g. Assessment No. 88, Havelock Road, Colombo 05' },
      { name: 'leaseStartDate', label: 'Lease Commencement Date', type: 'date', required: true },
      { name: 'leasePeriodMonths', label: 'Lease Duration (Months)', type: 'number', required: true, placeholder: 'e.g. 12' },
      { name: 'monthlyRent', label: 'Monthly Rental Amount (LKR)', type: 'number', required: true, placeholder: 'e.g. 65000' },
      { name: 'depositAmount', label: 'Refundable Security Deposit Amount (LKR)', type: 'number', required: true, placeholder: 'e.g. 195000 (3 months advance)' },
      { name: 'noticePeriodMonths', label: 'Termination Notice Period (Months)', type: 'number', required: true, placeholder: 'e.g. 2' },
      { name: 'utilityResponsibility', label: 'Utility & Rates Allocation', type: 'text', required: false, placeholder: 'Tenant pays Electricity & Water; Landlord pays Municipal Assessment Rates' },
    ]
  },
  {
    id: 'debt-notice',
    title: 'Formal Demand Notice for Debt Recovery (ණය අයකර ගැනීමේ නිවේදනය)',
    category: 'Financial Recovery',
    description: 'Statutory demand letter under Debt Recovery (Special Provisions) Act No. 2 of 1990 & Civil Procedure Code with formal payment deadline and interest notice.',
    fields: [
      { name: 'creditorName', label: 'Creditor Full Name / Business Entity', type: 'text', required: true, placeholder: 'e.g. Priyantha Dissanayake / Apex Capital Pvt Ltd' },
      { name: 'creditorAddress', label: 'Creditor Postal Address', type: 'text', required: true, placeholder: 'e.g. No. 15, High Level Road, Maharagama' },
      { name: 'creditorPhone', label: 'Creditor Contact Phone Number', type: 'text', required: true, placeholder: 'e.g. +94 77 123 4567' },
      { name: 'debtorName', label: 'Debtor Full Name', type: 'text', required: true, placeholder: 'e.g. Kasun Nuwantha Silva' },
      { name: 'debtorAddress', label: 'Debtor Residential / Business Address', type: 'text', required: true, placeholder: 'e.g. No. 74, Kandy Road, Kiribathgoda' },
      { name: 'amountDue', label: 'Total Outstanding Amount (LKR)', type: 'number', required: true, placeholder: 'e.g. 350000' },
      { name: 'debtReason', label: 'Particulars of Debt (e.g. Loan, Bounced Cheque No., Unpaid Invoice)', type: 'text', required: true, placeholder: 'e.g. Dishonoured Cheque No. 458921 drawn on Commercial Bank' },
      { name: 'debtDate', label: 'Date of Debt / Dishonour of Cheque', type: 'date', required: true },
      { name: 'deadlineDays', label: 'Remittance Deadline (Days to Settle)', type: 'number', required: true, placeholder: 'e.g. 7 or 14' },
      { name: 'settlementMethod', label: 'Bank Details / Settlement Method', type: 'text', required: true, placeholder: 'e.g. Bank of Ceylon, Account: 0012345678, Maharagama Branch' },
    ]
  },
  {
    id: 'police-complaint',
    title: 'Formal Police Complaint Letter (පොලිස් පැමිණිල්ල / பொலிஸ் முறைப்பாடு)',
    category: 'Criminal & Public Grievance',
    description: 'Structured complaint letter under Section 109 of the Code of Criminal Procedure Act No. 15 of 1979 for theft, fraud, harassment, or property trespass.',
    fields: [
      { name: 'complainantName', label: 'Complainant Full Legal Name', type: 'text', required: true, placeholder: 'e.g. Nimal Ranasinghe' },
      { name: 'complainantNic', label: 'Complainant NIC Number', type: 'text', required: true, placeholder: 'e.g. 198212345678' },
      { name: 'complainantAddress', label: 'Complainant Residential Address', type: 'text', required: true, placeholder: 'e.g. No. 23, Galle Road, Mount Lavinia' },
      { name: 'complainantPhone', label: 'Complainant Mobile Phone Number', type: 'text', required: true, placeholder: 'e.g. +94 71 234 5678' },
      { name: 'policeStation', label: 'Target Police Station (Name)', type: 'text', required: true, placeholder: 'e.g. Mount Lavinia Police Station' },
      { name: 'complaintType', label: 'Category of Offence', type: 'text', required: true, placeholder: 'e.g. Burglary / Financial Cheating / Physical Threat / Cyber Harassment' },
      { name: 'incidentDate', label: 'Date and Time of Incident', type: 'text', required: true, placeholder: 'e.g. 24th March 2026 at approximately 8:30 PM' },
      { name: 'incidentLocation', label: 'Exact Location where Incident Occurred', type: 'text', required: true, placeholder: 'e.g. Outside supermarket at Station Road, Dehiwala' },
      { name: 'suspectInfo', label: 'Suspect Details (Name, Vehicle No, or Unknown)', type: 'text', required: false, placeholder: 'e.g. Unknown individual / or Name: Jagath, riding red motorcycle' },
      { name: 'witnessInfo', label: 'Witness Details (Names & Contacts if available)', type: 'text', required: false, placeholder: 'e.g. Security Officer Sunil (077-xxxxxxx)' },
      { name: 'incidentDescription', label: 'Detailed Narrative of the Incident', type: 'textarea', required: true, placeholder: 'State what happened chronologically in clear factual detail...' },
      { name: 'reliefSought', label: 'Action Requested from Police', type: 'text', required: true, placeholder: 'e.g. Record Information Book (IB) entry, investigate, recover stolen items, issue certified extract' },
    ]
  },
  {
    id: 'motor-vehicle-sale',
    title: 'Motor Vehicle Sale & Handover Agreement (මෝටර් රථ විකිණීමේ ගිවිසුම)',
    category: 'Commercial & Transport',
    description: 'Official transfer agreement under the Motor Traffic Act (Cap 203) establishing immediate transfer of road liability, fines, and possession upon handover.',
    fields: [
      { name: 'sellerName', label: 'Seller Full Legal Name (Registered Owner)', type: 'text', required: true, placeholder: 'e.g. Gamini Jayawardena' },
      { name: 'sellerNic', label: 'Seller NIC Number', type: 'text', required: true, placeholder: 'e.g. 197012345678' },
      { name: 'sellerAddress', label: 'Seller Address', type: 'text', required: true, placeholder: 'e.g. No. 18, Lake Road, Boralesgamuwa' },
      { name: 'buyerName', label: 'Buyer Full Legal Name', type: 'text', required: true, placeholder: 'e.g. Roshan Sampath Alwis' },
      { name: 'buyerNic', label: 'Buyer NIC Number', type: 'text', required: true, placeholder: 'e.g. 199312345678' },
      { name: 'buyerAddress', label: 'Buyer Address', type: 'text', required: true, placeholder: 'e.g. No. 5, Station Road, Panadura' },
      { name: 'vehicleNumber', label: 'Vehicle Registration Number', type: 'text', required: true, placeholder: 'e.g. WP CAC-4589' },
      { name: 'vehicleMakeModel', label: 'Make, Model & Year of Manufacture', type: 'text', required: true, placeholder: 'e.g. Toyota Aqua 2017 (Pearl White)' },
      { name: 'chassisNumber', label: 'Chassis Number', type: 'text', required: true, placeholder: 'e.g. NHP10-2345678' },
      { name: 'engineNumber', label: 'Engine Number', type: 'text', required: true, placeholder: 'e.g. 1NZ-FXE-987654' },
      { name: 'salePrice', label: 'Agreed Sale Price (LKR)', type: 'number', required: true, placeholder: 'e.g. 6850000' },
      { name: 'handoverDateTime', label: 'Exact Date and Time of Physical Handover', type: 'text', required: true, placeholder: 'e.g. 30th March 2026 at 2:30 PM' },
    ]
  },
  {
    id: 'poa-special',
    title: 'Special Power of Attorney (විශේෂ ඇටෝර්නි බලපත්‍රය)',
    category: 'Authorization & Agency',
    description: 'Specific authority draft under the Powers of Attorney Ordinance No. 4 of 1902 authorizing a nominated agent to perform designated acts on principal\'s behalf.',
    fields: [
      { name: 'principalName', label: 'Principal (Grantor) Full Name', type: 'text', required: true, placeholder: 'e.g. Malini Chandrika Wickramasinghe' },
      { name: 'principalNic', label: 'Principal NIC / Passport Number', type: 'text', required: true, placeholder: 'e.g. 196812345678' },
      { name: 'principalAddress', label: 'Principal Address', type: 'text', required: true, placeholder: 'e.g. No. 12/4, Park Street, Colombo 02' },
      { name: 'attorneyName', label: 'Attorney-in-Fact (Agent) Full Name', type: 'text', required: true, placeholder: 'e.g. Damith Asela Wickramasinghe' },
      { name: 'attorneyNic', label: 'Attorney-in-Fact NIC Number', type: 'text', required: true, placeholder: 'e.g. 199612345678' },
      { name: 'attorneyAddress', label: 'Attorney-in-Fact Address', type: 'text', required: true, placeholder: 'e.g. No. 12/4, Park Street, Colombo 02' },
      { name: 'specificPowers', label: 'Specific Powers Granted (Clear Enumeration)', type: 'textarea', required: true, placeholder: 'e.g. 1. To represent me before the Department of Motor Traffic... 2. To sign transfer papers... 3. To collect revenue license...' },
      { name: 'validityDuration', label: 'Duration / Expiry of Power', type: 'text', required: true, placeholder: 'e.g. Valid for 6 months from execution date / Until revoked in writing' },
    ]
  }
];

// Helper: Format Currency
function formatLKR(amount) {
  if (!amount) return '0.00';
  const num = Number(amount);
  return isNaN(num) ? amount : num.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Helper: Format Date
function getSriLankanDate() {
  return new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

// Format Document Content with verified Sri Lankan legal accuracy
export function formatDocumentText(templateId, data = {}, language = 'en') {
  const currentDate = getSriLankanDate();

  // -------------------------------------------------------------
  // 1. GENERAL AFFIDAVIT
  // -------------------------------------------------------------
  if (templateId === 'affidavit-general') {
    const isChristian = (data.religion || '').toLowerCase().includes('christian');
    const affirmationPhrase = isChristian
      ? 'make oath and state as follows:'
      : 'being a citizen of Sri Lanka over 18 years of age, do hereby solemnly, sincerely, and truly declare and affirm as follows:';

    if (language === 'si') {
      return `ශ්‍රී ලංකා ප්‍රජාතාන්ත්‍රික සමාජවාදී ජනරජයේ
දිවුරුම් ප්‍රකාශය (AFFIDAVIT)
(1890 අංක 09 දරන දිවුරුම් සහ සහතික කිරීමේ ආඥාපනත සහ සිවිල් නඩු විධාන සංග්‍රහයේ 437/438 වගන්ති යටතේ)

${data.address || '[ස්ථිර ලිපිනය]'} හි පදිංචි, ජාතික හැඳුනුම්පත් / විදේශ ගමන් බලපත්‍ර අංක ${data.nicNumber || '[හැඳුනුම්පත් අංකය]'} දරන, ශ්‍රී ලාංකික පුරවැසියෙකු වන ${data.deponentName || '[සම්පූර්ණ නම]'} වන මම මෙයින් ගෞරව බහුමානයෙන්, සත්‍ය ලෙස හා අවංකව ප්‍රකාශ කර සිටින වග නම්:

1. මම ඉහත නම් සඳහන් ප්‍රතිඥාකරු වන අතර මෙහි සඳහන් කරුණු පිළිබඳව මනා පුද්ගලික දැනුමක් සහිතව සිටිමි.
2. මෙම දිවුරුම් ප්‍රකාශයේ අරමුණ: ${data.purpose || '[අරමුණ]'}.
3. සත්‍ය ප්‍රකාශනය සහ කරුණු විස්තරය:
${data.statementDetails || '[සත්‍ය කරුණු විස්තරය]'}

4. මා ඉහත දැක්වූ සියලු කරුණු මාගේ දැනුම හා විශ්වාසය පරිදි සත්‍ය සහ නිවැරදි බවටත්, කිසිදු කරුණක් වසන් නොකළ බවටත් මෙයින් සත්‍ය ලෙස හා ගෞරවයෙන් ප්‍රකාශ කර දිවුරා සිටිමි.

.....................................................
ප්‍රතිඥාකරුගේ අත්සන (Deponent Signature)
නම: ${data.deponentName || '[නම]'}
දිනය: ${currentDate}
ස්ථානය: ${data.city || 'කොළඹ'}, ශ්‍රී ලංකාව

ඉහත නම් සඳහන් ප්‍රතිඥාකරු විසින් මනා සිහිබුද්ධියෙන් යුතුව, මා ඉදිරියේ කියවා තේරුම් ගෙන ${data.city || 'කොළඹ'} දී අද දින එනම් ${currentDate} වන දින දිවුරා / ප්‍රතිඥා දී අත්සන් තබන ලදී.

.....................................................
සාමදාන විනිශ්චයකාර / දිවුරුම් කොමසාරිස් / ප්‍රසිද්ධ නොතාරිස්
JUSTICE OF THE PEACE / COMMISSIONER FOR OATHS
(නිල මුද්‍රාව සහ අත්සන)`;
    }

    if (language === 'ta') {
      return `இலங்கை ஜனநாயக சோசலிச குடியரசு
சத்தியக்கடதாசி (AFFIDAVIT)
(1890 ஆம் ஆண்டின் 09 ஆம் இலக்க சத்தியப் பிரமாண கட்டளைச் சட்டம்)

${data.address || '[நிரந்தர முகவரி]'} இல் வசிக்கும், தேசிய அடையாள அட்டை / கடவுச்சீட்டு இலக்கம் ${data.nicNumber || '[அடையாள அட்டை இலக்கம்]'} உடைய, இலங்கை பிரஜையான ${data.deponentName || '[முழுப் பெயர்]'} ஆகிய நான் பின்வருமாறு சத்தியம் செய்து பிரகடனம் செய்கிறேன்:

1. நான் மேலே குறிப்பிடப்பட்ட பிரகடனதாரர் ஆவேன், இங்கு குறிப்பிடப்பட்டுள்ள விடயங்களை நன்கு அறிந்தவன்.
2. சத்தியக்கடதாசியின் நோக்கம்: ${data.purpose || '[நோக்கம்]'}.
3. உண்மை விபரங்கள்:
${data.statementDetails || '[விபரங்கள்]'}

4. மேலே கூறப்பட்ட விடயங்கள் எனது அறிவிற்கும் நம்பிக்கைக்கும் எட்டியவரை உண்மை மற்றும் சரியானது என மனசாட்சியுடன் பிரகடனம் செய்கிறேன்.

.....................................................
பிரகடனதாரர் கையொப்பம் (Deponent Signature)
பெயர்: ${data.deponentName || '[பெயர்]'}
திகதி: ${currentDate}
இடம்: ${data.city || 'கொழும்பு'}, இலங்கை

மேற்குறிப்பிட்ட பிரகடனதாரர் எனது முன்னிலையில் உறுதிப்படுத்தி ${data.city || 'கொழும்பு'} இல் ${currentDate} அன்று கையொப்பமிட்டார்.

.....................................................
சமாதான நீதவான் / சத்திய ஆணையாளர்
JUSTICE OF THE PEACE / COMMISSIONER FOR OATHS
(முத்திரை & கையொப்பம்)`;
    }

    // Default English
    return `IN THE DEMOCRATIC SOCIALIST REPUBLIC OF SRI LANKA
AFFIDAVIT / SWORN DECLARATION
(Executed under the Oaths and Affirmations Ordinance No. 9 of 1890 & Section 437/438 of the Civil Procedure Code)

I, ${data.deponentName || '[FULL LEGAL NAME]'}, holder of National Identity Card / Passport No. ${data.nicNumber || '[NIC / PASSPORT NUMBER]'}, residing at ${data.address || '[PERMANENT RESIDENTIAL ADDRESS]'}, ${affirmationPhrase}

1. I am the deponent abovenamed, competent to make this declaration, and I am personally conversant with all the facts and circumstances deposed to herein.
2. Purpose of this Affidavit: ${data.purpose || '[STATED PURPOSE]'}.
3. Statement of Facts:
${data.statementDetails || '[STATEMENT OF FACTS]'}

4. I conscientiously make this solemn declaration believing the contents hereof to be true and accurate in every respect, knowing that it carries the same legal force and penal liabilities as if made under formal judicial oath in a Court of Law in Sri Lanka.

Signed and affirmed by the Deponent:

________________________________________
DEPONENT SIGNATURE
Full Name: ${data.deponentName || '[FULL NAME]'}
NIC Number: ${data.nicNumber || '[NIC NUMBER]'}
Date: ${currentDate}
Place of Execution: ${data.city || 'Colombo'}, Sri Lanka

ATTESTATION BEFORE COMMISSIONER FOR OATHS / JUSTICE OF THE PEACE
Sworn / Affirmed before me at ${data.city || 'Colombo'}, Sri Lanka, on this ${currentDate}, the deponent having been verified by National Identity Card No. ${data.nicNumber || '[NIC NUMBER]'} and appearing to fully understand the nature and contents of this declaration.

________________________________________
JUSTICE OF THE PEACE / COMMISSIONER FOR OATHS / NOTARY PUBLIC
Official Seal & Signature
Registration / Court Enrollment No: ____________________`;
  }

  // -------------------------------------------------------------
  // 2. RESIDENTIAL TENANCY AGREEMENT
  // -------------------------------------------------------------
  if (templateId === 'lease-agreement') {
    const rentFormatted = formatLKR(data.monthlyRent);
    const depositFormatted = formatLKR(data.depositAmount);

    return `TENANCY AGREEMENT FOR RESIDENTIAL PREMISES
(Subject to the Prevention of Frauds Ordinance No. 7 of 1840 & Rent Act No. 7 of 1972 as amended)

THIS LEASE AGREEMENT is made and entered into on this ${currentDate} at Sri Lanka,

BY AND BETWEEN:
LESSOR (LANDLORD): ${data.landlordName || '[LANDLORD FULL NAME]'} (Holder of NIC No: ${data.landlordNic || '[LANDLORD NIC]'}), residing at ${data.landlordAddress || '[LANDLORD ADDRESS]'}, hereinafter called the "Lessor" (which expression shall mean and include where the context requires his/her heirs, executors, administrators, and assigns) of the ONE PART;

AND
LESSEE (TENANT): ${data.tenantName || '[TENANT FULL NAME]'} (Holder of NIC No: ${data.tenantNic || '[TENANT NIC]'}), hereinafter called the "Lessee" (which expression shall mean and include his/her permitted occupants and executors) of the OTHER PART.

WHEREAS the Lessor is the absolute lawful owner and possessor of the residential premises situated and bearing Assessment No: ${data.propertyAddress || '[PREMISES ADDRESS WITH ASSESSMENT NO.]'} (hereinafter referred to as the "Demised Premises").

NOW THIS AGREEMENT WITNESSETH AND IT IS MUTUALLY AGREED BY AND BETWEEN THE PARTIES AS FOLLOWS:

1. LEASE TERM & COMMENCEMENT:
The tenancy shall be for a fixed duration of ${data.leasePeriodMonths || 12} calendar months, commencing on ${data.leaseStartDate || currentDate} and expiring on the conclusion of the said term, unless renewed by mutual written consent or determined earlier under the provisions hereof.

2. RENTAL CONSIDERATION:
The Lessee shall pay to the Lessor a monthly rental of LKR ${rentFormatted} (Sri Lankan Rupees), payable in advance on or before the 5th day of each calendar month.

3. REFUNDABLE SECURITY DEPOSIT:
The Lessee has deposited with the Lessor a sum of LKR ${depositFormatted} (Sri Lankan Rupees) as an interest-free refundable security deposit. This deposit shall be refunded to the Lessee within fourteen (14) days upon peaceful surrender of vacant possession, subject to deduction of any accrued rental arrears, damages beyond reasonable wear and tear, or outstanding utility bills.

4. UTILITIES & OUTGOINGS:
${data.utilityResponsibility || 'The Lessee shall punctually pay all monthly electricity charges, water bills, and municipal garbage fees incurred during the tenancy. The Lessor shall be liable for Municipal Council / Pradeshiya Sabha Assessment Rates and structural property taxes.'}

5. USE & CARE OF PREMISES:
The Demised Premises shall be used exclusively for peaceful residential purposes. The Lessee shall not sublet, assign, or part with possession of the premises to any third party without the prior written consent of the Lessor.

6. RIGHT OF INSPECTION:
The Lessor or an authorized representative shall have the right, upon giving not less than twenty-four (24) hours prior notice, to inspect the condition of the Demised Premises at reasonable times.

7. TERMINATION & NOTICE:
Either party may terminate this agreement prior to expiry by tendering ${data.noticePeriodMonths || 2} full calendar months prior written notice to the other party.

8. GOVERNING LAW & JURISDICTION:
This agreement shall be governed and interpreted in all respects by the Laws of the Democratic Socialist Republic of Sri Lanka, and the parties hereby submit to the exclusive jurisdiction of the competent Courts of Sri Lanka.

IN WITNESS WHEREOF the Lessor and the Lessee have executed this Agreement on the day and year first above written.

________________________________________            ________________________________________
LESSOR (LANDLORD) SIGNATURE                          LESSEE (TENANT) SIGNATURE
Name: ${data.landlordName || '[LANDLORD NAME]'}                      Name: ${data.tenantName || '[TENANT NAME]'}
NIC: ${data.landlordNic || '[NIC]'}                              NIC: ${data.tenantNic || '[NIC]'}

ATTESTING WITNESSES (As required under the Prevention of Frauds Ordinance No. 7 of 1840):

WITNESS 1:                                          WITNESS 2:
Signature: _____________________________            Signature: _____________________________
Name: __________________________________            Name: __________________________________
NIC No: ________________________________            NIC No: ________________________________
Address: _______________________________            Address: _______________________________`;
  }

  // -------------------------------------------------------------
  // 3. FORMAL LEGAL DEMAND NOTICE FOR DEBT RECOVERY
  // -------------------------------------------------------------
  if (templateId === 'debt-notice') {
    const amountFormatted = formatLKR(data.amountDue);

    return `FORMAL STATUTORY LETTER OF DEMAND FOR RECOVERY OF DEBT
(DISPATCHED BY REGISTERED POST WITH ACKNOWLEDGEMENT OF DUE / PERSONAL SERVICE)

Date: ${currentDate}

TO (DEBTOR):
Full Name: ${data.debtorName || '[DEBTOR FULL NAME]'}
Address: ${data.debtorAddress || '[DEBTOR RESIDENTIAL / BUSINESS ADDRESS]'}

FROM (CREDITOR):
Full Name / Firm: ${data.creditorName || '[CREDITOR NAME]'}
Address: ${data.creditorAddress || '[CREDITOR POSTAL ADDRESS]'}
Telephone / Contact: ${data.creditorPhone || '[CONTACT PHONE NUMBER]'}

DEMAND FOR IMMEDIATE PAYMENT OF OUTSTANDING SUM OF LKR ${amountFormatted}

Dear Sir / Madam,

I / We write to formally place you on notice regarding the outstanding monetary indebtedness owed by you as set forth hereunder:

1. PARTICULARS OF INDEBTEDNESS:
You are lawfully indebted to me/us in the capital sum of LKR ${amountFormatted} (Sri Lankan Rupees) arising out of:
${data.debtReason || '[PARTICULARS OF DEBT / LOAN AGREEMENT / BOUNCED CHEQUE NO.]'}, which transaction took place / matured on or about ${data.debtDate || '[DATE]'}.

2. DEFAULT IN PAYMENT:
Notwithstanding multiple reminders and verbal requests for settlement, you have deliberately neglected, defaulted, and failed to settle the said outstanding amount or any part thereof.

3. FORMAL DEMAND:
DEMAND IS HEREBY MADE UPON YOU to pay the full capital sum of LKR ${amountFormatted} within ${data.deadlineDays || 7} (Seven) days from the date of receipt of this notice, by way of direct remittance to:
${data.settlementMethod || '[CREDITOR BANK ACCOUNT DETAILS / CONTACT OFFICE]'} against an official written receipt.

4. NOTICE OF LEGAL ACTION:
TAKE NOTICE that in the event you fail to settle the full sum within the stipulated deadline of ${data.deadlineDays || 7} days, I/we have already instructed our Attorney-at-Law to institute formal civil litigation against you in the competent District Court of Sri Lanka under the Debt Recovery (Special Provisions) Act No. 2 of 1990 and/or the Civil Procedure Code (Cap 101).

You shall additionally be held liable for:
(a) Statutory commercial legal interest on the outstanding sum until full realization;
(b) Full taxable legal costs and incidental damages suffered.

PLEASE TREAT THIS AS FORMAL AND FINAL STATUTORY NOTICE BEFORE ACTION.

Yours faithfully,

________________________________________
CREDITOR / AUTHORIZED SIGNATORY
Name: ${data.creditorName || '[CREDITOR NAME]'}
Contact: ${data.creditorPhone || '[PHONE NUMBER]'}`;
  }

  // -------------------------------------------------------------
  // 4. FORMAL POLICE COMPLAINT LETTER
  // -------------------------------------------------------------
  if (templateId === 'police-complaint') {
    return `FORMAL WRITTEN POLICE COMPLAINT (පොලිස් පැමිණිල්ල / பொலிஸ் முறைப்பாடு)
(Lodged under Section 109 and Section 110 of the Code of Criminal Procedure Act No. 15 of 1979)

Date: ${currentDate}

TO:
The Officer-in-Charge (OIC)
Police Station: ${data.policeStation || '[POLICE STATION NAME]'} Police Station
Sri Lanka Police Service

COMPLAINANT DETAILS:
Full Name: ${data.complainantName || '[COMPLAINANT FULL LEGAL NAME]'}
National Identity Card (NIC) No: ${data.complainantNic || '[NIC NUMBER]'}
Permanent Address: ${data.complainantAddress || '[COMPLAINANT ADDRESS]'}
Contact Telephone Number: ${data.complainantPhone || '[CONTACT PHONE NUMBER]'}

SUBJECT: FORMAL COMPLAINT REGARDING ${data.complaintType?.toUpperCase() || 'CRIMINAL INCIDENT / OFFENCE'}

Respected Sir / Madam,

I am lodging this formal complaint requesting immediate investigation and statutory police action regarding an incident described hereunder:

1. INCIDENT TIME & PLACE:
(a) Date & Time of Occurrence: ${data.incidentDate || '[DATE AND TIME]'}
(b) Exact Location / Place: ${data.incidentLocation || '[EXACT LOCATION / ADDRESS]'}

2. SUSPECT PARTICULARS:
${data.suspectInfo || 'Unknown perpetrator(s) / Under police investigation'}

3. WITNESSES PRESENT (IF ANY):
${data.witnessInfo || 'Details to be furnished during preliminary inquiry'}

4. DETAILED STATEMENT OF FACTS:
${data.incidentDescription || '[DETAILED FACTUAL NARRATIVE]'}

5. RELIEF / ACTION PRAYED FOR:
I respectfully request the Sri Lanka Police to:
(a) Record this information formally in the Information Book (IB) / Crimes Information Book (CIB);
(b) Conduct a thorough investigation into the matter and apprehend the offender(s);
(c) Provide me with a Certified Extract of this Police Entry (CIB Extract) for official and court purposes;
(d) Take necessary steps to report the matter to the Honorable Magistrate's Court having jurisdiction: ${data.reliefSought || 'Investigation and legal action'}.

I hereby declare that the particulars furnished above are true and correct to the best of my knowledge and belief.

Yours faithfully,

________________________________________
COMPLAINANT SIGNATURE
Name: ${data.complainantName || '[COMPLAINANT NAME]'}
NIC: ${data.complainantNic || '[NIC NUMBER]'}
Telephone: ${data.complainantPhone || '[PHONE NUMBER]'}`;
  }

  // -------------------------------------------------------------
  // 5. MOTOR VEHICLE SALE & HANDOVER AGREEMENT
  // -------------------------------------------------------------
  if (templateId === 'motor-vehicle-sale') {
    const priceFormatted = formatLKR(data.salePrice);

    return `AGREEMENT FOR SALE AND HANDOVER OF MOTOR VEHICLE
(Governed under the Motor Traffic Act - Cap 203 of Sri Lanka)

THIS AGREEMENT is made and entered into on this ${currentDate} at Sri Lanka,

BY AND BETWEEN:
SELLER (REGISTERED OWNER): ${data.sellerName || '[SELLER FULL NAME]'}, holder of NIC No: ${data.sellerNic || '[SELLER NIC]'}, residing at ${data.sellerAddress || '[SELLER ADDRESS]'} (hereinafter called the "Seller");

AND
BUYER (PURCHASER): ${data.buyerName || '[BUYER FULL NAME]'}, holder of NIC No: ${data.buyerNic || '[BUYER NIC]'}, residing at ${data.buyerAddress || '[BUYER ADDRESS]'} (hereinafter called the "Buyer").

WHEREAS the Seller is the registered and lawful owner of the motor vehicle detailed below:
- Vehicle Registration No: ${data.vehicleNumber || '[REGISTRATION NO]'}
- Make & Model: ${data.vehicleMakeModel || '[MAKE / MODEL]'}
- Chassis Number: ${data.chassisNumber || '[CHASSIS NUMBER]'}
- Engine Number: ${data.engineNumber || '[ENGINE NUMBER]'}

IT IS HEREBY MUTUALLY AGREED AS FOLLOWS:
1. SALE PRICE & PAYMENT:
The agreed purchase price for the said vehicle is LKR ${priceFormatted} (Sri Lankan Rupees). The Seller hereby acknowledges receipt of the said full payment in cleared funds from the Buyer.

2. PHYSICAL HANDOVER & DOCUMENTS:
The physical possession of the said motor vehicle, together with the Certificate of Registration (CR), original Revenue License, Vehicle Keys, and duly executed MTA 6 / MTA 8 Transfer of Ownership Forms, has been delivered to the Buyer on:
Handover Date & Time: ${data.handoverDateTime || currentDate}.

3. INDEMNITY & TRANSFER OF ROAD LIABILITY:
The Buyer hereby covenants and agrees that from the exact date and hour of physical handover, all risks, traffic liabilities, penalties, accidents, speed-camera fines, third-party claims, or criminal consequences arising out of the use or operation of the said motor vehicle shall be the sole responsibility of the Buyer, and the Buyer shall indemnify the Seller against any such claims.

4. REGISTRATION OF TRANSFER:
The Buyer undertakes to submit the transfer documents to the Department of Motor Traffic (DMT) within fourteen (14) days hereof to effect the official transfer of ownership.

IN WITNESS WHEREOF the parties have affixed their signatures hereto:

________________________________________            ________________________________________
SELLER SIGNATURE                                     BUYER SIGNATURE
Name: ${data.sellerName || '[SELLER NAME]'}                          Name: ${data.buyerName || '[BUYER NAME]'}
NIC: ${data.sellerNic || '[NIC]'}                                NIC: ${data.buyerNic || '[NIC]'}

WITNESSES:
1. Signature: __________________ Name: __________________ NIC: __________________
2. Signature: __________________ Name: __________________ NIC: __________________`;
  }

  // -------------------------------------------------------------
  // 6. SPECIAL POWER OF ATTORNEY
  // -------------------------------------------------------------
  if (templateId === 'poa-special') {
    return `SPECIAL POWER OF ATTORNEY (විශේෂ ඇටෝර්නි බලපත්‍රය)
(Executed under the Powers of Attorney Ordinance No. 4 of 1902 of Sri Lanka)

KNOW ALL MEN BY THESE PRESENTS that I, ${data.principalName || '[PRINCIPAL NAME]'}, holder of NIC / Passport No. ${data.principalNic || '[PRINCIPAL NIC]'}, residing at ${data.principalAddress || '[PRINCIPAL ADDRESS]'} (hereinafter called the "Principal"), do hereby appoint and constitute:

${data.attorneyName || '[ATTORNEY NAME]'}, holder of NIC No. ${data.attorneyNic || '[ATTORNEY NIC]'}, residing at ${data.attorneyAddress || '[ATTORNEY ADDRESS]'} (hereinafter called the "Attorney-in-Fact"),

as my true and lawful attorney for me and in my name, place, and stead, to do, execute, and perform all or any of the following specific acts, deeds, and things:

SPECIFIC POWERS CONFERRED:
${data.specificPowers || '[SPECIFIC POWERS ENUMERATED]'}

DURATION & REVOCATION:
This Special Power of Attorney shall remain in full force and effect for: ${data.validityDuration || 'Six (6) months from the date hereof'} unless revoked earlier in writing by the Principal.

AND I hereby agree to ratify and confirm all and whatsoever my said Attorney-in-Fact shall lawfully do or cause to be done by virtue of these presents.

IN WITNESS WHEREOF I, the Principal, have set my hand on this ${currentDate}.

________________________________________
PRINCIPAL (GRANTOR) SIGNATURE
Name: ${data.principalName || '[PRINCIPAL NAME]'}
NIC / Passport: ${data.principalNic || '[NIC]'}

ATTESTATION BEFORE NOTARY PUBLIC / JUSTICE OF THE PEACE:
Signed by the Principal in the presence of:
Witness 1: ____________________________ NIC: ____________________________
Witness 2: ____________________________ NIC: ____________________________

Before Me:
________________________________________
JUSTICE OF THE PEACE / NOTARY PUBLIC
(Seal & Signature)`;
  }

  return `STATUTORY LEGAL DOCUMENT DRAFT - ${currentDate}\n\n${JSON.stringify(data, null, 2)}`;
}

// -------------------------------------------------------------
// ROUTES
// -------------------------------------------------------------

// Get all templates
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
    const docId = `doc_${Date.now()}`;

    let docObj = null;
    if (getDBStatus()) {
      docObj = await Document.create({
        userId,
        templateType: templateId,
        title: `${template.title.split(' (')[0]} - ${new Date().toLocaleDateString('en-GB')}`,
        formData,
        generatedContent: generatedText,
        language,
      });
    } else {
      docObj = {
        _id: docId,
        userId,
        templateType: templateId,
        title: `${template.title.split(' (')[0]} - ${new Date().toLocaleDateString('en-GB')}`,
        formData,
        generatedContent: generatedText,
        language,
        createdAt: new Date(),
      };
      memoryDocuments.unshift(docObj);
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

// Update / Edit Document Content — saves generatedContent, formData, isEdited flag and editedAt
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { generatedContent, formData, title } = req.body;

    if (!generatedContent) {
      return res.status(400).json({ message: 'generatedContent is required for update.' });
    }

    const editedAt = new Date();

    // Build the update object — include formData if provided
    const updateFields = {
      generatedContent,
      isEdited: true,
      editedAt,
      ...(title ? { title } : {}),
      ...(formData && typeof formData === 'object' ? { formData } : {}),
    };

    if (getDBStatus()) {
      const updated = await Document.findByIdAndUpdate(
        id,
        updateFields,
        { new: true, runValidators: false }
      );
      if (!updated) {
        return res.status(404).json({ message: 'Document not found in database.' });
      }
      return res.json({
        success: true,
        savedToDb: true,
        document: updated,
      });
    } else {
      // In-memory fallback
      const index = memoryDocuments.findIndex(d => d._id === id || String(d._id) === id);
      if (index === -1) {
        return res.json({
          success: true,
          savedToDb: false,
          document: { _id: id, ...updateFields, updatedAt: editedAt },
        });
      }
      Object.assign(memoryDocuments[index], updateFields);
      memoryDocuments[index].updatedAt = editedAt;
      return res.json({
        success: true,
        savedToDb: false,
        document: memoryDocuments[index],
      });
    }
  } catch (error) {
    console.error('Update document error:', error);
    res.status(500).json({ message: 'Failed to update document.' });
  }
});

// Delete Document
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (getDBStatus()) {
      await Document.findByIdAndDelete(id);
    } else {
      const index = memoryDocuments.findIndex(d => d._id === id || String(d._id) === id);
      if (index !== -1) {
        memoryDocuments.splice(index, 1);
      }
    }

    res.json({ success: true, message: 'Document draft deleted successfully.' });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ message: 'Failed to delete document.' });
  }
});

// Get user documents
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    if (getDBStatus()) {
      const docs = await Document.find({ userId }).sort({ createdAt: -1 });
      return res.json(docs);
    } else {
      const docs = memoryDocuments.filter(d => d.userId === userId);
      return res.json(docs);
    }
  } catch (error) {
    console.error('Fetch user documents error:', error);
    res.status(500).json({ message: 'Failed to fetch user documents.' });
  }
});

export default router;
