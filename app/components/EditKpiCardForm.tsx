"use client";

import React, { useState, useEffect } from 'react';

interface KpiCardData {
  id: string;
  name: string;
  minValue: number;
  maxValue: number;
  benchmark: number;
  order: number;
  achieved?: number;
  date?: string;
}

interface EditKpiCardFormProps {
  card: KpiCardData;
  onCardUpdated: (cardName: string) => void;
  onClose: () => void;
}

const EditKpiCardForm: React.FC<EditKpiCardFormProps> = ({ card, onCardUpdated, onClose }) => {
  const [form, setForm] = useState<KpiCardData>({
    id: card.id,
    name: card.name || '',
    minValue: card.minValue || 0,
    maxValue: card.maxValue || 0,
    benchmark: card.benchmark || 0,
    order: card.order || 0,
    achieved: card.achieved !== undefined ? card.achieved : undefined,
    date: card.date || new Date().toISOString(),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setForm({ ...card });
  }, [card]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (name === 'achieved' && value === '') {
      setForm(f => ({ ...f, [name]: undefined }));
    } else if (type === 'number') {
      setForm(f => ({ ...f, [name]: value === '' ? undefined : Number(value) }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`/api/kpi-cards/${card.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      
      if (!res.ok) throw new Error('Failed to update card');
      
      onCardUpdated(form.name);
      onClose();
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg flex flex-col gap-4 w-full max-w-sm border border-gray-200">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-extrabold text-black">Edit KPI Card</h2>
        <button 
          type="button" 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 cursor-pointer"
          disabled={loading}
        >
          ✕
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium text-gray-700">Card Name</label>
        <input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="minValue" className="text-sm font-medium text-gray-700">Min Value</label>
          <input
            id="minValue"
            name="minValue"
            type="number"
            value={form.minValue}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
            required
          />
        </div>
        
        <div className="flex flex-col gap-1">
          <label htmlFor="maxValue" className="text-sm font-medium text-gray-700">Max Value</label>
          <input
            id="maxValue"
            name="maxValue"
            type="number"
            value={form.maxValue}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="benchmark" className="text-sm font-medium text-gray-700">Benchmark (Target)</label>
        <input
          id="benchmark"
          name="benchmark"
          type="number"
          value={form.benchmark}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="achieved" className="text-sm font-medium text-gray-700">Achieved Value</label>
        <input
          id="achieved"
          name="achieved"
          type="number"
          value={form.achieved ?? ''}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
        />
      </div>

<div className="flex flex-col gap-1">
        <label htmlFor="date" className="text-sm font-medium text-gray-700">Date</label>
        <input
          id="date"
          name="date"
          type="date"
          value={form.date ? new Date(form.date).toISOString().split('T')[0] : ''}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
        />
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex justify-center items-center gap-2 cursor-pointer focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Changes'}
          {loading && (
            <svg className="animate-spin -mr-1 ml-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
        </button>
      </div>
    </form>
  );
};

export default EditKpiCardForm;
