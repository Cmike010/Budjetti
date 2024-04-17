import { router, useLocalSearchParams } from 'expo-router';
import CheckBox from './CheckBox';
import React, { useEffect, useRef, useState } from 'react';
import {Picker} from '@react-native-picker/picker';
import { Dropdown } from 'react-native-element-dropdown';
import { View, StyleSheet } from 'react-native';
import { TextInput, Text, Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../Redux/store';
import { haeTaulut, lisaaLuokka, tallennaBudjettiRivi } from '../../Redux/budjettiSlice';

const LisaaLuokka : React.FC = () : React.ReactElement => {

    const taulut =  useSelector((state : RootState) => state.budjetit)
    const dispatch = useDispatch<AppDispatch>();
    const { id } = useLocalSearchParams<{ id : string }>();

    const [tiedot, setTiedot] = useState({
                                    nimi : "",
                                    virhe : ""
    });

    const lisaa = () => {

        if (tiedot.nimi.length > 0){
            dispatch(lisaaLuokka(tiedot.nimi))
            dispatch(haeTaulut());
            router.dismiss(1);
            /*router.push({
                pathname: "/Components/[Id]MuokkaaLuokkia",
                params: { id : id }
              })*/

        }

        else {setTiedot({...tiedot, virhe : "Anna nimi"})}

        /*router.push({
            pathname: "/Components/[Id]MuokkaaLuokkia",
            params: { id : id }
          })*/
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
            //placeholder='Nimi...'
            onChangeText={uusiNimi => setTiedot({...tiedot, nimi : uusiNimi})}
            //outlineColor='#F0F8FF'
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
    container: {
      flex: 1,
      marginHorizontal: 16,
      marginVertical: 32,
    },
    section: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    paragraph: {
      fontSize: 15,
    },
    checkbox: {
      margin: 8,
    },
    button: {
        margin : 5
      }
  });

export default LisaaLuokka;