import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { FamilyMember, Location, Schedule } from '../types';
import { FAMILY_MEMBERS, LOCATIONS, DEFAULT_ACTIVITIES } from '../constants';
import { getDateDisplayName } from '../utils/dateUtils';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberId: string;
  date: string;
  existingSchedule?: Schedule;
  onSave: (schedule: Omit<Schedule, 'id'>) => void;
  onDelete?: (scheduleId: string) => void;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  memberId,
  date,
  existingSchedule,
  onSave,
  onDelete,
}) => {
  const [activity, setActivity] = useState('');
  const [customActivity, setCustomActivity] = useState('');
  const [locationId, setLocationId] = useState('1');
  const [isCustomActivity, setIsCustomActivity] = useState(false);

  const member = FAMILY_MEMBERS.find(m => m.id === memberId);
  const selectedLocation = LOCATIONS.find(l => l.id === locationId);

  useEffect(() => {
    if (existingSchedule) {
      const isCustom = !DEFAULT_ACTIVITIES.includes(existingSchedule.activity);
      setIsCustomActivity(isCustom);
      if (isCustom) {
        setCustomActivity(existingSchedule.activity);
        setActivity('');
      } else {
        setActivity(existingSchedule.activity);
        setCustomActivity('');
      }
      setLocationId(existingSchedule.locationId);
    } else {
      setActivity(DEFAULT_ACTIVITIES[0]);
      setCustomActivity('');
      setLocationId('1');
      setIsCustomActivity(false);
    }
  }, [existingSchedule, isOpen]);

  const handleSave = () => {
    const finalActivity = isCustomActivity ? customActivity : activity;
    if (!finalActivity.trim()) return;

    onSave({
      memberId,
      date,
      activity: finalActivity.trim(),
      locationId,
    });
    onClose();
  };

  const handleDelete = () => {
    if (existingSchedule && onDelete) {
      onDelete(existingSchedule.id);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            {member?.name}さんの予定 - {getDateDisplayName(date)}
          </h3>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>予定内容:</label>
            <div className="activity-selection">
              <div className="activity-tabs">
                <button
                  className={!isCustomActivity ? 'active' : ''}
                  onClick={() => setIsCustomActivity(false)}
                >
                  定番から選択
                </button>
                <button
                  className={isCustomActivity ? 'active' : ''}
                  onClick={() => setIsCustomActivity(true)}
                >
                  自由入力
                </button>
              </div>

              {!isCustomActivity ? (
                <select 
                  value={activity} 
                  onChange={(e) => setActivity(e.target.value)}
                  className="activity-select"
                >
                  {DEFAULT_ACTIVITIES.map(act => (
                    <option key={act} value={act}>{act}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={customActivity}
                  onChange={(e) => setCustomActivity(e.target.value)}
                  placeholder="予定を入力してください"
                  className="custom-activity-input"
                />
              )}
            </div>
          </div>

          <div className="form-group">
            <label>泊まる場所:</label>
            <div className="location-selection">
              {LOCATIONS.map(location => (
                <label key={location.id} className="location-option">
                  <input
                    type="radio"
                    name="location"
                    value={location.id}
                    checked={locationId === location.id}
                    onChange={(e) => setLocationId(e.target.value)}
                  />
                  <div 
                    className="location-color"
                    style={{ backgroundColor: location.color }}
                  ></div>
                  <span>{location.name}</span>
                </label>
              ))}
            </div>
          </div>

          {selectedLocation && (
            <div className="preview">
              <h4>プレビュー:</h4>
              <div 
                className="preview-cell"
                style={{ backgroundColor: selectedLocation.color }}
              >
                <div className="activity">
                  {isCustomActivity ? customActivity : activity}
                </div>
                <div className="location-tag">
                  {selectedLocation.name}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <div className="button-group">
            {existingSchedule && onDelete && (
              <button 
                className="delete-button"
                onClick={handleDelete}
              >
                削除
              </button>
            )}
            <button className="cancel-button" onClick={onClose}>
              キャンセル
            </button>
            <button 
              className="save-button" 
              onClick={handleSave}
              disabled={!((isCustomActivity && customActivity.trim()) || (!isCustomActivity && activity))}
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};