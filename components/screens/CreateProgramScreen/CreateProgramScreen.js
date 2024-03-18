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
            FileSystemCommands.setupProject().then(res => {
                setData(res)
                setProgram({
                    [programName]: {
                        "info": [
            
                        ],
                        "state": {
                            "currentDayIndex": 0,
                            "exercises": []
                        }
                    }
                })
            })

        }
    }, [isFocused, programName, setData])
    //get files to check if initial route name should be select workout or workout page

    const addDay = () => {
        setTotalDays(prev => prev + 1)
        setProgram(prevProgram => {
            prevProgram[programName].info.push({ day: `Day ${totalDays}`, workouts: [{}] })
            setProgram(prevProgram)
        });

    };

    const deleteDay = (index) => {
        Vibration.vibrate(500)
        setProgram(prevProgram => {
            prevProgram[programName].info.splice(index, 1)
            setProgram(prevProgram)
        });
    };


    return (

        !data || !program ? (null) : (
            <View style={{ flex: 1 }}>
                <CustomHeader navigation={navigation} leftNavigate={"Programs"}  leftImage={<Image source={require('../../../assets/back.png')} tintColor={'white'} style={{ width: 26, height: 26 }} />} titleText={"Create Program"} />
                <CustomCard marginRight={0} marginTop={0} screen={
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <TextInput style={{ fontSize: 22, padding: 18, marginHorizontal: 16.25, color: 'white', margin: 5 }}
                            placeholder="Enter Program Name"
                            placeholderTextColor="#d3d3d3"
                            value={programName}
                            onChangeText={text => setProgramName(text)}
                        />
                    </View>
                } />

                <View style={{ height: "70%" }}>
                    <ScrollView
                        style={{ borderRadius: 10, marginTop: 15 }}
                    >
                        <View>
                            {program[programName] && program[programName].info.map((item, index) => (
                                <CustomCard key={index} styles={{flexDirection: 'row', marginTop: 0, marginBottom: null }} screen={
                                    <><TouchableOpacity onPress={() => navigation.navigate("CreateDay", {day: item})} style={{flex: 1, flexDirection: 'row', padding: 20, justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20 }}>
                                        <View style={{ }}>
                                            <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'white', alignSelf: 'center', marginLeft: 0}}>{item.day}</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onLongPress={() => deleteDay(index)} style={{justifyContent: 'center', marginRight: 10}}>
                                        <View style={{ padding: 10, borderRadius: 10}}>
                                            <Image source= {require('../../../assets/trash.png')} style={{ width: 25, height: 30}}></Image>
                                        </View>
                                    </TouchableOpacity></>
                                } />

                            ))}
                        </View>
                        <CustomCard style={{}} screen={
                            <TouchableOpacity onPress={() => addDay()} style={{ padding: 20 }}>
                                <View style={{flexDirection: 'row', alignItems: 'bottom', justifyContent: 'center' }}>
                                    <Image source={require('../../../assets/plus.png')} tintColor={'white'} style={{width: 30, height: 30, marginHorizontal: 10}} ></Image>
                                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', margin: 5 }}>Add Day</Text>
                                </View>
                            </TouchableOpacity>
                        } />
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