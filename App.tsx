import React, { useState, useEffect, useRef } from 'react';
import { 
    Calendar as CalendarIcon, 
    Share2, 
    Users, 
    PlusCircle, 
    Wand2,
    Loader2,
    LogOut
} from 'lucide-react';
import { 
    TripData, 
    initialTripData, 
    Flight, 
    Accommodation, 
    Activity, 
    Transportation 
} from './types';
import { FlightCard } from './components/FlightCard';
import { AccommodationCard } from './components/AccommodationCard';
import { ActivityList } from './components/ActivityList';
import { TransportCard } from './components/TransportCard';
import { BudgetChart } from './components/BudgetChart';
import { generateTripPlan } from './services/geminiService';

// Utility for unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export default function App() {
  const [tripData, setTripData] = useState<TripData>(initialTripData);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [showAiModal, setShowAiModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Persistence
  useEffect(() => {
    // Load Trip Data
    const savedData = localStorage.getItem('tripMateData');
    if (savedData) {
      try {
        setTripData(JSON.parse(savedData));
      } catch (e) {
        console.error("Failed to parse saved trip data");
      }
    }
    // Load User Data
    const savedUser = localStorage.getItem('tripMateUser');
    if (savedUser) {
        try {
            setUser(JSON.parse(savedUser));
        } catch (e) { console.error("Failed to parse user data"); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tripMateData', JSON.stringify(tripData));
  }, [tripData]);

  // Login Handlers
  const handleLogin = () => {
      // Simulate Google Login
      const mockUser: User = {
          id: 'user-' + Math.random().toString(36).substr(2, 9),
          name: '김여행',
          email: 'traveler@example.com',
          avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${Math.floor(Math.random() * 1000)}` 
      };
      setUser(mockUser);
      localStorage.setItem('tripMateUser', JSON.stringify(mockUser));
  };

  const handleLogout = () => {
      setUser(null);
      localStorage.removeItem('tripMateUser');
  };

  // Handlers for updating state deeply
  const updateTripInfo = (field: keyof TripData, value: any) => {
    setTripData(prev => ({ ...prev, [field]: value }));
  };

  const addFlight = (type: 'outbound' | 'inbound') => {
    const newFlight: Flight = {
      id: generateId(),
      type,
      airline: '',
      flightNumber: '',
      departureTime: '',
      arrivalTime: '',
      departureAirport: '',
      arrivalAirport: '',
      price: 0
    };
    setTripData(prev => ({ ...prev, flights: [...prev.flights, newFlight] }));
  };

  const updateFlight = (updated: Flight) => {
    setTripData(prev => ({
      ...prev,
      flights: prev.flights.map(f => f.id === updated.id ? updated : f)
    }));
  };

  const deleteFlight = (id: string) => {
    setTripData(prev => ({
      ...prev,
      flights: prev.flights.filter(f => f.id !== id)
    }));
  };

  const addAccommodation = () => {
    const newAccom: Accommodation = {
      id: generateId(),
      name: '',
      address: '',
      checkIn: '',
      checkOut: '',
      price: 0,
      notes: ''
    };
    setTripData(prev => ({ ...prev, accommodations: [...prev.accommodations, newAccom] }));
  };

  const updateAccommodation = (updated: Accommodation) => {
    setTripData(prev => ({
      ...prev,
      accommodations: prev.accommodations.map(a => a.id === updated.id ? updated : a)
    }));
  };

  const deleteAccommodation = (id: string) => {
    setTripData(prev => ({
      ...prev,
      accommodations: prev.accommodations.filter(a => a.id !== id)
    }));
  };

  const addActivity = () => {
    const newActivity: Activity = {
      id: generateId(),
      day: 1,
      time: '10:00',
      title: '',
      location: '',
      description: '',
      cost: 0
    };
    setTripData(prev => ({ ...prev, activities: [...prev.activities, newActivity] }));
  };

  const updateActivity = (updated: Activity) => {
    setTripData(prev => ({
      ...prev,
      activities: prev.activities.map(a => a.id === updated.id ? updated : a)
    }));
  };

  const deleteActivity = (id: string) => {
    setTripData(prev => ({
      ...prev,
      activities: prev.activities.filter(a => a.id !== id)
    }));
  };

    const addTransport = () => {
    const newTransport: Transportation = {
      id: generateId(),
      type: 'taxi',
      details: '',
      pickupLocation: '',
      cost: 0
    };
    setTripData(prev => ({ ...prev, transportation: [...prev.transportation, newTransport] }));
  };

  const updateTransport = (updated: Transportation) => {
    setTripData(prev => ({
      ...prev,
      transportation: prev.transportation.map(t => t.id === updated.id ? updated : t)
    }));
  };

  const deleteTransport = (id: string) => {
    setTripData(prev => ({
      ...prev,
      transportation: prev.transportation.filter(t => t.id !== id)
    }));
  };

  // AI Generation
  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    const result = await generateTripPlan(aiPrompt, tripData);
    if (result) {
        // Merge strategy: replace list items, keep IDs unique if possible or just use new ones
        setTripData(prev => ({
            ...prev,
            ...result,
            // Ensure strictly valid lists even if AI returns partial
            flights: result.flights || [],
            accommodations: result.accommodations || [],
            activities: result.activities || [],
            transportation: result.transportation || []
        }));
        setShowAiModal(false);
    }
    setIsAiLoading(false);
  };

  // Mock Share
  const handleShare = () => {
      const dataStr = JSON.stringify(tripData);
      const encoded = btoa(unescape(encodeURIComponent(dataStr)));
      // In a real app, this would be a database ID. 
      // Here we just simulate copying a "link" or state.
      navigator.clipboard.writeText(window.location.origin + '#' + encoded);
      alert('여행 계획 링크가 클립보드에 복사되었습니다! (시뮬레이션)');
  };

  if (!user) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-200">
                    <CalendarIcon className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">TripMate</h1>
                <p className="text-gray-500 mb-8">친구들과 함께 만드는 AI 여행 플래너</p>
                
                <button 
                    onClick={handleLogin}
                    className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all hover:shadow-md active:scale-95"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Google 계정으로 계속하기
                </button>
                <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400">
                    <Users className="w-3 h-3" />
                    <span>현재 3명이 함께 계획 중입니다</span>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                <CalendarIcon className="w-5 h-5" />
             </div>
             <input 
                value={tripData.title}
                onChange={(e) => updateTripInfo('title', e.target.value)}
                className="text-xl font-bold text-gray-900 bg-transparent outline-none focus:ring-2 ring-blue-100 rounded px-1 max-w-[150px] sm:max-w-xs"
                placeholder="여행 제목 입력..."
             />
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden md:flex -space-x-2">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-500 overflow-hidden">
                        <img src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${i+10}`} alt="user" className="w-full h-full" />
                    </div>
                ))}
                <button className="w-8 h-8 rounded-full bg-blue-50 border-2 border-white flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors">
                    <PlusCircle className="w-4 h-4" />
                </button>
            </div>
            
            <div className="h-6 w-px bg-gray-200 mx-1 hidden md:block"></div>
            
            <button 
                onClick={() => setShowAiModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full hover:shadow-lg hover:from-purple-600 hover:to-indigo-700 transition-all text-sm font-medium"
            >
                <Wand2 className="w-4 h-4" />
                <span className="hidden sm:inline">AI 자동 계획</span>
            </button>
            <button 
                onClick={handleShare}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                title="친구 초대"
            >
                <Share2 className="w-5 h-5" />
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-2 pl-3 border-l border-gray-200 ml-1">
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200" />
                <div className="hidden sm:flex flex-col items-end">
                    <span className="text-sm font-medium text-gray-700 leading-none">{user.name}</span>
                    <button onClick={handleLogout} className="text-[10px] text-gray-400 hover:text-red-500 flex items-center gap-0.5 mt-0.5">
                        <LogOut className="w-3 h-3" /> 로그아웃
                    </button>
                </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Destination & Dates Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">여행지</label>
                    <input 
                        type="text" 
                        value={tripData.destination}
                        onChange={(e) => updateTripInfo('destination', e.target.value)}
                        className="w-full text-2xl font-bold text-gray-800 placeholder-gray-300 outline-none border-b border-transparent focus:border-blue-500 transition-colors"
                        placeholder="어디로 떠나시나요?"
                    />
                </div>
                <div>
                     <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">시작일</label>
                     <input 
                        type="date"
                        value={tripData.startDate}
                        onChange={(e) => updateTripInfo('startDate', e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                    />
                </div>
                <div>
                     <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">종료일</label>
                     <input 
                        type="date"
                        value={tripData.endDate}
                        onChange={(e) => updateTripInfo('endDate', e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                    />
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Logistics (Flights, Hotels, Transport) - 7 cols */}
            <div className="lg:col-span-7 space-y-8">
                
                {/* Flights Section */}
                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800">항공편</h2>
                        <div className="flex gap-2">
                            <button onClick={() => addFlight('outbound')} className="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 font-medium">
                                + 가는 편
                            </button>
                            <button onClick={() => addFlight('inbound')} className="text-sm bg-orange-50 text-orange-600 px-3 py-1.5 rounded-lg hover:bg-orange-100 font-medium">
                                + 오는 편
                            </button>
                        </div>
                    </div>
                    {tripData.flights.length === 0 && (
                        <div className="bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 p-8 text-center text-gray-500 text-sm">
                            항공편 정보가 없습니다. 버튼을 눌러 추가하세요.
                        </div>
                    )}
                    {tripData.flights.map(f => (
                        <FlightCard 
                            key={f.id} 
                            flight={f} 
                            onUpdate={updateFlight} 
                            onDelete={deleteFlight} 
                        />
                    ))}
                </section>

                {/* Accommodations Section */}
                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800">숙소</h2>
                        <button onClick={addAccommodation} className="text-sm bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg hover:bg-emerald-100 font-medium">
                            + 숙소 추가
                        </button>
                    </div>
                    {tripData.accommodations.length === 0 && (
                        <div className="bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 p-8 text-center text-gray-500 text-sm">
                            머물 곳을 추가해보세요.
                        </div>
                    )}
                    {tripData.accommodations.map(a => (
                        <AccommodationCard 
                            key={a.id} 
                            accommodation={a} 
                            onUpdate={updateAccommodation} 
                            onDelete={deleteAccommodation} 
                        />
                    ))}
                </section>

                {/* Transportation Section */}
                <section>
                    <div className="flex justify-between items-center mb-4">
                         <h2 className="text-xl font-bold text-gray-800">현지 이동 수단</h2>
                        <button onClick={addTransport} className="text-sm bg-purple-50 text-purple-600 px-3 py-1.5 rounded-lg hover:bg-purple-100 font-medium">
                            + 이동편 추가
                        </button>
                    </div>
                    {tripData.transportation.map(t => (
                        <TransportCard
                            key={t.id}
                            transport={t}
                            onUpdate={updateTransport}
                            onDelete={deleteTransport}
                        />
                    ))}
                     {tripData.transportation.length === 0 && (
                        <div className="bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 p-6 text-center text-gray-500 text-sm">
                            렌터카, 기차표 등 이동 수단을 기록하세요.
                        </div>
                    )}
                </section>

            </div>

            {/* Right Column: Activities & Budget - 5 cols */}
            <div className="lg:col-span-5 space-y-8">
                {/* Activity Section */}
                <section className="h-[600px]">
                    <ActivityList 
                        activities={tripData.activities}
                        onUpdate={updateActivity}
                        onDelete={deleteActivity}
                        onAdd={addActivity}
                    />
                </section>
                
                {/* Budget Section */}
                <section className="h-[400px]">
                    <BudgetChart data={tripData} />
                </section>
            </div>
        </div>
      </main>

      {/* AI Modal */}
      {showAiModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
              <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-600"></div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <Wand2 className="w-6 h-6 text-purple-600" />
                      AI 여행 계획 생성기
                  </h3>
                  <p className="text-gray-500 text-sm mb-6">
                      여행지, 기간, 스타일을 입력하면 Gemini가 완벽한 일정과 예산을 제안해드립니다.
                  </p>

                  <textarea
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800 mb-4 focus:ring-2 ring-purple-100 outline-none resize-none h-32"
                      placeholder="예: 3박 4일 오사카 여행, 유니버셜 스튜디오 포함해서 맛집 위주로 짜줘. 예산 150만원."
                  />

                  <div className="flex gap-3 justify-end">
                      <button 
                        onClick={() => setShowAiModal(false)}
                        className="px-5 py-2.5 text-gray-500 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                      >
                          취소
                      </button>
                      <button 
                        onClick={handleAiGenerate}
                        disabled={isAiLoading || !aiPrompt.trim()}
                        className="px-5 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                          {isAiLoading ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                생성 중...
                              </>
                          ) : (
                              <>
                                <Wand2 className="w-4 h-4" />
                                계획 생성하기
                              </>
                          )}
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}