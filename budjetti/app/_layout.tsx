import { Stack, Tabs } from "expo-router";
import { StyleSheet, Text, View } from 'react-native';
import { Provider } from "react-redux";
import { AppDispatch, store } from '../Redux/store';
import { SafeAreaProvider } from "react-native-safe-area-context";
import BudjetinTarkastelu from "./Components/[Id]BudjetinTarkastelu";
import { PaperProvider } from "react-native-paper";

const RootLayout = () => {
  return (
    <Provider store={store}>
        <SafeAreaProvider>
          <PaperProvider>
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
                  name="Components/[Id]BudjetinTarkastelu"
                  options={{
                    headerTitle: "Budjetin tarkastelu"
                  }}
              />
              <Stack.Screen
                  name="Components/[Id]LisaaRiviBudjettiin"
                  options={{
                    headerTitle: "Lisää rivi"
                  }}
              />
              <Stack.Screen
                  name="Components/[Id]MuokkaaLuokkia"
                  options={{
                    headerTitle: "Muokkaa luokkia"
                  }}
              />
              <Stack.Screen
                  name="Components/[Id]LisaaLuokka"
                  options={{
                    headerTitle: "Lisää Luokka"
                  }}
              />
              <Stack.Screen
                  name="Components/[Id]MuokkaaPoista"
                  options={{
                    headerTitle: "Muokkaa tai Poista"
                  }}
              />
            </Stack>
            </PaperProvider>
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