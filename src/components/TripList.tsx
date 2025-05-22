import React, { useState } from 'react';
import { Trip } from '../types';
import { useTrip } from '../contexts/TripContext';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { TripFormModal } from './TripFormModal';

export const TripList: React.FC = () => {
  const { trips, currentTrip, setCurrentTrip, addTrip, updateTrip, deleteTrip } = useTrip();
  const [tripToEdit, setTripToEdit] = useState<Trip | null>(null);
  const [isTripModalOpen, setIsTripModalOpen] = useState(false);

  const handleAddTrip = () => {
    setTripToEdit(null);
    setIsTripModalOpen(true);
  };

  const handleEditTrip = (trip: Trip) => {
    setTripToEdit(trip);
    setIsTripModalOpen(true);
  };

  const handleTripFormSubmit = (trip: Partial<Trip>) => {
    if (tripToEdit) {
      updateTrip(tripToEdit.id, trip);
    } else {
      addTrip({
        title: trip.title || 'Nuevo Viaje',
        description: trip.description,
        startDate: trip.startDate,
        endDate: trip.endDate,
        days: []
      });
    }
    
    setIsTripModalOpen(false);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Mis Viajes</h2>
        <button
          onClick={handleAddTrip}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          <Plus size={16} className="mr-1" />
          Nuevo Viaje
        </button>
      </div>
      
      <div className="p-4">
        {trips.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {trips.map(trip => (
              <li key={trip.id} className="py-3">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setCurrentTrip(trip.id)}
                    className={`flex-1 text-left px-3 py-2 rounded-md ${
                      currentTrip?.id === trip.id
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium">{trip.title}</div>
                    {(trip.startDate || trip.endDate) && (
                      <div className="text-xs text-gray-500 mt-1">
                        {trip.startDate && `Desde: ${trip.startDate}`}
                        {trip.startDate && trip.endDate && ' • '}
                        {trip.endDate && `Hasta: ${trip.endDate}`}
                      </div>
                    )}
                  </button>
                  
                  <div className="flex items-center ml-2">
                    <button
                      onClick={() => handleEditTrip(trip)}
                      className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                      aria-label="Editar viaje"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => deleteTrip(trip.id)}
                      className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      aria-label="Eliminar viaje"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-6 text-gray-500">
            No hay viajes creados.
            <div className="mt-2">
              <button
                onClick={handleAddTrip}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                <Plus size={16} className="mr-1" />
                Crear primer viaje
              </button>
            </div>
          </div>
        )}
      </div>
      
      {isTripModalOpen && (
        <TripFormModal
          trip={tripToEdit}
          isOpen={isTripModalOpen}
          onClose={() => setIsTripModalOpen(false)}
          onSubmit={handleTripFormSubmit}
        />
      )}
    </div>
  );
};
