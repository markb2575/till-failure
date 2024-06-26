import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, LogBox } from 'react-native';
import Navigation from './components/routing/Navigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

LogBox.ignoreLogs(['Require cycle:']);

export default function App() {
  return (
    // <GestureHandlerRootView style={{ flex: 1 }}>
        <Navigation />
    // </GestureHandlerRootView>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
