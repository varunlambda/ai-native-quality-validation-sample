import { useState, useRef, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/datepicker.css';
import type { SearchFilters } from '../types';

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
  initialFilters?: SearchFilters;
}

const LOCATIONS = [
  { city: 'Malibu', state: 'California', country: 'United States' },
  { city: 'Brooklyn', state: 'New York', country: 'United States' },
  { city: 'Austin', state: 'Texas', country: 'United States' },
  { city: 'Aspen', state: 'Colorado', country: 'United States' },
  { city: 'Miami Beach', state: 'Florida', country: 'United States' },
  { city: 'San Francisco', state: 'California', country: 'United States' },
  { city: 'Honolulu', state: 'Hawaii', country: 'United States' },
  { city: 'Scottsdale', state: 'Arizona', country: 'United States' },
  { city: 'Las Vegas', state: 'Nevada', country: 'United States' },
  { city: 'New Orleans', state: 'Louisiana', country: 'United States' },
  { city: 'Denver', state: 'Colorado', country: 'United States' },
  { city: 'Los Angeles', state: 'California', country: 'United States' },
  { city: 'Seoul', state: 'South Korea', country: 'South Korea' },
  { city: 'Ghaziabad', state: 'Uttar Pradesh', country: 'India' },
  { city: 'Delhi', state: 'Delhi', country: 'India' },
];

const SearchBar = ({ onSearch, initialFilters }: SearchBarProps) => {
  const [location, setLocation] = useState(initialFilters?.city || '');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState(LOCATIONS);
  const [checkIn, setCheckIn] = useState<Date | null>(initialFilters?.checkIn || null);
  const [checkOut, setCheckOut] = useState<Date | null>(initialFilters?.checkOut || null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [pets, setPets] = useState(0);
  const [showGuestPicker, setShowGuestPicker] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);

  const locationRef = useRef<HTMLDivElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);
  const guestRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
      if (dateRef.current && !dateRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
      if (guestRef.current && !guestRef.current.contains(event.target as Node)) {
        setShowGuestPicker(false);
      }
      setActiveField(null);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocationChange = (value: string) => {
    setLocation(value);

    if (value.trim()) {
      const filtered = LOCATIONS.filter(
        (loc) =>
          loc.city.toLowerCase().includes(value.toLowerCase()) ||
          loc.state.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations(LOCATIONS);
    }
  };

  const selectLocation = (loc: typeof LOCATIONS[0]) => {
    setLocation(`${loc.city}, ${loc.state}`);
    setShowLocationDropdown(false);
  };

  const totalGuests = adults + children;

  const guestText = () => {
    if (totalGuests === 0) return 'Add guests';
    const parts = [];
    if (totalGuests > 0) parts.push(`${totalGuests} guest${totalGuests > 1 ? 's' : ''}`);
    if (infants > 0) parts.push(`${infants} infant`);
    if (pets > 0) parts.push(`${pets} pet`);
    return parts.join(', ');
  };

  const handleSearch = () => {
    const filters: SearchFilters = {};

    if (location) filters.city = location.split(',')[0].trim();
    if (checkIn) filters.checkIn = checkIn;
    if (checkOut) filters.checkOut = checkOut;
    if (totalGuests > 0) filters.guests = totalGuests;

    onSearch(filters);

    setShowLocationDropdown(false);
    setShowDatePicker(false);
    setShowGuestPicker(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto mb-10">
      <div className="bg-white rounded-full shadow-md border border-gray-200 hover:shadow-xl transition duration-300">

        <div className="flex items-center divide-x divide-gray-200">

          {/* LOCATION */}

          <div ref={locationRef} className="flex-1 relative">

            <div
              className="px-6 py-4 cursor-pointer hover:bg-gray-50 rounded-l-full transition"
              onClick={() => {
                setActiveField('location');
                setShowLocationDropdown(true);
                locationInputRef.current?.focus();
              }}
            >
              <label className="text-xs font-semibold text-gray-800">
                Where
              </label>

              <input
                ref={locationInputRef}
                type="text"
                placeholder="Search destinations"
                value={location}
                onChange={(e) => handleLocationChange(e.target.value)}
                className="w-full outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent mt-1"
              />
            </div>

            {showLocationDropdown && (
              <div className="absolute top-full mt-3 left-0 bg-white rounded-2xl shadow-2xl border border-gray-200 py-4 z-50 w-96">

                <div className="px-6 pb-2 text-xs font-semibold text-gray-500 uppercase">
                  Popular destinations
                </div>

                <div className="max-h-80 overflow-y-auto">

                  {filteredLocations.map((loc, index) => (

                    <button
                      key={index}
                      onClick={() => selectLocation(loc)}
                      className="w-full px-6 py-3 hover:bg-gray-50 transition text-left flex items-center space-x-4"
                    >
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        📍
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {loc.city}
                        </p>
                        <p className="text-xs text-gray-500">
                          {loc.state}, {loc.country}
                        </p>
                      </div>

                    </button>
                  ))}

                </div>
              </div>
            )}

          </div>

          {/* DATES */}

          <div ref={dateRef} className="flex-1 relative">

            <div
              className="px-6 py-4 cursor-pointer hover:bg-gray-50 transition"
              onClick={() => setShowDatePicker(true)}
            >
              <label className="text-xs font-semibold text-gray-800">
                Check in – Check out
              </label>

              <div className="text-sm text-gray-600 mt-1">
                {checkIn
                  ? `${checkIn.toLocaleDateString()} - ${checkOut?.toLocaleDateString() || ''}`
                  : 'Add dates'}
              </div>
            </div>

            {showDatePicker && (

              <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 bg-white rounded-3xl shadow-2xl z-50 p-6">

                <DatePicker
                  selected={checkIn}
                  onChange={(dates) => {
                    const [start, end] = dates as [Date | null, Date | null];
                    setCheckIn(start);
                    setCheckOut(end);
                  }}
                  startDate={checkIn}
                  endDate={checkOut}
                  selectsRange
                  monthsShown={2}
                  inline
                />

              </div>

            )}

          </div>

          {/* GUESTS */}

          <div ref={guestRef} className="flex-1 relative">

            <div
              className="px-6 py-4 cursor-pointer hover:bg-gray-50 rounded-r-full transition flex items-center justify-between"
              onClick={() => setShowGuestPicker(true)}
            >
              <div>

                <label className="text-xs font-semibold text-gray-800">
                  Who
                </label>

                <div className="text-sm text-gray-600 mt-1">
                  {guestText()}
                </div>

              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSearch();
                }}
                className="bg-airbnb-red text-white rounded-full p-4 hover:bg-red-600 transition shadow-md"
              >
                <FaSearch />
              </button>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default SearchBar;
