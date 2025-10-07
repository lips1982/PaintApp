
import React from 'react';

interface IconButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  isActive?: boolean;
  label: string;
}

export const IconButton: React.FC<IconButtonProps> = ({ children, onClick, isActive = false, label }) => {
  const activeClasses = isActive ? 'bg-sky-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600';
  
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`p-2.5 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-400 ${activeClasses}`}
    >
      {children}
    </button>
  );
};
