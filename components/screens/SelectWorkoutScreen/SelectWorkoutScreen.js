import { useState, useEffect } from 'react';
import { View, Text, Button, Image, ScrollView, Dimensions, TouchableOpacity, Vibration } from 'react-native';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FileSystemCommands from "../../util/FileSystemCommands"
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import { ListItem, Card } from '@rneui/themed';
import CustomCard from '../CustomCard';
import ScrollPrograms from './ScrollPrograms';
import CustomHeader from '../CustomHeader';

export default function SelectWorkoutScreen({ navigation }) {
    const [data, setData] = useState(null);
    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused) {
            FileSystemCommands.setupProject().then(res => {
                setData(res)
            })
        }
    }, [isFocused, data])

    const deleteProgram = (item) => {
        const newDataPrograms = { ...data.programs };
        delete newDataPrograms[item];
        const newData = { ...data, programs: newDataPrograms };
        FileSystemCommands.updateWorkoutFiles(newData)
        setData(newData)
        Vibration.vibrate(500)
    }

    return (
        <View>
            {data ? (
                <View style={{ marginHorizontal: 15 }}>
                    <CustomHeader navigation={navigation} leftNavigate={"Workout"} rightNavigate={"CreateWorkout"} leftImage={<Image source={require('../../../assets/back.png')} tintColor={'white'} style={{ width: 26, height: 26 }} />} rightImage={<Image source={require('../../../assets/plus.png')} tintColor={'white'} style={{ width: 30, height: 30 }} />} titleText={"Programs"} />
                    <ScrollPrograms navigation={navigation} data={data} {...{ deleteProgram}} />
                </View>
            ) : null}
        </View>


    );
}