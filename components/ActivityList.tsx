import React, { useState, useEffect } from 'react';
import { Camera, Trash2, MapPin, Clock } from 'lucide-react';
import { Activity } from '../types';

interface ActivityListProps {
  activities: Activity[];
  onUpdate: (updated: Activity) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

const DayInput = ({ day, onUpdate }: { day: number, onUpdate: (d: number) => void }) => {
  const [val, setVal] = useState(day.toString());

  useEffect(() => {
    setVal(day.toString());
  }, [day]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setVal(newVal);
    
    // Allow empty string for better editing UX
    if (newVal === '') return;

    const num = parseInt(newVal);
    if (!isNaN(num) && num > 0) {
      onUpdate(num);
    }
  };

  const handleBlur = () => {
    if (val === '' || isNaN(parseInt(val))) {
      setVal(day.toString());
    }
  };

  return (
    <div className="flex items-center gap-1 bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded transition-colors hover:bg-indigo-200 cursor-pointer">
        <span className="text-xs font-bold">Day</span>
        <input 
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={val}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-6 text-xs font-bold bg-transparent outline-none text-center p-0 focus:ring-0 border-none"
        />
    </div>
  );
};

export const ActivityList: React.FC<ActivityListProps> = ({ activities, onUpdate, onDelete, onAdd }) => {
  const sortedActivities = [...activities].sort((a, b) => {
      if (a.day !== b.day) return a.day - b.day;
      return a.time.localeCompare(b.time);
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 h-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
            <Camera className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-800 text-lg">여행 일정</h3>
        </div>
        <button 
            onClick={onAdd}
            className="text-sm bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full hover:bg-indigo-100 font-medium transition-colors"
        >
            + 추가하기
        </button>
      </div>

      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        {sortedActivities.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm">
                아직 계획된 활동이 없습니다. <br /> AI에게 추천을 받아보세요!
            </div>
        ) : (
            sortedActivities.map((activity) => (
                <div key={activity.id} className="group relative pl-4 border-l-2 border-indigo-100 hover:border-indigo-300 transition-colors pb-6 last:pb-0">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-indigo-200 group-hover:border-indigo-400 transition-colors"></div>
                    
                    <div className="bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 rounded-lg p-3 transition-all group-hover:shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <DayInput 
                                    day={activity.day} 
                                    onUpdate={(newDay) => onUpdate({...activity, day: newDay})} 
                                />
                                <input 
                                    type="time" 
                                    value={activity.time}
                                    onChange={(e) => onUpdate({...activity, time: e.target.value})}
                                    className="text-xs text-gray-500 bg-transparent outline-none"
                                />
                            </div>
                            <button onClick={() => onDelete(activity.id)} className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-opacity">
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        
                        <input
                            type="text"
                            value={activity.title}
                            onChange={(e) => onUpdate({...activity, title: e.target.value})}
                            className="block w-full font-semibold text-gray-800 bg-transparent outline-none mb-1"
                            placeholder="활동 이름"
                        />
                        
                        <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-2">
                            <MapPin className="w-3 h-3" />
                            <input 
                                value={activity.location}
                                onChange={(e) => onUpdate({...activity, location: e.target.value})}
                                className="bg-transparent w-full outline-none"
                                placeholder="장소"
                            />
                        </div>

                        <textarea
                            value={activity.description}
                            onChange={(e) => onUpdate({...activity, description: e.target.value})}
                            rows={2}
                            className="w-full text-xs text-gray-600 bg-transparent outline-none resize-none placeholder-gray-400"
                            placeholder="설명 추가..."
                        />
                         <div className="mt-2 text-right">
                             <span className="text-xs text-gray-400 mr-2">비용:</span>
                             <input 
                                type="number" 
                                value={activity.cost} 
                                onChange={(e) => onUpdate({...activity, cost: Number(e.target.value)})}
                                className="text-xs font-mono w-20 text-right bg-transparent outline-none border-b border-gray-200 focus:border-indigo-300" 
                            />
                             <span className="text-xs text-gray-400 ml-1">원</span>
                         </div>
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
};