import { router } from 'expo-router';
import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native';
import { TextInput, Text, Button, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../Redux/store';
import { haeTaulut, lisaaBudjetti } from '../../Redux/budjettiSlice';

interface Values {
    nimi : string
    virhe : string
}

const LisaaBudjetti : React.FC = () : React.ReactElement => {

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
          onChangeText={uusiNimi => setValues({...values, nimi : uusiNimi})}
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
  button: {
    margin : 5,
    width : 300,
    alignSelf : "center",
      borderColor : "black",
      borderWidth : 1
  }
})
export default LisaaBudjetti;