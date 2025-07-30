import React, { useState } from 'react';
import { IoMdNotifications } from 'react-icons/io';
import { useNotifications } from '../context/NotificationContext';
import { FaThumbsUp } from 'react-icons/fa';

const NotificationBell = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { notifications, unreadCount, markAsRead } = useNotifications();

  const handleNotificationClick = (notificationId) => {
    markAsRead(notificationId);
  };

  return (
    <div className="relative">
      <div className="cursor-pointer" onClick={() => setShowDropdown(!showDropdown)}>
        <IoMdNotifications className="rounded-full border-2 p-2 size-10 text-black" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {unreadCount}
          </span>
        )}
      </div>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-4">
            <h3 className="font-bold mb-2">Notifications</h3>
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif._id}
                  onClick={() => handleNotificationClick(notif._id)}
                  className={`p-2 border-b cursor-pointer hover:bg-gray-100 ${
                    !notif.isRead ? 'bg-blue-50' : ''
                  }`}
                >
                  <p className="text-sm">{notif.message}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(notif.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No notifications</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell; 