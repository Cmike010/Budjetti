import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react'
import {Picker} from '@react-native-picker/picker';
import { Dropdown } from 'react-native-element-dropdown';
import { View, StyleSheet } from 'react-native';
import { TextInput, Text, Button, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../Redux/store';
import { haeTaulut, tallennaBudjettiRivi, lisaaBudjetti } from '../../Redux/budjettiSlice';
import VahvistaPoistoDialog from './VahvistaLuokanPoistoDialog';

interface Values {

    nimi : string
    virhe : string
}

const LisaaBudjetti : React.FC = () : React.ReactElement => {

    const taulut =  useSelector((state : RootState) => state.budjetit)
    const dispatch = useDispatch<AppDispatch>();

    const theme = useTheme()
    const [values, setValues] = useState<Values>({nimi : "", virhe : ""});



    const lisaa = () => {
        setValues({nimi : "", virhe : ""})
        if (values.nimi){
            dispatch(lisaaBudjetti(values.nimi))
            dispatch(haeTaulut());
            router.dismiss(1)
        }

        else {
            setValues({...values, virhe : "Anna nimi"})
        }

      
    }

  return (
    <View>
        {(Boolean(values.virhe.length > 0))
        ? <Text variant='headlineMedium' style={{color : theme.colors.error}}>{values.virhe}</Text>
        : null
        }
        <TextInput
          style={styles.textInputs}
          label={"Anna budjetille nimi..."}
          //placeholder='Nimi...'
          onChangeText={uusiNimi => setValues({...values, nimi : uusiNimi})}
          //outlineColor='#F0F8FF'
          mode='outlined'
        />
        <Button style={styles.button} mode='contained' onPress={lisaa}>Lisää uusi budjetti</Button>
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
export default LisaaBudjetti;