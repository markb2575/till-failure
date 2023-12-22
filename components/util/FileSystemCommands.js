import * as FileSystem from 'expo-file-system';
import workouts from '../../workouts.json';
const dir = FileSystem.documentDirectory;

const FileSystemCommands = {
    async setupProject() {
        if ((await FileSystem.getInfoAsync(dir + "workouts.json")).exists) {
            return this.getWorkouts()
        } else {
            this.createWorkoutFiles()
            return this.getWorkouts()
        }
        // try {
        //     // const info = await FileSystem.getInfoAsync(dir + "workouts.json")
        //     // console.log(info)
        //     // return info.exists
        // } catch (error) {
        //     console.error(error)
        // }
    },
    async createWorkoutFiles() {
        console.log("in createWorkoutFiles")
        // console.log("workouts",workouts.workouts.Arms['Barbell Bicep Curls'])
        try {
            await FileSystem.writeAsStringAsync(dir + "workouts.json", JSON.stringify({
                "workouts": {
                    "Arms": {
                        "Dumbell Bicep Curls": [
                            {
                                "Weight": 12,
                                "Reps": 12
                            },
                            {
                                "Weight": 12,
                                "Reps": 12
                            },
                            {
                                "Weight": 12,
                                "Reps": 12
                            }
                        ],
                        "Barbell Bicep Curls": [
                            {
                                "Weight": 12,
                                "Reps": 12
                            },
                            {
                                "Weight": 12,
                                "Reps": 12
                            },
                            {
                                "Weight": 12,
                                "Reps": 12
                            }
                        ],
                        "Hammer Curls": [],
                        "Preacher Curls": [],
                        "Spider Curls": []
                    },
                    "Chest": {
                        "Barbell Bench Press": []
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
                        "Push": [{ "name": "Barbell Bench Press", "rep_range": "3-6", "sets": 4 }],
                        "Pull": [{ "name": "Barbell Bicep Curls", "rep_range": "8-12", "sets": 4 }, { "name": "Dumbell Bicep Curls", "rep_range": "8-12", "sets": 4 }, { "name": "Hammer Curls", "rep_range": "8-12", "sets": 4 }],
                        "Legs": [{ "name": "Barbell Squats", "rep_range": "3-6", "sets": 4 }],
                        "Rest": []
                    },
                    "Arnold": {}
                },
                "state": {
                    "selectedProgram": null,
                    "currentDay": null,
                    "exercises": []
                }
            }));
        } catch (error) {
            console.error(error);
        }
    },
    async getWorkouts() {
        console.log("in getWorkouts")
        try {
            var workouts = await FileSystem.readAsStringAsync(dir + "workouts.json")
            workouts = JSON.parse(workouts)
         
            // workouts = Object.entries(workouts);
         
            return workouts
        } catch (error) {
            console.error(error);
        }
    },
    async deleteFiles() {
        console.log("in deleteFiles", await FileSystem.readDirectoryAsync(dir), dir)
        try {
            await FileSystem.deleteAsync(dir + "workouts.json")
            console.log("after deleteFiles", await FileSystem.readDirectoryAsync(dir))
            return true
        } catch (error) {
            console.error(error);
        }
        return false
    }
}

export default FileSystemCommands
