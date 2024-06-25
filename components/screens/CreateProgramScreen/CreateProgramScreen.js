import { useState, useEffect, React, useRef } from 'react';
import { View, Text, setText, Button, Image, ScrollView, Dimensions, TouchableOpacity, TextInput, Alert, Vibration, Animated } from 'react-native';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FileSystemCommands from "../../util/FileSystemCommands"
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import { ListItem, Card } from '@rneui/themed';
import CustomCard from '../CustomCard';
import CustomHeader from '../CustomHeader';

export default function CreateProgramScreen({ navigation }) {
    const [data, setData] = useState(null);
    const [program, setProgram] = useState(null);
    const isFocused = useIsFocused();
    const [totalDays, setTotalDays] = useState(1);
    const [programName, setProgramName] = useState('');
    const animatedHeights = useRef(Array.from({ length: 100 }, () => new Animated.Value(0))).current;
    const [activeDropdown, setActiveDropdown] = useState(null)
    useEffect(() => {
        if (isFocused) {
            // need a way to save and load data when entering into createdayscreen
            FileSystemCommands.setupProject().then(res => {
                setData(res)
                setProgram({
                    [programName]: {
                        "info": [
                            { "day": `Day 1`, "workouts": [{}] }
                        ],
                        "state": {
                            "currentDayIndex": 0,
                            "exercises": []
                        }
                    }
                })
            })

        }
    }, [isFocused, programName])
    //get files to check if initial route name should be select workout or workout page
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
    const addDay = (oldDays) => {
        setTotalDays(prev => prev + 1)
        setProgram(prevProgram => ({
            ...prevProgram,
            [programName]: {
                ...prevProgram[programName],
                info: [
                    ...prevProgram[programName].info,
                    { day: `Day ${oldDays + 1}`, workouts: [{}] }
                ]
            }
        }));
    };

    const deleteDay = (index) => {
        Vibration.vibrate(500);
        setProgram(prevProgram => ({
            ...prevProgram,
            [programName]: {
                ...prevProgram[programName],
                info: prevProgram[programName].info.filter((_, i) => i !== index)
            }
        }));
        // setTotalDays(prev => prev - 1);
    };
    const verifySave = () => {
        console.log("verifying save")
    }

    const closeDropdown = (dropdownIndex) => {
        if (dropdownIndex === null) return
        Animated.timing(animatedHeights[dropdownIndex], {
            toValue: 0,
            duration: 150,
            useNativeDriver: false,
        }).start();
    };
    const openDropdown = (dropdownIndex) => {

        Animated.timing(animatedHeights[dropdownIndex], {
            toValue: 100,
            duration: 150,
            useNativeDriver: false,
        }).start();

    };
    const handleDayChange = (text, index) => {
        console.log("in handle text change",text, index)
        console.log("here1")
        const updatedProgram = program
        updatedProgram[index] = text
        console.log("here2")
        setProgram(updatedProgram)
        console.log("here3")
        // setData()
        // FileSystemCommands.updateWorkoutFiles()
        
        // FileSystemCommands.updateWorkoutFiles(data)
        // setData(data)
    }
    return (
        !data || !program ? (null) : (

            <View style={{ flex: 1 }}>
                <CustomHeader navigation={navigation} leftNavigate={"Programs"} leftImage={<Image source={require('../../../assets/back.png')} tintColor={'white'} style={{ width: 26, height: 26 }} />} titleText={"Create Program"} />
                <CustomCard styles={{ padding: 10 }} screen={
                    // <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <TextInput style={{ fontSize: 25, padding: 7, color: 'white', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
                        placeholder="Enter Program Name"
                        placeholderTextColor="#d3d3d3"
                        value={programName}
                        onChangeText={text => setProgramName(text)}
                    />
                    // </View>
                } />

                <View style={{ height: "70%" }}>
                    <ScrollView
                        style={{ borderRadius: 10, margin: 15, padding: 0 }}
                    >
                        {program[programName] && program[programName].info.map((item, index) => (
                            
                            <CustomCard key={index} styles={{ marginTop: 0, marginLeft: 0, marginRight: 0, marginBottom: null, padding: 10 }} screen={
                                <>{console.log(item.day)}
                                    <TouchableOpacity onPress={() => handleToggleDropdown(item, index)} style={{ flexDirection: "row", flex: 1, justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View style={{ marginLeft: 15 }}>
                                            <TextInput
                                                maxLength={16}
                                                keyboardType='default'
                                                style={{
                                                    color: "white",
                                                    height: 40,
                                                    backgroundColor: "transparent",
                                                    borderColor: 'grey',
                                                    borderWidth: 2,
                                                    borderRadius: 8,
                                                    paddingHorizontal: 70,
                                                    fontSize: 20,

                                                }}
                                                placeholderTextColor={"grey"}
                                                // placeholder={item.recommended_weight !== null ? String(Math.round(item.recommended_weight / 5) * 5) : ""}
                                                value={item.day}
                                                onChangeText={(text) => handleDayChange(text, index)}
                                                // editable={!scrolling && handleEdits(index, exercises[activeDropdown].sets - 1)}
                                                keyboardAppearance="dark"
                                            />
                                        </View>
                                        <TouchableOpacity onLongPress={() => deleteDay(index)} style={{ marginRight: 13.5 }}>
                                            <View style={{ padding: 10, borderRadius: 10 }}>
                                                <Image source={require('../../../assets/x.png')} style={{ width: 25, height: 25 }} />
                                            </View>
                                        </TouchableOpacity>
                                    </TouchableOpacity>
                                    <Animated.View style={{ paddingHorizontal: 16, height: animatedHeights[index] === undefined ? 0 : animatedHeights[index], overflow: 'hidden' }}>
                                        <Card.Divider style={{ marginBottom: 30, marginTop: 10 }} width={2} color={"grey"} />
                                    </Animated.View>
                                </>
                            } />

                        ))}
                        <TouchableOpacity onPress={() => addDay(totalDays)} style={{ padding: 12 }}>
                            <Image source={require('../../../assets/plus.png')} tintColor={'white'} style={{ width: 40, height: 40, alignSelf: "center", borderRadius: 30 }} ></Image>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
                <View style={{ position: 'absolute', bottom: 40, right: 0, left: 0 }}>
                    <CustomCard screen={
                        <TouchableOpacity onPress={verifySave} style={{ padding: 10, marginHorizontal: 16.25 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', margin: 5 }}>Save</Text>
                            </View>
                        </TouchableOpacity>
                    } />
                </View>
            </View>
        )
    );
}