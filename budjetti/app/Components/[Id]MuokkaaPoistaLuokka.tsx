import { router, useLocalSearchParams } from "expo-router";
import { View, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import { Button, TextInput, Text, useTheme } from "react-native-paper";
import { useState } from "react";
import VahvistaLuokanPoistoDialog from "./VahvistaLuokanPoistoDialog";
import { haeTaulut, luokanPoistoDialog, vaihdaLuokanNimi } from "../../Redux/budjettiSlice";

const MuokkaaPoista : React.FC = () : React.ReactElement => {

    const { id } = useLocalSearchParams<{ id : string }>();
    const dispatch = useDispatch<AppDispatch>();

    const luokat =  useSelector((state : RootState) => state.budjetit.luokat)
    const luokanPoistoDialogi = useSelector((state : RootState) => state.budjetit.luokanPoistoDialog)
    const theme = useTheme();
    const [teksti, setTeksti] = useState<string>("");
    const [virhe, setVirhe] = useState<string>("")

    const nimi : string | undefined = luokat.find((luokka : {id : number, nimi : string}) => {
        return luokka.id === Number(id);
    })?.nimi;

    const korvaa = () => {

      setVirhe("");
      if (teksti.length <= 0){
        setVirhe("Syötä uusi nimi");
      }

      else {
        dispatch(vaihdaLuokanNimi({id : Number(id), nimi : teksti}))
        dispatch(haeTaulut());
        router.dismiss(1);
      }
    }

    return (

        <View>
          {(Boolean(virhe.length > 0))
          ?<Text variant='headlineMedium' style={{ color : theme.colors.error}}>{virhe}</Text>
          : null
          }
            <Text variant="titleLarge">Nykyinen nimi:</Text>
            <TextInput style={styles.textInputs} editable={false} value={nimi} mode='outlined'/>
            <Text variant="titleLarge">Anna uusi nimi luokalle:</Text>
            <TextInput style={styles.textInputs} mode='outlined' onChangeText={(uusiTeksti) => {setTeksti(uusiTeksti)} }/>
            <Button
                  style={styles.button} 
                  mode='contained'
                  onPress={korvaa}
                  >Korvaa nimi</Button>
            <Button mode="contained" style={styles.button} onPress={() => dispatch(luokanPoistoDialog(true))}>Poista luokka</Button>
            {(Boolean(luokanPoistoDialogi))
            ? <View>
                <VahvistaLuokanPoistoDialog id={Number(id)}/>
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
      margin : 5,
      width : 300,
      alignSelf : "center",
      borderColor : "black",
      borderWidth : 1
    },
    
  });

export default MuokkaaPoista;