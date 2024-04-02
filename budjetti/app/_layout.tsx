import { Stack, Tabs } from "expo-router";
import { StyleSheet, Text, View } from 'react-native';
import { Provider } from "react-redux";
import { AppDispatch, store } from '../Redux/store';
import { SafeAreaProvider } from "react-native-safe-area-context";

const RootLayout = () => {
  return (
    <Provider store={store}>
        <SafeAreaProvider>
            <Stack
              screenOptions={{
                headerStyle: {
                  backgroundColor: '#f0511e',
                },
                headerTintColor : '#fff',
                headerTitleStyle: {
                  fontWeight : 'bold',
                },
              }}
            >
              <Stack.Screen
                  name="index"
                  options={{
                    headerTitle: "Budjetit"
                  }}
              />
              <Stack.Screen
                  name="Components/[BudjetinTarkastelu]"
                  options={{
                    headerTitle: "Budjetin tarkastelu"
                  }}
              />
            </Stack>
        </SafeAreaProvider>
    </Provider>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default RootLayout;