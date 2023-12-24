import { useState, useEffect } from 'react';
import { Image } from 'react-native';
import { NavigationContainer, useIsFocused, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SelectWorkoutScreen, WorkoutScreen, ProgressScreen } from '../screens/screens';

const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

const HomeTabs = () => {
    return (
        <Tab.Navigator
            style={{ backgroundColor: '#101010' }}
            initialRouteName='Workout'
            screenOptions={{
                tabBarIconStyle: {
                    height: 30,
                    width: 30,
                },
                tabBarStyle: {
                    backgroundColor: '#1b1b1b',
                    paddingBottom: 5,
                    paddingTop: 5,
                    borderTopColor: 'grey',
                    borderRadius: 30,
                    margin: 25,
                },
                tabBarInactiveTintColor: '#575757',
                tabBarActiveTintColor: 'white',
                tabBarLabelStyle: {
                    marginTop: 5,
                    textTransform: 'capitalize'
                }
            }}
            tabBarPosition="bottom"
        ><Tab.Screen name="Workout" component={WorkoutScreen} options={{ tabBarIcon: ({ color, size, focused }) => (<Image source={require('../../assets/workout_icon.png')} style={{ resizeMode: 'contain', flex: 1, tintColor: focused ? 'white' : '#575757', alignSelf: 'center' }} />) }} />
            <Tab.Screen name="Progress" component={ProgressScreen} options={{ tabBarIcon: ({ color, size, focused }) => (<Image source={require('../../assets/progress_icon.png')} style={{ resizeMode: 'contain', flex: 1, tintColor: focused ? 'white' : '#575757', alignSelf: 'center' }} />) }} />
        </Tab.Navigator>
    )
}

export default function Navigation() {
    return (
        <NavigationContainer theme={{ colors: { background: '#101010' } }}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="HomeTabs" component={HomeTabs} />
                <Stack.Screen name="Programs" component={SelectWorkoutScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
