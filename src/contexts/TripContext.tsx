import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Trip, DayBlock, Activity } from '../types';
import { generateId } from '../lib/utils';

interface TripContextType {
  trips: Trip[];
  currentTrip: Trip | null;
  apiKey: string;
  setApiKey: (key: string) => void;
  addTrip: (trip: Omit<Trip, 'id'>) => void;
  updateTrip: (tripId: string, trip: Partial<Trip>) => void;
  deleteTrip: (tripId: string) => void;
  setCurrentTrip: (tripId: string) => void;
  addDay: (tripId: string, day: Omit<DayBlock, 'id'>) => void;
  updateDay: (tripId: string, dayId: string, day: Partial<DayBlock>) => void;
  deleteDay: (tripId: string, dayId: string) => void;
  reorderDays: (tripId: string, dayIds: string[]) => void;
  addActivity: (tripId: string, dayId: string, activity: Omit<Activity, 'id'>) => void;
  updateActivity: (tripId: string, dayId: string, activityId: string, activity: Partial<Activity>) => void;
  deleteActivity: (tripId: string, dayId: string, activityId: string) => void;
  reorderActivities: (tripId: string, dayId: string, activityIds: string[]) => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

interface TripProviderProps {
  children: ReactNode;
  initialTrips: Trip[];
  onTripsChange: (trips: Trip[]) => void;
}

export function TripProvider({ children, initialTrips, onTripsChange }: TripProviderProps) {
  const [trips, setTrips] = useState<Trip[]>(initialTrips);
  const [currentTripId, setCurrentTripId] = useState<string | null>(
    initialTrips.length > 0 ? initialTrips[0].id : null
  );
  const [apiKey, setApiKey] = useState<string>(() => {
    // Intentar recuperar la API key del localStorage
    try {
      const savedKey = localStorage.getItem('openai_api_key');
      return savedKey || '';
    } catch (e) {
      return '';
    }
  });

  // Guardar la API key en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('openai_api_key', apiKey);
  }, [apiKey]);

  // Actualizar el estado externo cuando cambian los viajes
  useEffect(() => {
    onTripsChange(trips);
  }, [trips, onTripsChange]);

  const currentTrip = trips.find(trip => trip.id === currentTripId) || null;

  const addTrip = (trip: Omit<Trip, 'id'>) => {
    const newTrip = { ...trip, id: generateId() };
    setTrips([...trips, newTrip]);
    setCurrentTripId(newTrip.id);
  };

  const updateTrip = (tripId: string, updatedTrip: Partial<Trip>) => {
    setTrips(trips.map(trip => 
      trip.id === tripId ? { ...trip, ...updatedTrip } : trip
    ));
  };

  const deleteTrip = (tripId: string) => {
    setTrips(trips.filter(trip => trip.id !== tripId));
    if (currentTripId === tripId) {
      setCurrentTripId(trips.length > 0 ? trips[0].id : null);
    }
  };

  const setCurrentTrip = (tripId: string) => {
    setCurrentTripId(tripId);
  };

  const addDay = (tripId: string, day: Omit<DayBlock, 'id'>) => {
    const newDay = { ...day, id: generateId() };
    setTrips(trips.map(trip => 
      trip.id === tripId 
        ? { ...trip, days: [...trip.days, newDay] } 
        : trip
    ));
  };

  const updateDay = (tripId: string, dayId: string, updatedDay: Partial<DayBlock>) => {
    setTrips(trips.map(trip => 
      trip.id === tripId 
        ? { 
            ...trip, 
            days: trip.days.map(day => 
              day.id === dayId 
                ? { ...day, ...updatedDay } 
                : day
            ) 
          } 
        : trip
    ));
  };

  const deleteDay = (tripId: string, dayId: string) => {
    setTrips(trips.map(trip => 
      trip.id === tripId 
        ? { ...trip, days: trip.days.filter(day => day.id !== dayId) } 
        : trip
    ));
  };

  const reorderDays = (tripId: string, dayIds: string[]) => {
    setTrips(trips.map(trip => {
      if (trip.id !== tripId) return trip;
      
      const reorderedDays = dayIds.map(id => 
        trip.days.find(day => day.id === id)!
      );
      
      return { ...trip, days: reorderedDays };
    }));
  };

  const addActivity = (tripId: string, dayId: string, activity: Omit<Activity, 'id'>) => {
    const newActivity = { ...activity, id: generateId() };
    setTrips(trips.map(trip => 
      trip.id === tripId 
        ? { 
            ...trip, 
            days: trip.days.map(day => 
              day.id === dayId 
                ? { ...day, activities: [...day.activities, newActivity] } 
                : day
            ) 
          } 
        : trip
    ));
  };

  const updateActivity = (
    tripId: string, 
    dayId: string, 
    activityId: string, 
    updatedActivity: Partial<Activity>
  ) => {
    setTrips(trips.map(trip => 
      trip.id === tripId 
        ? { 
            ...trip, 
            days: trip.days.map(day => 
              day.id === dayId 
                ? { 
                    ...day, 
                    activities: day.activities.map(activity => 
                      activity.id === activityId 
                        ? { ...activity, ...updatedActivity } 
                        : activity
                    ) 
                  } 
                : day
            ) 
          } 
        : trip
    ));
  };

  const deleteActivity = (tripId: string, dayId: string, activityId: string) => {
    setTrips(trips.map(trip => 
      trip.id === tripId 
        ? { 
            ...trip, 
            days: trip.days.map(day => 
              day.id === dayId 
                ? { 
                    ...day, 
                    activities: day.activities.filter(
                      activity => activity.id !== activityId
                    ) 
                  } 
                : day
            ) 
          } 
        : trip
    ));
  };

  const reorderActivities = (tripId: string, dayId: string, activityIds: string[]) => {
    setTrips(trips.map(trip => {
      if (trip.id !== tripId) return trip;
      
      return {
        ...trip,
        days: trip.days.map(day => {
          if (day.id !== dayId) return day;
          
          const reorderedActivities = activityIds.map(id => 
            day.activities.find(activity => activity.id === id)!
          );
          
          return { ...day, activities: reorderedActivities };
        })
      };
    }));
  };

  return (
    <TripContext.Provider
      value={{
        trips,
        currentTrip,
        apiKey,
        setApiKey,
        addTrip,
        updateTrip,
        deleteTrip,
        setCurrentTrip,
        addDay,
        updateDay,
        deleteDay,
        reorderDays,
        addActivity,
        updateActivity,
        deleteActivity,
        reorderActivities,
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
}
