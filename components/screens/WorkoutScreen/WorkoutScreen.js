import { useCallback, useEffect } from 'react';
import FileSystemCommands from "../../util/FileSystemCommands"
import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing, Keyboard } from 'react-native';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import CustomCard from '../CustomCard';
import ScrollWorkouts from '../WorkoutScreen/ScrollWorkouts';
export default function WorkoutScreen({ navigation }) {
    const [data, setData] = useState(null);
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [currentDay, setCurrentDay] = useState(null);
    const [currentDayIndex, setCurrentDayIndex] = useState(null);
    const [exercises, setExercises] = useState(null);
    const [activeDropdown, setActiveDropdown] = useState(null)
    const [loading, setLoading] = useState(true)
    // const [currentSet, setCurrentSet] = useState(1)
    const [notValid, setNotValid] = useState([])
    const [currentWeight, setCurrentWeight] = useState("")
    const [currentReps, setCurrentReps] = useState("")
    const [recommendedWeight, setRecommendedWeight] = useState("")
    const isFocused = useIsFocused();
    const animatedHeights = useRef(Array.from({ length: 100 }, () => new Animated.Value(0))).current;
    const animatedRotations = useRef(Array.from({ length: 100 }, () => new Animated.Value(1))).current;

    const updateRecommendedWeight = (currentWeight, currentReps, optimalReps, index, dropdownIndex) => {
        if (currentWeight === null || currentReps === null) {
            if (index !== -1) {
                const maxLen = data.programs[data.state.selectedProgram].state.exercises[activeDropdown].data.length
                if (index + 1 === maxLen) return
                data.programs[data.state.selectedProgram].state.exercises[activeDropdown].data[index+1].recommended_weight = null
                
            } else {
                data.programs[data.state.selectedProgram].state.exercises[dropdownIndex].data[index+1].recommended_weight = null
            }
            return
        }
        if (index !== -1) {
            const maxLen = data.programs[data.state.selectedProgram].state.exercises[activeDropdown].data.length
            if (index + 1 === maxLen) return
            data.programs[data.state.selectedProgram].state.exercises[activeDropdown].data[index+1].recommended_weight = ((currentWeight * currentReps) + (30 * currentWeight)) / (optimalReps + 30)
        } else {
            data.programs[data.state.selectedProgram].state.exercises[dropdownIndex].data[index+1].recommended_weight = ((currentWeight * currentReps) + (30 * currentWeight)) / (optimalReps + 30)
        }
    }

    useFocusEffect(useCallback(() => {

        FileSystemCommands.setupProject().then(res => {
            setData(res)
            if (res.programs[res.state.selectedProgram] === undefined) {
                res.state.selectedProgram = null
                FileSystemCommands.updateWorkoutFiles(res).then(res => {
                    navigation.navigate("Programs")
                })
                return
            }
            if (res.state.selectedProgram === null) {
                    setLoading(false)
                    return null
                };
            setSelectedProgram(res.state.selectedProgram)
            if (res.programs[res.state.selectedProgram].state.currentDayIndex === null) {
                setCurrentDay(res.programs[res.state.selectedProgram].info[0].day)
                setCurrentDayIndex(0)
                res.programs[res.state.selectedProgram].state.currentDay = res.programs[res.state.selectedProgram].info[0].day
                FileSystemCommands.updateWorkoutFiles(res)
                setData(res)
            } else {
                setCurrentDay(res.programs[res.state.selectedProgram].info[res.programs[res.state.selectedProgram].state.currentDayIndex].day)
                setCurrentDayIndex(res.programs[res.state.selectedProgram].state.currentDayIndex)
            }
            if (res.programs[res.state.selectedProgram].state.exercises.length === 0 || res.programs[res.state.selectedProgram].state.exercises === null) {
                res.programs[res.state.selectedProgram].info.forEach((info, index) => {
                    if (index === res.programs[res.state.selectedProgram].state.currentDayIndex) {
                        res.programs[res.state.selectedProgram].state.exercises = []
                        info.workouts.forEach(item => {
                            let prevWeight = null;
                            let prevReps = null;
                            res.workouts.forEach(workout => {
                                if (workout.name === item.name) {
                                    const lastElement = workout.data[workout.data.length - 1]
                                    if (lastElement === undefined) return
                                    prevWeight = lastElement.weight
                                    prevReps = lastElement.reps
                                }
                            })
                            res.programs[res.state.selectedProgram].state.exercises.push({ 'name': item.name, 'rep_range': item.rep_range, 'sets': item.sets, 'complete': false, 'current_set': '1', 'prev_weight': null, 'prev_reps': null, "optimal_reps": (Number(item.rep_range.split('-')[0]) + Number(item.rep_range.split('-')[1])) / 2 });
                        })
                    }
                })
                res.programs[res.state.selectedProgram].state.exercises.forEach(exercise => {
                    for (var i = exercise.sets; i > 0; i--) {
                        if (exercise["data"] === undefined) {
                            exercise["data"] = [{ "weight": null, "reps": null, "recommended_weight": null }]
                        } else {
                            exercise["data"].push({ "weight": null, "reps": null, "recommended_weight": null })
                        }
                    }
                })
            }
            FileSystemCommands.updateWorkoutFiles(res)
            setData(res)
            setExercises(res.programs[res.state.selectedProgram].state.exercises)
            setTimeout(fadeIn, 100)
            setLoading(false)
        })

    }, [isFocused, currentDay, animatedHeights, animatedRotations]))


    const closeDropdown = (dropdownIndex) => {
        if (dropdownIndex === null) return
        // console.log(animatedHeights[dropdownIndex])
        Animated.timing(animatedHeights[dropdownIndex], {
            toValue: 0,
            duration: 150,
            useNativeDriver: false,
        }).start();
        Animated.timing(animatedRotations[dropdownIndex], {
            toValue: 1,
            duration: 150,
            useNativeDriver: false,
        }).start();
    };
    const openDropdown = (dropdownIndex, exercise) => {
        // console.log("exercise", exercise)
        // console.log("in opendropdown")
        Animated.timing(animatedHeights[dropdownIndex], {
            toValue: 310,
            duration: 150,
            useNativeDriver: false,
        }).start();
        Animated.timing(animatedRotations[dropdownIndex], {
            toValue: -1,
            duration: 150,
            useNativeDriver: false,
        }).start();
        //if the previous set reps and weight are filled in recommended weight to reach optimal weight
        // console.log(exercise.prev_weight, exercise.prev_reps, exercise.optimal_reps)
        let prevWeight = null;
        let prevReps = null;
        data.workouts.forEach(workout => {
            if (workout.name === exercise.name) {
                const lastElement = workout.data[workout.data.length - 1]
                if (lastElement === undefined) return
                prevWeight = lastElement.weight
                prevReps = lastElement.reps
            }
        })
        // console.log(prevWeight, prevReps, exercise.optimal_reps)
        updateRecommendedWeight(prevWeight, prevReps, exercise.optimal_reps, -1, dropdownIndex)
        // setActiveDropdown(dropdownIndex);
        // setCurrentSet(1);
        // setCurrentReps(exercise.data[0].reps !== null ? exercise.data[0].reps : "");
        // setCurrentWeight(exercise.data[0].weight !== null ? exercise.data[0].weight : "");
        // console.log("exit opendropdown")
    };
    const holdAnimation = useRef(new Animated.Value(0)).current;
    const handleHold = () => {
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
        Animated.timing(holdAnimation, {
            toValue: 0,
            duration: 100,
            useNativeDriver: false,
        }).start()
    };

    const animatedFadeIn = useRef(new Animated.Value(0)).current;
    const fadeOut = () => {
        Animated.timing(animatedFadeIn, {
            toValue: 0,
            duration: 250,
            useNativeDriver: false,
        }).start()
    }
    const fadeIn = () => {
        Animated.timing(animatedFadeIn, {
            toValue: 1,
            duration: 150,
            useNativeDriver: false,
        }).start()
    }


    const handleNextDay = () => {
        const length = Object.values(data.programs[data.state.selectedProgram].info).length
        if (currentDayIndex === length - 1) {
            setCurrentDay(data.programs[data.state.selectedProgram].info[0].day)
            setCurrentDayIndex(0)
            data.programs[data.state.selectedProgram].state.currentDayIndex = 0
        } else {
            const nextDayIndex = currentDayIndex + 1
            const nextDay = data.programs[data.state.selectedProgram].info[nextDayIndex].day
            setCurrentDay(nextDay)
            setCurrentDayIndex(nextDayIndex)
            data.programs[data.state.selectedProgram].state.currentDayIndex = nextDayIndex
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
        !loading ? (selectedProgram && exercises ? (
            <View style={{ flex: 1, justifyContent: 'space-between' }} onTouchStart={() => Keyboard.dismiss()}>
                <Text style={{ fontSize: 40, fontWeight: 'bold', color: 'white', marginBottom: 15, marginTop: 50, alignSelf: 'center' }}>{currentDay}</Text>

                {!exercises.every(exercise => exercise.complete === true) ?
                    <Animated.View style={{ opacity: animatedFadeIn, flex: 1, justifyContent: 'flex-start' }}>
                        <ScrollWorkouts {...{ data, exercises, setExercises, notValid, animatedRotations, animatedHeights, currentWeight, currentReps, activeDropdown, openDropdown, setCurrentReps, setCurrentWeight, setData, setNotValid, closeDropdown, setActiveDropdown, recommendedWeight, updateRecommendedWeight, setRecommendedWeight, selectedProgram }} />
                    </Animated.View> :
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
                    </View>
                }


                <View style={{ marginHorizontal: 90, marginTop: 5, marginBottom: 10, }}>
                    <CustomCard screen={<TouchableOpacity onPress={() => { closeDropdown(activeDropdown); setActiveDropdown(null); navigation.navigate("Programs"); fadeOut() }} style={{ padding: 10 }}><Text style={{ fontSize: 15, fontWeight: 'bold', color: 'white', margin: 5, alignSelf: 'center' }}>Switch Program</Text></TouchableOpacity>} />
                </View>
            </View>
        ) : (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={{ fontSize: 40, fontWeight: 'bold', color: 'white', marginBottom: 15, marginHorizontal: 70, marginTop: 50, alignSelf: 'center', textAlign: 'center', }}>No Program Selected</Text>
                <View style={{ marginHorizontal: 60 }}>
                    <CustomCard screen={<TouchableOpacity onPress={() => { closeDropdown(activeDropdown); navigation.navigate("Programs"); fadeOut() }} style={{ padding: 10 }}><Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', margin: 5, alignSelf: 'center' }}>Select Program</Text></TouchableOpacity>} />
                </View>
            </View>

        )
        ) : (null));
}