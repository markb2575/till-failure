import { useState, useEffect } from 'react';
import { Image } from 'react-native';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SelectWorkoutScreen, WorkoutScreen, ProgressScreen } from '../screens/screens';

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
                        backgroundColor: '#1b1b1b',
                        paddingBottom:10,
                        paddingTop:5,
                        borderTopColor:'grey'
                    },
                    tabBarInactiveTintColor: '#575757',
                    tabBarActiveTintColor: 'white',
                }}
                tabBarPosition="bottom"
            >
                <Tab.Screen name="Programs" component={SelectWorkoutScreen} options={{ tabBarIcon: ({ color, size, focused }) => (<Image source={require('../../assets/select_workout_icon.png')} style={{ resizeMode: 'contain', flex: 1, tintColor: focused ? 'white' : '#575757', alignSelf: 'center' }} />) }} />
                <Tab.Screen name="Workout" component={WorkoutScreen} options={{ tabBarIcon: ({ color, size, focused }) => (<Image source={require('../../assets/workout_icon.png')} style={{ resizeMode: 'contain', flex: 1, tintColor: focused ? 'white' : '#575757', alignSelf: 'center' }} />) }} />
                <Tab.Screen name="Progress" component={ProgressScreen} options={{ tabBarIcon: ({ color, size, focused }) => (<Image source={require('../../assets/progress_icon.png')} style={{ resizeMode: 'contain', flex: 1, tintColor: focused ? 'white' : '#575757', alignSelf: 'center' }} />) }} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
