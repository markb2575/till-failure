import FileSystemCommands from "../../util/FileSystemCommands"
import { useRef, useState, createRef, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image, Animated, Easing, Keyboard, FlatList, KeyboardAvoidingView } from 'react-native';
import { Card } from '@rneui/themed';
import Carousel from 'react-native-reanimated-carousel';
import CustomCard from '../CustomCard';
import { ActivityIndicator } from "react-native";

// import Carousel, { Pagination } from 'react-native-snap-carousel';
export default function ScrollWorkouts({ data, exercises, setExercises, notValid, animatedRotations, animatedHeights, activeDropdown, openDropdown, setData, setNotValid, closeDropdown, setActiveDropdown, updateRecommendedWeight }) {
    const handleComplete = (animatedColors, shakeAnimation, currentSet) => {
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
                // console.log(notValid)
                setNotValid((prev) => prev.filter((item) => item !== activeDropdown));
                // console.log(notValid)
            });
            return;
        }
        if (currentSet !== exercises.length) {
            exercises[activeDropdown].prev_weight = exercises[activeDropdown].data[currentSet - 1].weight
            exercises[activeDropdown].prev_reps = exercises[activeDropdown].data[currentSet - 1].reps
            updateRecommendedWeight(exercises[activeDropdown].data[currentSet - 1].weight, exercises[activeDropdown].data[currentSet - 1].reps, exercises[activeDropdown].optimal_reps, currentSet)
        }
        // Keyboard.dismiss()
        exercises[activeDropdown].complete = true;
        data.workouts.find(exercise => exercise.name === exercises[activeDropdown].name).data = [...exercises[activeDropdown].data];
        FileSystemCommands.updateWorkoutFiles(data);
        setData(data);
        closeDropdown(activeDropdown)
        setActiveDropdown(null);
    };
    // const handleComplete = (animatedColors, shakeAnimation) => {
    //     const isValid = !exercises[activeDropdown].data.some(set => set.weight === null || set.reps === null || Number.isNaN(set.weight));
    //     if (!isValid) {
    //         setNotValid((prev) => [...prev, activeDropdown]);
    //         Animated.sequence([
    //             Animated.timing(shakeAnimation, { toValue: 5, duration: 50, useNativeDriver: false }),
    //             Animated.timing(shakeAnimation, { toValue: -5, duration: 50, useNativeDriver: false }),
    //             Animated.timing(shakeAnimation, { toValue: 5, duration: 50, useNativeDriver: false }),
    //             Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: false })
    //         ]).start();
    //         Animated.sequence([
    //             Animated.timing(animatedColors, {
    //                 toValue: 1,
    //                 duration: 100,
    //                 easing: Easing.linear,
    //                 useNativeDriver: false,
    //             }),
    //             Animated.timing(animatedColors, {
    //                 toValue: 0,
    //                 duration: 1000,
    //                 easing: Easing.linear,
    //                 useNativeDriver: false,
    //             }),
    //         ]).start(() => {
    //             // console.log(notValid)
    //             setNotValid((prev) => prev.filter((item) => item !== activeDropdown));
    //             // console.log(notValid)
    //         });
    //         return;
    //     }
    //     if (currentSets[activeDropdown] !== exercises.length) {
    //         exercises[activeDropdown].prev_weight = exercises[activeDropdown].data[currentSets[activeDropdown] - 1].weight
    //         exercises[activeDropdown].prev_reps = exercises[activeDropdown].data[currentSets[activeDropdown] - 1].reps
    //         updateRecommendedWeight(exercises[activeDropdown].data[currentSets[activeDropdown] - 1].weight, exercises[activeDropdown].data[currentSets[activeDropdown] - 1].reps, exercises[activeDropdown].optimal_reps, currentSets[activeDropdown])
    //     }
    //     // Keyboard.dismiss()
    //     exercises[activeDropdown].complete = true;
    //     data.workouts.find(exercise => exercise.name === exercises[activeDropdown].name).data = [...exercises[activeDropdown].data];
    //     FileSystemCommands.updateWorkoutFiles(data);
    //     setData(data);
    //     closeDropdown(activeDropdown)
    //     setActiveDropdown(null);
    // };
    const sleep = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    };
    const handleToggleDropdown = async (exercise, index) => {
        // Keyboard.dismiss();
        // console.log("prev",currentSets)
        // scrollX.setValue(currentSets[index] * 327.5)
        if (index === activeDropdown) { // closing dropdown that is open
            closeDropdown(index);
            setActiveDropdown(null);
        } else {
            if (activeDropdown !== null) { // opening dropdown when one is open
                closeDropdown(activeDropdown);
                await sleep(200)
            }
            setActiveDropdown(index);
            openDropdown(index, exercise);
        }
        // console.log("new",currentSets)
    };

    const handleTextChange = (text, type, index, currentSet) => {
        // console.log("in handle text change",currentSet)
        // if (currentSet === undefined) return
        const updatedExercises = [...exercises];
        if (type === "Weight") {
            updatedExercises[activeDropdown].data[index].weight = text === "" ? null : Number(text);
        } else if (type === "Reps") {
            updatedExercises[activeDropdown].data[index].reps = text === "" ? null : Number(text.split('.')[0]);
        }
        setExercises(updatedExercises);
        // console.log(currentSet)
        if (index !== exercises.length) {
            exercises[activeDropdown].prev_weight = exercises[activeDropdown].data[currentSet].weight
            exercises[activeDropdown].prev_reps = exercises[activeDropdown].data[currentSet].reps
            updateRecommendedWeight(exercises[activeDropdown].data[index].weight, exercises[activeDropdown].data[index].reps, exercises[activeDropdown].optimal_reps, index)
        }
        // console.log("here2")
        FileSystemCommands.updateWorkoutFiles(data)
        setData(data)
    }
    // const handleTextChange = (text, type, index, currentSet) => {
    //     const updatedExercises = [...exercises];
    //     if (type === "Weight") {
    //         updatedExercises[activeDropdown].data[index].weight = text === "" ? null : Number(text);
    //     } else if (type === "Reps") {
    //         updatedExercises[activeDropdown].data[index].reps = text === "" ? null : Number(text.split('.')[0]);
    //     }
    //     setExercises(updatedExercises);
    //     console.log(currentSets[activeDropdown])
    //     if (index !== exercises.length) {
    //         exercises[activeDropdown].prev_weight = exercises[activeDropdown].data[currentSets[activeDropdown]].weight
    //         exercises[activeDropdown].prev_reps = exercises[activeDropdown].data[currentSets[activeDropdown]].reps
    //         updateRecommendedWeight(exercises[activeDropdown].data[index].weight, exercises[activeDropdown].data[index].reps, exercises[activeDropdown].optimal_reps, index)
    //     }
    //     console.log("here2")
    //     FileSystemCommands.updateWorkoutFiles(data)
    //     setData(data)
    // }

    const handleEdits = (index, totalSets) => {
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

    // const scrollXValues = Array.from({ length: 100 }, () => useRef(new Animated.Value(0)).current);




    const Indicator = ({ scrollX }) => {

        if (activeDropdown === null) return
        // console.log("scrollX", scrollX)
        const finalIndex = exercises[activeDropdown].sets - 1;
        var currentIndex = Math.round(scrollX._value / 327.5);//currentSets[activeDropdown];
        const isFirstSet = currentIndex === 0;
        const isFinalSet = currentIndex === finalIndex;
        const style = { height: 5, width: 5, borderRadius: 5, margin: 10, backgroundColor: "#ffffff" };
        var currentDots = 0
        // console.log("----")
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
                    {/* console.log(i > currentIndex + 3 || i < currentIndex - 3) */ }
                    // Check if opacity value is greater than 0.01 (a small threshold)
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
                            const flatListRef = flatListRefs.current[activeDropdown];
                            if (flatListRef) {
                                flatListRef.current.scrollToIndex({ index: i, animated: true, duration: 3000 });
                            }
                        }}>
                            <Animated.View style={{ transform: [{ scale: scale }, { translateX: translate }], opacity: opacity, height: 5, width: 5, borderRadius: 5, margin: 10, backgroundColor: "#ffffff" }}></Animated.View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };
    const [scrolling, setScrolling] = useState(false);
    // const renderItem = ({ item, index }, shakeAnimation, animatedColors, currentSet) => {

    //     return (

    //         <View>
    //             <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, marginHorizontal: 30 }}>
    //                 <TouchableOpacity onPress={() => {

    //                     // Keyboard.dismiss()
    //                     if (currentSets[activeDropdown] === 0) return
    //                     const flatListRef = flatListRefs.current[activeDropdown];
    //                     if (flatListRef) {
    //                         // console.log(currentSets[activeDropdown])
    //                         flatListRef.current.scrollToIndex({ index: currentSets[activeDropdown] - 1, animated: true });
    //                     }
    //                     // setTimeout(() => { setCurrentSet(currentSet - 1) }, 50)
    //                 }} style={{ padding: 15, opacity: index + 1 === 1 ? .2 : 1 }}>
    //                     <Image source={require('../../../assets/back.png')} tintColor={'white'} style={{ width: 30, height: 30 }} />
    //                 </TouchableOpacity>
    //                 <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'white', alignSelf: 'center' }}>Set {index + 1}</Text>
    //                 {index + 1 < exercises[activeDropdown].sets ?
    //                     <TouchableOpacity onPress={() => {
    //                         // Keyboard.dismiss()
    //                         const flatListRef = flatListRefs.current[activeDropdown];
    //                         if (flatListRef) {
    //                             flatListRef.current.scrollToIndex({ index: currentSets[activeDropdown] + 1, animated: true });
    //                         }
    //                         // setTimeout(() => { setCurrentSet(currentSet + 1) }, 50)
    //                     }} style={{ padding: 15 }}>
    //                         <Image source={require('../../../assets/back.png')} tintColor={'white'} style={{ width: 30, height: 30, transform: [{ scaleX: -1 }] }} />
    //                     </TouchableOpacity> :
    //                     <TouchableOpacity onPress={() => handleComplete(animatedColors, shakeAnimation)} style={{ padding: 15, opacity: notValid.includes(index + 1) ? .2 : 1 }} disabled={notValid.includes(index + 1) ? true : false}>
    //                         <Image source={require('../../../assets/check-mark.png')} tintColor={'white'} style={{ width: 30, height: 30 }} />
    //                     </TouchableOpacity>
    //                 }
    //             </View>
    //             <View style={{ marginBottom: 16, marginHorizontal: 10, width: 307.5 }}>
    //                 <View style={{ flexDirection: 'row' }}>
    //                     <Text style={{ fontSize: 20, color: 'white', marginBottom: 8, fontWeight: 'bold', marginRight: 4 }}>Weight</Text>
    //                     <Text style={{ fontSize: 20, color: 'white', marginBottom: 8 }}>(lbs)</Text>
    //                 </View>
    //                 <TextInput
    //                     keyboardType='numeric'
    //                     style={{
    //                         color: "white",
    //                         height: 40,
    //                         backgroundColor: handleEdits(index, exercises[activeDropdown].sets - 1) ? 'transparent' : 'gray',
    //                         borderColor: 'grey',
    //                         borderWidth: 2,
    //                         borderRadius: 8,
    //                         paddingHorizontal: 12,
    //                         fontSize: 16,

    //                     }}
    //                     placeholderTextColor={"grey"}
    //                     placeholder={item.recommended_weight !== null ? String(Math.round(item.recommended_weight / 5) * 5) : ""}
    //                     value={String(exercises[activeDropdown].data[index].weight ?? "")}
    //                     onChangeText={(text) => handleTextChange(text, type = "Weight", index)}
    //                     editable={!scrolling && handleEdits(index, exercises[activeDropdown].sets - 1)}
    //                     keyboardAppearance="dark"
    //                 />
    //             </View>
    //             <View style={{ marginBottom: 16, marginHorizontal: 10 }}>
    //                 <Text style={{ fontSize: 20, color: 'white', marginBottom: 8, fontWeight: 'bold' }}>Reps</Text>
    //                 <TextInput
    //                     keyboardType='number-pad'
    //                     style={{
    //                         color: "white",
    //                         height: 40,
    //                         backgroundColor: handleEdits(index, exercises[activeDropdown].sets - 1) ? 'transparent' : 'gray',
    //                         borderColor: 'grey',
    //                         borderWidth: 2,
    //                         borderRadius: 8,
    //                         paddingHorizontal: 12,
    //                         fontSize: 16,
    //                     }}

    //                     value={String(exercises[activeDropdown].data[index].reps ?? "")}
    //                     onChangeText={(text) => handleTextChange(text, type = "Reps", index)}
    //                     editable={!scrolling && handleEdits(index, exercises[activeDropdown].sets - 1)}
    //                     keyboardAppearance="dark"
    //                 />
    //             </View>
    //         </View>
    //     )
    // }
    const renderItem = ({ item, index }, shakeAnimation, animatedColors, currentSet) => {
        // console.log("in render item", currentSet)
        return (
            <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, marginHorizontal: 30 }}>
                    <TouchableOpacity onPress={() => {

                        // Keyboard.dismiss()
                        if (currentSet === 0) return
                        const flatListRef = flatListRefs.current[activeDropdown];
                        if (flatListRef) {
                            // console.log(currentSets[activeDropdown])
                            flatListRef.current.scrollToIndex({ index: currentSet - 1, animated: true });
                        }
                        // setTimeout(() => { setCurrentSet(currentSet - 1) }, 50)
                    }} style={{ padding: 15, opacity: index + 1 === 1 ? .2 : 1 }}>
                        <Image source={require('../../../assets/back.png')} tintColor={'white'} style={{ width: 30, height: 30 }} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'white', alignSelf: 'center' }}>Set {index + 1}</Text>
                    {index + 1 < exercises[activeDropdown].sets ?
                        <TouchableOpacity onPress={() => {
                            // Keyboard.dismiss()
                            const flatListRef = flatListRefs.current[activeDropdown];
                            if (flatListRef) {
                                flatListRef.current.scrollToIndex({ index: currentSet + 1, animated: true });
                            }
                            // setTimeout(() => { setCurrentSet(currentSet + 1) }, 50)
                        }} style={{ padding: 15 }}>
                            <Image source={require('../../../assets/back.png')} tintColor={'white'} style={{ width: 30, height: 30, transform: [{ scaleX: -1 }] }} />
                        </TouchableOpacity> :
                        <TouchableOpacity onPress={() => handleComplete(animatedColors, shakeAnimation, currentSet)} style={{ padding: 15, opacity: notValid.includes(index + 1) ? .2 : 1 }} disabled={notValid.includes(index + 1) ? true : false}>
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
                        onChangeText={(text) => handleTextChange(text, type = "Weight", index, currentSet)}
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
                        onChangeText={(text) => handleTextChange(text, type = "Reps", index, currentSet)}
                        editable={!scrolling && handleEdits(index, exercises[activeDropdown].sets - 1)}
                        keyboardAppearance="dark"
                    />
                </View>
            </View>
        )
    }

    const flatListRefs = useRef([]);
    useEffect(() => {
        flatListRefs.current = exercises.map(() => createRef());
    }, [exercises]);
    // const [currentSets, setCurrentSets] = useState(Array.from({ length: exercises.length }, () => 0));

    const [prevScrollDirection, setPrevScrollDirection] = useState(null)
    // const handleScrollEnd = () => {
    //     setScrolling(false);
    // };
    // const onScroll = (event) => {
    //     // setScrolling(true)
    //     const scrollOffset = event.nativeEvent.contentOffset.x
    //     // console.log(scrollOffset)
    //     const itemHeight = 327.5; // Replace ITEM_HEIGHT with the actual height of each item

    //     // Calculate the index of the visible item based on the scroll offset and item height
    //     const visibleItemIndex = Math.round(scrollOffset / itemHeight);
    //     // console.log("scrollOffset", scrollOffset)


    //     // Update currentSets based on the visibleItemIndex
    //     setCurrentSets(prev => {
    //         const newSets = [...prev];
    //         setPrevScrollDirection(visibleItemIndex > newSets[activeDropdown] ? 'right' : visibleItemIndex < newSets[activeDropdown] ? 'left' : null)
    //         newSets[activeDropdown] = visibleItemIndex;
    //         return newSets;
    //     });
    // };
    const onScroll = (event, setCurrentSet) => {
        // setScrolling(true)
        const scrollOffset = event.nativeEvent.contentOffset.x
        // console.log(scrollOffset)
        const itemHeight = 327.5; // Replace ITEM_HEIGHT with the actual height of each item

        // Calculate the index of the visible item based on the scroll offset and item height
        const visibleItemIndex = Math.round(scrollOffset / itemHeight);
        // console.log("scrollOffset", scrollOffset)


        // Update currentSets based on the visibleItemIndex
        setCurrentSet(visibleItemIndex)
    };


    return (
        <KeyboardAvoidingView behavior="position" enabled keyboardVerticalOffset={125}>
            <ScrollView style={{ borderRadius: 10, marginHorizontal: 15 }} keyboardShouldPersistTaps='always'>
                <View style={{ marginBottom: -15 }}>
                    {exercises.sort((a, b) => a.complete - b.complete).map((exercise, index) => {
                        const scrollX = useRef(new Animated.Value(0)).current
                        const animatedColors = useRef(new Animated.Value(0)).current;
                        const shakeAnimation = useRef(new Animated.Value(0)).current;
                        const backgroundColorInterpolation = animatedColors.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['#242424', '#ff0033'],
                        });
                        const [currentSet, setCurrentSet] = useState(0);
                        return (
                            <CustomCard key={index} styles={{ marginTop: 0, marginLeft: 0, marginRight: 0, marginBottom: null, backgroundColor: notValid.includes(index) ? backgroundColorInterpolation : '#242424', transform: [{ translateY: shakeAnimation }] }} screen={
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


                                        {activeDropdown != null && console.log("updating", currentSet)}
                                        {activeDropdown != null && currentSet < exercises[activeDropdown].data.length?

                                            <FlatList
                                                getItemLayout={(data, index) => (
                                                    { length: 327.5, offset: 327.5 * index, index }
                                                )}
                                                data={exercises[activeDropdown].data}
                                                ref={flatListRefs.current[index]}
                                                initialScrollIndex={currentSet}
                                                keyExtractor={(item, index) => `${index}_${activeDropdown}`}
                                                onMomentumScrollEnd={(event) => onScroll(event, setCurrentSet)}
                                                keyboardShouldPersistTaps='always'
                                                renderItem={({ item, index }) => renderItem({ item, index }, shakeAnimation, animatedColors, currentSet)}
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
                                        <Indicator scrollX={scrollX} />
                                    </Animated.View>
                                </View>
                            } />
                        )
                    })}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}