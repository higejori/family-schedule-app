import React from 'react';
import { FamilyMember, Location, Schedule } from '../types';
import { getDateDisplayName, getDatesInRange, isSaturday, isSunday } from '../utils/dateUtils';
import { FAMILY_MEMBERS, LOCATIONS } from '../constants';

interface CalendarProps {
  startDate: string;
  endDate: string;
  schedules: Schedule[];
  onScheduleClick: (memberId: string, date: string) => void;
}

export const Calendar: React.FC<CalendarProps> = ({
  startDate,
  endDate,
  schedules,
  onScheduleClick,
}) => {
  const dates = getDatesInRange(startDate, endDate);
  
  const getScheduleForMemberAndDate = (memberId: string, date: string): Schedule | undefined => {
    return schedules.find(s => s.memberId === memberId && s.date === date);
  };

  const getLocationById = (locationId: string): Location | undefined => {
    return LOCATIONS.find(l => l.id === locationId);
  };

  const renderScheduleCell = (member: FamilyMember, date: string) => {
    const schedule = getScheduleForMemberAndDate(member.id, date);
    const location = schedule ? getLocationById(schedule.locationId) : null;
    
    return (
      <td
        key={`${member.id}-${date}`}
        className="schedule-cell"
        style={{
          backgroundColor: location?.color || '#f5f5f5',
          cursor: 'pointer',
        }}
        onClick={() => onScheduleClick(member.id, date)}
        title={`${member.name} - ${getDateDisplayName(date)} クリックで予定入力`}
      >
        <div className="schedule-content">
          {schedule ? (
            <div className="activity">{schedule.activity}</div>
          ) : (
            <div className="empty-schedule">+</div>
          )}
        </div>
      </td>
    );
  };

  return (
    <div className="calendar-container">
      <h2>スケジュール表</h2>
      
      <div className="legend">
        <h4>泊まる場所の色分け:</h4>
        <div className="legend-items">
          {LOCATIONS.map(location => (
            <div key={location.id} className="legend-item">
              <div 
                className="color-box"
                style={{ backgroundColor: location.color }}
              ></div>
              <span>{location.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="calendar-table-container">
        <table className="calendar-table">
          <thead>
            <tr>
              <th className="member-header">家族</th>
              {dates.map(date => {
                let dateHeaderClass = "date-header";
                if (isSaturday(date)) {
                  dateHeaderClass += " saturday";
                } else if (isSunday(date)) {
                  dateHeaderClass += " sunday";
                }
                
                return (
                  <th key={date} className={dateHeaderClass}>
                    {getDateDisplayName(date)}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {FAMILY_MEMBERS.map(member => (
              <tr key={member.id}>
                <td className="member-cell">
                  {member.name}
                </td>
                {dates.map(date => 
                  renderScheduleCell(member, date)
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};