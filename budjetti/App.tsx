import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider, useDispatch } from 'react-redux';
import { AppDispatch, store } from './Redux/store';
import { useEffect, useRef } from 'react';
import { luoTaulut } from './Redux/budjettiSlice';
//import Index from './app';

const App : React.FC = () : React.ReactElement => {
  

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <View style={styles.container}>
        </View>
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
