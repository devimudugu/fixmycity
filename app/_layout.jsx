import { Slot, useRouter, useRootNavigationState } from 'expo-router';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';

function RootLayoutInner() {
  const { user, authLoading } = useAuth();
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  const isNavigationReady = rootNavigationState?.key != null;

  const [firstRender, setFirstRender] = useState(true);  // Track the first render to avoid unnecessary redirects

  useEffect(() => {


    if (!authLoading && isNavigationReady && firstRender) {
      if (user) {
        console.log('User found, redirecting to /tabs');
        router.replace('/tabs'); 
      } else {
        console.log('No user, redirecting to /');
        router.replace('/'); 
      }
      setFirstRender(false); 
    }
  }, [authLoading, user, isNavigationReady, firstRender, router]);

  // If session is still loading, show a loading spinner
  if (authLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutInner />
    </AuthProvider>
  );
}
