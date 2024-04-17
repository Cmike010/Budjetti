import { router, useLocalSearchParams } from 'expo-router';
import CheckBox from './CheckBox';
import React, { useEffect, useRef, useState } from 'react';
import {Picker} from '@react-native-picker/picker';
import { Dropdown } from 'react-native-element-dropdown';
import { View, StyleSheet } from 'react-native';
import { TextInput, Text, Button, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../Redux/store';
import { haeTaulut, tallennaBudjettiRivi } from '../../Redux/budjettiSlice';
import { Colors } from 'react-native/Libraries/NewAppScreen';

interface Value {
  id : number
  nimi : string
  virhe : string
}

const MuokkaaLuokkia : React.FC = () : React.ReactElement => {

    const luokat =  useSelector((state : RootState) => state.budjetit.luokat)
    const dispatch = useDispatch<AppDispatch>();

    const theme = useTheme()

    const [values, setValues] = useState<Value>({
      id : NaN,
      nimi : "",
      virhe : ""
      })

    const data = (() : {label : string, value : string}[] => {
      const apuData : {label : string, value : string}[] = []

      luokat.map((luokka : any) => {
        console.log("Nimi: " + luokka.nimi + " Id: " +luokka.id)
        if (luokka.nimi !== "Ei valittu"){
        apuData.push({label : luokka.nimi, value : luokka.id})
        }
      })
      return apuData
    })();



const [value, setValue] = useState<string | null>("");

    const vaihda = (item : {value : string, label : string}) => {
      setValue(item.value);
      console.log("Vaihda nimi: " + item.label + " ja Id: " + item.value)
      setValues({...values, id : Number(item.value), nimi : item.label})
    }

const lisaaLuokka = () => {

    router.push({
        pathname: "/Components/[Id]LisaaLuokka",
        //params: { id : values.id }
      })
}

const muokkaaTaiPoista = () => {
  setValues({...values, virhe : ""})
  if (values.id > 0){
    router.push({
      pathname: "/Components/[Id]MuokkaaPoista",
      params : { id : values.id}
    })
    setValues({id : NaN, nimi : "", virhe : ""})
  }

  else {setValues({...values, virhe : "Valitse luokka"})}
}

    return (

        <View style={styles.container}>
          {(Boolean(values.virhe.length > 0))
          ? <Text variant='headlineMedium' style={{ color : theme.colors.error}}>{values.virhe}</Text>
          : null
          }
            <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                data={data}
                search
                maxHeight={300}
                labelField={"label"}
                valueField="value"
                placeholder="Valitse..."
                searchPlaceholder="Hae..."
                value={value}
                onChange={item => {
                  vaihda(item);
                }}
              />
            <Button style={styles.button} mode='contained' onPress={muokkaaTaiPoista}>Muokkaa/Poista</Button>
            <Button style={styles.button} mode='contained' onPress={lisaaLuokka}>Lisää uusi</Button>
        </View>
    )
}

const styles = StyleSheet.create({
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
      },
      dropdown: {
        margin: 16,
        height: 50,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
      },
      placeholderStyle: {
        fontSize: 16,
      },
      selectedTextStyle: {
        fontSize: 16,
      },
      inputSearchStyle: {
        height: 40,
        fontSize: 16,
      },
  });

export default MuokkaaLuokkia;