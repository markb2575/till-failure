import { useEffect } from 'react';
// import * as FS from 'expo-file-system'

import FileSystemCommands from "../../util/FileSystemCommands"
import { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ListItem, Card } from '@rneui/themed';

export default function WorkoutScreen({ navigation }) {
    const [data, setData] = useState(null);
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [currentDay, setCurrentDay] = useState(null);
    const [exercises, setExercises] = useState(null);
    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused) {
            FileSystemCommands.setupProject().then(res => {
                setData(res)
                setSelectedProgram(res.state.selectedProgram)
                console.log(res.state.selectedProgram)
                if (res.state.selectedProgram != null && res.state.currentDay == null) {
                    setCurrentDay(res.programs[res.state.selectedProgram][0].day)
                } else {
                    setCurrentDay(res.state.currentDay)
                }
                setExercises(res.state.exercises)
            })
        }
    }, [isFocused, setData])

    return (
        <View>
            {selectedProgram ?
                (
                    <View>
                        <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'white', marginBottom: 15, marginHorizontal: 70 }}>{currentDay} Day</Text>
                        <Card.Divider color='grey' style={{marginBottom: 0}} />
                    </View>
                )
                : (<Button title="No Program Selected" onPress={() => navigation.navigate("Programs")} />)}
        </View>
    );
}