import * as FileSystem from 'expo-file-system';

const dir = FileSystem.documentDirectory;

const FileSystemCommands = {
    async isProjectSetup() {
        try {
            let result = await FileSystem.readDirectoryAsync(dir);
        } catch (error) {
            console.error(error);
        }
    },
    async createWorkoutFiles() {
        try {
            await FileSystem.writeAsStringAsync(dir + "workouts.json", JSON.stringify({
                "Dumbell Bicep Curls": [],
                "Barbell Bicep Curls": [],
                "Hammer Curls": [],
                "Preacher Curls": []
            }));
        } catch (error) {
            console.error(error);
        }
    },
    async getWorkouts() {
        try {
            let workouts = await FileSystem.readAsStringAsync(dir + "workouts.json")
            console.log("workouts", workouts)
        } catch (error) {
            console.error(error);
        }
    }
}

export default FileSystemCommands
