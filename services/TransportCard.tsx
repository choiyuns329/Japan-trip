import React from 'react';
import { Bus, Train, Car, Trash2, MapPin } from 'lucide-react';
import { Transportation } from '../types';

interface TransportCardProps {
  transport: Transportation;
  onUpdate: (updated: Transportation) => void;
  onDelete: (id: string) => void;
}

export const TransportCard: React.FC<TransportCardProps> = ({ transport, onUpdate, onDelete }) => {
  const getIcon = () => {
    switch (transport.type) {
      case 'train': return <Train className="w-5 h-5" />;
      case 'rental': return <Car className="w-5 h-5" />;
      default: return <Bus className="w-5 h-5" />;
    }
  };

  const getLabel = () => {
       switch (transport.type) {
      case 'train': return '기차/지하철';
      case 'rental': return '렌터카';
      case 'taxi': return '택시';
      case 'bus': return '버스';
      default: return '기타';
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onUpdate({ ...transport, [name]: name === 'price' || name === 'cost' ? Number(value) : value });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-3 flex items-start gap-3 hover:shadow-md transition-shadow">
      <div className={`p-2.5 rounded-full flex-shrink-0 ${transport.type === 'rental' ? 'bg-amber-100 text-amber-600' : 'bg-purple-100 text-purple-600'}`}>
        {getIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
            <select 
                name="type" 
                value={transport.type} 
                onChange={handleChange}
                className="text-xs font-bold text-gray-500 bg-transparent uppercase tracking-wider outline-none cursor-pointer hover:text-gray-700"
            >
                <option value="rental">렌터카</option>
                <option value="train">기차</option>
                <option value="bus">버스</option>
                <option value="taxi">택시</option>
                <option value="other">기타</option>
            </select>
             <button onClick={() => onDelete(transport.id)} className="text-gray-300 hover:text-red-500">
                <Trash2 className="w-3.5 h-3.5" />
            </button>
        </div>
        
        <input 
            type="text" 
            name="details"
            value={transport.details}
            onChange={handleChange}
            className="block w-full font-medium text-gray-800 bg-transparent outline-none mb-1"
            placeholder="상세 정보 (예: 유레일 패스)"
        />

        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
            <MapPin className="w-3 h-3" />
             <input 
                type="text" 
                name="pickupLocation"
                value={transport.pickupLocation}
                onChange={handleChange}
                className="w-full bg-transparent outline-none"
                placeholder="탑승/픽업 위치"
            />
        </div>

         <div className="flex items-center gap-2">
             <label className="text-xs text-gray-400">비용:</label>
             <input 
                type="number" 
                name="cost"
                value={transport.cost}
                onChange={handleChange}
                className="w-20 text-xs font-mono bg-gray-50 rounded px-1 py-0.5 outline-none"
            />
            <span className="text-xs text-gray-400">원</span>
        </div>
      </div>
    </div>
  );
};