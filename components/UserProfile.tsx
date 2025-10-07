import React, { useState, useRef, useEffect } from 'react';
import { UserProfile as UserProfileType } from '../types';
import { LogoutIcon } from './icons';

interface UserProfileProps {
  user: UserProfileType;
  onLogout: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <button onClick={() => setIsOpen(prev => !prev)} className="w-10 h-10 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-sky-500">
        <img src={user.picture} alt={user.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
      </button>
      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-72 z-20 bg-gray-800 border border-gray-700 rounded-lg shadow-xl text-white">
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <img src={user.picture} alt={user.name} referrerPolicy="no-referrer" className="w-12 h-12 rounded-full object-cover" />
              <div>
                <p className="font-semibold text-base text-gray-100 truncate">{user.name}</p>
                <p className="text-sm text-gray-400 truncate">{user.email}</p>
              </div>
            </div>
          </div>
          <div className="p-2">
            <button
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 text-left px-3 py-2 text-sm rounded-md hover:bg-gray-700 transition-colors text-red-400"
            >
              <LogoutIcon className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};