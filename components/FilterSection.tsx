
import React from 'react';

interface FilterSectionProps {
  title: string;
  items: { id: string; name: string }[];
  selectedIds: string[];
  onChange: (id: string) => void;
  onClear: () => void;
}

export const FilterSection: React.FC<FilterSectionProps> = ({ 
  title, 
  items, 
  selectedIds, 
  onChange,
  onClear 
}) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">{title}</h3>
        <button 
          onClick={onClear}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
        >
          Clear
        </button>
      </div>
      <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
        {items.map((item) => (
          <label 
            key={item.id} 
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              checked={selectedIds.includes(item.id)}
              onChange={() => onChange(item.id)}
            />
            <span className="text-sm text-gray-600 font-medium">{item.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
};
