import React from 'react';
import { Plane, Trash2, Clock, MapPin } from 'lucide-react';
import { Flight } from '../types';

interface FlightCardProps {
  flight: Flight;
  onUpdate: (updated: Flight) => void;
  onDelete: (id: string) => void;
}

export const FlightCard: React.FC<FlightCardProps> = ({ flight, onUpdate, onDelete }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onUpdate({ ...flight, [name]: name === 'price' ? Number(value) : value });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${flight.type === 'outbound' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
            <Plane className="w-5 h-5" style={{ transform: flight.type === 'inbound' ? 'rotate(180deg)' : 'none' }} />
          </div>
          <h3 className="font-bold text-gray-800 text-lg">
            {flight.type === 'outbound' ? '가는 편' : '오는 편'}
          </h3>
        </div>
        <button onClick={() => onDelete(flight.id)} className="text-gray-400 hover:text-red-500 transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">항공사</label>
          <input
            type="text"
            name="airline"
            value={flight.airline}
            onChange={handleChange}
            className="w-full text-sm border-b border-gray-200 focus:border-blue-500 outline-none py-1 transition-colors"
            placeholder="예: 대한항공"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">편명</label>
          <input
            type="text"
            name="flightNumber"
            value={flight.flightNumber}
            onChange={handleChange}
            className="w-full text-sm border-b border-gray-200 focus:border-blue-500 outline-none py-1 transition-colors"
            placeholder="KE123"
          />
        </div>
        
        <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                <MapPin className="w-4 h-4 text-gray-400" />
                <div className="flex-1">
                    <input 
                        name="departureAirport" 
                        value={flight.departureAirport} 
                        onChange={handleChange}
                        className="bg-transparent w-full text-sm font-medium outline-none" 
                        placeholder="출발 공항"
                    />
                    <input 
                        type="datetime-local"
                        name="departureTime" 
                        value={flight.departureTime} 
                        onChange={handleChange}
                        className="bg-transparent w-full text-xs text-gray-500 outline-none mt-1" 
                    />
                </div>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                <MapPin className="w-4 h-4 text-gray-400" />
                <div className="flex-1">
                    <input 
                        name="arrivalAirport" 
                        value={flight.arrivalAirport} 
                        onChange={handleChange}
                        className="bg-transparent w-full text-sm font-medium outline-none" 
                        placeholder="도착 공항"
                    />
                    <input 
                        type="datetime-local"
                        name="arrivalTime" 
                        value={flight.arrivalTime} 
                        onChange={handleChange}
                        className="bg-transparent w-full text-xs text-gray-500 outline-none mt-1" 
                    />
                </div>
            </div>
        </div>

        <div className="col-span-1 md:col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">가격 (원)</label>
            <input
                type="number"
                name="price"
                value={flight.price}
                onChange={handleChange}
                className="w-full font-mono text-sm bg-gray-50 rounded px-2 py-1 outline-none focus:ring-1 ring-blue-200"
            />
        </div>
      </div>
    </div>
  );
};