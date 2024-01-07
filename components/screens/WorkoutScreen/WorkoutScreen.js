import { useEffect } from 'react';
// import * as FS from 'expo-file-system'
import FileSystemCommands from "../../util/FileSystemCommands"
import { useState, useRef } from 'react';
import { View, Text, Button, TouchableOpacity, ScrollView, TextInput, Image, Animated, Easing, TouchableWithoutFeedback, Keyboard } from 'react-native';
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
    const [currentSet, setCurrentSet] = useState(1)
    const [notValid, setNotValid] = useState([])
    const [currentWeight, setCurrentWeight] = useState("")
    const [currentReps, setCurrentReps] = useState("")
    const isFocused = useIsFocused();
    const animatedHeights = useRef(Array.from({ length: exercises === null ? 100 : exercises.length }, () => new Animated.Value(0))).current; //100 needs to be changed


    useEffect(() => {
        if (isFocused) {

            FileSystemCommands.setupProject().then(res => {
                setData(res)
                // console.log(res.programs[res.state.selectedProgram].state.currentDay)
                if (res.state.selectedProgram === null) return
                setSelectedProgram(res.state.selectedProgram)
                if (res.programs[res.state.selectedProgram].state.currentDay === null) {
                    // console.log("here1")
                    setCurrentDay(res.programs[res.state.selectedProgram].info[0].day)
                    res.programs[res.state.selectedProgram].state.currentDay = res.programs[res.state.selectedProgram].info[0].day
                    FileSystemCommands.updateWorkoutFiles(res)
                    setData(res)
                } else {
                    // console.log("here2", res.programs[res.state.selectedProgram].state.currentDay)
                    setCurrentDay(res.programs[res.state.selectedProgram].state.currentDay)
                }
                // console.log(res.programs[res.state.selectedProgram].state.exercises)
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
                console.log("exercises 1")
                res.programs[res.state.selectedProgram].state.exercises.forEach(exercise=> console.log(exercise.data))
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

        // Reset scaleY to 1 for flipping back to its original position
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

        // Set scaleY to -1 for flipping around the x-axis
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

    const handleToggleDropdown = (exercise, index) => {
        Keyboard.dismiss()
        console.log("index:" + index, "activeDropdown:" + activeDropdown);



        // If clicking on the open dropdown, close it
        if (index === activeDropdown) {
            closeDropdown(index);
            setActiveDropdown(null);
        } else {
            // If there is an open dropdown, close it first
            if (activeDropdown !== null) {
                closeDropdown(activeDropdown);
                openDropdown(index, exercise);
            } else {
                // Open the clicked dropdown if there isn't an open dropdown
                openDropdown(index, exercise);
            }
        }
    };

    const animatedTextTranslation = useRef(new Animated.Value(0)).current;

    const handlePrev = () => {
        if (exercises[activeDropdown].data[currentSet - 2] === undefined) return

        // console.log("handlePrev" ,exercises[activeDropdown].data, currentSet - 1)
        if (animatedTextTranslation._value !== 0) {
            setCurrentReps(exercises[activeDropdown].data[currentSet - 2].reps === null ? "" : exercises[activeDropdown].data[currentSet - 2].reps)
            setCurrentWeight(exercises[activeDropdown].data[currentSet - 2].weight === null || Number.isNaN(exercises[activeDropdown].data[currentSet - 2].weight) ? "" : exercises[activeDropdown].data[currentSet - 2].weight)
            setCurrentSet((current) => (
                current - 1
            ))
            return
        }
        animateTextTranslation(350, then = () => {
            setCurrentReps(exercises[activeDropdown].data[currentSet - 2].reps === null ? "" : exercises[activeDropdown].data[currentSet - 2].reps)
            setCurrentWeight(exercises[activeDropdown].data[currentSet - 2].weight === null || Number.isNaN(exercises[activeDropdown].data[currentSet - 2].weight) ? "" : exercises[activeDropdown].data[currentSet - 2].weight)
            setCurrentSet((current) => (
                current - 1
            ))
            // animateTextTranslation(0);
        }
        );
    }
    const handleNext = () => {
        // console.log("handleNext" ,exercises[activeDropdown].data, currentSet + 1)
        if (animatedTextTranslation._value !== 0) {
            setCurrentReps(exercises[activeDropdown].data[currentSet].reps === null ? "" : exercises[activeDropdown].data[currentSet].reps)
            setCurrentWeight(exercises[activeDropdown].data[currentSet].weight === null || Number.isNaN(exercises[activeDropdown].data[currentSet].weight) ? "" : exercises[activeDropdown].data[currentSet].weight)
            setCurrentSet((current) => (
                current + 1
            ))
            return
        }
        animateTextTranslation(-350, then = () => {
            setCurrentReps(exercises[activeDropdown].data[currentSet].reps === null ? "" : exercises[activeDropdown].data[currentSet].reps)
            setCurrentWeight(exercises[activeDropdown].data[currentSet].weight === null || Number.isNaN(exercises[activeDropdown].data[currentSet].weight) ? "" : exercises[activeDropdown].data[currentSet].weight)
            setCurrentSet((current) => (
                current + 1
            ))
            // animateTextTranslation(0);
        }
        );


    }
    const animateTextTranslation = (toValue, then) => {
        Animated.timing(animatedTextTranslation, {
            toValue,
            duration: 120,
            useNativeDriver: false,
        }).start(() => {
            then()
            animatedTextTranslation.setValue(-toValue)
            Animated.timing(animatedTextTranslation, {
                toValue: 0,
                duration: 120,
                useNativeDriver: false,
            }).start()
        });


    };


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
    const animatedColors = useRef(Array.from({ length: exercises === null ? 100 : exercises.length }, () => new Animated.Value(0))).current;

    const backgroundColorInterpolation = (index) => animatedColors[index].interpolate({
        inputRange: [0, 1],
        outputRange: ['#242424', '#ff0033'],
    });

    const shakeAnimation = useRef(Array.from({ length: exercises === null ? 100 : exercises.length }, () => new Animated.Value(0))).current;

    const handleComplete = () => {
        // Check that everything has a valid value
        const isValid = !exercises[activeDropdown].data.some(set => set.weight === null || set.reps === null || Number.isNaN(set.weight));
        if (!isValid) {
            setNotValid((prev) => [...prev, activeDropdown]);
            Animated.sequence([
                Animated.timing(shakeAnimation[activeDropdown], { toValue: 5, duration: 50, useNativeDriver: false }),
                Animated.timing(shakeAnimation[activeDropdown], { toValue: -5, duration: 50, useNativeDriver: false }),
                Animated.timing(shakeAnimation[activeDropdown], { toValue: 5, duration: 50, useNativeDriver: false }),
                Animated.timing(shakeAnimation[activeDropdown], { toValue: 0, duration: 50, useNativeDriver: false })
            ]).start();
            Animated.sequence([
                Animated.timing(animatedColors[activeDropdown], {
                    toValue: 1,
                    duration: 100,
                    easing: Easing.linear,
                    useNativeDriver: false,
                }),
                Animated.timing(animatedColors[activeDropdown], {
                    toValue: 0,
                    duration: 1000,
                    easing: Easing.linear,
                    useNativeDriver: false,
                }),
            ]).start(() => {
                // Remove the processed index from the state
                console.log(notValid)
                setNotValid((prev) => prev.filter((item) => item !== activeDropdown));
                console.log(notValid)
            });
            return;  // Do not proceed with animation if not valid
        }

        // Add to workouts
        exercises[activeDropdown].complete = true;
        data.workouts.find(exercise => exercise.name === exercises[activeDropdown].name).data = [...exercises[activeDropdown].data];
        FileSystemCommands.updateWorkoutFiles(data);
        setData(data);
        closeDropdown(activeDropdown)
        setActiveDropdown(null);
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
        // holdAnimation.stop(); // Stop the animation
        // holdAnimation.setValue(0); // Reset the animation value to 0
    };
    const handleNextDay = () => {
        const length = Object.values(data.programs[data.state.selectedProgram].info).length
        const currentIndex = Object.values(data.programs[data.state.selectedProgram].info).findIndex(day => day.day.toLowerCase() === currentDay.toLowerCase())
        if (currentIndex === length - 1) {
            setCurrentDay(data.programs[data.state.selectedProgram].info[0].day)
            data.programs[data.state.selectedProgram].state.currentDay = data.programs[data.state.selectedProgram].info[0].day
            // console.log(data.programs[data.state.selectedProgram].state)
        } else {
            const nextDay = data.programs[data.state.selectedProgram].info[Object.values(data.programs[data.state.selectedProgram].info).findIndex(day => day.day.toLowerCase() === currentDay.toLowerCase()) + 1].day
            setCurrentDay(nextDay)
            data.programs[data.state.selectedProgram].state.currentDay = nextDay
            // console.log(data.programs[data.state.selectedProgram].state)
        }
        data.programs[data.state.selectedProgram].state.exercises = []
        FileSystemCommands.updateWorkoutFiles(data)
        animatedHeights.forEach(animatedHeight => animatedHeight.setValue(0))
        animatedRotations.forEach(animatedRotation => animatedRotation.setValue(1))
        setExercises(null)
        setCurrentReps("")
        setCurrentWeight("")
        console.log("exercises 2")
        exercises.forEach(exercise=> console.log(exercise.data))
    }
    return (
        selectedProgram && exercises ? (

            <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 40, fontWeight: 'bold', color: 'white', marginBottom: 15, marginTop: 50, alignSelf: 'center' }}>{currentDay}</Text>
                {!exercises.every(exercise => exercise.complete === true) ?
                    <ScrollView style={{ borderRadius: 10, marginHorizontal: 15 }} keyboardShouldPersistTaps={'always'}>

                        <View style={{ marginBottom: -15 }}>
                            {exercises.sort((a, b) => a.complete - b.complete).map((exercise, index) => (
                                <CustomCard key={index} styles={{ marginTop: 0, marginLeft: 0, marginRight: 0, marginBottom: null, backgroundColor: notValid.includes(index) ? backgroundColorInterpolation(index) : '#242424', transform: [{ translateY: shakeAnimation[index] }] }} screen={
                                    <View>
                                        <TouchableOpacity style={{ padding: 10, opacity: exercise.complete ? 0.2 : 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} onPress={() => handleToggleDropdown(exercise, index)} disabled={exercise.complete ? true : false}>
                                            <View>
                                                <Text style={{ fontSize: 22, fontWeight: 'bold', color: 'white', margin: 5 }}>{exercise.name}</Text>
                                                <Text style={{ fontSize: 20, color: 'grey', margin: 5 }}>{exercise.sets} sets of {exercise.rep_range} Reps</Text>
                                            </View>
                                            <Animated.Image
                                                source={require('../../../assets/back.png')}
                                                style={{
                                                    width: 30,
                                                    height: 30,
                                                    transform: [
                                                        { rotate: "-90deg" },
                                                        { scaleX: animatedRotations[index]?.interpolate({ inputRange: [-1, 1], outputRange: [-1, 1] }) },
                                                    ],
                                                    tintColor: 'white',
                                                    marginRight: 15,
                                                }}
                                            />
                                        </TouchableOpacity>
                                        <Animated.View style={{ paddingHorizontal: 16, height: animatedHeights[index] === undefined ? 0 : animatedHeights[index], overflow: 'hidden' }}>
                                            <Card.Divider style={{ marginBottom: 30, }} width={2} color={"grey"} />
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, marginHorizontal: 30 }}>
                                                <TouchableOpacity onPress={handlePrev} disabled={currentSet === 1} style={{ padding: 15, opacity: currentSet === 1 ? .2 : 1 }}>
                                                    <Image source={require('../../../assets/back.png')} tintColor={'white'} style={{ width: 30, height: 30 }} />
                                                </TouchableOpacity>
                                                <Animated.Text style={{ fontSize: 30, fontWeight: 'bold', color: 'white', alignSelf: 'center', transform: [{ translateX: animatedTextTranslation }] }}>Set {currentSet}</Animated.Text>

                                                {currentSet < exercise.sets ?
                                                    <TouchableOpacity onPress={handleNext} style={{ padding: 15 }}>
                                                        <Image source={require('../../../assets/back.png')} tintColor={'white'} style={{ width: 30, height: 30, transform: [{ scaleX: -1 }] }} />
                                                    </TouchableOpacity> :
                                                    <TouchableOpacity onPress={handleComplete} style={{ padding: 15, opacity: notValid.includes(index) ? .2 : 1 }} disabled={notValid.includes(index) ? true : false}>
                                                        <Image source={require('../../../assets/check-mark.png')} tintColor={'white'} style={{ width: 30, height: 30 }} />
                                                    </TouchableOpacity>
                                                }
                                            </View>
                                            <Animated.View style={{ transform: [{ translateX: animatedTextTranslation }] }}>
                                                <View style={{ marginBottom: 16, marginHorizontal: 10 }}>
                                                    <Text style={{ fontSize: 20, color: 'white', marginBottom: 8, fontWeight: 'bold' }}>Weight</Text>
                                                    <TextInput
                                                        keyboardType='numeric'
                                                        style={{
                                                            color: "white",
                                                            height: 40,
                                                            backgroundColor: 'transparent',
                                                            borderColor: 'grey',
                                                            borderWidth: 2,
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
                                                    <Text style={{ fontSize: 20, color: 'white', marginBottom: 8, fontWeight: 'bold' }}>Reps</Text>
                                                    <TextInput
                                                        keyboardType='number-pad'
                                                        style={{
                                                            color: "white",
                                                            height: 40,
                                                            backgroundColor: 'transparent',
                                                            borderColor: 'grey',
                                                            borderWidth: 2,
                                                            borderRadius: 8,
                                                            paddingHorizontal: 12,
                                                            fontSize: 16,
                                                        }}
                                                        value={String(currentReps)}
                                                        editable={true}
                                                        onChangeText={(text) => handleTextChange(text, type = "Reps")}
                                                    />
                                                </View>
                                            </Animated.View>
                                        </Animated.View>
                                    </View>
                                } />
                            ))}
                        </View>
                    </ScrollView> :
                    <View style={{ marginVertical: 30 }}>
                        {currentDay === "Rest" ? 
                        <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'white', margin: 20, alignSelf: 'center', textAlign: 'center', marginHorizontal: 40, }}>Enjoy your Rest Day</Text>:
                        <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'white', margin: 20, alignSelf: 'center', textAlign: 'center', marginHorizontal: 40, }}>All Exercises Complete</Text>}
                        <CustomCard screen={
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Animated.View style={{ backgroundColor: "green", width: holdAnimation, height: 50, borderRadius: 10, marginRight: 10 }}>
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