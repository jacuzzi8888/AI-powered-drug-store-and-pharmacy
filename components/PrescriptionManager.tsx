import React, { useState, useMemo } from 'react';
import { Prescription, PrescriptionStatus } from '../types';
import { UploadIcon, CheckCircleIcon, XCircleIcon, ClockIcon, InformationCircleIcon, DocumentTextIcon, EyeIcon, ArrowPathIcon } from './icons/Icons';
import Modal from './ui/Modal';

interface PrescriptionManagerProps {
  prescriptions: Prescription[];
  onUpload: (file: File) => void;
}

const statusStyles: Record<PrescriptionStatus, { icon: React.ElementType, badge: string, text: string, description: string }> = {
  [PrescriptionStatus.Approved]: { icon: CheckCircleIcon, badge: 'bg-green-100 text-green-800', text: 'text-green-600', description: "Your prescription has been approved and is ready to be filled." },
  [PrescriptionStatus.Pending]: { icon: ClockIcon, badge: 'bg-amber-100 text-amber-800', text: 'text-amber-600', description: "Your prescription has been submitted and is awaiting review." },
  [PrescriptionStatus.Rejected]: { icon: XCircleIcon, badge: 'bg-red-100 text-red-800', text: 'text-red-600', description: "Your prescription was rejected. Please contact the pharmacy for details." },
  [PrescriptionStatus.NeedsClarification]: { icon: InformationCircleIcon, badge: 'bg-sky-100 text-sky-800', text: 'text-sky-600', description: "The pharmacist requires more information. We will be in touch." },
};

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

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleSubmit = () => {
    if (file) {
      onUpload(file);
      onClose();
    }
  };

  return (
    <Modal title="Upload Prescription" onClose={onClose}>
      <div className="p-6">
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors ${isDragging ? 'border-[#3A7D44] bg-[#EAF6E6]' : 'border-stone-300'}`}
        >
          <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">Drag & drop your file here</p>
          <p className="text-xs text-gray-500">or</p>
          <label htmlFor="file-upload" className="cursor-pointer font-medium text-[#3A7D44] hover:text-opacity-80">
            browse to upload
          </label>
          <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*,.pdf" onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)} />
          <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 10MB, or PDF</p>
        </div>
        {file && (
          <div className="mt-4 p-4 border rounded-lg flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">{file.name}</p>
              <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            {preview && <img src={preview} alt="Preview" className="h-16 w-16 object-cover rounded" />}
          </div>
        )}
      </div>
      <div className="bg-stone-50 px-6 py-4 flex justify-end space-x-3">
        <button onClick={onClose} type="button" className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-stone-300 rounded-full shadow-sm hover:bg-stone-100">Cancel</button>
        <button onClick={handleSubmit} type="button" disabled={!file} className="px-4 py-2 text-sm font-medium text-white bg-[#F4991A] border border-transparent rounded-full shadow-sm hover:bg-opacity-90 disabled:bg-gray-300">Submit for Verification</button>
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
                        <h3 className="font-bold text-lg text-[#344F1F]">{prescription.fileName}</h3>
                        <p className="text-sm text-gray-500">Submitted: {prescription.submittedAt.toLocaleDateString()}</p>
                        <div className="mt-2 flex items-center">
                            <Icon className={`h-5 w-5 ${textColor}`} />
                            <span className={`ml-2 font-semibold ${textColor}`}>{prescription.status}</span>
                        </div>
                    </div>
                </div>

                {prescription.status === PrescriptionStatus.Approved && prescription.stampJws && (
                    <div className="mt-6">
                        <h4 className="font-semibold text-gray-700">Digital Prescription Stamp (JWS)</h4>
                        <div className="mt-2 p-3 bg-stone-100 rounded-md text-xs text-gray-600 break-all font-mono">
                            {prescription.stampJws}
                        </div>
                         <p className="mt-2 text-xs text-gray-500">This tamper-resistant stamp verifies the authenticity of your prescription.</p>
                    </div>
                )}
                 {prescription.status === PrescriptionStatus.Rejected && (
                    <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-400">
                         <p className="text-sm text-red-700">This prescription was rejected. Please contact the pharmacy for more details or upload a new valid prescription.</p>
                    </div>
                )}
            </div>
             <div className="bg-stone-50 px-6 py-4 flex justify-end">
                <button onClick={onClose} type="button" className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-stone-300 rounded-full shadow-sm hover:bg-stone-50">Close</button>
            </div>
        </Modal>
    )
}

const PrescriptionRow: React.FC<{ prescription: Prescription, onSelect: (p: Prescription) => void }> = ({ prescription, onSelect }) => {
  const { icon: Icon, badge: badgeColor } = statusStyles[prescription.status];
  const handleRefillClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    alert(`Refill requested for ${prescription.fileName}. You will be notified when it's ready.`);
  };

  return (
    <tr className="bg-[#EAF6E6] hover:bg-white">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#344F1F] flex items-center">
        <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-3" />
        {prescription.fileName}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prescription.submittedAt.toLocaleDateString()}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <span 
            title={statusStyles[prescription.status].description}
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${badgeColor}`}
        >
          <Icon className="h-4 w-4 mr-1.5" />
          {prescription.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-4">
             {prescription.status === PrescriptionStatus.Approved && (
                <button 
                    onClick={handleRefillClick}
                    className="text-green-600 hover:text-green-900 flex items-center text-sm"
                >
                    <ArrowPathIcon className="h-4 w-4 mr-1"/> Refill
                </button>
            )}
            <button onClick={() => onSelect(prescription)} className="text-[#3A7D44] hover:text-opacity-80 flex items-center text-sm">
                <EyeIcon className="h-4 w-4 mr-1" /> View
            </button>
        </div>
      </td>
    </tr>
  );
};

const PrescriptionManager: React.FC<PrescriptionManagerProps> = ({ prescriptions, onUpload }) => {
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  const sortedPrescriptions = useMemo(() => {
    return [...prescriptions].sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());
  }, [prescriptions]);

  const StatusLegend = () => (
    <div className="bg-white p-4 rounded-lg border border-stone-200 mb-6 md:mb-8">
        <h3 className="text-base font-semibold text-gray-700 mb-3 flex items-center">
            <InformationCircleIcon className="h-5 w-5 mr-2 text-gray-400" />
            Status Legend
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            {Object.values(statusStyles).map((style, index) => (
                <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                         <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${style.badge}`}>
                            <style.icon className="h-4 w-4 mr-1.5" />
                            {Object.keys(statusStyles)[index]}
                        </span>
                    </div>
                    <p className="ml-3 text-sm text-gray-600">{style.description}</p>
                </div>
            ))}
        </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {isUploadModalOpen && <UploadModal onClose={() => setUploadModalOpen(false)} onUpload={onUpload} />}
      {selectedPrescription && <PrescriptionDetailModal prescription={selectedPrescription} onClose={() => setSelectedPrescription(null)} />}

      <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 md:mb-8">
        <div>
          <h1 className="text-4xl font-bold font-lora text-[#344F1F]">My Prescriptions</h1>
          <p className="mt-2 text-lg text-[#344F1F]/80">Manage and track your prescription submissions.</p>
        </div>
        <button
          onClick={() => setUploadModalOpen(true)}
          className="mt-4 sm:mt-0 w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-[#F4991A] hover:bg-opacity-90"
        >
          <UploadIcon className="-ml-1 mr-2 h-5 w-5" />
          Upload New Prescription
        </button>
      </header>
      
      <div className="hidden md:block bg-[#EAF6E6] shadow-sm rounded-lg border border-[#3A7D44]/20 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#3A7D44]/20">
                <thead className="bg-white">
                    <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Submitted</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                    </tr>
                </thead>
                <tbody className="bg-[#EAF6E6] divide-y divide-[#3A7D44]/20">
                    {sortedPrescriptions.length > 0 ? (
                        sortedPrescriptions.map(p => <PrescriptionRow key={p.id} prescription={p} onSelect={setSelectedPrescription} />)
                    ) : (
                        <tr>
                            <td colSpan={4} className="text-center py-10 text-gray-500">
                                No prescriptions found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionManager;