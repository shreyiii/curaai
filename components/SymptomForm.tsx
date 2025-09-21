import React, { useState } from 'react';
import type { UserInput } from '../types';

interface SymptomFormProps {
  onSubmit: (data: UserInput) => void;
  isLoading: boolean;
}

const SymptomForm: React.FC<SymptomFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<UserInput>({
    age: '',
    gender: 'Prefer not to say',
    symptoms: '',
    duration: '',
    history: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.symptoms.trim() || !formData.age.trim() || !formData.duration.trim()) {
      alert("Please fill in Age, Symptoms, and Duration of illness.");
      return;
    }
    onSubmit(formData);
  };
  
  const inputStyles = "w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-md shadow-sm placeholder-gray-400 transition-colors duration-150 ease-in-out hover:bg-blue-50 focus:ring-blue-500 focus:border-blue-500";


  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">Age</label>
            <input
              type="number"
              name="age"
              id="age"
              value={formData.age}
              onChange={handleChange}
              className={inputStyles}
              placeholder="e.g., 35"
              required
            />
          </div>
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              name="gender"
              id="gender"
              value={formData.gender}
              onChange={handleChange}
              className={inputStyles}
            >
              <option>Prefer not to say</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-1">Symptoms</label>
          <textarea
            name="symptoms"
            id="symptoms"
            rows={4}
            value={formData.symptoms}
            onChange={handleChange}
            className={inputStyles}
            placeholder="e.g., Headache, sore throat, mild fever"
            required
          />
        </div>
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">Duration of Illness</label>
          <input
            type="text"
            name="duration"
            id="duration"
            value={formData.duration}
            onChange={handleChange}
            className={inputStyles}
            placeholder="e.g., 3 days"
            required
          />
        </div>
        <div>
          <label htmlFor="history" className="block text-sm font-medium text-gray-700 mb-1">Medical History (Optional)</label>
          <input
            type="text"
            name="history"
            id="history"
            value={formData.history}
            onChange={handleChange}
            className={inputStyles}
            placeholder="e.g., Diabetes, allergies to penicillin"
          />
        </div>
        <div className="text-right">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-teal-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Analyzing...' : 'Get Advice'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SymptomForm;