import { Cloud, CloudDrizzle, CloudFog, CloudRain, CloudSnow, CloudLightning, Sun, CloudSun, Moon, CloudMoon, Wind, Droplets } from 'lucide-react-native';
import { Colors } from '@/lib/theme';

interface WeatherIconProps {
  icon: string;
  size?: number;
  color?: string;
  isDay?: boolean;
}

export function WeatherIcon({ icon, size = 24, color, isDay = true }: WeatherIconProps) {
  const iconColor = color || Colors.neutral[700];

  switch (icon) {
    case 'sun':
      return isDay ? <Sun size={size} color={iconColor} strokeWidth={2} /> : <Moon size={size} color={iconColor} strokeWidth={2} />;
    case 'cloud-sun':
      return isDay ? <CloudSun size={size} color={iconColor} strokeWidth={2} /> : <CloudMoon size={size} color={iconColor} strokeWidth={2} />;
    case 'cloud':
      return <Cloud size={size} color={iconColor} strokeWidth={2} />;
    case 'fog':
      return <CloudFog size={size} color={iconColor} strokeWidth={2} />;
    case 'drizzle':
      return <CloudDrizzle size={size} color={iconColor} strokeWidth={2} />;
    case 'rain':
      return <CloudRain size={size} color={iconColor} strokeWidth={2} />;
    case 'snow':
      return <CloudSnow size={size} color={iconColor} strokeWidth={2} />;
    case 'thunderstorm':
      return <CloudLightning size={size} color={iconColor} strokeWidth={2} />;
    case 'wind':
      return <Wind size={size} color={iconColor} strokeWidth={2} />;
    default:
      return <Cloud size={size} color={iconColor} strokeWidth={2} />;
  }
}
