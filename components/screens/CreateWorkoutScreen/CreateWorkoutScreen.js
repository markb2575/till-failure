import { useState, useEffect, React } from 'react';
import { View, Text, setText, Button, Image, ScrollView, Dimensions, TouchableOpacity, TextInput} from 'react-native';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FileSystemCommands from "../../util/FileSystemCommands"
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import { ListItem, Card } from '@rneui/themed';
import CustomCard from '../CustomCard';

export default function CreateWorkoutScreen({ navigation }) {
    const [data, setData] = useState(null);
    const isFocused = useIsFocused();
    const [inputValue, setText] = useState('');
    useEffect(() => {
        if (isFocused) {
            FileSystemCommands.setupProject().then(res => {
                setData(res)
            })
        }
    }, [isFocused, setData])
    //get files to check if initial route name should be select workout or workout page
    return (
        <View>
            <Text style={{ fontSize: 40, fontWeight: 'bold', color: 'white', marginBottom: 15, marginHorizontal: 70, marginTop: 50, alignSelf: 'center' }}>Create Workout</Text>
            <CustomCard marginRight={0} screen={
                            <TouchableOpacity onPress={() => navigation.navigate("Programs")} style={{padding:10, marginHorizontal:16.25}}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                    <Image source={require('../../../assets/back.png')} tintColor={'white'} style={{ width: 30, height: 30, margin: 5 }} />
                                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', margin: 5}}>Back</Text>
                                </View>
                            </TouchableOpacity>
            } />
            <CustomCard marginRight={0} marginTop={0} screen ={
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                <TextInput style={{fontSize:22, padding:20, marginHorizontal:16.25, color: 'white', margin: 5 }}
                                    placeholder="Enter Workout Name"
                                    placeholderTextColor="#d3d3d3"
                                    value={inputValue}
                                    onChangeText={newText => setText(newText)}
                                />
                            </View>               
            } />
            {/* <CustomCard marginRight={0} screen={
                            <TouchableOpacity onPress={() => navigation.navigate("Programs")} style={{padding:10, marginHorizontal:16.25}}>
                                <View style={{ flexDirection: 'row', alignItems: 'bottom', justifyContent: 'center'}}>
                                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', margin: 5}}>Save</Text>
                                </View>
                            </TouchableOpacity>
                        } /> */}
        </View>
    );
}