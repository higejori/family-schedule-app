import React from 'react';
import { Save, Upload, Trash2 } from 'lucide-react';
import { AppState } from '../types';

interface DataManagerProps {
  appState: AppState;
  onLoadData: (data: AppState) => void;
  onClearData: () => void;
}

export const DataManager: React.FC<DataManagerProps> = ({
  appState,
  onLoadData,
  onClearData,
}) => {
  const [savedSchedules, setSavedSchedules] = React.useState<Array<{
    id: string;
    name: string;
    data: AppState;
    savedAt: string;
  }>>([]);

  React.useEffect(() => {
    const saved = localStorage.getItem('savedSchedules');
    if (saved) {
      try {
        setSavedSchedules(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load saved schedules:', error);
      }
    }
  }, []);

  const saveCurrentSchedule = () => {
    const name = prompt('スケジュールに名前を付けてください:');
    if (!name) return;

    const newSchedule = {
      id: Date.now().toString(),
      name,
      data: appState,
      savedAt: new Date().toLocaleString('ja-JP'),
    };

    const updated = [...savedSchedules, newSchedule];
    setSavedSchedules(updated);
    localStorage.setItem('savedSchedules', JSON.stringify(updated));
    
    alert('スケジュールを保存しました！');
  };

  const loadSchedule = (schedule: typeof savedSchedules[0]) => {
    if (confirm(`「${schedule.name}」を読み込みますか？現在のデータは上書きされます。`)) {
      onLoadData(schedule.data);
      alert('スケジュールを読み込みました！');
    }
  };

  const deleteSchedule = (id: string) => {
    if (confirm('この保存済みスケジュールを削除しますか？')) {
      const updated = savedSchedules.filter(s => s.id !== id);
      setSavedSchedules(updated);
      localStorage.setItem('savedSchedules', JSON.stringify(updated));
    }
  };

  const clearAllData = () => {
    if (confirm('すべてのデータを削除しますか？この操作は取り消せません。')) {
      onClearData();
      setSavedSchedules([]);
      localStorage.removeItem('savedSchedules');
      localStorage.removeItem('familyScheduleData');
      alert('すべてのデータを削除しました。');
    }
  };

  return (
    <div className="data-manager">
      <div className="action-buttons">
        <button 
          className="action-button save-data-button"
          onClick={saveCurrentSchedule}
        >
          <Save size={20} />
          現在のスケジュールを保存
        </button>
        
        <button 
          className="action-button" 
          style={{ background: '#e74c3c' }}
          onClick={clearAllData}
        >
          <Trash2 size={20} />
          すべてのデータを削除
        </button>
      </div>

      {savedSchedules.length > 0 && (
        <div className="saved-schedules">
          <h3>保存済みスケジュール</h3>
          <div className="schedule-list">
            {savedSchedules.map((schedule) => (
              <div key={schedule.id} className="saved-schedule-item">
                <div className="schedule-info">
                  <div className="schedule-name">{schedule.name}</div>
                  <div className="schedule-date">保存日時: {schedule.savedAt}</div>
                </div>
                <div className="schedule-actions">
                  <button 
                    className="load-button"
                    onClick={() => loadSchedule(schedule)}
                    title="読み込み"
                  >
                    <Upload size={16} />
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => deleteSchedule(schedule.id)}
                    title="削除"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};