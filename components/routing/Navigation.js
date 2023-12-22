import { useState, useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SelectWorkoutScreen, WorkoutScreen, ProgressScreen } from '../screens/screens';
import FileSystemCommands from "../util/FileSystemCommands"
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

export default function Navigation() {
    const Tab = createBottomTabNavigator();
    const theme = {
        colors: {
            //   primary: '#282c34', // Dark gray
            //   accent: '#61dafb', // Blue
            background: '#777777', // Dark gray
            //   card: '#21252b', // Slightly lighter than background
            text: '#ffffff', // White
        },
    };
    return (
        <NavigationContainer theme={theme}>
            <Tab.Navigator initialRouteName={"Programs"} screenOptions={{
                headerShown: false, tabBarActiveBackgroundColor: '#6b6b6b', 
                tabBarStyle: {
                    backgroundColor: '#525252',
                    // margin: 0,
                    // paddingTop: 10,
                    paddingRight: 10,
                    paddingLeft: 10,
                    paddingBottom: 10,
                },
                tabBarItemStyle: {
                    marginTop: 5,
                    borderRadius: 20,
                    marginRight: 15,
                    marginLeft: 15
                },
                tabBarIconStyle: {
                    marginTop: 10,
                },
                tabBarLabelStyle: {
                    color: 'white',
                    fontSize: 15,
                    fontWeight: 'bold',
                    paddingBottom: 5
                },
            }}>
                <Tab.Screen name="Programs" component={SelectWorkoutScreen} options={{tabBarIcon: ({ color, size }) => (<Image source={require('../../assets/select_workout_icon.png')} style={{ width: 30, height: 20, resizeMode:'stretch'}}/>)}}/>
                <Tab.Screen name="Workout" component={WorkoutScreen} options={{tabBarIcon: ({ color, size }) => (<Image source={require('../../assets/workout_icon.png')} style={{ width: 100, height: 100}}/>)}}/>
                <Tab.Screen name="Progress" component={ProgressScreen} options={{tabBarIcon: ({ color, size }) => (<Image source={require('../../assets/progress_icon.png')} style={{ width: 30, height: 20, resizeMode:'stretch'}}/>)}}/>
            </Tab.Navigator>
        </NavigationContainer>
    );
}
