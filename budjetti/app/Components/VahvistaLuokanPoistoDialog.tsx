import React from 'react'
import { View, StyleSheet } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { haeTaulut, luokanPoistoDialog, poistaLuokka } from '../../Redux/budjettiSlice';
import { AppDispatch, RootState } from '../../Redux/store';
import { router } from 'expo-router';

interface Props {
    id : number
}

const VahvistaLuokanPoistoDialog : React.FC<Props> = (props : Props) : React.ReactElement => {

const dialogAuki = useSelector((state : RootState) => state.budjetit.luokanPoistoDialog)
const luokat =  useSelector((state : RootState) => state.budjetit.luokat)
const dispatch = useDispatch<AppDispatch>();

const nimi : string | undefined = luokat.find((luokka : {id : number, nimi : string}) => {
    return luokka.id === props.id;
})?.nimi;

const poista = () => {
dispatch(poistaLuokka(props.id));
dispatch(haeTaulut());
dispatch(luokanPoistoDialog(false));
router.dismiss(1)
    
}


    return(
            <View>
                <Portal>
                    <Dialog visible={dialogAuki} onDismiss={() => dispatch(luokanPoistoDialog(false))}>
                        <Dialog.Title>Varoitus</Dialog.Title>
                        <Dialog.Content>
                            <Text>Poistetaanko luokka {nimi}?</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button mode="contained" style={styles.button} onPress={() => dispatch(luokanPoistoDialog(false))}>Takaisin</Button>
                            <Button buttonColor='red' mode="contained" style={styles.button} onPress={poista}>Poista</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </View>
    )
}

const styles = StyleSheet.create({
    textInputs : {
        margin : 10,
    },
    button: {
      margin : 5,
      width : 100
    },
    
  });

export default VahvistaLuokanPoistoDialog;