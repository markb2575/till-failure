import { useEffect } from 'react';
// import * as FS from 'expo-file-system'

import FileSystemCommands from "../../util/FileSystemCommands"
import { useState } from 'react';
import { View, Text, Button, TouchableOpacity, ScrollView } from 'react-native';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ListItem, Card } from '@rneui/themed';
import CustomCard from '../CustomCard';

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
                if (res.programs[res.state.selectedProgram].state.currentDay == null) {
                    setCurrentDay(res.programs[res.state.selectedProgram].info[0].day)
                    res.programs[res.state.selectedProgram].state.currentDay = res.programs[res.state.selectedProgram].info[0].day
                    FileSystemCommands.updateWorkoutFiles(res)
                } else {
                    setCurrentDay(res.programs[res.state.selectedProgram].state.currentDay)
                }

                res.programs[res.state.selectedProgram].info.forEach(info => {
                    if (info.day === res.programs[res.state.selectedProgram].state.currentDay) {
                        res.programs[res.state.selectedProgram].state.exercises = []
                        info.workouts.forEach(item => {
                            res.programs[res.state.selectedProgram].state.exercises.push({ 'name': item.name, 'rep_range': item.rep_range, 'sets': item.sets });
                        })
                    }
                })
                FileSystemCommands.updateWorkoutFiles(res)
                setExercises(res.programs[res.state.selectedProgram].state.exercises)
            })
        }
    }, [isFocused, setData])

    return (
        selectedProgram && exercises ? (
            <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 40, fontWeight: 'bold', color: 'white', marginBottom: 15, marginHorizontal: 70, marginTop: 50, alignSelf: 'center' }}>{currentDay} Day</Text>
                <ScrollView style={{ borderRadius: 10, marginHorizontal: 15 }}>
                {exercises.map((exercise, index) => (
                    <CustomCard marginTop={0} marginLeft={0} marginRight={0} key={index} screen={
                        <TouchableOpacity style={{ padding: 10 }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', margin: 5}}>{exercise.name}</Text>
                            <Text style={{ fontSize: 20, color: 'grey', margin: 5 }}>{exercise.sets} sets of {exercise.rep_range} Reps</Text>
                        </TouchableOpacity>
                    } />
                ))}
                </ScrollView>
                <View style={{ marginHorizontal: 90, marginBottom: -10 }}>
                    <CustomCard screen={<TouchableOpacity onPress={() => navigation.navigate("Programs")} style={{ padding: 10 }}><Text style={{ fontSize: 15, fontWeight: 'bold', color: 'white', margin: 5, alignSelf: 'center' }}>Switch Program</Text></TouchableOpacity>} />
                </View>
            </View>
        ) : (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={{ fontSize: 40, fontWeight: 'bold', color: 'white', marginBottom: 15, marginHorizontal: 70, marginTop: 50, alignSelf: 'center', textAlign: 'center', }}>No Program Selected</Text>
                <View style={{ marginHorizontal: 60 }}>
                    <CustomCard screen={<TouchableOpacity onPress={() => navigation.navigate("Programs")} style={{ padding: 10 }}><Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', margin: 5, alignSelf: 'center' }}>Select Program</Text></TouchableOpacity>} />
                </View>
            </View>
        )
    );
}