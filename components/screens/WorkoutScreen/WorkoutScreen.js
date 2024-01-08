import { useEffect } from 'react';
import FileSystemCommands from "../../util/FileSystemCommands"
import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing, Keyboard } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import CustomCard from '../CustomCard';
import ScrollWorkouts from '../WorkoutScreen/ScrollWorkouts';
export default function WorkoutScreen({ navigation }) {
    const [data, setData] = useState(null);
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [currentDay, setCurrentDay] = useState(null);
    const [exercises, setExercises] = useState(null);
    const [activeDropdown, setActiveDropdown] = useState(null)
    const [currentSet, setCurrentSet] = useState(1)
    const [notValid, setNotValid] = useState([])
    const [currentWeight, setCurrentWeight] = useState("")
    const [currentReps, setCurrentReps] = useState("")
    const isFocused = useIsFocused();
    const animatedHeights = useRef(Array.from({ length: exercises === null ? 100 : exercises.length }, () => new Animated.Value(0))).current; //100 needs to be changed
    useEffect(() => {
        if (isFocused) {
            FileSystemCommands.setupProject().then(res => {
                animatedHeights.forEach(animatedHeight => animatedHeight.setValue(0))
                animatedRotations.forEach(animatedRotation => animatedRotation.setValue(1))
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
    }, [isFocused, setData, currentDay])
    const animatedRotations = useRef(Array.from({ length: exercises === null ? 7 : exercises.length }, () => new Animated.Value(1))).current;
    const closeDropdown = (dropdownIndex) => {
        Animated.timing(animatedHeights[dropdownIndex], {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
        Animated.timing(animatedRotations[dropdownIndex], {
            toValue: 1,
            duration: 200,
            useNativeDriver: false,
        }).start();
    };
    const openDropdown = (dropdownIndex, exercise) => {
        Animated.timing(animatedHeights[dropdownIndex], {
            toValue: 310,
            duration: 200,
            useNativeDriver: false,
        }).start();
        Animated.timing(animatedRotations[dropdownIndex], {
            toValue: -1,
            duration: 200,
            useNativeDriver: false,
        }).start();
        setActiveDropdown(dropdownIndex);
        setCurrentSet(1);
        setCurrentReps(exercise.data[0]?.reps || "");
        setCurrentWeight(exercise.data[0]?.weight || "");
    };
    const holdAnimation = useRef(new Animated.Value(0)).current;
    const handleHold = () => {
        console.log("holding")
        Animated.timing(holdAnimation, {
            toValue: 360,
            duration: 600,
            useNativeDriver: false,
        }).start(() => {
            if (holdAnimation._value === 360) {
                handleNextDay()
                holdAnimation.setValue(0)
            }
        })
    }
    const handleRelease = () => {
        console.log("release");
        Animated.timing(holdAnimation, {
            toValue: 0,
            duration: 100,
            useNativeDriver: false,
        }).start()
    };
    const handleNextDay = () => {
        const length = Object.values(data.programs[data.state.selectedProgram].info).length
        const currentIndex = Object.values(data.programs[data.state.selectedProgram].info).findIndex(day => day.day.toLowerCase() === currentDay.toLowerCase())
        if (currentIndex === length - 1) {
            setCurrentDay(data.programs[data.state.selectedProgram].info[0].day)
            data.programs[data.state.selectedProgram].state.currentDay = data.programs[data.state.selectedProgram].info[0].day
        } else {
            const nextDay = data.programs[data.state.selectedProgram].info[Object.values(data.programs[data.state.selectedProgram].info).findIndex(day => day.day.toLowerCase() === currentDay.toLowerCase()) + 1].day
            setCurrentDay(nextDay)
            data.programs[data.state.selectedProgram].state.currentDay = nextDay
        }
        data.programs[data.state.selectedProgram].state.exercises = []
        FileSystemCommands.updateWorkoutFiles(data)
        animatedHeights.forEach(animatedHeight => animatedHeight.setValue(0))
        animatedRotations.forEach(animatedRotation => animatedRotation.setValue(1))
        setExercises(null)
        setCurrentReps("")
        setCurrentWeight("")
    }
    return (
        selectedProgram && exercises ? (
            <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 40, fontWeight: 'bold', color: 'white', marginBottom: 15, marginTop: 50, alignSelf: 'center' }}>{currentDay}</Text>
                {!exercises.every(exercise => exercise.complete === true) ?
                    <ScrollWorkouts {...{data, exercises, notValid, animatedRotations, animatedHeights, currentSet, currentWeight, currentReps, activeDropdown, openDropdown, setCurrentReps, setCurrentWeight, setCurrentSet, setData, setNotValid, closeDropdown, setActiveDropdown}}/>:
                    <View style={{ marginVertical: 30 }}>
                        {currentDay === "Rest" ?
                            <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'white', margin: 20, alignSelf: 'center', textAlign: 'center', marginHorizontal: 40, }}>Enjoy your Rest Day</Text> :
                            <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'white', margin: 20, alignSelf: 'center', textAlign: 'center', marginHorizontal: 40, }}>All Exercises Complete</Text>}
                        <CustomCard screen={
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Animated.View style={{ backgroundColor: "grey", width: holdAnimation, height: 50, borderRadius: 10, marginRight: 10 }}>
                                </Animated.View>
                                <CustomCard styles={{ position: 'absolute', backgroundColor: "transparent", shadowOpacity: 0 }} screen={
                                    <TouchableOpacity onPressIn={handleHold} onPressOut={handleRelease} style={{ alignItems: 'center' }}>
                                        <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'white', margin: 15, textAlign: 'center' }}>Continue to Next Workout</Text>
                                    </TouchableOpacity>
                                } />
                            </View>
                        } />
                    </View>}
                <View style={{ marginHorizontal: 90, marginTop: 5, marginBottom: 10, }}>
                    <CustomCard screen={<TouchableOpacity onPress={() => { setActiveDropdown(null); navigation.navigate("Programs") }} style={{ padding: 10 }}><Text style={{ fontSize: 15, fontWeight: 'bold', color: 'white', margin: 5, alignSelf: 'center' }}>Switch Program</Text></TouchableOpacity>} />
                </View>
            </View >
        ) : (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={{ fontSize: 40, fontWeight: 'bold', color: 'white', marginBottom: 15, marginHorizontal: 70, marginTop: 50, alignSelf: 'center', textAlign: 'center', }}>No Program Selected</Text>
                <View style={{ marginHorizontal: 60 }}>
                    <CustomCard screen={<TouchableOpacity onPress={() => { navigation.navigate("Programs") }} style={{ padding: 10 }}><Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', margin: 5, alignSelf: 'center' }}>Select Program</Text></TouchableOpacity>} />
                </View>
            </View>
        )
    );
}