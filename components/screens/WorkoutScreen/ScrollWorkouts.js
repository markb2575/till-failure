import FileSystemCommands from "../../util/FileSystemCommands"
import { useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image, Animated, Easing, Keyboard } from 'react-native';
import { Card } from '@rneui/themed';
import CustomCard from '../CustomCard';
export default function ScrollWorkouts({ data, exercises, notValid, animatedRotations, animatedHeights, currentSet, currentWeight, currentReps, activeDropdown, openDropdown, setCurrentReps, setCurrentWeight, setCurrentSet, setData, setNotValid, closeDropdown, setActiveDropdown, recommendedWeight, updateRecommendedWeight, setRecommendedWeight}) {
    const animatedTextTranslation = useRef(new Animated.Value(0)).current;
    const animatedColors = useRef(Array.from({ length:  100  }, () => new Animated.Value(0))).current;
    const shakeAnimation = useRef(Array.from({ length:  100  }, () => new Animated.Value(0))).current;
    // const animatedColors = useRef([]);
    // const shakeAnimation = useRef([]);

    // useEffect(() => {
    //     // Filter out undefined exercises
    //     const validExercises = exercises.filter((exercise) => exercise !== undefined);
    //     setFilteredExercises(validExercises);
    //   }, [exercises]);

    const backgroundColorInterpolation = (index) => animatedColors[index].interpolate({
        inputRange: [0, 1],
        outputRange: ['#242424', '#ff0033'],
    });
    
    const handleComplete = () => {
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
                // console.log(notValid)
                setNotValid((prev) => prev.filter((item) => item !== activeDropdown));
                // console.log(notValid)
            });
            return;
        }
    
        exercises[activeDropdown].prev_weight = exercises[activeDropdown].data[currentSet-1].weight
        exercises[activeDropdown].prev_reps = exercises[activeDropdown].data[currentSet-1].reps
        updateRecommendedWeight(exercises[activeDropdown].data[currentSet-1].weight, exercises[activeDropdown].data[currentSet-1].reps, exercises[activeDropdown].optimal_reps)
        Keyboard.dismiss()
        exercises[activeDropdown].complete = true;
        data.workouts.find(exercise => exercise.name === exercises[activeDropdown].name).data = [...exercises[activeDropdown].data];
        FileSystemCommands.updateWorkoutFiles(data);
        setData(data);
        closeDropdown(activeDropdown)
        setActiveDropdown(null);
    };
    const handleToggleDropdown = (exercise, index) => {
        Keyboard.dismiss()
        if (index === activeDropdown) {
            closeDropdown(index);
            setActiveDropdown(null);
        } else {
            if (activeDropdown !== null) {
                closeDropdown(activeDropdown);
                openDropdown(index, exercise);
            } else {
                openDropdown(index, exercise);
            }
        }
    }
    const handlePrev = () => {
        Keyboard.dismiss()
        if (exercises[activeDropdown].data[currentSet - 2] === undefined) return
        if (animatedTextTranslation._value !== 0) {
            setCurrentReps(exercises[activeDropdown].data[currentSet - 2].reps === null ? "" : exercises[activeDropdown].data[currentSet - 2].reps)
            setCurrentWeight(exercises[activeDropdown].data[currentSet - 2].weight === null || Number.isNaN(exercises[activeDropdown].data[currentSet - 2].weight) ? "" : exercises[activeDropdown].data[currentSet - 2].weight)
            setCurrentSet((current) => (
                current - 1
            ))
            if (currentSet - 3 < 0) {
            
            } else if (exercises[activeDropdown].data[currentSet-3].reps !== null && exercises[activeDropdown].data[currentSet-3].weight !== null && !Number.isNaN(exercises[activeDropdown].data[currentSet-3].weight)) {
                exercises[activeDropdown].prev_weight = exercises[activeDropdown].data[currentSet-3].weight
                exercises[activeDropdown].prev_reps = exercises[activeDropdown].data[currentSet-3].reps
                updateRecommendedWeight(exercises[activeDropdown].data[currentSet-3].weight, exercises[activeDropdown].data[currentSet-3].reps, exercises[activeDropdown].optimal_reps)
            } else {
                setRecommendedWeight(null)
            }
            return
        }
        animateTextTranslation(350, then = () => {
            setCurrentReps(exercises[activeDropdown].data[currentSet - 2].reps === null ? "" : exercises[activeDropdown].data[currentSet - 2].reps)
            setCurrentWeight(exercises[activeDropdown].data[currentSet - 2].weight === null || Number.isNaN(exercises[activeDropdown].data[currentSet - 2].weight) ? "" : exercises[activeDropdown].data[currentSet - 2].weight)
            setCurrentSet((current) => (
                current - 1
            ))
            if (currentSet - 3 < 0) {
            
            } else if (exercises[activeDropdown].data[currentSet-3].reps !== null && exercises[activeDropdown].data[currentSet-3].weight !== null && !Number.isNaN(exercises[activeDropdown].data[currentSet-3].weight)) {
                exercises[activeDropdown].prev_weight = exercises[activeDropdown].data[currentSet-3].weight
                exercises[activeDropdown].prev_reps = exercises[activeDropdown].data[currentSet-3].reps
                updateRecommendedWeight(exercises[activeDropdown].data[currentSet-3].weight, exercises[activeDropdown].data[currentSet-3].reps, exercises[activeDropdown].optimal_reps)
            } else {
                setRecommendedWeight(null)
            }
        });
    }
    const handleNext = () => {
        Keyboard.dismiss()

        
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
        });
        // console.log(currentSet-1,exercises[activeDropdown].data[currentSet-1].reps, exercises[activeDropdown].data[currentSet-1].weight, !Number.isNaN(exercises[activeDropdown].data[currentSet-1].weight))
        // console.log("bool",exercises[activeDropdown].data[currentSet-1].reps !== null && exercises[activeDropdown].data[currentSet-1].weight !== null && !Number.isNaN(exercises[activeDropdown].data[currentSet-1].weight))
        if (exercises[activeDropdown].data[currentSet-1].reps !== null && exercises[activeDropdown].data[currentSet-1].weight !== null && !Number.isNaN(exercises[activeDropdown].data[currentSet-1].weight)) {
            // console.log("prev is valid")
            exercises[activeDropdown].prev_weight = exercises[activeDropdown].data[currentSet-1].weight
            exercises[activeDropdown].prev_reps = exercises[activeDropdown].data[currentSet-1].reps
            updateRecommendedWeight(exercises[activeDropdown].data[currentSet-1].weight, exercises[activeDropdown].data[currentSet-1].reps, exercises[activeDropdown].optimal_reps)
        } else {
            setRecommendedWeight(null)
        }
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
    }
    return (
        <ScrollView style={{ borderRadius: 10, marginHorizontal: 15 }} keyboardShouldPersistTaps={'always'}>
            <View style={{ marginBottom: -15 }}>
                {exercises.sort((a, b) => a.complete - b.complete).map((exercise, index) => {
                    return (
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
                                            { scaleX: animatedRotations[index]?.interpolate({ inputRange: [-1, 1], outputRange: [-1, 1] })},
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
                                    <View style={{flexDirection:'row'}}>
                                        <Text style={{ fontSize: 20, color: 'white', marginBottom: 8, fontWeight: 'bold', marginRight:4 }}>Weight</Text>
                                        <Text style={{ fontSize: 20, color: 'white', marginBottom: 8 }}>(lbs)</Text>
                                    </View>
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
                                            placeholderTextColor={"grey"}
                                            placeholder={recommendedWeight ? String(Math.round(recommendedWeight / 5) * 5) : ""}
                                            value={String(currentWeight)}
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
                                            onChangeText={(text) => handleTextChange(text, type = "Reps")}
                                        />
                                    </View>
                                </Animated.View>
                            </Animated.View>
                        </View>
                    } />
                )})}
            </View>
        </ScrollView>
    )
}