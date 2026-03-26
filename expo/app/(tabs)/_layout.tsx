import { Tabs } from 'expo-router';
import { Bookmark, User, Compass } from 'lucide-react-native';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, borderRadius } from '@/constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.accent.primary,
        tabBarInactiveTintColor: colors.text.tertiary,
        tabBarStyle: {
          backgroundColor: colors.background.secondary,
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
          letterSpacing: 0.3,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <Compass 
                size={24} 
                color={color} 
                strokeWidth={focused ? 2.5 : 2}
              />
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <Bookmark 
                size={24} 
                color={color} 
                strokeWidth={focused ? 2.5 : 2}
              />
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <User 
                size={24} 
                color={color} 
                strokeWidth={focused ? 2.5 : 2}
              />
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  iconContainerActive: {
    backgroundColor: colors.status.successBg,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.accent.primary,
  },
});
