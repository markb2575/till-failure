import { useEffect } from 'react';
// import * as FS from 'expo-file-system'

import FileSystemCommands from "../../util/FileSystemCommands"
import { View, Text, Button } from 'react-native';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export default function WorkoutScreen({ navigation }) {
    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused) {

        }
    }, [isFocused])

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

        </View>
    );
}