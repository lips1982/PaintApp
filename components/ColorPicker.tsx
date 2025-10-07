
import React from 'react';

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

const PRESET_COLORS = [
  '#000000', '#FFFFFF', '#EF4444', '#F97316', '#EAB308', 
  '#84CC16', '#22C55E', '#14B8A6', '#06B6D4', '#3B82F6', 
  '#8B5CF6', '#EC4899'
];

export const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onColorChange }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        {PRESET_COLORS.map(color => (
          <button
            key={color}
            onClick={() => onColorChange(color)}
            className={`w-7 h-7 rounded-full border-2 transition-transform duration-150 ${
              selectedColor.toUpperCase() === color.toUpperCase() 
                ? 'border-sky-400 scale-110' 
                : 'border-gray-600 hover:scale-110'
            }`}
            style={{ backgroundColor: color }}
            aria-label={`Select color ${color}`}
          />
        ))}
      </div>
      <div className="relative w-8 h-8">
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => onColorChange(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label="Custom color picker"
        />
        <div 
          className="w-full h-full rounded-md border-2 border-gray-500 pointer-events-none" 
          style={{ backgroundColor: selectedColor }}
        />
      </div>
    </div>
  );
};
