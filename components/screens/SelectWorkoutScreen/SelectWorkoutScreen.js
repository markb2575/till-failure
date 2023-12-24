import { useState, useEffect } from 'react';
import { View, Text, Button, Image, ScrollView, Dimensions } from 'react-native';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FileSystemCommands from "../../util/FileSystemCommands"
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import { ListItem, Card } from '@rneui/themed';
import CustomCard from '../CustomCard';
import ScrollPrograms from './ScrollPrograms';

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
    //get files to check if initial route name should be select workout or workout page
    return (
<View>
  <Text style={{ fontSize: 40, fontWeight: 'bold', color: 'white', marginHorizontal: 70, alignSelf: 'center', marginTop: 50}}>Programs</Text>
  {data ? (
    <View style={{ marginHorizontal: 15}}>
    <View style={{marginBottom:10}}>
        <CustomCard screen={
            <View style={{ flexDirection: 'row', alignSelf: 'center'}}>
            <Image source={require('../../../assets/plus.png')} tintColor={'white'} style={{ width: 30, height: 30, alignSelf: 'center', margin: 5 }} />
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', margin: 5, alignSelf: 'center' }}>Create</Text>
            </View>
        } />
      </View>
      <ScrollPrograms navigation={navigation} data={data} />
    </View>
  ) : null}
</View>


    );
}