import { useState, useEffect, useRef } from 'react';
import { Image, Animated, View, Dimensions } from 'react-native';
import { NavigationContainer, useIsFocused, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SelectWorkoutScreen, WorkoutScreen, ProgressScreen, CreateProgramScreen, SelectExerciseScreen, CreateDayScreen } from '../screens/screens';

const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

const HomeTabs = () => {


    return (
        <Tab.Navigator
            style={{ backgroundColor: '#141414' }}
            initialRouteName='Workout'
            
            screenOptions={{
                swipeEnabled: false,
                tabBarStyle: {
                    backgroundColor: '#242424',
                    paddingBottom: 5,
                    paddingTop: 5,
                    borderTopColor: 'grey',
                    borderRadius: 30,
                    margin: 25,
                    marginTop: 10,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.4,
                    shadowRadius: 2,
                    elevation: 5,
                },
                tabBarInactiveTintColor: '#575757',
                tabBarActiveTintColor: 'white',
                tabBarLabelStyle: {
                    marginTop: 5,
                    textTransform: 'capitalize'
                },
                tabBarIconStyle: {
                    height: 30,
                    width: 30
                },
                
            }}
            
            tabBarPosition="bottom"
            
        >
            <Tab.Screen name="Workout" component={WorkoutScreen} options={{ tabBarLabel: "Workout", tabBarIcon: ({ color, size, focused }) => (<Image source={require('../../assets/workout_icon.png')} style={{ resizeMode: 'contain', flex: 1, tintColor: focused ? 'white' : '#575757', alignSelf: 'center' }} />) }} />
            <Tab.Screen name="Progress" component={ProgressScreen}  options={{ tabBarLabel: "Progress", tabBarIcon: ({ color, size, focused }) => (<Image source={require('../../assets/progress_icon.png')} style={{ resizeMode: 'contain', flex: 1, tintColor: focused ? 'white' : '#575757', alignSelf: 'center' }} />) }} />
        </Tab.Navigator>
    )

}
export default function Navigation() {

    return (
        <NavigationContainer theme={{ colors: { background: '#141414' } }}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="HomeTabs" component={HomeTabs} />
                <Stack.Screen name="Programs" component={SelectWorkoutScreen} />
                <Stack.Screen name="CreateWorkout" component={CreateProgramScreen} />
                <Stack.Screen name="SelectExercise" component={SelectExerciseScreen} />
                <Stack.Screen name="CreateDay" component={CreateDayScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}
