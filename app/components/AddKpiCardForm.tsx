"use client";

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface KpiCard {
  id: string;
  name: string;
  minValue: number;
  maxValue: number;
  benchmark: number;
  order: number;
}

interface AddKpiCardFormProps {
  onCardAdded: () => void;
  onClose: () => void;
}

const AddKpiCardForm: React.FC<AddKpiCardFormProps> = ({ onCardAdded, onClose }) => {
  const [availableCards, setAvailableCards] = useState<KpiCard[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailableCards = async () => {
    try {
      console.log('=== Starting to fetch available KPI cards ===');
      
      // First, get the currently displayed cards
      console.log('1. Fetching currently displayed cards...');
      const displayedCardsResponse = await fetch('/api/kpi-cards');
      if (!displayedCardsResponse.ok) {
        const errorText = await displayedCardsResponse.text();
        console.error('Failed to fetch displayed cards:', errorText);
        throw new Error('Failed to fetch displayed cards');
      }
      const displayedCards = await displayedCardsResponse.json();
      console.log('2. Fetched displayed cards:', displayedCards);
      
      const displayedCardIds = displayedCards.map((card: any) => card.id);
      console.log('3. Extracted displayed card IDs:', displayedCardIds);
      
      // Then get available cards, excluding the ones already displayed
      const url = `/api/kpi-cards/available?displayedCardIds=${displayedCardIds.join(',')}`;
      console.log('4. Requesting available cards from:', url);
      
      const response = await fetch(url);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response from available cards API:', errorText);
        throw new Error('Failed to fetch available cards');
      }
      
      const availableCardsData = await response.json();
      console.log('5. Received available cards:', availableCardsData);
      
      setAvailableCards(availableCardsData);
      setError(null);
      return availableCardsData;
    } catch (error) {
      console.error('Error in fetchAvailableCards:', error);
      setError('Failed to load available KPI cards');
      toast.error('Failed to load available KPI cards');
      throw error; // Re-throw to allow handling in the caller
    }
  };

  // Fetch available KPI cards when component mounts
  useEffect(() => {
    fetchAvailableCards();
  }, []);

  const handleCardSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCardId(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCardId) {
      setError('Please select a KPI card');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Adding card with ID:', selectedCardId);
      
      const response = await fetch(`/api/kpi-cards/${selectedCardId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isVisible: true,
        }),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        console.error('Error response:', responseData);
        throw new Error(responseData.error || 'Failed to add KPI card');
      }

      console.log('Card added successfully:', responseData);
      
      // Refresh the available cards list
      await fetchAvailableCards();
      
      // Reset the form
      setSelectedCardId('');
      
      toast.success('KPI card added successfully!');
      onCardAdded();
      // Don't close the form, just refresh the list
    } catch (err) {
      console.error('Error adding KPI card:', err);
      setError(err instanceof Error ? err.message : 'Failed to add KPI card');
      toast.error('Failed to add KPI card');
    } finally {
      setLoading(false);
    }
  };

  if (availableCards.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col gap-5 w-full max-w-md mx-auto border border-gray-100">
        <div className="flex justify-between items-center border-b pb-3 mb-2">
          <h2 className="text-2xl font-extrabold text-black">Add KPI Card</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p>Loading available cards...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-xl flex flex-col gap-5 w-full max-w-md mx-auto border border-gray-100">
      <div className="flex justify-between items-center border-b pb-3 mb-2">
        <h2 className="text-2xl font-extrabold text-black">Add KPI Card</h2>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          disabled={loading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-1">
        <label htmlFor="cardSelect" className="block text-sm font-medium text-gray-700">Select KPI Card</label>
        <div className="relative">
          <select
            id="cardSelect"
            value={selectedCardId}
            onChange={handleCardSelect}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-black"
            required
            disabled={loading}
          >
            <option value="">-- Select a KPI card --</option>
            {availableCards.map((card) => (
                <option key={card.id} value={card.id}>
                  {card.name}
                </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      {selectedCardId && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-800">
            This card will be added to your dashboard with the predefined settings.
            You can update the achieved value after adding it.
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 p-4 rounded-lg border border-red-100 flex items-start">
          <svg className="h-5 w-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding...
            </>
          ) : (
            'Add KPI Card'
          )}
        </button>
      </div>
    </form>
  );
};

export default AddKpiCardForm;