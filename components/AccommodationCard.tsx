import React from 'react';
import { Home, Trash2, Calendar, MapPin } from 'lucide-react';
import { Accommodation } from '../types';

interface AccommodationCardProps {
  accommodation: Accommodation;
  onUpdate: (updated: Accommodation) => void;
  onDelete: (id: string) => void;
}

export const AccommodationCard: React.FC<AccommodationCardProps> = ({ accommodation, onUpdate, onDelete }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onUpdate({ ...accommodation, [name]: name === 'price' ? Number(value) : value });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
            <Home className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-800 text-lg">숙소 정보</h3>
        </div>
        <button onClick={() => onDelete(accommodation.id)} className="text-gray-400 hover:text-red-500">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">호텔/숙소명</label>
          <input
            type="text"
            name="name"
            value={accommodation.name}
            onChange={handleChange}
            className="w-full text-lg font-semibold border-b border-gray-200 focus:border-emerald-500 outline-none py-1"
            placeholder="호텔 이름을 입력하세요"
          />
        </div>

        <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
                type="text"
                name="address"
                value={accommodation.address}
                onChange={handleChange}
                className="w-full text-sm text-gray-600 bg-transparent outline-none"
                placeholder="주소"
            />
        </div>

        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg">
            <div>
                <span className="text-xs text-gray-500 block mb-1">체크인</span>
                <input 
                    type="datetime-local" 
                    name="checkIn"
                    value={accommodation.checkIn}
                    onChange={handleChange}
                    className="bg-transparent text-sm w-full outline-none"
                />
            </div>
            <div>
                <span className="text-xs text-gray-500 block mb-1">체크아웃</span>
                <input 
                    type="datetime-local" 
                    name="checkOut"
                    value={accommodation.checkOut}
                    onChange={handleChange}
                    className="bg-transparent text-sm w-full outline-none"
                />
            </div>
        </div>

        <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">가격 (원)</label>
            <input
                type="number"
                name="price"
                value={accommodation.price}
                onChange={handleChange}
                className="w-full font-mono text-sm bg-gray-50 rounded px-2 py-1 outline-none"
            />
        </div>
        
        <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">메모</label>
            <textarea
                name="notes"
                value={accommodation.notes}
                onChange={handleChange}
                rows={2}
                className="w-full text-sm border border-gray-200 rounded p-2 focus:border-emerald-500 outline-none resize-none"
                placeholder="예약 번호나 특이사항..."
            />
        </div>
      </div>
    </div>
  );
};