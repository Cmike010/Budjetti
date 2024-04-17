import { router, useLocalSearchParams } from "expo-router";
import { View, StyleSheet, TextInputChangeEventData, NativeSyntheticEvent } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { Button, DataTable, TextInput, Text } from "react-native-paper";
import { useState } from "react";
import VahvistaPoistoDialog from "./VahvistaPoistoDialog";
import { luokanPoistoDialog } from "../../Redux/budjettiSlice";

const MuokkaaPoista : React.FC = () : React.ReactElement => {

    const { id } = useLocalSearchParams<{ id : string }>();
    const dispatch = useDispatch();

    const luokat =  useSelector((state : RootState) => state.budjetit.luokat)
    const luokanPoistoDialogi = useSelector((state : RootState) => state.budjetit.luokanPoistoDialog)

    const [teksti, setTeksti] = useState<string>("");

    const nimi : string = luokat.find((luokka : {id : number, nimi : string}) => {
        return luokka.id === Number(id);
    })?.nimi;

    

    return (

        <View>
            <Text variant="titleLarge">Nykyinen nimi:</Text>
            <TextInput style={styles.textInputs} editable={false} value={nimi} mode='outlined'/>
            <Text variant="titleLarge">Anna uusi nimi luokalle:</Text>
            <TextInput style={styles.textInputs} mode='outlined' onChangeText={(uusiTeksti) => {setTeksti(uusiTeksti)} }/>
            <Button
                  style={styles.button} 
                  mode='contained'
                  onPress={() => console.log(teksti)}
                  >Korvaa nimi</Button>
            <Button mode="contained" style={styles.button} onPress={() => dispatch(luokanPoistoDialog(true))}>Poista luokka</Button>
            {(Boolean(luokanPoistoDialogi))
            ? <View>
                <VahvistaPoistoDialog id={Number(id)}/>
              </View>
            : null
            }
        </View>

    )
}

const styles = StyleSheet.create({
    textInputs : {
        margin : 10,
    },
    button: {
      margin : 5
    },
    
  });

export default MuokkaaPoista;