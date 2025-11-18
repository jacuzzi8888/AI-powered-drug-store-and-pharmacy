
import React, { useState, useMemo } from 'react';
import { Prescription, PrescriptionStatus } from '../types';
import { UploadIcon, CheckCircleIcon, XCircleIcon, ClockIcon, InformationCircleIcon, DocumentTextIcon, EyeIcon, ArrowPathIcon, LockClosedIcon, ShieldCheckIcon } from './icons/Icons';
import Modal from './ui/Modal';

interface PrescriptionManagerProps {
  prescriptions: Prescription[];
  onUpload: (file: File) => void;
  onUpdate: (prescription: Prescription) => void;
}

const statusStyles: Record<PrescriptionStatus, { icon: React.ElementType, badge: string, text: string, description: string }> = {
  [PrescriptionStatus.Approved]: { icon: CheckCircleIcon, badge: 'bg-primary-teal/10 text-primary-teal', text: 'text-primary-teal', description: "Approved and ready to be filled." },
  [PrescriptionStatus.Pending]: { icon: ClockIcon, badge: 'bg-amber-100 text-amber-800', text: 'text-amber-600', description: "Submitted and awaiting pharmacist review." },
  [PrescriptionStatus.Rejected]: { icon: XCircleIcon, badge: 'bg-red-100 text-red-800', text: 'text-red-600', description: "Rejected. See details for pharmacist's note." },
  [PrescriptionStatus.NeedsClarification]: { icon: InformationCircleIcon, badge: 'bg-secondary-blue/10 text-secondary-blue', text: 'text-secondary-blue', description: "Pharmacist requires more information." },
  [PrescriptionStatus.RefillRequested]: { icon: ArrowPathIcon, badge: 'bg-indigo-100 text-indigo-800', text: 'text-indigo-600', description: "Refill requested, awaiting confirmation." },
};

// ... (UploadModal and PrescriptionDetailModal remain the same)
const UploadModal: React.FC<{ onClose: () => void; onUpload: (file: File) => void; }> = ({ onClose, onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile && (selectedFile.type.startsWith('image/') || selectedFile.type === 'application/pdf')) {
      setFile(selectedFile);
      if (selectedFile.type.startsWith('image/')) {
        setPreview(URL.createObjectURL(selectedFile));
      } else {
        setPreview(null);
      }
    } else {
      alert('Please select a valid image or PDF file.');
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleSubmit = () => { if (file) { onUpload(file); onClose(); } };

  return (
    <Modal title="Upload Prescription" onClose={onClose}>
      <div className="p-6">
        <div onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop} className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors ${isDragging ? 'border-primary-teal bg-secondary-blue/20' : 'border-gray-300'}`}>
          <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">Drag & drop your file here</p>
          <p className="text-xs text-gray-500">or</p>
          <label htmlFor="file-upload" className="cursor-pointer font-medium text-primary-teal hover:text-opacity-80">browse to upload</label>
          <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*,.pdf" onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)} />
          <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 10MB, or PDF</p>
        </div>
        {file && (
          <div className="mt-4 p-4 border rounded-lg flex items-center justify-between">
            <div><p className="font-medium text-sm">{file.name}</p><p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p></div>
            {preview && <img src={preview} alt="Preview" className="h-16 w-16 object-cover rounded" />}
          </div>
        )}
        <div className="mt-4 flex items-center justify-center text-xs text-gray-500"><LockClosedIcon className="h-4 w-4 mr-1.5" />Your uploads are secure and HIPAA compliant.</div>
      </div>
      <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
        <button onClick={onClose} type="button" className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-100">Cancel</button>
        <button onClick={handleSubmit} type="button" disabled={!file} className="px-4 py-2 text-sm font-medium text-white bg-primary-teal border border-transparent rounded-full shadow-sm hover:bg-opacity-90 disabled:bg-gray-300">Submit for Verification</button>
      </div>
    </Modal>
  );
};
const PrescriptionDetailModal: React.FC<{ prescription: Prescription; onClose: () => void; }> = ({ prescription, onClose }) => {
    const { icon: Icon, text: textColor } = statusStyles[prescription.status];
    return (
        <Modal title="Prescription Details" onClose={onClose}>
            <div className="p-6">
                <div className="flex items-center space-x-4">
                    <img src={prescription.fileUrl} alt="Prescription" className="h-32 w-24 object-cover rounded-lg border"/>
                    <div>
                        <h3 className="font-bold text-lg text-text-dark">{prescription.fileName}</h3>
                        <p className="text-sm text-gray-500">Submitted: {prescription.submittedAt.toLocaleDateString()}</p>
                        <div className="mt-2 flex items-center"><Icon className={`h-5 w-5 ${textColor}`} /><span className={`ml-2 font-semibold ${textColor}`}>{prescription.status}</span></div>
                    </div>
                </div>
                {prescription.stampJws && (<div className="mt-6"><h4 className="font-semibold text-gray-700 flex items-center"><ShieldCheckIcon className="h-5 w-5 mr-2 text-secondary-blue"/> Digital Prescription Stamp</h4><div className="mt-2 p-3 bg-gray-100 rounded-md text-xs text-gray-600 break-all font-mono">{prescription.stampJws}</div><p className="mt-2 text-xs text-gray-500">This tamper-resistant digital signature (JWS) verifies the authenticity of your prescription, ensuring it was approved by a licensed pharmacist on our platform.</p></div>)}
                {(prescription.status === PrescriptionStatus.Rejected || prescription.status === PrescriptionStatus.NeedsClarification) && prescription.pharmacistNote && (<div className="mt-6 p-4 bg-amber-50 border-l-4 border-amber-400"><h4 className="font-semibold text-amber-800">Note from the Pharmacist:</h4><p className="text-sm text-amber-700 mt-1">{prescription.pharmacistNote}</p></div>)}
            </div>
            <div className="bg-gray-50 px-6 py-4 flex justify-end"><button onClick={onClose} type="button" className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-50">Close</button></div>
        </Modal>
    )
};
const TransferPrescriptionModal: React.FC<{onClose: () => void}> = ({onClose}) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Transfer request submitted. Our pharmacy team will contact you within 24 hours to complete the process.");
        onClose();
    }
    return (
        <Modal title="Transfer Prescriptions" onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-4">
                    <p className="text-sm text-gray-600">Provide the details of your current pharmacy and we'll handle the rest. This process is secure and confidential.</p>
                    <div><label className="text-sm font-medium">Current Pharmacy Name</label><input type="text" required className="mt-1 w-full p-2 border rounded-md"/></div>
                    <div><label className="text-sm font-medium">Pharmacy Phone Number</label><input type="tel" required className="mt-1 w-full p-2 border rounded-md"/></div>
                    <div><label className="text-sm font-medium">Medication Name(s)</label><textarea required rows={3} className="mt-1 w-full p-2 border rounded-md" placeholder="List the medications you wish to transfer."></textarea></div>
                </div>
                <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                    <button onClick={onClose} type="button" className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-100">Cancel</button>
                    <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary-teal border border-transparent rounded-full shadow-sm hover:bg-opacity-90">Submit Transfer Request</button>
                </div>
            </form>
        </Modal>
    )
}


const PrescriptionRow: React.FC<{ prescription: Prescription, onSelect: (p: Prescription) => void, onUpdate: (p: Prescription) => void }> = ({ prescription, onSelect, onUpdate }) => {
  const { icon: Icon, badge: badgeColor } = statusStyles[prescription.status];

  const handleRefillClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate({ ...prescription, status: PrescriptionStatus.RefillRequested });
  };

  const handleToggleAutoRefill = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...prescription, autoRefill: e.target.checked });
  };

  return (
    <tr className="bg-white hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 flex items-center">
        <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-3" />
        {prescription.fileName}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prescription.submittedAt.toLocaleDateString()}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <span title={statusStyles[prescription.status].description} className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${badgeColor}`}>
          <Icon className="h-4 w-4 mr-1.5" />
          {prescription.status}
        </span>
      </td>
       <td className="px-6 py-4 whitespace-nowrap text-sm">
        {prescription.status === PrescriptionStatus.Approved && (
             <label htmlFor={`autorefill-${prescription.id}`} className="flex items-center cursor-pointer">
                <div className="relative">
                    <input type="checkbox" id={`autorefill-${prescription.id}`} className="sr-only" checked={prescription.autoRefill} onChange={handleToggleAutoRefill} />
                    <div className={`block w-10 h-6 rounded-full ${prescription.autoRefill ? 'bg-primary-teal' : 'bg-gray-300'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${prescription.autoRefill ? 'translate-x-4' : ''}`}></div>
                </div>
                <div className="ml-3 text-gray-700 text-xs font-medium">Auto-Refill</div>
            </label>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-4">
            {prescription.status === PrescriptionStatus.Approved && (
                <button onClick={handleRefillClick} className="text-primary-teal hover:text-opacity-80 flex items-center text-sm"><ArrowPathIcon className="h-4 w-4 mr-1"/> Refill</button>
            )}
            <button onClick={() => onSelect(prescription)} className="text-primary-teal hover:text-opacity-80 flex items-center text-sm"><EyeIcon className="h-4 w-4 mr-1" /> View</button>
        </div>
      </td>
    </tr>
  );
};

const PrescriptionManager: React.FC<PrescriptionManagerProps> = ({ prescriptions, onUpload, onUpdate }) => {
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [isTransferModalOpen, setTransferModalOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  const sortedPrescriptions = useMemo(() => {
    return [...prescriptions].sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());
  }, [prescriptions]);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {isUploadModalOpen && <UploadModal onClose={() => setUploadModalOpen(false)} onUpload={onUpload} />}
      {isTransferModalOpen && <TransferPrescriptionModal onClose={() => setTransferModalOpen(false)} />}
      {selectedPrescription && <PrescriptionDetailModal prescription={selectedPrescription} onClose={() => setSelectedPrescription(null)} />}

      <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 md:mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold font-lora text-text-dark">My Prescriptions</h1>
          <p className="mt-2 text-lg text-text-medium">Manage and track your prescription submissions.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
             <button onClick={() => setTransferModalOpen(true)} className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 border border-primary-teal text-sm font-medium rounded-full text-primary-teal bg-white hover:bg-primary-teal/5">Transfer Prescription</button>
            <button onClick={() => setUploadModalOpen(true)} className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-primary-teal hover:bg-opacity-90"><UploadIcon className="-ml-1 mr-2 h-5 w-5" />Upload New</button>
        </div>
      </header>
      
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Submitted</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auto-Refill</th>
                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {sortedPrescriptions.length > 0 ? (
                        sortedPrescriptions.map(p => <PrescriptionRow key={p.id} prescription={p} onSelect={setSelectedPrescription} onUpdate={onUpdate} />)
                    ) : (
                        <tr><td colSpan={5} className="text-center py-10 text-gray-500">No prescriptions found.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionManager;
