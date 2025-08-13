import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#a21caf',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: { backgroundColor: '#fff', borderTopWidth: 0 },
      }}
    >
  <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
  <Tabs.Screen name="canvas" options={{ title: 'Canvas' }} />
  <Tabs.Screen name="partner" options={{ title: 'Partner' }} />
  <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}
