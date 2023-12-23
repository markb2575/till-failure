import { useState, useEffect } from 'react';
import { Image } from 'react-native';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SelectWorkoutCard, WorkoutCard, ProgressCard } from '../screens/screens';

const Tab = createMaterialTopTabNavigator();

export default function Navigation() {
    return (
        <NavigationContainer theme={{ colors: { background: '#101010' } }}>
            <Tab.Navigator
                initialRouteName='Workout'
                screenOptions={{
                    tabBarIconStyle: {
                        height: 30,
                        width: 30,
                    },
                    tabBarStyle: {
                        backgroundColor: '#101010',
                        paddingBottom:10
                    },
                    tabBarInactiveTintColor: '#575757',
                    tabBarActiveTintColor: 'white',
                }}
                tabBarPosition="bottom"
            >
                <Tab.Screen name="Programs" component={SelectWorkoutCard} options={{ tabBarIcon: ({ color, size, focused }) => (<Image source={require('../../assets/select_workout_icon.png')} style={{ resizeMode: 'contain', flex: 1, tintColor: focused ? 'white' : '#575757', alignSelf: 'center' }} />) }} />
                <Tab.Screen name="Workout" component={WorkoutCard} options={{ tabBarIcon: ({ color, size, focused }) => (<Image source={require('../../assets/workout_icon.png')} style={{ resizeMode: 'contain', flex: 1, tintColor: focused ? 'white' : '#575757', alignSelf: 'center' }} />) }} />
                <Tab.Screen name="Progress" component={ProgressCard} options={{ tabBarIcon: ({ color, size, focused }) => (<Image source={require('../../assets/progress_icon.png')} style={{ resizeMode: 'contain', flex: 1, tintColor: focused ? 'white' : '#575757', alignSelf: 'center' }} />) }} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
