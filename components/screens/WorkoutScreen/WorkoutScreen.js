import { useEffect } from 'react';
// import * as FS from 'expo-file-system'

import FileSystemCommands from "../../util/FileSystemCommands"
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export default function WorkoutScreen({ navigation }) {
    //get files to check if initial route name should be select workout or workout page
    
    useEffect(() => {
        
        // let files = FS.readDirectoryAsync();
        // console.log(files)
        
        if (FileSystemCommands.isProjectSetup()) {
            console.log("project is setup, getting workouts")
            FileSystemCommands.getWorkouts()
        } else {
            console.log("project is not setup, creating files")
            FileSystemCommands.createWorkoutFiles();
        }
        

        // if (await FileSystemCommands.isProjectSetup()) {
        //     console.log("reading workouts.json")
        //     console.log(RNFS.readFile("workouts.json"))
        // } else {
        //     console.log("creating workouts.json")
        //     RNFS.writeFile("workouts.json", JSON.stringify({
        //         "Dumbell Bicep Curls": [],
        //         "Barbell Bicep Curls" : [],
        //         "Hammer Curls": [],
        //         "Preacher Curls": []
        //     }))
        // }
        
    }, [])
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