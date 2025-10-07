
import React from 'react';

interface BrushSizeSliderProps {
  brushSize: number;
  onSizeChange: (size: number) => void;
}

export const BrushSizeSlider: React.FC<BrushSizeSliderProps> = ({ brushSize, onSizeChange }) => {
  return (
    <div className="flex items-center gap-3 text-white">
      <label htmlFor="brush-size" className="text-sm font-medium text-gray-300 whitespace-nowrap">Size</label>
      <input
        id="brush-size"
        type="range"
        min="1"
        max="100"
        value={brushSize}
        onChange={(e) => onSizeChange(Number(e.target.value))}
        className="w-32 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-sky-500"
      />
      <span className="w-8 text-center text-sm font-semibold bg-gray-700 rounded-md py-1">{brushSize}</span>
    </div>
  );
};
