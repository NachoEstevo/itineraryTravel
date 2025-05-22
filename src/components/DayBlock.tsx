import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { DayBlock as DayBlockType, Activity } from '../types';
import { ActivityBlock } from './ActivityBlock';
import { cn, formatDate } from '../lib/utils';
import { ChevronDown, ChevronUp, Plus, Pencil, Trash2, GripVertical, Sparkles } from 'lucide-react';

interface DayBlockProps {
  day: DayBlockType;
  index: number;
  onEdit: (day: DayBlockType) => void;
  onDelete: (dayId: string) => void;
  onAddActivity: (dayId: string) => void;
  onGenerateActivity: (dayId: string) => void;
  onEditActivity: (dayId: string, activity: Activity) => void;
  onDeleteActivity: (dayId: string, activityId: string) => void;
  onReorderActivities: (dayId: string, activityIds: string[]) => void;
}

export const DayBlock: React.FC<DayBlockProps> = ({
  day,
  index,
  onEdit,
  onDelete,
  onAddActivity,
  onGenerateActivity,
  onEditActivity,
  onDeleteActivity,
  onReorderActivities
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(day.activities);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    onReorderActivities(day.id, items.map(item => item.id));
  };

  return (
    <Draggable draggableId={day.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={cn(
            "bg-white rounded-lg shadow mb-6 overflow-hidden",
            snapshot.isDragging && "shadow-lg"
          )}
        >
          <div className="border-b">
            <div className="flex items-center justify-between p-4">
              <div className="flex-1">
                <div className="flex items-center">
                  <div {...provided.dragHandleProps} className="mr-3 text-gray-400 cursor-grab">
                    <GripVertical size={20} />
                  </div>
                  <div>
                    <h2 className="font-bold text-xl text-gray-900">
                      {day.title}
                    </h2>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <span className="font-medium">{formatDate(day.date)}</span>
                      <span className="mx-2">•</span>
                      <span>{day.location}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onGenerateActivity(day.id)}
                  className="p-1.5 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-full transition-colors"
                  aria-label="Generar actividad con IA"
                  title="Generar actividad con IA"
                >
                  <Sparkles size={18} />
                </button>
                <button
                  onClick={() => onAddActivity(day.id)}
                  className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
                  aria-label="Añadir actividad"
                >
                  <Plus size={18} />
                </button>
                <button
                  onClick={() => onEdit(day)}
                  className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  aria-label="Editar día"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => onDelete(day.id)}
                  className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  aria-label="Eliminar día"
                >
                  <Trash2 size={18} />
                </button>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label={isExpanded ? "Contraer" : "Expandir"}
                >
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
              </div>
            </div>
          </div>
          
          {isExpanded && (
            <div className="p-4">
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId={`day-${day.id}`}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {day.activities.length > 0 ? (
                        day.activities.map((activity, index) => (
                          <ActivityBlock
                            key={activity.id}
                            activity={activity}
                            index={index}
                            onEdit={(activity) => onEditActivity(day.id, activity)}
                            onDelete={(activityId) => onDeleteActivity(day.id, activityId)}
                          />
                        ))
                      ) : (
                        <div className="text-center py-6 text-gray-500">
                          No hay actividades para este día.
                          <div className="mt-2 flex justify-center space-x-2">
                            <button
                              onClick={() => onAddActivity(day.id)}
                              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                            >
                              <Plus size={16} className="mr-1" />
                              Añadir actividad
                            </button>
                            <button
                              onClick={() => onGenerateActivity(day.id)}
                              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600"
                            >
                              <Sparkles size={16} className="mr-1" />
                              Generar con IA
                            </button>
                          </div>
                        </div>
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
              
              {day.activities.length > 0 && (
                <div className="mt-4 text-center flex justify-center space-x-2">
                  <button
                    onClick={() => onAddActivity(day.id)}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    <Plus size={16} className="mr-1" />
                    Añadir actividad
                  </button>
                  <button
                    onClick={() => onGenerateActivity(day.id)}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600"
                  >
                    <Sparkles size={16} className="mr-1" />
                    Generar con IA
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};
