import { useState, useEffect, React } from 'react';
import { View, Text, setText, Button, Image, ScrollView, Dimensions, TouchableOpacity, TextInput, Alert, Vibration } from 'react-native';
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
    


    return (
        !data || !program ? (null) : (
            
            <View style={{ flex: 1 }}>
                <CustomHeader navigation={navigation} leftNavigate={"Programs"} leftImage={<Image source={require('../../../assets/back.png')} tintColor={'white'} style={{ width: 26, height: 26 }} />} titleText={"Create Program"} />
                <CustomCard styles={{ padding: 10 }} screen={
                    // <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <TextInput style={{ fontSize: 25, padding: 10, color: 'white', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
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
                                <View style={{ flexDirection: "row", flex: 1, justifyContent: 'space-between', alignItems: 'center' }}>
                                    <TouchableOpacity onPress={() => navigation.navigate("CreateDay", { day: item })} style={{ marginLeft: 15 }}>
                                        <View>
                                            <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'white', alignSelf: 'center' }}>{item.day}</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onLongPress={() => deleteDay(index)} style={{ marginRight: 13.5 }}>
                                        <View style={{ padding: 10, borderRadius: 10 }}>
                                            <Image source={require('../../../assets/trash.png')} style={{ width: 25, height: 30 }} />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            } />
                        ))}

                        {/* <CustomCard styles={{ margin: 0 }} screen={ */}
                            <TouchableOpacity onPress={() => addDay(totalDays)} style={{ padding: 12 }}>
                                {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}> */}
                                    {/* <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'white', margin: 5, marginLeft: 15 }}>Add Day</Text> */}
                                    <Image source={require('../../../assets/plus.png')} tintColor={'white'} style={{ width: 40, height: 40, alignSelf: "center", borderRadius: 30 }} ></Image>
                                {/* </View> */}
                            </TouchableOpacity>
                        {/* } /> */}
                    </ScrollView>
                </View>


                <View style={{ position: 'absolute', bottom: 40, right: 0, left: 0 }}>
                    <CustomCard screen={
                        <TouchableOpacity onPress={() => Alert.alert('save pressed')}  /*save to workout*/ style={{ padding: 10, marginHorizontal: 16.25 }}>
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