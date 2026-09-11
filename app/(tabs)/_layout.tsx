import { Tabs } from 'expo-router';
import { MessageCircle, Cloud, AlertTriangle, BarChart3, Settings, Target, ClipboardList } from 'lucide-react-native';
import { Colors } from '@/lib/theme';
import { useApp } from '@/lib/AppContext';
import { t } from '@/lib/languages';

export default function TabLayout() {
  const { preferences } = useApp();
  const lang = preferences?.language || 'en';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary[600],
        tabBarInactiveTintColor: Colors.neutral[400],
        tabBarStyle: {
          backgroundColor: Colors.neutral[0],
          borderTopColor: Colors.neutral[200],
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.chat', lang),
          tabBarIcon: ({ size, color }) => (
            <MessageCircle size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="mission"
        options={{
          title: 'Mission',
          tabBarIcon: ({ size, color }) => (
            <Target size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="weather"
        options={{
          title: t('tabs.weather', lang),
          tabBarIcon: ({ size, color }) => (
            <Cloud size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: t('tabs.alerts', lang),
          tabBarIcon: ({ size, color }) => (
            <AlertTriangle size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="plans"
        options={{
          title: 'Plans',
          tabBarIcon: ({ size, color }) => (
            <ClipboardList size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="climate"
        options={{
          title: t('tabs.climate', lang),
          tabBarIcon: ({ size, color }) => (
            <BarChart3 size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('tabs.settings', lang),
          tabBarIcon: ({ size, color }) => (
            <Settings size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  );
}
