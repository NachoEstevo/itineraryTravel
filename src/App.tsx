import { TripProvider } from './contexts/TripContext';
import { TripList } from './components/TripList';
import { TripView } from './components/TripView';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Trip } from './types';
import { parseItinerario } from './lib/itinerarioParser';

function App() {
 
  const initialTrip = parseItinerario();
  
  const [savedTrips, setSavedTrips] = useLocalStorage<Trip[]>('trips', [initialTrip]);
  
  return (
    <TripProvider initialTrips={savedTrips} onTripsChange={setSavedTrips}>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold text-gray-900">TRVL Itinerary</h1>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <TripList />
            </div>
            <div className="lg:col-span-3">
              <TripView />
            </div>
          </div>
        </main>
        
        <footer className="bg-white border-t mt-12 py-6">
          <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} TRVL Itinerary - Plan, organize, and share your trips with ease.
          </div>
        </footer>
      </div>
    </TripProvider>
  );
}

export default App;
