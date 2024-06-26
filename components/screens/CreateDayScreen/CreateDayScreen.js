import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, TextInput, Modal, TouchableWithoutFeedback, Vibration } from 'react-native';
import CustomCard from '../CustomCard';
import CustomHeader from '../CustomHeader';
import FileSystemCommands from "../../util/FileSystemCommands";

export default function CreateDayScreen({ navigation, route }) {
    const [data, setData] = useState(null);
    const [workouts, setWorkouts] = useState([]);
    const [dayName, setDayName] = useState("");


    useEffect(() => {
        if (navigation.isFocused()) {
            FileSystemCommands.setupProject().then(res => {
                setData(res)
            });
        }
    }, [navigation]);

    useEffect(() => {
        // console.log("Route params:", route.params);
        if (route.params?.exercise !== undefined) {
            // console.log("Adding new exercise:", route.params.exercise);
            setWorkouts((prevWorkouts) => [...prevWorkouts, route.params.exercise]);
            // console.log("added")
        }
    }, [route.params?.exercise]);

    // const addWorkout = () => {
    //     setWorkouts(prevWorkouts => [
    //         ...prevWorkouts,
    //         { name: "", rep_range: "", sets: null }
    //     ]);
    // };

    const deleteWorkout = (index) => {
        Vibration.vibrate(500);
        setWorkouts(prevWorkouts => {
            const updatedWorkouts = [...prevWorkouts];
            updatedWorkouts.splice(index, 1);
            return updatedWorkouts;
        });
    };

    const verifySave = () => {
        if (workouts.length > 0 && dayName.length > 0) {
            // console.log(workouts, dayName)
            // { "day": "Legs", "workouts": [{ "name": "Dumbbell Bench Press", "rep_range": "3-6", "sets": 2 }] },
            const payload = { "day": dayName, "workouts": workouts }
            navigation.navigate("CreateWorkout", { "day": payload })
        } else {
            console.log("error")
            Vibration.vibrate(500)
        }
    };



    return (
        <View style={{ flex: 1 }}>
            <CustomHeader navigation={navigation} leftNavigate={"CreateWorkout"} leftImage={<Image source={require('../../../assets/back.png')} tintColor={'white'} style={{ width: 26, height: 26 }} />} titleText={"Create Day"} />
            <CustomCard styles={{ padding: 10 }} screen={
                <TextInput style={{ fontSize: 25, padding: 7, color: 'white', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
                    placeholder="Enter Day Name"
                    placeholderTextColor={"grey"}
                    value={dayName}
                    onChangeText={(text) => { setDayName(text) }}
                    keyboardAppearance="dark"
                />
            } />

            <View style={{ height: "70%" }}>
                <ScrollView style={{ borderRadius: 10, margin: 15, padding: 0 }}>
                    {workouts.map((item, index) => (

                        <CustomCard key={index} styles={{ marginTop: 0, marginLeft: 0, marginRight: 0, marginBottom: null, padding: 10 }} screen={
                            <TouchableOpacity>
                                <View style={{ marginLeft: 15, flexDirection: "row", flex: 1, justifyContent: 'space-between', alignItems: 'center' }}>
                                    {item.name === "" || item.sets === null || item.rep_range === "" ?
                                        (<Text style={{ fontSize: 22, fontWeight: 'bold', color: 'white', margin: 5 }}>Press to Add an Exercise</Text>) :
                                        (<View style={{maxWidth: '75%'}}><Text style={{ fontSize: 22, fontWeight: 'bold', color: 'white', margin: 5 }}>{item.name}</Text>
                                            <Text style={{ fontSize: 20, color: 'grey', margin: 5 }}>{item.sets} sets of {item.rep_range} Reps</Text></View>)}
                                    <TouchableOpacity onLongPress={() => deleteWorkout(index)} style={{ marginRight: 13.5 }}>
                                        <View style={{ padding: 10, borderRadius: 10 }}>
                                            <Image source={require('../../../assets/x.png')} style={{ width: 25, height: 25 }} />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        } />
                    ))}
                    <TouchableOpacity onPress={() => navigation.navigate("SelectExercise")} style={{ padding: 12 }}>
                        <Image source={require('../../../assets/plus.png')} tintColor={'white'} style={{ width: 40, height: 40, alignSelf: "center", borderRadius: 30 }} />
                    </TouchableOpacity>
                </ScrollView>
            </View>
            <View style={{ position: 'absolute', bottom: 40, right: 0, left: 0 }}>
                <CustomCard screen={
                    <TouchableOpacity onPress={verifySave} style={{ padding: 10, marginHorizontal: 16.25 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', margin: 5 }}>Save</Text>
                        </View>
                    </TouchableOpacity>
                } />
            </View>
        </View>
    );
}
