import SelectWorkoutScreen from "./SelectWorkoutScreen/SelectWorkoutScreen"
import WorkoutScreen from "./WorkoutScreen/WorkoutScreen"
import ProgressScreen from "./ProgressScreen/ProgressScreen"
import CustomCard from "./CustomCard"

export const SelectWorkoutCard = ({navigation}) => (
    <CustomCard screen={<SelectWorkoutScreen navigation={navigation}/>} />
  );
  
  export const WorkoutCard = ({navigation}) => (
    <CustomCard screen={<WorkoutScreen navigation={navigation}/>} />
  );
  
  export const ProgressCard = ({navigation}) => (
    <CustomCard screen={<ProgressScreen navigation={navigation}/>} />
  );