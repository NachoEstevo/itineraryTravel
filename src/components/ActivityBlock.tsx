import { Draggable } from 'react-beautiful-dnd';
import { Activity } from '../types';
import { cn } from '../lib/utils';
import { Pencil, Trash2, GripVertical } from 'lucide-react';

interface ActivityBlockProps {
  activity: Activity;
  index: number;
  onEdit: (activity: Activity) => void;
  onDelete: (activityId: string) => void;
}

export const ActivityBlock: React.FC<ActivityBlockProps> = ({
  activity,
  index,
  onEdit,
  onDelete
}) => {
  return (
    <Draggable draggableId={activity.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={cn(
            "bg-white rounded-lg shadow-sm p-4 mb-3 border-l-4 border-blue-500",
            "hover:shadow-md transition-shadow duration-200",
            snapshot.isDragging && "shadow-lg"
          )}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-medium text-lg text-gray-900">{activity.title}</h3>
              
              {activity.time && (
                <div className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Hora:</span> {activity.time}
                </div>
              )}
              
              {activity.location && (
                <div className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Ubicación:</span> {activity.location}
                </div>
              )}
              
              <div className="mt-2 text-gray-700 whitespace-pre-wrap">
                {activity.description}
              </div>
              
              {activity.links && activity.links.length > 0 && (
                <div className="mt-3">
                  {activity.links.map((link, i) => (
                    <a 
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm mr-3"
                    >
                      {link.text}
                    </a>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => onEdit(activity)}
                className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                aria-label="Editar actividad"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => onDelete(activity.id)}
                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                aria-label="Eliminar actividad"
              >
                <Trash2 size={16} />
              </button>
              <div
                {...provided.dragHandleProps}
                className="p-1.5 text-gray-400 hover:text-gray-600 cursor-grab"
              >
                <GripVertical size={16} />
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};
