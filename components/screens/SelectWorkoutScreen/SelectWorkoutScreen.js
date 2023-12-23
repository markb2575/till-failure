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
            <Text style={{ fontSize: 40, fontWeight: 'bold', color: 'white', marginBottom: 15, marginHorizontal:70}}>Programs</Text>
            <Card.Divider color='grey' style={{marginBottom: 0}} />
            {data ? (
                <View>
                    {Object.keys(data.programs).map((item, index) => (
                        <View key={index}>
                            <ListItem containerStyle={{ backgroundColor: 'transparent' }} onPress={() => handleProgramPress(item)}>
                                <ListItem.Content>
                                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 5 }}>{item}</Text>
                                    <Text style={{ fontSize: 15, color: 'grey', marginBottom: 5 }}>
                                        {data.programs[item].map((program) => program.day).join(' | ')}
                                    </Text>
                                </ListItem.Content>
                            </ListItem>
                            <Card.Divider color='grey' style={{marginBottom:0}} />
                        </View>
                    ))}
                </View>
            ) : null}
        </View>
    );
}