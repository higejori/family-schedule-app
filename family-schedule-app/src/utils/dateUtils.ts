import { format, eachDayOfInterval, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';

export const formatDate = (date: string): string => {
  return format(parseISO(date), 'M/d', { locale: ja });
};

export const formatDateWithDay = (date: string): string => {
  return format(parseISO(date), 'M/d(E)', { locale: ja });
};

export const getDatesInRange = (startDate: string, endDate: string): string[] => {
  const dates = eachDayOfInterval({
    start: parseISO(startDate),
    end: parseISO(endDate),
  });
  
  return dates.map(date => format(date, 'yyyy-MM-dd'));
};

export const getDateDisplayName = (date: string): string => {
  const parsedDate = parseISO(date);
  const dayOfWeek = format(parsedDate, 'E', { locale: ja });
  const formattedDate = format(parsedDate, 'M/d', { locale: ja });
  
  return `${formattedDate}(${dayOfWeek})`;
};

export const getDayOfWeek = (date: string): number => {
  // 0: 日曜日, 1: 月曜日, ..., 6: 土曜日
  return parseISO(date).getDay();
};

export const isWeekend = (date: string): boolean => {
  const dayOfWeek = getDayOfWeek(date);
  return dayOfWeek === 0 || dayOfWeek === 6; // 日曜日または土曜日
};

export const isSaturday = (date: string): boolean => {
  return getDayOfWeek(date) === 6;
};

export const isSunday = (date: string): boolean => {
  return getDayOfWeek(date) === 0;
};