import React, { useState, useRef, useEffect } from 'react';
import { CanvasSize } from '../types';
import { SizeIcon } from './icons';

interface CanvasSizeSelectorProps {
  canvasSize: CanvasSize;
  setCanvasSize: (size: CanvasSize) => void;
}

const PRESETS = [
    { label: 'Fit Screen', value: 'FIT_SCREEN' as const },
    { label: 'Square (1024x1024)', value: { width: 1024, height: 1024 } },
    { label: 'Portrait (768x1024)', value: { width: 768, height: 1024 } },
    { label: 'Landscape (1024x768)', value: { width: 1024, height: 768 } },
];

export const CanvasSizeSelector: React.FC<CanvasSizeSelectorProps> = ({ canvasSize, setCanvasSize }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [customWidth, setCustomWidth] = useState(1280);
    const [customHeight, setCustomHeight] = useState(720);
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

    const handlePresetSelect = (size: CanvasSize) => {
        setCanvasSize(size);
        setIsOpen(false);
    }

    const handleApplyCustom = () => {
        if (customWidth > 0 && customHeight > 0) {
            setCanvasSize({ width: customWidth, height: customHeight });
            setIsOpen(false);
        }
    }

    const getCurrentSizeLabel = () => {
        if (canvasSize === 'FIT_SCREEN') return 'Fit Screen';
        return `${canvasSize.width} x ${canvasSize.height}`;
    }

    return (
        <div ref={wrapperRef} className="relative">
            <button
              onClick={() => setIsOpen(prev => !prev)}
              aria-haspopup="true"
              aria-expanded={isOpen}
              title="Canvas Size"
              className="flex items-center justify-center px-3 py-2.5 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              <SizeIcon className="w-6 h-6" />
              <span className="ml-2 font-medium text-sm whitespace-nowrap hidden sm:inline">{getCurrentSizeLabel()}</span>
            </button>
            {isOpen && (
                <div className="absolute top-full mt-2 left-0 w-64 z-20 bg-gray-800 border border-gray-700 rounded-lg shadow-xl text-white">
                    <ul className="p-1">
                        {PRESETS.map(preset => (
                           <li key={preset.label}>
                               <button 
                                 onClick={() => handlePresetSelect(preset.value)}
                                 className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-700 transition-colors"
                               >
                                   {preset.label}
                               </button>
                           </li>
                        ))}
                    </ul>
                    <div className="border-t border-gray-700 p-2">
                        <p className="text-sm font-semibold mb-2 px-1">Custom Size</p>
                        <div className="flex items-center gap-2">
                            <input 
                              type="number"
                              value={customWidth}
                              onChange={(e) => setCustomWidth(Math.max(1, parseInt(e.target.value, 10) || 1))}
                              className="w-full bg-gray-900 text-white border border-gray-600 rounded-md px-2 py-1 text-sm focus:ring-sky-500 focus:border-sky-500"
                              placeholder="Width"
                            />
                            <span className="text-gray-500">x</span>
                            <input 
                              type="number"
                              value={customHeight}
                              onChange={(e) => setCustomHeight(Math.max(1, parseInt(e.target.value, 10) || 1))}
                              className="w-full bg-gray-900 text-white border border-gray-600 rounded-md px-2 py-1 text-sm focus:ring-sky-500 focus:border-sky-500"
                              placeholder="Height"
                            />
                        </div>
                        <button
                          onClick={handleApplyCustom}
                          className="mt-2 w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded-md text-sm transition-colors"
                        >
                            Apply
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
};
