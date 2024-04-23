import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from '../Redux/store';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import Ratas from "./Components/Ratas";


const RootLayout = () => {

  return (
    <Provider store={store}>
        <SafeAreaProvider>
          <PaperProvider>
            <Stack
              screenOptions={{
                headerStyle: {
                  backgroundColor: '#3d84f5',
                },
                headerRight : () => 
                <Ratas/>
                ,
                headerTintColor : 'white',
                headerTitleStyle: {
                  fontWeight : 'bold',
                },
              }}
            >
              <Stack.Screen
                  name="index"
                  options={{
                    headerTitle: "Budjetit",
                    
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
                  name="Components/[Id]MuokkaaPoistaLuokka"
                  options={{
                    headerTitle: "Muokkaa tai Poista"
                  }}
              />
              <Stack.Screen
                    name="Components/LisaaBudjetti"
                    options={{
                      headerTitle: "Lisää budjetti"
                    }}
                />
              <Stack.Screen
                name="Components/[Id]MuokkaaBudjettiRivi"
                options={{
                  headerTitle: "Muokkaa riviä"
                }}
                />
            </Stack>
            </PaperProvider>
        </SafeAreaProvider>
    </Provider>
  );
};

export default RootLayout;