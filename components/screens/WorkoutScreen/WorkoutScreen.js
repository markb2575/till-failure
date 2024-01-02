import { useEffect } from 'react';
// import * as FS from 'expo-file-system'
import FileSystemCommands from "../../util/FileSystemCommands"
import { useState } from 'react';
import { View, Text, Button, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ListItem, Card } from '@rneui/themed';
import CustomCard from '../CustomCard';
import { Divider } from 'react-native-paper';

export default function WorkoutScreen({ navigation }) {
    const [data, setData] = useState(null);
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [currentDay, setCurrentDay] = useState(null);
    const [exercises, setExercises] = useState(null);
    const [activeDropdown, setActiveDropdown] = useState(null)
    const [currentSet, setCurrentSet] = useState(null)
    const [currentWeight, setCurrentWeight] = useState("")
    const [currentReps, setCurrentReps] = useState("")
    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused) {
            FileSystemCommands.setupProject().then(res => {
                setData(res)
                if (res.state.selectedProgram === null) return
                setSelectedProgram(res.state.selectedProgram)
                if (res.programs[res.state.selectedProgram].state.currentDay === null) {
                    setCurrentDay(res.programs[res.state.selectedProgram].info[0].day)
                    res.programs[res.state.selectedProgram].state.currentDay = res.programs[res.state.selectedProgram].info[0].day
                    FileSystemCommands.updateWorkoutFiles(res)
                    setData(res)
                } else {
                    setCurrentDay(res.programs[res.state.selectedProgram].state.currentDay)
                }
                if (res.programs[res.state.selectedProgram].state.exercises.length === 0 || res.programs[res.state.selectedProgram].state.exercises === null) {
                    res.programs[res.state.selectedProgram].info.forEach(info => {
                        if (info.day === res.programs[res.state.selectedProgram].state.currentDay) {
                            res.programs[res.state.selectedProgram].state.exercises = []
                            info.workouts.forEach(item => {
                                res.programs[res.state.selectedProgram].state.exercises.push({ 'name': item.name, 'rep_range': item.rep_range, 'sets': item.sets, 'complete': false });
                            })
                        }
                    })
                    res.programs[res.state.selectedProgram].state.exercises.forEach(exercise => {
                        for (var i = exercise.sets; i > 0; i--) {
                            if (exercise["data"] === undefined) {
                                exercise["data"] = [{ "weight": null, "reps": null }]
                            } else {
                                exercise["data"].push({ "weight": null, "reps": null })
                            }
                        }
                    })
                }
                FileSystemCommands.updateWorkoutFiles(res)
                setData(res)
                setExercises(res.programs[res.state.selectedProgram].state.exercises)
            })
        }
    }, [isFocused, setData])

    const handleOpenDropdown = (exercise, index) => {
        setActiveDropdown(activeDropdown === index ? null : index)
        setCurrentSet(1)
        setCurrentReps(exercise.data[0].reps === null ? "" : exercise.data[0].reps)
        setCurrentWeight(exercise.data[0].weight === null ? "" : exercise.data[0].weight)
    }
    const handlePrev = () => {
        // console.log("handlePrev" ,exercises[activeDropdown].data, currentSet - 1)
        setCurrentReps(exercises[activeDropdown].data[currentSet - 2].reps === null ? "" : exercises[activeDropdown].data[currentSet - 2].reps)
        setCurrentWeight(exercises[activeDropdown].data[currentSet - 2].weight === null || Number.isNaN(exercises[activeDropdown].data[currentSet - 2].weight) ? "" : exercises[activeDropdown].data[currentSet - 2].weight)
        setCurrentSet((current) => (
            current - 1
        ))
    }
    const handleNext = () => {
        // console.log("handleNext" ,exercises[activeDropdown].data, currentSet + 1)
        setCurrentReps(exercises[activeDropdown].data[currentSet].reps === null ? "" : exercises[activeDropdown].data[currentSet].reps)
        setCurrentWeight(exercises[activeDropdown].data[currentSet].weight === null || Number.isNaN(exercises[activeDropdown].data[currentSet].weight) ? "" : exercises[activeDropdown].data[currentSet].weight)
        setCurrentSet((current) => (
            current + 1
        ))

    }
    const handleTextChange = (text, type) => {
        if (type === "Weight") {
            setCurrentWeight(text)
            exercises[activeDropdown].data[currentSet - 1].weight = text === "" ? null : Number(text)
        } else if (type === "Reps") {
            setCurrentReps(text.split('.')[0])
            exercises[activeDropdown].data[currentSet - 1].reps = text === "" ? null : Number(text.split('.')[0])
        }
        FileSystemCommands.updateWorkoutFiles(data)
        setData(data)
        // console.log("handleChange" ,exercises[activeDropdown].data, currentSet)
    }
    const handleComplete = () => {
        //check that everything has a valid value
        console.log(exercises[activeDropdown].data)
        const isValid = !exercises[activeDropdown].data.some(set => set.weight === null | set.reps === null | Number.isNaN(set.weight))
        if (!isValid) return
        console.log("is valid")
        //add to workouts
        exercises[activeDropdown].complete = true
        let category = Object.keys(data.workouts).find(category => data.workouts[category].hasOwnProperty(exercises[activeDropdown].name));
        data.workouts[category][exercises[activeDropdown].name] = [...exercises[activeDropdown].data]
        FileSystemCommands.updateWorkoutFiles(data)
        setData(data)
        console.log(data.programs[selectedProgram].state.exercises)
        //disable button, dim color, move to bottom if possible
        setActiveDropdown(null)

    }

    return (
        selectedProgram && exercises ? (
            <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 40, fontWeight: 'bold', color: 'white', marginBottom: 15, marginTop: 50, alignSelf: 'center' }}>{currentDay}</Text>

                <ScrollView style={{ borderRadius: 10, marginHorizontal: 15 }}>
                    <View style={{ marginBottom: -15 }}>
                        {exercises.sort((a, b) => a.complete - b.complete).map((exercise, index) => (
                            <View key={index}>
                                <CustomCard styles={{ marginTop: 0, marginLeft: 0, marginRight: 0, marginBottom: activeDropdown === index ? 0 : null }} screen={
                                    <TouchableOpacity style={{ padding: 10, opacity: exercise.complete ? 0.2 : 1 }} onPress={() => handleOpenDropdown(exercise, index)} disabled={exercise.complete ? true : false}>
                                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', margin: 5 }}>{exercise.name}</Text>
                                        <Text style={{ fontSize: 20, color: 'grey', margin: 5 }}>{exercise.sets} sets of {exercise.rep_range} Reps</Text>
                                    </TouchableOpacity>
                                } />
                                {activeDropdown === index ?
                                    <CustomCard styles={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, marginTop: 0, marginBottom: null, backgroundColor: '#1e1e1e', marginRight: 8, marginLeft: 8, paddingTop: 15 }} screen={
                                        <View style={{ paddingHorizontal: 16 }}>
                                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 10 }}>Set {currentSet}</Text>
                                            <View style={{ marginBottom: 16, marginHorizontal: 10 }}>
                                                <Text style={{ fontSize: 18, color: 'white', marginBottom: 8 }}>Weight</Text>
                                                <TextInput
                                                    keyboardType='numeric'
                                                    style={{
                                                        height: 40,
                                                        backgroundColor: 'white',
                                                        borderWidth: 1,
                                                        borderRadius: 8,
                                                        paddingHorizontal: 12,
                                                        fontSize: 16,
                                                    }}
                                                    value={String(currentWeight)}
                                                    editable={true}
                                                    onChangeText={(text) => handleTextChange(text, type = "Weight")}
                                                />
                                            </View>
                                            <View style={{ marginBottom: 16, marginHorizontal: 10 }}>
                                                <Text style={{ fontSize: 18, color: 'white', marginBottom: 8 }}>Reps</Text>
                                                <TextInput
                                                    keyboardType='number-pad'
                                                    style={{
                                                        height: 40,
                                                        backgroundColor: 'white',
                                                        borderWidth: 1,
                                                        borderRadius: 8,
                                                        paddingHorizontal: 12,
                                                        fontSize: 16,
                                                    }}
                                                    value={String(currentReps)}
                                                    editable={true}
                                                    onChangeText={(text) => handleTextChange(text, type = "Reps")}
                                                />
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 15, marginHorizontal: -30 }}>
                                                <TouchableOpacity onPress={handlePrev} disabled={currentSet === 1} style={{ opacity: currentSet === 1 ? 0.2 : 1 }}>
                                                    <Image source={require('../../../assets/back.png')} tintColor={'white'} style={{ width: 40, height: 40 }} />
                                                </TouchableOpacity>
                                                {currentSet < exercise.sets ?
                                                    <TouchableOpacity onPress={handleNext} >
                                                        <Image source={require('../../../assets/back.png')} tintColor={'white'} style={{ width: 40, height: 40, transform: [{ scaleX: -1 }] }} />
                                                    </TouchableOpacity> :
                                                    <TouchableOpacity onPress={handleComplete}>
                                                        <Image source={require('../../../assets/check-mark.png')} tintColor={'white'} style={{ width: 40, height: 40 }} />
                                                    </TouchableOpacity>
                                                }
                                            </View>
                                        </View>
                                    } />
                                    : null}
                            </View>
                        ))}
                    </View>
                </ScrollView>
                <View style={{ marginHorizontal: 90, marginTop: 5, marginBottom: 10, }}>
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