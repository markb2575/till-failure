import { useState, useEffect } from 'react';
import { View, Text, Button, Image, ScrollView, Dimensions } from 'react-native';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FileSystemCommands from "../../util/FileSystemCommands"
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import { ListItem, Card } from '@rneui/themed';
import CustomCard from '../CustomCard';

export default function ScrollPrograms({ navigation, data }) {
    const [isScrolling, setIsScrolling] = useState(false)
    const handleProgramPress = (programName) => {
        if (isScrolling) return
        data.state.selectedProgram = programName
        FileSystemCommands.updateWorkoutFiles(data)
        navigation.navigate("Workout")
    }
    //get files to check if initial route name should be select workout or workout page
    return (
        <View style={{ height: "53%", marginBottom:'90%', marginTop:'5%'}}>
            <ScrollView style={{ flexGrow: 1 }}
                onScrollBeginDrag={() => setIsScrolling(true)}
                onScrollEndDrag={() => setIsScrolling(false)}
            >
                <View>
                    {Object.keys(data.programs).map((item, index) => (
                        <View key={index} onTouchEnd={() => { handleProgramPress(item) }}>
                            <CustomCard screen={
                                <View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Image source={require('../../../assets/workout_icon.png')} tintColor={'white'} style={{ width: 30, height: 15, alignSelf: 'center', margin: 5 }} />
                                        <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'white', margin: 5, alignSelf: 'center', marginLeft: 0 }}>{item}</Text>
                                    </View>
                                    <Text style={{ fontSize: 20, color: 'grey', margin: 5 }}>
                                        {data.programs[item].map((program) => program.day).join(' | ')}
                                    </Text>
                                </View>
                            } />
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}