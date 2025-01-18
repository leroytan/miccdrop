import { Stack } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function StackLayout() {
  const colorScheme = useColorScheme();

  return (
    
    <Stack
      
    >
      
      <Stack.Screen
        name="explore"
        options={{
          title: 'Explore',
          headerShown: false,
          headerStyle: {
            backgroundColor: Colors[colorScheme ?? 'light'].background,
          },
          headerTitleStyle: {
            color: Colors[colorScheme ?? 'light'].text,
          },
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerStyle: {
            backgroundColor: Colors[colorScheme ?? 'light'].background,
          },
          headerTitleStyle: {
            color: Colors[colorScheme ?? 'light'].text,
          },
        }}
      />
    </Stack>
  );
}
