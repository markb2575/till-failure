import { useState, useEffect, React } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, TextInput, Modal, TouchableWithoutFeedback, Keyboard, FlatList, KeyboardAvoidingView, Vibration } from 'react-native';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FileSystemCommands from "../../util/FileSystemCommands";
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import { ListItem, Card } from '@rneui/themed';
import CustomCard from '../CustomCard';
import CustomHeader from '../CustomHeader';
import { CreateDayScreen } from '../screens';

export default function SelectExerciseScreen({ navigation, route }) {
    const [data, setData] = useState(null);
    const [index, setIndex] = useState(null)
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedWorkout, setSelectedWorkout] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredWorkouts, setFilteredWorkouts] = useState([]);
    const [workoutList, setWorkoutList] = useState([]);
    const [sets, setSets] = useState('');
    const [lowerRepRange, setLowerRepRange] = useState('');
    const [upperRepRange, setUpperRepRange] = useState('');

    const muscleGroups = [
        "Quadriceps", "Forearms", "Shoulders", "Biceps", "Hamstrings", "Abdominals",
        "Triceps", "Chest", "Traps", "Calves", "Middle Back", "Adductors",
        "Glutes", "Lats", "Lower Back", "Abductors"
    ];

    const [filters, setFilters] = useState([])

    const handleSelect = (muscle, selectAll = false, deselectAll = false) => {
        if (selectAll) {
            const updatedFilters = Object.keys(filters).reduce((acc, key) => {
                acc[key] = true;
                return acc;
            }, {});
            setFilters(updatedFilters);
        } else if (deselectAll) {
            const updatedFilters = Object.keys(filters).reduce((acc, key) => {
                acc[key] = false;
                return acc;
            }, {});
            setFilters(updatedFilters);

        } else {
            const updatedFilters = { ...filters, [muscle]: !filters[muscle] };
            setFilters(updatedFilters);
        }
    };

    useEffect(() => {
        handleSearch(searchTerm)
    }, [filters])

    const isFocused = useIsFocused();
    useEffect(() => {
        if (route.params?.index) {
            setIndex(route.params.index);
        }
      }, [route.params?.index]);
    useEffect(() => {
        if (isFocused) {
            FileSystemCommands.setupProject().then(res => {
                setData(res);
                setWorkoutList(res.workouts)
                setFilters(
                    muscleGroups.reduce((acc, muscle) => {
                        acc[muscle] = true;
                        return acc;
                    }, {}))
                // console.log(targets)
                // console.log(res.workouts)
            });
        }
    }, [isFocused, setData]);

    const closeModal = () => {
        setModalVisible(false);
    };

    const handleSelectWorkout = (workout) => {
        setSelectedWorkout(workout)
    };

    const handleSearch = (text) => {
        setSearchTerm(text);

        const filteredList = workoutList.filter(item => {
            return item.name.toLowerCase().includes(text.toLowerCase()) && filters[item.target] === true
        });
        setFilteredWorkouts(filteredList);
    };

    const handleSetsChange = (text) => {
        if (text > 99) text = 99
        if (text < 0) text = 0
        setSets(text);

    };

    const handleLowerRepRangeChange = (text) => {
        if (text > 99) text = 99
        if (text < 0) text = 0
        setLowerRepRange(text);

    };

    const handleUpperRepRangeChange = (text) => {
        if (text > 99) text = 99
        if (text < 0) text = 0
        setUpperRepRange(text);

    };

    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                key={index}
                style={{ flexDirection: 'row', justifyContent: 'center' }}
                onPress={() => handleSelectWorkout(item)}
            >
                <CustomCard
                    styles={{
                        width: "100%",
                        alignItems: 'flex-start',
                        backgroundColor: item === selectedWorkout ? '#525252' : '#2b2b2b',
                        padding: 10,
                        borderRadius: 10,
                        marginBottom: 15,
                        marginTop: 0
                    }}
                    screen={
                        <View style={{ width: '100%' }}>
                            <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ color: '#cfcfcf', fontSize: 14, marginTop: 5 }}>Target: {item.target}</Text>
                                <Text style={{ color: '#cfcfcf', fontSize: 14, marginTop: 5 }}>Rating: {item.rating}</Text>
                            </View>
                        </View>
                    }
                />
            </TouchableOpacity>
        );
    }

    const verify = () => {
        const set = Number(sets)
        const lower = Number(lowerRepRange)
        const upper = Number(upperRepRange)
        if (selectedWorkout !== null && 
            set > 0 && set < 99 && !isNaN(set) &&
            upper > 0 && upper < 99 && !isNaN(upper) &&
            lower > 0 && lower < 99 && !isNaN(lower) && upper > lower) {
            const payload = { "name": selectedWorkout.name, "rep_range": `${lower}-${upper}`, "sets": set }
            if (index === null) {
                navigation.navigate("CreateDay", {exercise: payload})
            } 
            // else {
            //     navigation.navigate("CreateDay", {exercise: payload, "index": index})
            // }
        } else {
            console.log("error")
            Vibration.vibrate(500)
        }
    }

    return (
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <TouchableWithoutFeedback onPress={closeModal}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 3, height: 3 }, shadowOpacity: 1, shadowRadius: 50 }}>
                        <TouchableWithoutFeedback>
                            <View style={{ justifyContent: 'center', alignItems: 'flex-start', borderRadius: 10, backgroundColor: '#242424', padding: 20, width: 350, maxHeight: 600 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <TouchableOpacity onPress={() => handleSelect(null, true, false)} style={{ marginRight: 10 }}>
                                            <Text style={{ color: '#fff' }}>Select All</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handleSelect(null, false, true)} style={{ marginRight: 10 }}>
                                            <Text style={{ color: '#fff' }}>Deselect All</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <TouchableOpacity onPress={closeModal}>
                                        <View style={{ padding: 10, borderRadius: 10 }}>
                                            <Image source={require('../../../assets/x.png')} style={{ width: 25, height: 25 }} />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                {muscleGroups.map((muscle, index) => (
                                    <TouchableOpacity key={index} onPress={() => handleSelect(muscle)} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                                        <View style={{
                                            height: 20,
                                            width: 20,
                                            borderRadius: 10,
                                            borderWidth: 2,
                                            borderColor: filters[muscle] ? '#ffffff' : '#fff',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginRight: 10,
                                        }}>
                                            {filters[muscle] && <View style={{ height: 10, width: 10, borderRadius: 5, backgroundColor: '#ffffff' }} />}
                                        </View>
                                        <Text style={{ color: '#fff' }}>{muscle}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View>
                    <CustomHeader navigation={navigation} leftNavigate={"CreateDay"} leftImage={<Image source={require('../../../assets/back.png')} tintColor={'white'} style={{ width: 26, height: 26 }} />} titleText={"Select Exercise"} />

                    <View style={{ justifyContent: 'flex-start', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '97.5%' }}>
                            <CustomCard styles={{ padding: 10, height: 50, marginRight: 0, width: "67.5%" }} screen={
                                <TextInput
                                    placeholder="Search..."
                                    placeholderTextColor="grey"
                                    style={{ padding: 5, borderRadius: 5, fontSize: 18, color: 'white' }}
                                    value={searchTerm}
                                    onChangeText={handleSearch}
                                    keyboardAppearance="dark"
                                />
                            } />
                            <CustomCard styles={{ padding: 15, height: 50, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginLeft: 0, paddingHorizontal: 20 }} screen={
                                <TouchableOpacity onPress={() => setModalVisible(true)}>
                                    <Text style={{ color: 'white', fontSize: 18, textAlign: 'center' }}>Filter</Text>
                                </TouchableOpacity>
                            } />
                        </View>



                        <CustomCard styles={{ padding: 10 }} screen={
                            <View style={{ width: '97.5%', height: 400, alignItems: 'center' }}>
                                {filteredWorkouts.length === 0 ? (<Text style={{ width: 327.5, color: 'grey', fontSize: 18, textAlign: 'center', padding: 10, justifyContent: 'flex-start' }}>No results found...</Text>) : (
                                    <FlatList
                                        data={filteredWorkouts}
                                        keyExtractor={(item, index) => `${index}`}
                                        renderItem={({ item, index }) => renderItem({ item, index })}
                                        style={{ width: 327.5, borderRadius: 10 }}
                                        initialNumToRender={2}
                                        maxToRenderPerBatch={2}
                                        windowSize={2}
                                        nestedScrollEnabled={true}
                                        showsVerticalScrollIndicator={false}
                                    />)}
                            </View>
                        } />
                        <KeyboardAvoidingView behavior='position' enabled keyboardVerticalOffset={100}>
                            <CustomCard style={{ backgroundColor: '#2b2b2b', borderRadius: 10, width: '97.5%' }} screen={

                                <View style={{ flexDirection: 'row', alignItems: 'center', margin: 15, marginHorizontal: 25 }}>
                                    <TextInput
                                        placeholder="Sets"
                                        placeholderTextColor="grey"
                                        keyboardType="numeric"
                                        style={{ backgroundColor: '#3b3b3b', borderRadius: 5, color: 'white', width: 45, height: 45, textAlign: 'center' }}
                                        value={sets.toString()}
                                        onChangeText={handleSetsChange}
                                        keyboardAppearance="dark"
                                    />
                                    <Text style={{ padding: 7.5, borderRadius: 5, fontSize: 18, color: 'white' }}> sets of </Text>

                                    <TextInput
                                        placeholder="Reps"
                                        placeholderTextColor="grey"
                                        keyboardType="numeric"
                                        style={{ backgroundColor: '#3b3b3b', borderRadius: 5, color: 'white', width: 45, height: 45, textAlign: 'center' }}
                                        value={lowerRepRange.toString()}
                                        onChangeText={handleLowerRepRangeChange}
                                        keyboardAppearance="dark"
                                    />
                                    <Text style={{ padding: 10, borderRadius: 5, fontSize: 18, color: 'white' }}>-</Text>
                                    <TextInput
                                        placeholder="Reps"
                                        placeholderTextColor="grey"
                                        keyboardType="numeric"
                                        style={{ backgroundColor: '#3b3b3b', borderRadius: 5, color: 'white', width: 45, height: 45, textAlign: 'center' }}
                                        value={upperRepRange.toString()}
                                        onChangeText={handleUpperRepRangeChange}
                                        keyboardAppearance="dark"
                                    />
                                    <Text style={{ padding: 10, borderRadius: 5, fontSize: 18, color: 'white' }}>reps</Text>
                                </View>

                            } />

                        </KeyboardAvoidingView>


                        <TouchableOpacity style={{ width: "96%" }} onPress={verify}>
                            <CustomCard style={{ padding: 15, height: 50, borderRadius: 10, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 50 }} screen={
                                <Text style={{ color: 'white', fontSize: 18, textAlign: 'center', margin: 15 }}>Confirm</Text>
                            } />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
}
