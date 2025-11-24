
import React, { useEffect } from 'react';
import { Notification } from '../../types';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, XMarkIcon } from '../icons/Icons';

interface NotificationProps {
    notification: Notification;
    onClose: (id: number) => void;
}

const NotificationToast: React.FC<NotificationProps> = ({ notification, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(notification.id);
        }, 5000); // Auto-dismiss after 5 seconds

        return () => clearTimeout(timer);
    }, [notification, onClose]);

    const icons = {
        success: <CheckCircleIcon className="h-6 w-6 text-green-500" />,
        error: <XCircleIcon className="h-6 w-6 text-red-500" />,
        info: <InformationCircleIcon className="h-6 w-6 text-blue-500" />,
    };

    return (
        <div className="bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
            <div className="p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        {icons[notification.type]}
                    </div>
                    <div className="ml-3 w-0 flex-1 pt-0.5">
                        <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex">
                        <button onClick={() => onClose(notification.id)} className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <span className="sr-only">Close</span>
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


interface NotificationContainerProps {
    notifications: Notification[];
    removeNotification: (id: number) => void;
}

const NotificationContainer: React.FC<NotificationContainerProps> = ({ notifications, removeNotification }) => {
    return (
        <div aria-live="assertive" className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-50">
            <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
                {notifications.map(notification => (
                    <NotificationToast key={notification.id} notification={notification} onClose={removeNotification} />
                ))}
            </div>
        </div>
    );
};

export default NotificationContainer;
