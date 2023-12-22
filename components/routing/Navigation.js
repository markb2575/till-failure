import { useState, useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SelectWorkoutScreen, WorkoutScreen } from '../screens/screens';
import FileSystemCommands from "../util/FileSystemCommands"
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

export default function Navigation() {
    const Tab = createBottomTabNavigator();
    const theme = {
        dark: true,
        colors: {
            //   primary: '#282c34', // Dark gray
            //   accent: '#61dafb', // Blue
            background: '#777777', // Dark gray
            //   card: '#21252b', // Slightly lighter than background
            //   text: '#ffffff', // White
        },
    };
    return (
        <NavigationContainer theme={theme}>
            <Tab.Navigator initialRouteName={"Select Workout"} screenOptions={{
                headerShown: false, tabBarActiveBackgroundColor: '#6b6b6b', tabBarStyle: {
                    backgroundColor: '#525252'
                },
                tabBarItemStyle: {
                    borderRadius: 15, // Adjust the border radius as needed
                },
            }}>
                <Tab.Screen name="Select Workout" component={SelectWorkoutScreen} options={{tabBarIcon: ({ color, size }) => (<Image source={require('../../assets/select_workout_icon.png')} style={{ width: 100, height: 40, resizeMode:'stretch'}}/>)}}/>
                <Tab.Screen name="Workout" component={WorkoutScreen} options={{tabBarIcon: ({ color, size }) => (<Image source={require('../../assets/workout_icon.png')} style={{ width: 140, height: 140 }}/>)}}/>
            </Tab.Navigator>
        </NavigationContainer>
    );
}
