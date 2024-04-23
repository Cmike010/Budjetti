import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react'
import { Dropdown } from 'react-native-element-dropdown';
import { View, StyleSheet } from 'react-native';
import { TextInput, Text, Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../Redux/store';
import { haeTaulut, paivitaBudjettiRivi, budjettiRivinPoistoDialog } from '../../Redux/budjettiSlice';
import VahvistaBudjettiRivinPoistoDialog from './VahvistaBudjettiRivinPoistoDialog';


const MuokkaaBudjettiRivi : React.FC = () : React.ReactElement => {

    const { id } = useLocalSearchParams<{ id : string }>();
    const taulut =  useSelector((state : RootState) => state.budjetit)
    const dispatch = useDispatch<AppDispatch>();

    const [values, setValues] = useState<Budjetti | undefined>(taulut?.budjetti?.find((item : Budjetti) => Number(id) === item.id) || undefined);

    const [virhe, setVirhe] = useState({})

    const data = (() : {label : string, value : string}[] => {
        const apuData : {label : string, value : string}[] = []
    
        taulut.luokat.map((luokka : any) => {
            apuData.push({label : luokka.nimi, value : luokka.id})
        })
        return apuData
        })();

    const vaihda = (item : {value : string, label : string}) => {
        if (values) {
          setValues({ ...values, luokkaId: item.value });
      } 
      }

    const muokkaa = () => {

      let apuVirhe = {}
        setVirhe({})
        if (values!.nimi.length <= 0){
          apuVirhe = {...apuVirhe, nimi : "Syötä nimi!"}
        }

        if (!values!.arvio){
          apuVirhe = {...apuVirhe, arvio : "Syötä arvio!"}
        }

        if (Object.entries(apuVirhe).length > 0){

          setVirhe(apuVirhe)
        }

        else {
          dispatch(paivitaBudjettiRivi(values));
          dispatch(haeTaulut());
          router.back();
        }
    }

  return (
    <View>
        {(Boolean(virhe))
        ? Object.entries(virhe).map(([key, value], idx : number) => {
          return (
         <Text key={idx} variant='displayLarge'>{String(value)}</Text>
          )})
        : null
        }
        <TextInput
          style={styles.textInputs}
          label={"Nimi..."}
          defaultValue={values!.nimi}
          onChangeText={newValue => {
            if (values){
            setValues({ ...values, nimi : newValue })}}}
          mode='outlined'
        />
        <TextInput
          style={styles.textInputs}
          label={"Arvio..."}
          defaultValue={String(values!.arvio)}
          onChangeText={newValue => {
            if (values){
            setValues({ ...values, arvio : Number(newValue) })}}}
          mode='outlined'
        />
        <TextInput
          style={styles.textInputs}
          label={"Toteuma..."}
          defaultValue={String(values!.toteuma)}
          onChangeText={newValue => {
            if (values){
            setValues({ ...values, toteuma : Number(newValue) })}}}
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
                placeholder={taulut.luokat.find((luokka : {id : number, nimi : string}) => values!.luokkaId == luokka.id)?.nimi}
                searchPlaceholder="Search..."
                value={String(values!.id)}
                onChange={item => {
                  vaihda(item);
                }}
              />
        <Button style={styles.button} mode='contained' onPress={muokkaa}>Vahvista muutokset</Button>
        <Button style={styles.button} mode='contained' onPress={router.back}>Takaisin</Button>
        <Button mode="contained" style={styles.buttonDanger} onPress={() => dispatch(budjettiRivinPoistoDialog(true))}>Poista tämä rivi</Button>
        {(Boolean(budjettiRivinPoistoDialog))
            ? <View>
                <VahvistaBudjettiRivinPoistoDialog id={Number(id)}/>
              </View>
            : null
            }
        
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
    margin : 5,
    width : 300,
    alignSelf : "center",
      borderColor : "black",
      borderWidth : 1
  },
  
  buttonDanger: {
    backgroundColor : "red",
    margin : 5,
    marginTop : 20,
    width : 300,
    alignSelf : "center",
      borderColor : "black",
      borderWidth : 1
  }
})
export default MuokkaaBudjettiRivi;