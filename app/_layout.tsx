import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from 'expo-font';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { SplashScreen } from 'expo-router';
import { AppProvider } from '@/lib/AppContext';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '@/lib/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();
  const [fontsLoaded, fontError] = useFonts({ 'Inter-Regular': Inter_400Regular, 'Inter-Medium': Inter_500Medium, 'Inter-SemiBold': Inter_600SemiBold, 'Inter-Bold': Inter_700Bold });
  useEffect(() => { if (fontsLoaded || fontError) SplashScreen.hideAsync(); }, [fontsLoaded, fontError]);
  if (!fontsLoaded && !fontError) { return (<View style={styles.loading}><ActivityIndicator size="large" color={Colors.primary[500]} /></View>); }
  return (<AppProvider><Stack screenOptions={{ headerShown: false }}><Stack.Screen name="+not-found" /><StatusBar style="auto" /></AppProvider>);
}

const styles = StyleSheet.create({ loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.neutral[50] } });
