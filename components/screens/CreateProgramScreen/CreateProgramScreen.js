import { useState, useEffect, React, useRef } from 'react';
import { View, Text, Button, Image, ScrollView, TouchableOpacity, TextInput, Vibration } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import FileSystemCommands from "../../util/FileSystemCommands";
import CustomCard from '../CustomCard';
import CustomHeader from '../CustomHeader';

export default function CreateProgramScreen({ navigation, route }) {
    const [data, setData] = useState(null);
    const [program, setProgram] = useState({ info: [], state: { currentDayIndex: 0, exercises: [] } });
    const isFocused = useIsFocused();
    // const [totalDays, setTotalDays] = useState(1);
    const [programName, setProgramName] = useState('');

    useEffect(() => {
        if (isFocused) {
            FileSystemCommands.setupProject().then(res => {
                setData(res);
            });
        }
    }, [isFocused]);

    useEffect(() => {
        if (route.params?.day) {
            setProgram((prevProgram) => {
                const updatedProgram = { ...prevProgram };
                updatedProgram.info.push(route.params.day);
                return updatedProgram;
            });
        }
    }, [route.params?.day]);

    // const addDay = () => {
    //     navigation.navigate("CreateDay", {day: item})
    // setTotalDays(prev => prev + 1);
    // setProgram((prevProgram) => {
    //     const updatedProgram = { ...prevProgram };
    //     updatedProgram.info.push({ day: `Day ${oldDays + 1}`, workouts: [{}] });
    //     return updatedProgram;
    // });
    // };

    const deleteDay = (index) => {
        Vibration.vibrate(500);
        setProgram((prevProgram) => {
            const updatedProgram = { ...prevProgram };
            updatedProgram.info.splice(index, 1);
            return updatedProgram;
        });
    };

    const verifySave = () => {
        if (programName != '' && program.info.length > 0 && data.programs[programName] === undefined) {
            const payload = {
                [programName]: program
            };
            const newData = {
                ...data,
                programs: {
                    ...data.programs,
                    ...payload
                }
            };
            setData(newData)
            FileSystemCommands.updateWorkoutFiles(newData)
            navigation.navigate("Programs")
        } else {
            Vibration.vibrate(500)
            console.log("error")
        }
    };

 

    return (
        false ? null : (
            <View style={{ flex: 1 }}>
                <CustomHeader
                    navigation={navigation}
                    leftNavigate={"Programs"}
                    leftImage={<Image source={require('../../../assets/back.png')} tintColor={'white'} style={{ width: 26, height: 26 }} />}
                    titleText={"Create Program"}
                />
                <CustomCard styles={{ padding: 10 }} screen={
                    <TextInput
                        style={{ fontSize: 25, padding: 7, color: 'white', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
                        placeholder="Enter Program Name"
                        placeholderTextColor={"grey"}
                        value={programName}
                        onChangeText={text => {
                            setProgramName(text);
                        }}
                        keyboardAppearance="dark"
                    />
                } />
                <View style={{ height: "67.5%" }}>
                    <ScrollView style={{ borderRadius: 10, margin: 15, padding: 0 }}>
                        {program.info.length != 0 && program.info.map((item, index) => (

                            <CustomCard key={index} styles={{ marginTop: 0, marginLeft: 0, marginRight: 0, marginBottom: null }} screen={
                                <TouchableOpacity style={{ padding: 10, marginLeft: 15, flexDirection: "row", flex: 1, justifyContent: 'space-between', alignItems: 'center' }}>
                                    <View style={{maxWidth: '75%'}}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'white', margin: 5, alignSelf: 'center', marginLeft: 5 }}>{item.day}</Text>
                                        </View>
                                        <Text style={{ fontSize: 20, color: 'grey', margin: 5 }}>{item.workouts.length === 1 ? `${item.workouts.length} Exercise` : `${item.workouts.length} Exercises`}</Text>
                                    </View>
                                    <TouchableOpacity onLongPress={() => deleteDay(index)} style={{ marginRight: 13.5 }}>
                                        <View style={{ padding: 10, borderRadius: 10 }}>
                                            <Image source={require('../../../assets/x.png')} style={{ width: 25, height: 25 }} />
                                        </View>
                                    </TouchableOpacity>
                                </TouchableOpacity>
                            } />
                        ))}
                        <TouchableOpacity onPress={() => navigation.navigate("CreateDay")} style={{ padding: 12 }}>
                            <Image source={require('../../../assets/plus.png')} tintColor={'white'} style={{ width: 40, height: 40, alignSelf: "center", borderRadius: 30 }} />
                        </TouchableOpacity>
                    </ScrollView>
                </View>
                <View style={{ position: 'absolute', bottom: 40, right: 0, left: 0 }}>
                    <CustomCard  screen={
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
