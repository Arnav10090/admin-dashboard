"use client";

import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import KpiCard from './KpiCard';
import AddKpiCardForm from './AddKpiCardForm';
import EditKpiCardForm from './EditKpiCardForm';
import KpiDetailModal from './KpiDetailModal';
import FabAddCard from './FabAddCard';
import ConfirmationDialog from './ConfirmationDialog';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface KpiCardData {
  id: string;
  name: string;
  benchmark: number;
  minValue: number;
  maxValue: number;
  order: number;
  achieved?: number;
  date?: string;
  isDefault?: boolean;
}

const fetchKpiCards = async (): Promise<KpiCardData[]> => {
  // For testing, we'll use a test user ID
  const userId = 'test-user-id';
  const res = await fetch(`/api/kpi-cards?userId=${userId}`);
  if (!res.ok) {
    const errorText = await res.text();
    console.error('Error fetching KPI cards:', res.status, errorText);
    throw new Error('Failed to fetch KPI cards');
  }
  return res.json();
};

const updateCardOrder = async (id: string, order: number) => {
  await fetch(`/api/kpi-cards/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ order }),
  });
};

function SortableKpiCard({ card, ...props }: { card: KpiCardData } & React.ComponentProps<typeof KpiCard>) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
    id: card.id,
  });
  
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition as string | undefined,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative' as const,
    zIndex: isDragging ? 100 : 1,
  };
  
  // Filter out role from attributes to prevent button-like behavior
  const { role, ...filteredAttributes } = attributes;
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative"
    >
      <div className="relative">
        {/* Drag handle - only on the top edge of the card */}
        <div 
          className="absolute top-0 left-0 right-0 h-6 cursor-grab active:cursor-grabbing z-20"
          {...listeners}
          {...filteredAttributes}
        >
          <div className="absolute left-1/2 top-2 w-8 h-1 bg-gray-300 rounded-full transform -translate-x-1/2" />
        </div>
        
        {/* Card content */}
        <div className="relative z-10">
          <KpiCard 
            {...props}
            // Always show date filter for all cards
            showDateFilter={true}
          />
        </div>
      </div>
    </div>
  );
}

export const KpiGrid: React.FC = () => {
  const [cards, setCards] = useState<KpiCardData[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<KpiCardData | null>(null);
  const [cardToDelete, setCardToDelete] = useState<string | null>(null);

  const refreshCards = async () => {
    const updatedCards = await fetchKpiCards();
    setCards(updatedCards);
    return updatedCards;
  };

  const handleCardClick = (card: KpiCardData) => {
    setSelectedCard(card);
    setDetailOpen(true);
  };

  const handleEditClick = async (card: KpiCardData) => {
    const updatedCards = await refreshCards();
    const freshCardData = updatedCards.find(c => c.id === card.id) || card;
    setSelectedCard(freshCardData);
    setShowEdit(true);
  };

  const handleCardUpdated = (cardName: string) => {
    refreshCards();
    setShowEdit(false);
    toast.success(`${cardName} updated successfully!`);
  };

  useEffect(() => {
    refreshCards();
  }, []);

  const handleDelete = (id: string) => {
    setCardToDelete(id);
  };

  const confirmDelete = async () => {
    if (!cardToDelete) return;
    const cardName = cards.find(c => c.id === cardToDelete)?.name || 'Card';
    const toastId = toast.loading('Deleting card...');
    
    try {
      const response = await fetch(`/api/kpi-cards/${cardToDelete}`, { 
        method: 'DELETE' 
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete card');
      }
      
      await refreshCards();
      toast.success(`${cardName} deleted successfully!`, { id: toastId });
    } catch (error) {
      console.error('Error deleting card:', error);
      toast.error('Failed to delete card', { id: toastId });
    } finally {
      setCardToDelete(null);
    }
  };

  // DnD Kit setup
  const sensors = useSensors(useSensor(PointerSensor));
  const cardIds = cards.sort((a, b) => a.order - b.order).map(card => card.id);

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = cards.findIndex(card => card.id === active.id);
      const newIndex = cards.findIndex(card => card.id === over.id);
      const newCards = arrayMove(cards, oldIndex, newIndex).map((card, idx) => ({ ...card, order: idx }));
      setCards(newCards);
      // Persist new order in backend
      for (const card of newCards) {
        await updateCardOrder(card.id, card.order);
      }
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-extrabold text-black">KPI Cards</h2>
        {/* Hide old Add Card button, use FAB instead */}
        {/* <button
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
          onClick={() => setShowAdd(true)}
        >
          + Add Card
        </button> */}
      </div>
      {showAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <AddKpiCardForm
            onCardAdded={refreshCards}
            onClose={() => setShowAdd(false)}
          />
        </div>
      )}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={cards.map(card => card.id)} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
            {[...cards]
              .sort((a: KpiCardData, b: KpiCardData) => a.order - b.order)
              .map((card: KpiCardData) => {
                const achieved = card.achieved ?? 0;
                const yieldPercent = card.benchmark ? ((achieved - card.benchmark) / card.benchmark) * 100 : 0;
                return (
                  <SortableKpiCard
                    key={card.id}
                    card={card}
                    name={card.name}
                    benchmark={card.benchmark}
                    achieved={achieved}
                    yieldPercent={yieldPercent}
                    minValue={card.minValue}
                    maxValue={card.maxValue}
                    onDelete={() => handleDelete(card.id)}
                    onClick={() => handleCardClick(card)}
                    onEdit={() => handleEditClick(card)}
                  />
                );
              })}
          </div>
        </SortableContext>
      </DndContext>
      <KpiDetailModal open={detailOpen} onClose={() => setDetailOpen(false)} card={selectedCard} />
      
      {showEdit && selectedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <EditKpiCardForm
            card={selectedCard}
            onCardUpdated={handleCardUpdated}
            onClose={() => setShowEdit(false)}
          />
        </div>
      )}
      
      <FabAddCard onClick={() => setShowAdd(true)} />
      
      <ConfirmationDialog
        isOpen={!!cardToDelete}
        onClose={() => setCardToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Card"
        message="Are you sure you want to delete this card? This action cannot be undone."
        confirmText="Yes, delete card"
        cancelText="Cancel"
      />
    </div>
  );
};

export default KpiGrid; 