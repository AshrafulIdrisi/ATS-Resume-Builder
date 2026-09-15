import React from 'react';
import { AdditionalItem } from '../../types';
import { Plus, Trash2, Layers } from 'lucide-react';

interface AdditionalSectionsFormProps {
  items: AdditionalItem[];
  onChange: (items: AdditionalItem[]) => void;
}

export const AdditionalSectionsForm: React.FC<AdditionalSectionsFormProps> = ({ items, onChange }) => {
  const addItem = (type: AdditionalItem['type']) => {
    const newItem: AdditionalItem = {
      id: 'add-' + Date.now(),
      type,
      title: '',
      subtitle: '',
      date: '',
      description: '',
    };
    onChange([...items, newItem]);
  };

  const updateItem = (id: string, field: keyof AdditionalItem, value: string) => {
    onChange(
      items.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  };

  const deleteItem = (id: string) => {
    onChange(items.filter((i) => i.id !== id));
  };

  return (
    <div id="section-additional" className="space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div>
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Additional Sections (Optional)
          </span>
          <p className="text-[11px] text-slate-500">
            Awards, Languages, Volunteer Work, Publications, and Interests.
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => addItem('award')}
            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs font-medium"
          >
            + Award
          </button>
          <button
            type="button"
            onClick={() => addItem('language')}
            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs font-medium"
          >
            + Language
          </button>
          <button
            type="button"
            onClick={() => addItem('volunteer')}
            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs font-medium"
          >
            + Volunteer
          </button>
          <button
            type="button"
            onClick={() => addItem('publication')}
            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs font-medium"
          >
            + Publication
          </button>
          <button
            type="button"
            onClick={() => addItem('interest')}
            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs font-medium"
          >
            + Interest
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-5 bg-slate-50 border border-dashed border-slate-300 rounded-lg p-3">
          <Layers className="w-6 h-6 text-slate-400 mx-auto mb-1" />
          <p className="text-xs text-slate-500">
            Click any button above to add optional awards, spoken languages, volunteer experience, or publications.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-white border border-slate-200 rounded-lg p-3.5 space-y-2.5">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                    {item.type}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => deleteItem(item.id)}
                  className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-0.5">Title / Subject</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateItem(item.id, 'title', e.target.value)}
                    placeholder={
                      item.type === 'language'
                        ? 'e.g. English (Native), Spanish (Fluent)'
                        : item.type === 'award'
                        ? 'e.g. Hackathon 1st Place Winner'
                        : 'Title'
                    }
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-0.5">
                    Organization / Details (Optional)
                  </label>
                  <input
                    type="text"
                    value={item.subtitle}
                    onChange={(e) => updateItem(item.id, 'subtitle', e.target.value)}
                    placeholder="e.g. TechCorp Annual Summit"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-0.5">Date / Year (Optional)</label>
                  <input
                    type="text"
                    value={item.date}
                    onChange={(e) => updateItem(item.id, 'date', e.target.value)}
                    placeholder="e.g. 2023"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-0.5">Description (Optional)</label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    placeholder="Brief description..."
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
