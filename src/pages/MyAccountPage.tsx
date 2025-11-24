/**
 * My Account Page Wrapper
 * Connects MyAccount component to auth context
 */

import React from 'react';
import MyAccount from '../components/MyAccount';
import { useAuth, useNotifications } from '../hooks';
import { UserProfile } from '../types';

export default function MyAccountPage() {
    const { user, updateProfile } = useAuth();
    const { addNotification } = useNotifications();

    if (!user) return null; // Protected route handles redirect, but type safety needs this

    const handleUpdateProfile = async (profile: UserProfile) => {
        const result = await updateProfile(profile);
        if (result.success) {
            addNotification('Profile updated successfully', 'success');
        } else {
            addNotification(result.message, 'error');
        }
    };

    return (
        <MyAccount
            user={user}
            onUpdateProfile={handleUpdateProfile}
        />
    );
}
