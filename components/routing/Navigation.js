import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SelectWorkoutScreen, WorkoutScreen } from '../screens/screens';

export default function Navigation() {
    const Stack = createNativeStackNavigator();
    //get files to check if initial route name should be select workout or workout page
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Select Workout" screenOptions={{
                headerBackVisible: false, // Hide the back button from all screens
            }}>
                <Stack.Screen name="Select Workout" component={SelectWorkoutScreen} />
                <Stack.Screen name="Workout" component={WorkoutScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
