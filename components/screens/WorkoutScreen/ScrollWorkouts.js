import FileSystemCommands from "../../util/FileSystemCommands"
import { useRef, useState, createRef, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image, Animated, Easing, Keyboard, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Card } from '@rneui/themed';
import Carousel from 'react-native-reanimated-carousel';
import CustomCard from '../CustomCard';
import { ActivityIndicator } from "react-native";

export default function ScrollWorkouts({ data, exercises, setExercises, notValid, animatedRotations, animatedHeights, activeDropdown, openDropdown, setData, setNotValid, closeDropdown, setActiveDropdown, updateRecommendedWeight, selectedProgram }) {
    const handleComplete = (animatedColors, shakeAnimation, currentSet) => {
        console.log("Called: handleComplete");
        const isValid = !exercises[activeDropdown].data.some(set => set.weight === null || set.reps === null || Number.isNaN(set.weight));
        if (!isValid) {
            setNotValid((prev) => [...prev, activeDropdown]);
            Animated.sequence([
                Animated.timing(shakeAnimation, { toValue: 5, duration: 50, useNativeDriver: false }),
                Animated.timing(shakeAnimation, { toValue: -5, duration: 50, useNativeDriver: false }),
                Animated.timing(shakeAnimation, { toValue: 5, duration: 50, useNativeDriver: false }),
                Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: false })
            ]).start();
            Animated.sequence([
                Animated.timing(animatedColors, {
                    toValue: 1,
                    duration: 100,
                    easing: Easing.linear,
                    useNativeDriver: false,
                }),
                Animated.timing(animatedColors, {
                    toValue: 0,
                    duration: 1000,
                    easing: Easing.linear,
                    useNativeDriver: false,
                }),
            ]).start(() => {
                setNotValid((prev) => prev.filter((item) => item !== activeDropdown));
            });
            return;
        }
        
        // const completedExerciseIndex = activeDropdown;
        // console.log("currentSet", currentSet,  "exercises.length" ,exercises.length)
        // if (currentSet !== exercises.length) {
        //     exercises[activeDropdown].prev_weight = exercises[activeDropdown].data[currentSet - 1].weight
        //     exercises[activeDropdown].prev_reps = exercises[activeDropdown].data[currentSet - 1].reps
        //     updateRecommendedWeight(exercises[activeDropdown].data[currentSet - 1].weight, exercises[activeDropdown].data[currentSet - 1].reps, exercises[activeDropdown].optimal_reps, currentSet)
        // }
        
        exercises[activeDropdown].complete = true;
        
        const workoutIndex = data.workouts.findIndex(workout => 
            workout.name === exercises[activeDropdown].name
        );
        
        if (workoutIndex === -1) {
            return;
        }
        
        data.workouts[workoutIndex] = {
            ...data.workouts[workoutIndex],
            complete: true,
            data: data.workouts[workoutIndex].data 
                ? [...data.workouts[workoutIndex].data, ...exercises[activeDropdown].data]
                : [...exercises[activeDropdown].data],
            prev_weight: exercises[activeDropdown].prev_weight,
            prev_reps: exercises[activeDropdown].prev_reps
        };

        FileSystemCommands.updateWorkoutFiles(data);
        setData({...data});
        closeDropdown(activeDropdown);
        setActiveDropdown(null);
        
        currentSets.current[activeDropdown] = 0
        // currentSets.current = currentSets.current.map((setIndex, i) => {
        //     if (i > completedExerciseIndex) {
        //         return 0;
        //     }
        //     return setIndex;
        // });
    };

    const sleep = (ms) => {
        console.log("Called: sleep");
        return new Promise((resolve) => setTimeout(resolve, ms));
    };

    const handleToggleDropdown = async (exercise, index) => {
        console.log("Called: handleToggleDropdown");
        if (index === activeDropdown) {
            closeDropdown(index);
            setActiveDropdown(null);
        } else {
            if (activeDropdown !== null) {
                closeDropdown(activeDropdown);
                await sleep(200)
            }
            setActiveDropdown(index);
            openDropdown(index, exercise);
        }
    };

    const handleTextChange = (text, type, index, currentSet) => {
        console.log("Called: handleTextChange");
        const updatedExercises = [...exercises];
        if (type === "Weight") {
            updatedExercises[activeDropdown].data[index].weight = text === "" ? null : Number(text);
        } else if (type === "Reps") {
            updatedExercises[activeDropdown].data[index].reps = text === "" ? null : Number(text.split('.')[0]);
        }
        setExercises(updatedExercises);
        
        if (index !== exercises.length) {
            exercises[activeDropdown].prev_weight = exercises[activeDropdown].data[currentSet].weight
            exercises[activeDropdown].prev_reps = exercises[activeDropdown].data[currentSet].reps
            updateRecommendedWeight(exercises[activeDropdown].data[index].weight, exercises[activeDropdown].data[index].reps, exercises[activeDropdown].optimal_reps, index)
        }
        
        FileSystemCommands.updateWorkoutFiles(data)
        setData(data)
    }

    const handleEdits = (index, totalSets) => {
        console.log("Called: handleEdits");
        if (index === 0 && index === totalSets) return true
        if (index === 0) {
            if (exercises[activeDropdown].data[index + 1].weight === null && exercises[activeDropdown].data[index + 1].reps === null) {
                return true
            }
        } else if (index === totalSets) {
            if (exercises[activeDropdown].data[index - 1].weight !== null && exercises[activeDropdown].data[index - 1].reps !== null) {
                return true
            }
        } else {
            if (exercises[activeDropdown].data[index + 1].weight === null && exercises[activeDropdown].data[index + 1].reps === null && exercises[activeDropdown].data[index - 1].weight !== null && exercises[activeDropdown].data[index - 1].reps !== null) {
                return true
            }
        }
        return false
    }

    const Indicator = ({ scrollX }) => {
        console.log("Called: Indicator");
        if (activeDropdown === null) return
        const finalIndex = exercises[activeDropdown].sets - 1;
        var currentIndex = Math.round(scrollX._value / 327.5);
        const style = { height: 5, width: 5, borderRadius: 5, margin: 10, backgroundColor: "#ffffff" };
        var currentDots = 0
        
        return (
            <View style={{ flexDirection: "row", alignSelf: "center", alignItems: "center", marginBottom: 7.5 }}>
                {Array.from({ length: exercises[activeDropdown].sets }).map((_, i) => {
                    const inputRange = [(i - 3) * 327.5, (i - 2) * 327.5, (i - 1) * 327.5, i * 327.5, (i + 1) * 327.5, (i + 2) * 327.5, (i + 3) * 327.5];
                    const translate = new Animated.Value(0)
                    const scale = scrollX.interpolate({
                        inputRange: inputRange,
                        outputRange: [.4, 0.6, 0.8, 1, 0.8, 0.6, .4],
                        extrapolate: "clamp"
                    });
                    const opacity = scrollX.interpolate({
                        inputRange: inputRange,
                        outputRange: [.3, 0.4, 0.6, 1, 0.6, 0.4, 0.3],
                        extrapolate: "clamp"
                    });
                    
                    var isVisible;

                    if (currentIndex === 0) {
                        isVisible = i < 5
                    } else if (currentIndex === 1) {
                        isVisible = i < 5
                    } else if (currentIndex === 2) {
                        isVisible = i < 5
                    } else if (currentIndex === finalIndex) {
                        isVisible = i > finalIndex - 5
                    } else if (currentIndex === finalIndex - 1) {
                        isVisible = i > finalIndex - 5
                    } else if (currentIndex === finalIndex - 2) {
                        isVisible = i > finalIndex - 5
                    } else {
                        isVisible = i > currentIndex - 3 && i < currentIndex + 3
                    }
                    return (
                        <TouchableOpacity key={i} onPress={() => {
                            if (flatListRefs) {
                                flatListRefs.current[activeDropdown].scrollToIndex({ index: i, animated: true });
                                currentSets.current[activeDropdown] = i
                            }
                        }}>
                            <Animated.View style={{ transform: [{ scale: scale }, { translateX: translate }], opacity: opacity, height: 5, width: 5, borderRadius: 5, margin: 10, backgroundColor: "#ffffff" }}></Animated.View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };

    const renderItem = ({ item, index }, shakeAnimation, animatedColors, scrolling) => {
        console.log("Called: renderItem");
        return (
            <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, marginHorizontal: 30 }}>
                    <TouchableOpacity onPress={() => {
                        if (currentSets.current[activeDropdown] === 0) return
                        if (flatListRefs) {
                            flatListRefs.current[activeDropdown].scrollToIndex({ index: currentSets.current[activeDropdown] - 1, animated: true });
                            currentSets.current[activeDropdown] -= 1
                        }
                    }} style={{ padding: 15, opacity: index + 1 === 1 ? .2 : 1 }}>
                        <Image source={require('../../../assets/back.png')} tintColor={'white'} style={{ width: 30, height: 30 }} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'white', alignSelf: 'center' }}>Set {index + 1}</Text>
                    {index + 1 < exercises[activeDropdown].sets ?
                        <TouchableOpacity onPress={() => {
                            if (flatListRefs) {
                                flatListRefs.current[activeDropdown].scrollToIndex({ index: currentSets.current[activeDropdown] + 1, animated: true });
                                currentSets.current[activeDropdown] += 1
                            }
                        }} style={{ padding: 15 }}>
                            <Image source={require('../../../assets/back.png')} tintColor={'white'} style={{ width: 30, height: 30, transform: [{ scaleX: -1 }] }} />
                        </TouchableOpacity> :
                        <TouchableOpacity onPress={() => handleComplete(animatedColors, shakeAnimation, currentSets.current[activeDropdown])} style={{ padding: 15, opacity: notValid.includes(index + 1) ? .2 : 1 }} disabled={notValid.includes(index + 1) ? true : false}>
                            <Image source={require('../../../assets/check-mark.png')} tintColor={'white'} style={{ width: 30, height: 30 }} />
                        </TouchableOpacity>
                    }
                </View>
                <View style={{ marginBottom: 16, marginHorizontal: 10, width: 307.5 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: 20, color: 'white', marginBottom: 8, fontWeight: 'bold', marginRight: 4 }}>Weight</Text>
                        <Text style={{ fontSize: 20, color: 'white', marginBottom: 8 }}>(lbs)</Text>
                    </View>
                    <TextInput
                        keyboardType='numeric'
                        style={{
                            color: "white",
                            height: 40,
                            backgroundColor: handleEdits(index, exercises[activeDropdown].sets - 1) ? 'transparent' : 'gray',
                            borderColor: 'grey',
                            borderWidth: 2,
                            borderRadius: 8,
                            paddingHorizontal: 12,
                            fontSize: 16,
                        }}
                        placeholderTextColor={"grey"}
                        placeholder={item.recommended_weight !== null ? String(Math.round(item.recommended_weight / 5) * 5) : ""}
                        value={String(exercises[activeDropdown].data[index].weight ?? "")}
                        onChangeText={(text) => handleTextChange(text, type = "Weight", index, currentSets.current[activeDropdown])}
                        editable={!scrolling && handleEdits(index, exercises[activeDropdown].sets - 1)}
                        keyboardAppearance="dark"
                    />
                </View>
                <View style={{ marginBottom: 16, marginHorizontal: 10 }}>
                    <Text style={{ fontSize: 20, color: 'white', marginBottom: 8, fontWeight: 'bold' }}>Reps</Text>
                    <TextInput
                        keyboardType='number-pad'
                        style={{
                            color: "white",
                            height: 40,
                            backgroundColor: handleEdits(index, exercises[activeDropdown].sets - 1) ? 'transparent' : 'gray',
                            borderColor: 'grey',
                            borderWidth: 2,
                            borderRadius: 8,
                            paddingHorizontal: 12,
                            fontSize: 16,
                        }}
                        value={String(exercises[activeDropdown].data[index].reps ?? "")}
                        onChangeText={(text) => handleTextChange(text, type = "Reps", index, currentSets.current[activeDropdown])}
                        editable={!scrolling && handleEdits(index, exercises[activeDropdown].sets - 1)}
                        keyboardAppearance="dark"
                    />
                </View>
            </View>
        )
    }

    const onScroll = (event, index) => {
        console.log("Called: onScroll");
        const scrollOffset = event.nativeEvent.contentOffset.x
        const itemHeight = 327.5;
        const visibleItemIndex = Math.round(scrollOffset / itemHeight);
        currentSets.current[index] = visibleItemIndex
    };

    const [scrolling, setScrolling] = useState(false);

    const flatListRefs = useRef(Array.from({ length: exercises.length }, () => null));
    const scrollXValues = useRef(Array.from({ length: exercises.length }, () => new Animated.Value(0)));
    const animatedColorsValues = useRef(Array.from({ length: exercises.length }, () => new Animated.Value(0)));
    const shakeAnimationValues = useRef(Array.from({ length: exercises.length }, () => new Animated.Value(0)));
    const currentSets = useRef(Array.from({ length: exercises.length }, () => 0));

    useEffect(() => {
        flatListRefs.current = Array.from({ length: exercises.length }, () => null)
        scrollXValues.current = Array.from({ length: exercises.length }, () => new Animated.Value(0))
        animatedColorsValues.current = Array.from({ length: exercises.length }, () => new Animated.Value(0))
        shakeAnimationValues.current = Array.from({ length: exercises.length }, () => new Animated.Value(0))
        currentSets.current = Array.from({ length: exercises.length }, () => 0)
    }, [selectedProgram]);

    return (
        exercises.length === currentSets.current.length ? (
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
            >
                <ScrollView 
                    style={{ borderRadius: 10, marginHorizontal: 15 }} 
                    keyboardShouldPersistTaps='always'
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    automaticallyAdjustKeyboardInsets={true}
                    keyboardDismissMode="on-drag"
                >
                    <View style={{ marginBottom: Platform.OS === "android" ? 300 : 100 }}>
                        {exercises.sort((a, b) => a.complete - b.complete).map((exercise, index) => {
                            const flatListRef = flatListRefs.current[index]
                            const scrollX = scrollXValues.current[index]
                            const animatedColors = animatedColorsValues.current[index]
                            const shakeAnimation = shakeAnimationValues.current[index]
                            const currentSet = currentSets.current[index]

                            const backgroundColorInterpolation = animatedColors.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['#242424', '#ff0033'],
                            });

                            return (
                                <CustomCard key={index} styles={{ marginTop: 0, marginLeft: 0, marginRight: 0, marginBottom: null, backgroundColor: notValid.includes(index) ? backgroundColorInterpolation : '#242424', transform: [{ translateY: shakeAnimation }] }} screen={
                                    <View>
                                        <TouchableOpacity style={{ padding: 10, opacity: exercise.complete ? 0.2 : 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} onPress={() => handleToggleDropdown(exercise, index)} disabled={exercise.complete ? true : false}>
                                            <View style={{maxWidth: '75%'}}>
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

                                            {activeDropdown === index ?
                                                <FlatList
                                                    getItemLayout={(data, index) => (
                                                        { length: 327.5, offset: 327.5 * index, index }
                                                    )}
                                                    data={exercises[activeDropdown].data}
                                                    ref={(ref) => flatListRefs.current[index] = ref}
                                                    initialScrollIndex={currentSet}
                                                    keyExtractor={(item, index) => `${index}_${activeDropdown}`}
                                                    onMomentumScrollEnd={(event) => onScroll(event, index)}
                                                    keyboardShouldPersistTaps='always'
                                                    renderItem={({ item, index }) => renderItem({ item, index }, shakeAnimation, animatedColors, scrolling)}
                                                    horizontal
                                                    onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
                                                    showsHorizontalScrollIndicator={false}
                                                    pagingEnabled
                                                    nestedScrollEnabled
                                                    initialNumToRender={2}
                                                    maxToRenderPerBatch={2}
                                                    windowSize={2}
                                                    decelerationRate={"normal"}
                                                    disableIntervalMomentum={true}
                                                />
                                                : (null)}
                                            <Indicator scrollX={scrollX} flatListRef={flatListRef} />
                                        </Animated.View>
                                    </View>
                                } />
                            )
                        })}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        ) : null
    )
}