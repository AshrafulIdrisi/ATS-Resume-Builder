import React from 'react';
import { CertificationItem } from '../../types';
import { Plus, Trash2, Award } from 'lucide-react';

interface CertificationsFormProps {
  certifications: CertificationItem[];
  onChange: (items: CertificationItem[]) => void;
}

export const CertificationsForm: React.FC<CertificationsFormProps> = ({ certifications, onChange }) => {
  const addCert = () => {
    const newItem: CertificationItem = {
      id: 'cert-' + Date.now(),
      name: '',
      issuer: '',
      issueDate: '',
      url: '',
    };
    onChange([...certifications, newItem]);
  };

  const updateCert = (id: string, field: keyof CertificationItem, value: string) => {
    onChange(
      certifications.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const deleteCert = (id: string) => {
    onChange(certifications.filter((c) => c.id !== id));
  };

  return (
    <div id="section-certifications" className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Certifications & Licenses ({certifications.length})
          </span>
          <p className="text-[11px] text-slate-500">Add AWS, Google, PMP, Scrum, or professional credentials.</p>
        </div>
        <button
          type="button"
          onClick={addCert}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Certification
        </button>
      </div>

      {certifications.length === 0 ? (
        <div className="text-center py-6 bg-slate-50 border border-dashed border-slate-300 rounded-lg p-4">
          <Award className="w-8 h-8 text-slate-400 mx-auto mb-1.5" />
          <p className="text-xs text-slate-600">No certifications listed yet.</p>
          <button
            type="button"
            onClick={addCert}
            className="mt-2 text-xs text-blue-700 font-semibold hover:underline"
          >
            + Add Credential
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {certifications.map((cert) => (
            <div key={cert.id} className="bg-white border border-slate-200 rounded-lg p-3.5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-blue-600" />
                  {cert.name || 'New Credential'}
                </span>
                <button
                  type="button"
                  onClick={() => deleteCert(cert.id)}
                  className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Certification Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) => updateCert(cert.id, 'name', e.target.value)}
                    placeholder="e.g. AWS Certified Solutions Architect"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-900 focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Issuing Organization <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={cert.issuer}
                    onChange={(e) => updateCert(cert.id, 'issuer', e.target.value)}
                    placeholder="e.g. Amazon Web Services (AWS)"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-900 focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Issue Date / Year</label>
                  <input
                    type="text"
                    value={cert.issueDate}
                    onChange={(e) => updateCert(cert.id, 'issueDate', e.target.value)}
                    placeholder="e.g. 2023 or Nov 2023"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-900 focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Credential URL (Optional)</label>
                  <input
                    type="text"
                    value={cert.url}
                    onChange={(e) => updateCert(cert.id, 'url', e.target.value)}
                    placeholder="e.g. aws.amazon.com/verify/..."
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-900 focus:ring-1 focus:ring-blue-600"
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
