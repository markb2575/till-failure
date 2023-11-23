import * as React from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export default function SelectWorkoutScreen({ navigation }) {
    //get files to check if initial route name should be select workout or workout page
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Select Workout</Text>
            <Button
                title="Go to Workout"
                onPress={() => navigation.navigate('Workout')}
            />
        </View>
    );
}