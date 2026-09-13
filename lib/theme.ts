export const Colors = {
  primary: { 50: '#eef7ff', 100: '#d9ecff', 200: '#bcdfff', 300: '#8ecbff', 400: '#59adff', 500: '#338df5', 600: '#1d6fe6', 700: '#1759cc', 800: '#194aa3', 900: '#1a4280' },
  secondary: { 50: '#ecfeff', 100: '#cffafe', 200: '#a5f3fc', 300: '#67e8f9', 400: '#22d3ee', 500: '#06b6d4', 600: '#0891b2', 700: '#0e7490', 800: '#155e75', 900: '#164e63' },
  accent: { 50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 300: '#fdba74', 400: '#fb923c', 500: '#f97316', 600: '#ea580c', 700: '#c2410c', 800: '#9a3412', 900: '#7c2d12' },
  success: { 50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac', 400: '#4ade80', 500: '#22c55e', 600: '#16a34a', 700: '#15803d', 800: '#166534', 900: '#14532d' },
  warning: { 50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d', 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309', 800: '#92400e', 900: '#78350f' },
  error: { 50: '#fef2f2', 100: '#fee2e2', 200: '#fecaca', 300: '#fca5a5', 400: '#f87171', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c', 800: '#991b1b', 900: '#7f1d1d' },
  neutral: { 0: '#ffffff', 50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1', 400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155', 800: '#1e293b', 900: '#0f172a', 950: '#020617' },
};

export type ThemeColors = typeof Colors;

export function getWeatherGradient(weatherCode: number, isDay: boolean): [string, string] {
  if (!isDay) return ['#0f172a', '#1e293b'];
  if (weatherCode <= 1) return ['#0ea5e9', '#38bdf8'];
  if (weatherCode <= 3) return ['#64748b', '#94a3b8'];
  if (weatherCode === 45 || weatherCode === 48) return ['#94a3b8', '#cbd5e1'];
  if (weatherCode >= 51 && weatherCode <= 67) return ['#475569', '#64748b'];
  if (weatherCode >= 71 && weatherCode <= 77) return ['#cbd5e1', '#e2e8f0'];
  if (weatherCode >= 80 && weatherCode <= 82) return ['#334155', '#475569'];
  if (weatherCode >= 95) return ['#1e293b', '#334155'];
  return ['#0ea5e9', '#38bdf8'];
}

export function getSeverityColor(severity: string): string {
  switch (severity) { case 'info': return Colors.secondary[500]; case 'warning': return Colors.warning[500]; case 'severe': return Colors.accent[600]; case 'extreme': return Colors.error[600]; default: return Colors.neutral[500]; }
}

export function getSeverityBg(severity: string): string {
  switch (severity) { case 'info': return Colors.secondary[50]; case 'warning': return Colors.warning[50]; case 'severe': return Colors.accent[50]; case 'extreme': return Colors.error[50]; default: return Colors.neutral[100]; }
}

export function getUVLevel(uv: number): { label: string; color: string } {
  if (uv <= 2) return { label: 'Low', color: Colors.success[500] };
  if (uv <= 5) return { label: 'Moderate', color: Colors.warning[500] };
  if (uv <= 7) return { label: 'High', color: Colors.accent[500] };
  if (uv <= 10) return { label: 'Very High', color: Colors.error[500] };
  return { label: 'Extreme', color: Colors.error[700] };
}
