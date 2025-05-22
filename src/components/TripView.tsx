import React, { useState } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { DayBlock } from './DayBlock';
import { useTrip } from '../contexts/TripContext';
import { DayBlock as DayBlockType, Activity } from '../types';
import { Plus, Settings } from 'lucide-react';
import { ActivityFormModal } from './ActivityFormModal';
import { DayFormModal } from './DayFormModal';
import { AISettingsModal } from './AISettingsModal';
import { AIActivityGenerator } from './AIActivityGenerator';

export const TripView: React.FC = () => {
  const { 
    currentTrip,
    apiKey,
    setApiKey,
    addDay,
    updateDay,
    deleteDay,
    reorderDays,
    addActivity,
    updateActivity,
    deleteActivity,
    reorderActivities
  } = useTrip();

  const [dayToEdit, setDayToEdit] = useState<DayBlockType | null>(null);
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);
  
  const [activityToEdit, setActivityToEdit] = useState<{
    dayId: string;
    activity: Activity | null;
  }>({ dayId: '', activity: null });
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  
  const [isAISettingsModalOpen, setIsAISettingsModalOpen] = useState(false);
  
  const [aiGeneratorState, setAIGeneratorState] = useState<{
    isOpen: boolean;
    dayId: string;
    dayTitle: string;
    dayLocation: string;
  }>({
    isOpen: false,
    dayId: '',
    dayTitle: '',
    dayLocation: ''
  });

  if (!currentTrip) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">No hay viaje seleccionado</h2>
        <p className="text-gray-500 mb-6">Selecciona un viaje existente o crea uno nuevo para comenzar.</p>
      </div>
    );
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !currentTrip) return;
    
    const items = Array.from(currentTrip.days);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    reorderDays(currentTrip.id, items.map(item => item.id));
  };

  const handleAddDay = () => {
    setDayToEdit(null);
    setIsDayModalOpen(true);
  };

  const handleEditDay = (day: DayBlockType) => {
    setDayToEdit(day);
    setIsDayModalOpen(true);
  };

  const handleDayFormSubmit = (day: Partial<DayBlockType>) => {
    if (!currentTrip) return;
    
    if (dayToEdit) {
      updateDay(currentTrip.id, dayToEdit.id, day);
    } else {
      addDay(currentTrip.id, {
        date: day.date || '',
        title: day.title || '',
        location: day.location || '',
        activities: []
      });
    }
    
    setIsDayModalOpen(false);
  };

  const handleAddActivity = (dayId: string) => {
    setActivityToEdit({ dayId, activity: null });
    setIsActivityModalOpen(true);
  };

  const handleEditActivity = (dayId: string, activity: Activity) => {
    setActivityToEdit({ dayId, activity });
    setIsActivityModalOpen(true);
  };

  const handleActivityFormSubmit = (activity: Partial<Activity>) => {
    if (!currentTrip || !activityToEdit.dayId) return;
    
    if (activityToEdit.activity) {
      updateActivity(
        currentTrip.id, 
        activityToEdit.dayId, 
        activityToEdit.activity.id, 
        activity
      );
    } else {
      addActivity(currentTrip.id, activityToEdit.dayId, {
        title: activity.title || '',
        description: activity.description || '',
        time: activity.time,
        location: activity.location,
        links: activity.links
      });
    }
    
    setIsActivityModalOpen(false);
  };
  
  const handleOpenAIGenerator = (dayId: string) => {
    const day = currentTrip.days.find(d => d.id === dayId);
    if (!day) return;
    
    setAIGeneratorState({
      isOpen: true,
      dayId,
      dayTitle: day.title,
      dayLocation: day.location
    });
  };
  
  const handleGenerateActivity = (activity: Partial<Activity>) => {
    if (!currentTrip || !aiGeneratorState.dayId) return;
    
    addActivity(currentTrip.id, aiGeneratorState.dayId, {
      title: activity.title || '',
      description: activity.description || '',
      time: activity.time || '',
      location: activity.location || '',
      links: activity.links || []
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{currentTrip.title}</h1>
          {currentTrip.description && (
            <p className="text-gray-600 mt-2">{currentTrip.description}</p>
          )}
          {(currentTrip.startDate || currentTrip.endDate) && (
            <p className="text-sm text-gray-500 mt-1">
              {currentTrip.startDate && `Desde: ${currentTrip.startDate}`}
              {currentTrip.startDate && currentTrip.endDate && ' • '}
              {currentTrip.endDate && `Hasta: ${currentTrip.endDate}`}
            </p>
          )}
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setIsAISettingsModalOpen(true)}
            className="inline-flex items-center px-3 py-2 font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            title="Configuración de IA"
          >
            <Settings size={18} />
          </button>
          
          <button
            onClick={handleAddDay}
            className="inline-flex items-center px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            <Plus size={18} className="mr-1" />
            Añadir día
          </button>
        </div>
      </div>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="days">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {currentTrip.days.length > 0 ? (
                currentTrip.days.map((day, index) => (
                  <DayBlock
                    key={day.id}
                    day={day}
                    index={index}
                    onEdit={handleEditDay}
                    onDelete={(dayId) => deleteDay(currentTrip.id, dayId)}
                    onAddActivity={handleAddActivity}
                    onGenerateActivity={handleOpenAIGenerator}
                    onEditActivity={handleEditActivity}
                    onDeleteActivity={(dayId, activityId) => 
                      deleteActivity(currentTrip.id, dayId, activityId)
                    }
                    onReorderActivities={(dayId, activityIds) => 
                      reorderActivities(currentTrip.id, dayId, activityIds)
                    }
                  />
                ))
              ) : (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <h3 className="text-xl font-medium text-gray-700 mb-4">
                    No hay días en este itinerario
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Comienza añadiendo un día a tu itinerario para organizar tus actividades.
                  </p>
                  <button
                    onClick={handleAddDay}
                    className="inline-flex items-center px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    <Plus size={18} className="mr-1" />
                    Añadir primer día
                  </button>
                </div>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      
      {currentTrip.days.length > 0 && (
        <div className="mt-8 text-center">
          <button
            onClick={handleAddDay}
            className="inline-flex items-center px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            <Plus size={18} className="mr-1" />
            Añadir día
          </button>
        </div>
      )}
      
      {isDayModalOpen && (
        <DayFormModal
          day={dayToEdit}
          isOpen={isDayModalOpen}
          onClose={() => setIsDayModalOpen(false)}
          onSubmit={handleDayFormSubmit}
        />
      )}
      
      {isActivityModalOpen && (
        <ActivityFormModal
          activity={activityToEdit.activity}
          isOpen={isActivityModalOpen}
          onClose={() => setIsActivityModalOpen(false)}
          onSubmit={handleActivityFormSubmit}
        />
      )}
      
      {isAISettingsModalOpen && (
        <AISettingsModal
          isOpen={isAISettingsModalOpen}
          onClose={() => setIsAISettingsModalOpen(false)}
          onSave={setApiKey}
          currentApiKey={apiKey}
        />
      )}
      
      {aiGeneratorState.isOpen && (
        <AIActivityGenerator
          isOpen={aiGeneratorState.isOpen}
          onClose={() => setAIGeneratorState(prev => ({ ...prev, isOpen: false }))}
          onGenerate={handleGenerateActivity}
          dayTitle={aiGeneratorState.dayTitle}
          dayLocation={aiGeneratorState.dayLocation}
          apiKey={apiKey}
        />
      )}
    </div>
  );
};
