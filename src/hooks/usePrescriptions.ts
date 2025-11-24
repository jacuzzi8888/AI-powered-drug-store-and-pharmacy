/**
 * Custom hook for prescription management
 */

import { useState, useCallback } from 'react';
import { Prescription, PrescriptionStatus } from '../types';
import { PRESCRIPTION_CONFIG } from '../utils/constants';

export function usePrescriptions() {
    // For now, using local state. In future, this could be moved to a context if needed
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([
        {
            id: 'px-001',
            fileName: 'Dr_Smith_Rx_Amoxicillin.pdf',
            fileUrl: 'https://picsum.photos/seed/px001/200/300',
            status: PrescriptionStatus.Approved,
            submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            stampJws: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJweC0wMDEiLCJ2ZXJpZmllcl9pZCI6InBoYXJtLTAwNyIsImlhdCI6MTcxOTI4NzYwMCwiZmlsZV9zaGEyNTYiOiJlM2IwYzQ0MmY2ZDE1MTFjZGU3ZTY4OWU4YzFjYTY1OThlY2FjYjBlNzYxYzc2ZGNmMDY3NTllN2M2OTgxZWM3In0.fake_signature_string_for_demo',
            autoRefill: true,
        },
        {
            id: 'px-002',
            fileName: 'Prescription_Photo_Jan24.jpg',
            fileUrl: 'https://picsum.photos/seed/px002/200/300',
            status: PrescriptionStatus.Rejected,
            submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            pharmacistNote: 'The image provided is too blurry to read the dosage instructions clearly. Please upload a clearer picture.',
            autoRefill: false,
        },
        {
            id: 'px-003',
            fileName: 'Cardiology_Consult_Rx.pdf',
            fileUrl: 'https://picsum.photos/seed/px003/200/300',
            status: PrescriptionStatus.Pending,
            submittedAt: new Date(),
            autoRefill: false,
        },
    ]);

    /**
     * Uploads a new prescription
     */
    const uploadPrescription = useCallback((file: File) => {
        const newPrescription: Prescription = {
            id: `px-${Date.now()}`,
            fileName: file.name,
            fileUrl: URL.createObjectURL(file),
            status: PrescriptionStatus.Pending,
            submittedAt: new Date(),
            autoRefill: false,
        };

        setPrescriptions(prev => [newPrescription, ...prev]);

        // Simulate OCR and verification process
        setTimeout(() => {
            setPrescriptions(prev => prev.map(p => {
                if (p.id === newPrescription.id) {
                    const statuses = [
                        PrescriptionStatus.Approved,
                        PrescriptionStatus.Rejected,
                        PrescriptionStatus.NeedsClarification
                    ];
                    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
                    const updatedPrescription: Prescription = { ...p, status: randomStatus };

                    if (randomStatus === PrescriptionStatus.Approved) {
                        updatedPrescription.stampJws = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJweC1uZXciLCJ2ZXJpZmllcl9pZCI6InBoYXJtLTAwNyIsImlhdCI6MTcxOTI4NzYwMCwiZmlsZV9zaGEyNTYiOiJmYWtlX2hhc2hfZm9yX2RlbW8ifQ.another_fake_signature_for_demo';
                    }

                    if (randomStatus === PrescriptionStatus.Rejected) {
                        updatedPrescription.pharmacistNote = 'The provided image was not clear enough to verify. Please upload a new one.';
                    }

                    return updatedPrescription;
                }
                return p;
            }));
        }, PRESCRIPTION_CONFIG.VERIFICATION_MIN_TIME + Math.random() * (PRESCRIPTION_CONFIG.VERIFICATION_MAX_TIME - PRESCRIPTION_CONFIG.VERIFICATION_MIN_TIME));

        return newPrescription;
    }, []);

    /**
     * Updates a prescription
     */
    const updatePrescription = useCallback((updatedPrescription: Prescription) => {
        setPrescriptions(prev => prev.map(p =>
            p.id === updatedPrescription.id ? updatedPrescription : p
        ));
    }, []);

    /**
     * Gets a specific prescription
     */
    const getPrescription = useCallback((id: string): Prescription | null => {
        return prescriptions.find(p => p.id === id) || null;
    }, [prescriptions]);

    /**
     * Gets recent prescriptions
     */
    const getRecentPrescriptions = useCallback((count: number = 3): Prescription[] => {
        return [...prescriptions]
            .sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime())
            .slice(0, count);
    }, [prescriptions]);

    return {
        prescriptions,
        uploadPrescription,
        updatePrescription,
        getPrescription,
        getRecentPrescriptions
    };
}
