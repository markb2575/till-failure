import * as React from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export default function WorkoutScreen({ navigation }) {
    //get files to check if initial route name should be select workout or workout page
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Workout</Text>
            <Button
                title="Go to Select Workout"
                onPress={() => navigation.navigate('Select Workout')}
            />
        </View>
    );
}