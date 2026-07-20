import { useLocalStorage } from './useLocalStorage';
import { DEFAULT_SETTINGS, LS_KEYS } from '../constants';
import type { Settings } from '../types';

export function useSettings() {
  return useLocalStorage<Settings>(LS_KEYS.settings, DEFAULT_SETTINGS);
}
