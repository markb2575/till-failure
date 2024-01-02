import * as FileSystem from 'expo-file-system';
import workouts from '../../workouts.json';
const dir = FileSystem.documentDirectory;
const starterJSON = {
    "workouts": {
        "Arms": {
            "Dumbell Bicep Curls": [],
            "Barbell Bicep Curls": [],
            "Hammer Curls": [],
            "Preacher Curls": [],
            "Spider Curls": []
        },
        "Chest": {
            "Barbell Bench Press": [],
            "Dumbbell Bench Press": [],
            "Dips": [],
            "Flys": [],
        },
        "Back": {
            "Lat Pulldowns": []
        },
        "Legs": {
            "Barbell Squats": []
        }
    },
    "programs": {
        "PPL": {
            "info": [
                { "day": "Push", "workouts": [{ "name": "Barbell Bench Press", "rep_range": "3-6", "sets": 4 },{ "name": "Dumbbell Bench Press", "rep_range": "3-6", "sets": 4 }, { "name": "Dips", "rep_range": "8-12", "sets": 4 }, { "name": "Flys", "rep_range": "8-12", "sets": 2 }] },
                { "day": "Pull", "workouts": [{ "name": "Barbell Bicep Curls", "rep_range": "8-12", "sets": 4 }, { "name": "Dumbell Bicep Curls", "rep_range": "8-12", "sets": 4 }, { "name": "Hammer Curls", "rep_range": "8-12", "sets": 4 }] },
                { "day": "Legs", "workouts": [{ "name": "Barbell Squats", "rep_range": "3-6", "sets": 4 }] },
                { "day": "Rest", "workouts": [] }],
            "state": {
                "currentDay": null,
                "exercises": []
            }
        },
        "Arnold": {
            "info": [
                { "day": "Chest, Back, Abs", "workouts": [{ "name": "Barbell Bench Press", "rep_range": "3-6", "sets": 4 }] },
                { "day": "Arms, Shoulders, Abs", "workouts": [{ "name": "Barbell Bicep Curls", "rep_range": "8-12", "sets": 4 }, { "name": "Dumbell Bicep Curls", "rep_range": "8-12", "sets": 4 }, { "name": "Hammer Curls", "rep_range": "8-12", "sets": 4 }] },
                { "day": "Legs, Abs", "workouts": [{ "name": "Barbell Squats", "rep_range": "3-6", "sets": 4 }] },
                { "day": "Chest, Back, Abs", "workouts": [{ "name": "Barbell Bench Press", "rep_range": "3-6", "sets": 4 }] },
                { "day": "Arms, Shoulders, Abs", "workouts": [{ "name": "Barbell Bicep Curls", "rep_range": "8-12", "sets": 4 }, { "name": "Dumbell Bicep Curls", "rep_range": "8-12", "sets": 4 }, { "name": "Hammer Curls", "rep_range": "8-12", "sets": 4 }] },
                { "day": "Legs, Abs", "workouts": [{ "name": "Barbell Squats", "rep_range": "3-6", "sets": 4 }] },
                { "day": "Rest", "workouts": [] }],
            "state": {
                "currentDay": null,
                "exercises": []
            }
        }
    },
    "state": {
        "selectedProgram": null,
    }
}

const FileSystemCommands = {
    async setupProject() {
        if ((await FileSystem.getInfoAsync(dir + "workouts.json")).exists) {
            // this.createWorkoutFiles() //uncomment to reset user data to starterJSON
            return this.getWorkouts()
        } else {
            this.createWorkoutFiles()
            return this.getWorkouts()
        }
    },
    async createWorkoutFiles() {
        // console.log("in createWorkoutFiles")
        // console.log("workouts",workouts.workouts.Arms['Barbell Bicep Curls'])
        try {
            await FileSystem.writeAsStringAsync(dir + "workouts.json", JSON.stringify(starterJSON));
        } catch (error) {
            console.error(error);
        }
    },
    async updateWorkoutFiles(data) {
        // console.log("in updateWorkoutFiles")
        // console.log("data",data.programs["PPL"].state.exercises[0].data)
        try {
            await FileSystem.writeAsStringAsync(dir + "workouts.json", JSON.stringify(data));
        } catch (error) {
            console.error(error);
        }
    },
    async getWorkouts() {
        // console.log("in getWorkouts")
        try {
            var workouts = await FileSystem.readAsStringAsync(dir + "workouts.json")
            workouts = JSON.parse(workouts)
            // console.log("workouts", workouts)
            // workouts = Object.entries(workouts);

            return workouts
        } catch (error) {
            console.error(error);
        }
    },
    async deleteFiles() {
        // console.log("in deleteFiles", await FileSystem.readDirectoryAsync(dir), dir)
        try {
            await FileSystem.deleteAsync(dir + "workouts.json")
            // console.log("after deleteFiles", await FileSystem.readDirectoryAsync(dir))
            return true
        } catch (error) {
            console.error(error);
        }
        return false
    }
}

export default FileSystemCommands
