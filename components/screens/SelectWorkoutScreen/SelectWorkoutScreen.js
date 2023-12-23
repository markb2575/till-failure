import { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FileSystemCommands from "../../util/FileSystemCommands"
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import { ListItem, Card } from '@rneui/themed';
import CustomCard from '../CustomCard';

export default function SelectWorkoutScreen({ navigation }) {
    const [data, setData] = useState(null);
    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused) {
            FileSystemCommands.setupProject().then(res => {
                setData(res)
            })
        }
    }, [isFocused, setData])
    const handleProgramPress = (programName) => {
        data.state.selectedProgram = programName
        FileSystemCommands.updateWorkoutFiles(data)
        navigation.navigate("Workout")
    }
    //get files to check if initial route name should be select workout or workout page
    return (
        <View>
            <Text style={{ fontSize: 40, fontWeight: 'bold', color: 'white', marginBottom: 15, marginHorizontal: 70, marginTop: 50, alignSelf: 'center'}}>Programs</Text>
            {data ? (
                <View>
                    {Object.keys(data.programs).map((item, index) => (
                        <CustomCard screen={
                            <View onTouchStart={() => {handleProgramPress(item)}} key={index}>
                                <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'white', margin: 5, alignSelf: 'center'}}>{item}</Text>
                                <Text style={{ fontSize: 20, color: 'grey' , margin: 5 }}>
                                    {data.programs[item].map((program) => program.day).join(' | ')}
                                </Text>
                            </View>
                        } />
                    ))}
                </View>
            ) : null}
        </View>
    );
}