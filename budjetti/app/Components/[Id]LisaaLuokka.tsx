import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Text, Button } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../Redux/store';
import { haeTaulut, lisaaLuokka } from '../../Redux/budjettiSlice';

const LisaaLuokka : React.FC = () : React.ReactElement => {

    const dispatch = useDispatch<AppDispatch>();

    const [tiedot, setTiedot] = useState({
                                    nimi : "",
                                    virhe : ""
    });

    const lisaa = () => {

        if (tiedot.nimi.length > 0){
            dispatch(lisaaLuokka(tiedot.nimi))
            dispatch(haeTaulut());
            router.dismiss(1);
        }

        else {setTiedot({...tiedot, virhe : "Anna nimi"})}

    }

    return (
        <View>
            {(Boolean(tiedot.virhe))
            ? <Text variant='displayLarge'>{tiedot.virhe}</Text>
            : null
            }
            <TextInput
            style={styles.textInputs}
            label={"Nimi..."}
            onChangeText={uusiNimi => setTiedot({...tiedot, nimi : uusiNimi})}
            mode='outlined'
            />
            <Button style={styles.button} mode='contained' onPress={lisaa}>Lisää</Button>
        </View>
    )
}

const styles = StyleSheet.create({
    textInputs : {
        margin : 5,
        color :'#F0F8FF'
      },
    button: {
        margin : 5
      }
  });

export default LisaaLuokka;