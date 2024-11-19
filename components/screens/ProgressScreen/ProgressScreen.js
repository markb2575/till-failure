import { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { VictoryChart, VictoryLine, VictoryTheme, VictoryVoronoiContainer, VictoryAxis, VictoryScatter, VictoryTooltip } from 'victory-native';
import FileSystemCommands from "../../util/FileSystemCommands";
import CustomCard from '../CustomCard';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';



export default function ProgressScreen({ navigation }) {
    const [data, setData] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [graphPeriod, setGraphPeriod] = useState('all'); // 'all', '180', '30', '10'
    const isFocused = useIsFocused();
    const [activePoint, setActivePoint] = useState(null);
    const [key, setKey] = useState(0);

    useFocusEffect(
        useCallback(() => {
            FileSystemCommands.setupProject().then(res => {
                setData(res);
            }).catch(err => {
                console.error('Error loading data:', err);
            });
        }, [isFocused])
    );

    // const calculateORM = (weight, reps) => {
    //     return weight * (1 + 0.0333 * reps);
    // };

    const getGraphData = () => {
        if (!data || !workoutsWithData[selectedIndex]?.data) return [];

        let dataPoints = workoutsWithData[selectedIndex].data;

        // Filter based on selected period
        switch (graphPeriod) {
            case '180':
                dataPoints = dataPoints.slice(-180);
                break;
            case '30':
                dataPoints = dataPoints.slice(-30);
                break;
            case '10':
                dataPoints = dataPoints.slice(-10);
                break;
            default:
                break;
        }

        return dataPoints.map((exercise, index) => ({
            x: index + 1,
            y: exercise.weight,
            weight: exercise.weight,
            reps: exercise.reps
        }));
    };

    const handlePeriodChange = (period) => {
        setGraphPeriod(period);
        setKey(prevKey => prevKey + 1);
    };

    const handleWorkoutChange = (itemValue) => {
        setSelectedIndex(itemValue);
        setKey(prevKey => prevKey + 1);
        setActivePoint(null);
    };

    if (!data) {
        return <View style={{ flex: 1, marginTop: 50 }}><Text style={{ color: 'white' }}>Loading...</Text></View>;
    }

    const workoutsWithData = data.workouts.filter(workout => workout.data && workout.data.length > 0);

    return (
        <View style={{ flex: 1 }}>
            <Text style={{
                fontSize: 40,
                fontWeight: 'bold',
                color: 'white',
                marginBottom: 15,
                marginTop: 50,
                alignSelf: 'center'
            }}>
                Progress
            </Text>

            <Picker
                selectedValue={selectedIndex}
                onValueChange={handleWorkoutChange}
                style={{
                    color: 'white',
                    height: 50,
                    justifyContent: 'center',
                }}
                itemStyle={{
                    height: 50,
                    textAlign: 'center',
                    margin: 5,
                }}
                dropdownIconColor="white"
            >
                {workoutsWithData.map((workout, index) => (
                    <Picker.Item
                        key={index}
                        label={workout.name}
                        value={index}
                        color="white"
                    />
                ))}
            </Picker>
            <CustomCard styles={{
                backgroundColor: '#242424',
                marginHorizontal: 15,

                marginBottom: 15,
                borderRadius: 20,
                height: 350,
                overflow: 'hidden',
            }} screen={
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ height: 50, justifyContent: 'center' }}>
                        {activePoint ? (
                            <Text style={{
                                color: 'white',
                                textAlign: 'center',
                                fontSize: 20,
                                fontWeight: '500',
                                marginTop: 25
                            }}>
                                {activePoint.weight} lbs x {activePoint.reps} reps
                            </Text>
                        ) : (
                            <Text style={{
                                color: 'white',
                                textAlign: 'center',
                                fontSize: 20,
                                fontWeight: '500',
                                marginTop: 25,
                                opacity: 0.5
                            }}>
                                Tap a point to see details
                            </Text>
                        )}
                    </View>
                    <VictoryChart
                        key={key}
                        containerComponent={
                            <VictoryVoronoiContainer
                                onActivated={(points) => {
                                    setActivePoint(points[0]);
                                }}
                                voronoiDimension="x"
                            />
                        }
                    >
                        <VictoryAxis
                            style={{
                                axis: { stroke: 'white', strokeWidth: 0.5 },
                                tickLabels: { fill: 'transparent' },
                                grid: { stroke: 'rgba(255,255,255,0.1)' }
                            }}
                        />
                        <VictoryAxis
                            dependentAxis
                            style={{
                                axis: { stroke: 'white', strokeWidth: 0.5 },
                                tickLabels: { fill: 'white', fontSize: 10 },
                                grid: { stroke: 'rgba(255,255,255,0.1)' }
                            }}
                        />
                        <VictoryLine
                            data={getGraphData()}
                            style={{
                                data: {
                                    stroke: 'white',
                                    strokeWidth: 2
                                },
                            }}
                            animate={{
                                duration: 500,
                                onLoad: { duration: 500 }
                            }}
                            interpolation="monotoneX"
                        />
                        <VictoryScatter
                            data={getGraphData()}
                            size={({ active }) => active ? 5 : 3}
                            style={{
                                data: {
                                    fill: 'white',
                                    stroke: 'white',
                                    strokeWidth: ({ active }) => active ? 3 : 2
                                }
                            }}
                        />
                    </VictoryChart>
                </View>
            } />
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                padding: 10,
                marginTop: 10
            }}>
                {['all', '180', '30', '10'].map((period) => (
                    <TouchableOpacity
                        key={period}
                        onPress={() => handlePeriodChange(period)}
                        style={{
                            padding: 10,
                            backgroundColor: graphPeriod === period ? 'white' : '#2b2b2b',
                            borderRadius: 12,
                            minWidth: 60,
                            alignItems: 'center'
                        }}
                    >
                        <Text style={{
                            color: graphPeriod === period ? '#242424' : 'white',
                            fontWeight: graphPeriod === period ? 'bold' : 'normal'
                        }}>
                            {period === 'all' ? 'All' : `${period}`}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}