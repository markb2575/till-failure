import { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FileSystemCommands from "../../util/FileSystemCommands"
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import { ListItem } from '@rneui/themed';

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
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Select Workout</Text>
            {data ? (
                Object.keys(data.programs).map((l, i) => (
                    <ListItem key={i} style={{}}>
                        {/* <ListItem.Content> */}
                        <Text>{l}</Text>
                        {/* </ListItem.Content> */}
                    </ListItem>
                ))
            ) : null}
        </View>
    );
}