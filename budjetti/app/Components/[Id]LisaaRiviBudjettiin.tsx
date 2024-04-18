import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react'
import {Picker} from '@react-native-picker/picker';
import { Dropdown } from 'react-native-element-dropdown';
import { View, StyleSheet } from 'react-native';
import { TextInput, Text, Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../Redux/store';
import { haeTaulut, tallennaBudjettiRivi } from '../../Redux/budjettiSlice';
import VahvistaPoistoDialog from './VahvistaLuokanPoistoDialog';

interface Value {

  nimi : string,
  arvio : number,
  toteuma : number,
  luokka : {id : string, nimi : string},
  virhe : string[]
}

const LisaaRiviBudjettiin : React.FC = () : React.ReactElement => {

  console.log("RENDER")
    const taulut =  useSelector((state : RootState) => state.budjetit)
    const dispatch = useDispatch<AppDispatch>();

    const { id } = useLocalSearchParams<{ id : string }>();

    const [values, setValues] = useState<Value>({
                                          nimi : "",
                                          arvio : NaN,
                                          toteuma : NaN,
                                          luokka : {id : "", nimi : ""},
                                          virhe : []
                                          })


    
    const [value, setValue] = useState<string | null>("Valitse...");

    useEffect(() => {

      console.log(values)
    },[values])

    const data = (() : {label : string, value : string}[] => {
      const apuData : {label : string, value : string}[] = []

      taulut.luokat.map((luokka : any) => {
        apuData.push({label : luokka.nimi, value : luokka.id})
      })
      return apuData
    })();

    const vaihda = (item : {value : string, label : string}) => {
      setValue(item.value);
      setValues({...values, luokka : {id : item.value, nimi : item.label}})
    }

    const lisaaRivi = () => {

      let apuVirhe = []

      let uusiBudjettiRivi : {nimi : string, budjettiId : string|undefined, luokkaId : {id : string, nimi : string}, arvio : number, toteuma : number} = {
        nimi : "",
        budjettiId : id,
        luokkaId : {id : "", nimi : ""},
        arvio : NaN,
        toteuma : NaN
}

      if (!values.nimi){
        apuVirhe.push("Syötä nimi!")
      }
      if (!values.arvio){
        apuVirhe.push("Syötä arvio!")
      }

      if (!values.toteuma){
        uusiBudjettiRivi = {...uusiBudjettiRivi, toteuma : 0}
      }

      if (!values.luokka.id){
        uusiBudjettiRivi = {...uusiBudjettiRivi, luokkaId : {id : "1", nimi : "Ei valittu"}}
      }

      if (apuVirhe.length > 0){
        console.log(apuVirhe)
        setValues({...values, virhe : apuVirhe})
      }

      else {

        uusiBudjettiRivi = {...uusiBudjettiRivi,
          nimi : values.nimi,
          arvio : values.arvio
        }

        if (uusiBudjettiRivi.toteuma != 0){
          uusiBudjettiRivi = {...uusiBudjettiRivi, toteuma : values.toteuma}
        }

        if (uusiBudjettiRivi.luokkaId.id != "1"){
          uusiBudjettiRivi = {...uusiBudjettiRivi, luokkaId : {id : values.luokka.id, nimi : values.luokka.nimi} }
        }
        console.log("Lisätään uusi rivi...")
        console.log(uusiBudjettiRivi)

        setValues({
          nimi : "",
          arvio : NaN,
          toteuma : NaN,
          luokka : {id : "", nimi : ""},
          virhe : []
          })

        dispatch(tallennaBudjettiRivi(uusiBudjettiRivi));
        dispatch(haeTaulut());

      /*router.replace({
        pathname: "/Components/[Id]BudjetinTarkastelu",
        params: { id : id }
      })*/

      router.dismiss(1);
      }
    }

    const muokkaaLuokkia = () => {

      router.push({
        pathname: "/Components/[Id]MuokkaaLuokkia",
        //params: { id : id }
      })
    }

  return (
    <View>
        <Text>{id}</Text>
        {(Boolean(values.virhe.length > 0))
        ? values.virhe.map((virhe : string, idx : number) => {
          return (
         <Text key={idx} variant='displayLarge'>{virhe}</Text>
          )})
        : null
        }
        <TextInput
          style={styles.textInputs}
          label={"Nimi..."}
          //placeholder='Nimi...'
          onChangeText={newValue => setValues({ ...values, nimi : newValue })}
          //outlineColor='#F0F8FF'
          mode='outlined'
        />
        <TextInput
          style={styles.textInputs}
          label={"Arvio..."}
          //placeholder='0'
          onChangeText={newValue => setValues({ ...values, arvio : Number(newValue) })}
          mode='outlined'
        />
        <TextInput
          style={styles.textInputs}
          label={"Toteuma..."}
          //placeholder='0'
          onChangeText={newValue => setValues({ ...values, toteuma : Number(newValue) })}
          mode='outlined'
        />
        <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={data}
                search
                maxHeight={300}
                labelField={"label"}
                valueField="value"
                placeholder="Valitse..."
                searchPlaceholder="Search..."
                value={value}
                onChange={item => {
                  vaihda(item);
                }}
              />
        <Button style={styles.button} mode='contained' onPress={lisaaRivi}>Lisää rivi</Button>
        <Button style={styles.button} mode='contained' onPress={muokkaaLuokkia}>Muokkaa luokkia</Button>
        
    </View>
  )
}

const styles = StyleSheet.create({
  textInputs : {
    margin : 5,
    color :'#F0F8FF'
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
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  button: {
    margin : 5
  }
})
export default LisaaRiviBudjettiin;