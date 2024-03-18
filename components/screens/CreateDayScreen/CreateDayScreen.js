import { useState, useEffect, React } from 'react';
import { View, Text, setText, Button, Image, ScrollView, Dimensions, TouchableOpacity, TextInput, Alert } from 'react-native';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FileSystemCommands from "../../util/FileSystemCommands"
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import { ListItem, Card } from '@rneui/themed';
import CustomCard from '../CustomCard';
import CustomHeader from '../CustomHeader';

export default function CreateDayScreen({ navigation, route}) {
    const [data, setData] = useState(null);
    const [program, setProgram] = useState(null);
    const isFocused = useIsFocused();
    const [totalDays, setTotalDays] = useState(1);
    const [dayName, setDayName] = useState('');
    useEffect(() => {
        if (isFocused) {
            FileSystemCommands.setupProject().then(res => {
                setData(res)
                
            })


        }
    }, [isFocused, dayName, setData])
    //get files to check if initial route name should be select workout or workout page

    const updateDayName = (newDayName) => {
        setDayName(newDayName)
        navigation.setParams({day: newDayName})
    }

    const addDay = () => {
        setTotalDays(prev => prev + 1)
        setProgram(prevProgram => {
            prevProgram[dayName].info.push({ day: `Day ${totalDays}`, workouts: [{}] })
            setProgram(prevProgram)
        });

    };

    const deleteDay = (index) => {
        setProgram(prevProgram => {
            prevProgram[dayName].info.splice(index, 1)
            setProgram(prevProgram)
        });
    };

    


    return (
            <View style={{ flex: 1 }}>
                {console.log(route.params)}
                <CustomHeader navigation={navigation} leftNavigate={"CreateWorkout"} leftImage={<Image source={require('../../../assets/back.png')} tintColor={'white'} style={{ width: 26, height: 26 }} />} titleText={"Create Day"} />
                <CustomCard marginRight={0} marginTop={0} screen={
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <TextInput style={{ fontSize: 22, padding: 18, marginHorizontal: 16.25, color: 'white', margin: 5 }}
                            placeholder="Enter Day Name"
                            placeholderTextColor="#d3d3d3"
                            value={dayName}
                            onChangeText={text => updateDayName(text)}
                        />
                    </View>
                } />


                
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
    
}