import React from 'react';
import './App.css';
import { AppState, Holiday, Schedule } from './types';
import { FAMILY_MEMBERS, LOCATIONS } from './constants';
import { HolidaySelector } from './components/HolidaySelector';
import { Calendar } from './components/Calendar';
import { ScheduleModal } from './components/ScheduleModal';
import { ExportButton } from './components/ExportButton';
import { DataManager } from './components/DataManager';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  const [appData, setAppData] = useLocalStorage<AppState>('familyScheduleData', {
    familyMembers: FAMILY_MEMBERS,
    locations: LOCATIONS,
    schedules: [],
    holidays: [],
    selectedHoliday: null,
    selectedDateRange: null,
  });

  const [modalState, setModalState] = React.useState<{
    isOpen: boolean;
    memberId: string;
    date: string;
  }>({
    isOpen: false,
    memberId: '',
    date: '',
  });

  const handleHolidaySelect = (holiday: Holiday) => {
    setAppData(prev => ({
      ...prev,
      selectedHoliday: holiday,
      selectedDateRange: null,
    }));
  };

  const handleCustomDateChange = (start: string, end: string) => {
    setAppData(prev => ({
      ...prev,
      selectedHoliday: null,
      selectedDateRange: { start, end },
    }));
  };

  const handleScheduleClick = (memberId: string, date: string) => {
    setModalState({
      isOpen: true,
      memberId,
      date,
    });
  };

  const handleScheduleSave = (scheduleData: Omit<Schedule, 'id'>) => {
    const existingSchedule = appData.schedules.find(
      s => s.memberId === scheduleData.memberId && s.date === scheduleData.date
    );

    if (existingSchedule) {
      setAppData(prev => ({
        ...prev,
        schedules: prev.schedules.map(s =>
          s.id === existingSchedule.id
            ? { ...scheduleData, id: existingSchedule.id }
            : s
        ),
      }));
    } else {
      const newSchedule: Schedule = {
        ...scheduleData,
        id: Date.now().toString(),
      };
      setAppData(prev => ({
        ...prev,
        schedules: [...prev.schedules, newSchedule],
      }));
    }
  };

  const handleScheduleDelete = (scheduleId: string) => {
    setAppData(prev => ({
      ...prev,
      schedules: prev.schedules.filter(s => s.id !== scheduleId),
    }));
  };

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  const currentPeriod = appData.selectedHoliday || appData.selectedDateRange;
  const existingSchedule = appData.schedules.find(
    s => s.memberId === modalState.memberId && s.date === modalState.date
  );

  const handleLoadData = (newData: AppState) => {
    setAppData(newData);
  };

  const handleClearData = () => {
    setAppData({
      familyMembers: FAMILY_MEMBERS,
      locations: LOCATIONS,
      schedules: [],
      holidays: [],
      selectedHoliday: null,
      selectedDateRange: null,
    });
  };

  return (
    <div className="app">
      <h1>家族スケジュール管理アプリ</h1>
      
      <HolidaySelector
        selectedHoliday={appData.selectedHoliday}
        onHolidaySelect={handleHolidaySelect}
        customDateRange={appData.selectedDateRange}
        onCustomDateChange={handleCustomDateChange}
      />

      {currentPeriod && (
        <>
          <div id="calendar-for-export">
            <Calendar
              startDate={
                appData.selectedHoliday?.startDate || 
                appData.selectedDateRange?.start || ''
              }
              endDate={
                appData.selectedHoliday?.endDate || 
                appData.selectedDateRange?.end || ''
              }
              schedules={appData.schedules}
              onScheduleClick={handleScheduleClick}
            />
          </div>

          <div className="action-buttons">
            <ExportButton 
              targetElementId="calendar-for-export"
              filename={`family-schedule-${
                appData.selectedHoliday?.name || 'custom'
              }.jpg`}
            />
          </div>
        </>
      )}

      <DataManager
        appState={appData}
        onLoadData={handleLoadData}
        onClearData={handleClearData}
      />

      <ScheduleModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        memberId={modalState.memberId}
        date={modalState.date}
        existingSchedule={existingSchedule}
        onSave={handleScheduleSave}
        onDelete={handleScheduleDelete}
      />
    </div>
  );
}

export default App
