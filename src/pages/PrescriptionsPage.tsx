/**
 * Prescriptions Page Wrapper
 * Connects PrescriptionManager to usePrescriptions hook
 */

import React from 'react';
import PrescriptionManager from '../components/PrescriptionManager';
import { usePrescriptions } from '../hooks';

export default function PrescriptionsPage() {
    const { prescriptions, uploadPrescription, updatePrescription } = usePrescriptions();

    return (
        <PrescriptionManager
            prescriptions={prescriptions}
            onUpload={uploadPrescription}
            onUpdate={updatePrescription}
        />
    );
}
