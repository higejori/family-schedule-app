import React from 'react';
import { Holiday } from '../types';
import { DEFAULT_HOLIDAYS } from '../constants';
import { formatDate } from '../utils/dateUtils';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface HolidaySelectorProps {
  selectedHoliday: Holiday | null;
  onHolidaySelect: (holiday: Holiday) => void;
  customDateRange: { start: string; end: string } | null;
  onCustomDateChange: (start: string, end: string) => void;
}

export const HolidaySelector: React.FC<HolidaySelectorProps> = ({
  selectedHoliday,
  onHolidaySelect,
  customDateRange,
  onCustomDateChange,
}) => {
  const [customHolidays, setCustomHolidays] = useLocalStorage<Holiday[]>('customHolidays', []);
  const [isCustomMode, setIsCustomMode] = React.useState(false);
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [editingHoliday, setEditingHoliday] = React.useState<Holiday | null>(null);
  const [editStartDate, setEditStartDate] = React.useState('');
  const [editEndDate, setEditEndDate] = React.useState('');

  // カスタマイズされた休暇期間と元の期間を統合した配列を作成
  const getEffectiveHolidays = (): Holiday[] => {
    const customizedMap = new Map(customHolidays.map(h => [h.id, h]));
    return DEFAULT_HOLIDAYS.map(holiday => customizedMap.get(holiday.id) || holiday);
  };

  const handleCustomSubmit = () => {
    if (startDate && endDate) {
      onCustomDateChange(startDate, endDate);
    }
  };

  const handleEditStart = (holiday: Holiday) => {
    setEditingHoliday(holiday);
    const existingCustom = customHolidays.find(h => h.id === holiday.id);
    const targetHoliday = existingCustom || holiday;
    setEditStartDate(targetHoliday.startDate);
    setEditEndDate(targetHoliday.endDate);
  };

  const handleEditSubmit = () => {
    if (editingHoliday && editStartDate && editEndDate) {
      const updatedHoliday: Holiday = {
        ...editingHoliday,
        startDate: editStartDate,
        endDate: editEndDate,
      };
      
      // カスタマイズされた期間として保存
      const updatedCustomHolidays = customHolidays.filter(h => h.id !== editingHoliday.id);
      setCustomHolidays([...updatedCustomHolidays, updatedHoliday]);
      
      // 現在選択中の休暇の場合は更新
      if (selectedHoliday?.id === editingHoliday.id) {
        onHolidaySelect(updatedHoliday);
      }
      
      setEditingHoliday(null);
      setEditStartDate('');
      setEditEndDate('');
    }
  };

  const handleEditCancel = () => {
    setEditingHoliday(null);
    setEditStartDate('');
    setEditEndDate('');
  };

  const handleResetToDefault = (holiday: Holiday) => {
    // カスタマイズを削除して元の期間に戻す
    const updatedCustomHolidays = customHolidays.filter(h => h.id !== holiday.id);
    setCustomHolidays(updatedCustomHolidays);
    
    // 現在選択中の休暇の場合はデフォルトに戻す
    if (selectedHoliday?.id === holiday.id) {
      const defaultHoliday = DEFAULT_HOLIDAYS.find(h => h.id === holiday.id);
      if (defaultHoliday) {
        onHolidaySelect(defaultHoliday);
      }
    }
  };

  return (
    <div className="holiday-selector">
      <h2>長期休暇の選択</h2>
      
      <div className="selector-tabs">
        <button 
          className={!isCustomMode ? 'active' : ''}
          onClick={() => setIsCustomMode(false)}
        >
          定番の休暇
        </button>
        <button 
          className={isCustomMode ? 'active' : ''}
          onClick={() => setIsCustomMode(true)}
        >
          カスタム期間
        </button>
      </div>

      {!isCustomMode ? (
        <div className="holiday-options">
          {getEffectiveHolidays().map((holiday) => {
            const isCustomized = customHolidays.some(h => h.id === holiday.id);
            const isEditing = editingHoliday?.id === holiday.id;
            
            return (
              <div key={holiday.id} className="holiday-option-container">
                {isEditing ? (
                  <div className="holiday-edit-form">
                    <div className="holiday-name">{holiday.name}</div>
                    <div className="edit-inputs">
                      <label>
                        開始日:
                        <input
                          type="date"
                          value={editStartDate}
                          onChange={(e) => setEditStartDate(e.target.value)}
                        />
                      </label>
                      <label>
                        終了日:
                        <input
                          type="date"
                          value={editEndDate}
                          onChange={(e) => setEditEndDate(e.target.value)}
                        />
                      </label>
                    </div>
                    <div className="edit-buttons">
                      <button 
                        className="save-edit-btn"
                        onClick={handleEditSubmit}
                        disabled={!editStartDate || !editEndDate}
                      >
                        保存
                      </button>
                      <button 
                        className="cancel-edit-btn"
                        onClick={handleEditCancel}
                      >
                        キャンセル
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={`holiday-option ${
                    selectedHoliday?.id === holiday.id ? 'selected' : ''
                  } ${isCustomized ? 'customized' : ''}`}>
                    <div 
                      className="holiday-content"
                      onClick={() => onHolidaySelect(holiday)}
                    >
                      <div className="holiday-name">
                        {holiday.name}
                        {isCustomized && <span className="custom-indicator"> (編集済み)</span>}
                      </div>
                      <div className="holiday-dates">
                        {formatDate(holiday.startDate)} ～ {formatDate(holiday.endDate)}
                      </div>
                    </div>
                    <div className="holiday-actions">
                      <button 
                        className="edit-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditStart(holiday);
                        }}
                        title="期間を編集"
                      >
                        ✏️
                      </button>
                      {isCustomized && (
                        <button 
                          className="reset-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleResetToDefault(holiday);
                          }}
                          title="デフォルトに戻す"
                        >
                          🔄
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="custom-date-input">
          <div className="date-inputs">
            <label>
              開始日:
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </label>
            <label>
              終了日:
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </label>
          </div>
          <button 
            className="apply-custom-dates"
            onClick={handleCustomSubmit}
            disabled={!startDate || !endDate}
          >
            期間を適用
          </button>
        </div>
      )}

      {(selectedHoliday || customDateRange) && (
        <div className="selected-period">
          <h3>選択中の期間:</h3>
          <p>
            {selectedHoliday 
              ? `${selectedHoliday.name} (${formatDate(selectedHoliday.startDate)} ～ ${formatDate(selectedHoliday.endDate)})`
              : customDateRange 
              ? `${formatDate(customDateRange.start)} ～ ${formatDate(customDateRange.end)}`
              : ''
            }
          </p>
        </div>
      )}
    </div>
  );
};