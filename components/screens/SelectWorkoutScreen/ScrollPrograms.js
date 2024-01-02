import { useState, useEffect } from 'react';
import { View, Text, Button, Image, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FileSystemCommands from "../../util/FileSystemCommands"
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import { ListItem, Card } from '@rneui/themed';
import CustomCard from '../CustomCard';

export default function ScrollPrograms({ navigation, data }) {
    const handleProgramPress = (programName) => {
        data.state.selectedProgram = programName
        FileSystemCommands.updateWorkoutFiles(data)
        navigation.navigate("Workout")
    }
    //get files to check if initial route name should be select workout or workout page
    return (
        <View style={{ height: "78%" }}>
            <ScrollView
                style={{ borderRadius: 10, marginTop:15}}
            >
                <View>
                    {Object.keys(data.programs).map((item, index) => (
                        <CustomCard key={index} styles={{marginTop: 0, marginLeft: 0, marginRight: 0, marginBottom:null}} screen={
                            <TouchableOpacity onPress={() => handleProgramPress(item)} style={{ padding: 10 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Image source={require('../../../assets/workout_icon.png')} tintColor={'white'} style={{ width: 30, height: 15, alignSelf: 'center', margin: 5 }} />
                                    <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'white', margin: 5, alignSelf: 'center', marginLeft: 0 }}>{item}</Text>
                                </View>
                                <Text style={{ fontSize: 20, color: 'grey', margin: 5 }}>
                                    {data.programs[item].info.map((program) => program.day).join(' | ')}
                                </Text>
                            </TouchableOpacity>
                        } />
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}