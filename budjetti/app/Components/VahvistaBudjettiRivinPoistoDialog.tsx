import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native';
import { Button, Dialog, Portal, PaperProvider, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { budjetinPoistoDialog, budjettiRivinPoistoDialog, haeTaulut, luokanPoistoDialog, poistaBudjetti, poistaBudjettiRivi, poistaLuokka } from '../../Redux/budjettiSlice';
import { AppDispatch, RootState } from '../../Redux/store';
import { router } from 'expo-router';

interface Props {
    id : number
}

const VahvistaBudjettiRivinPoistoDialog : React.FC<Props> = (props : Props) : React.ReactElement => {

const dialogAuki = useSelector((state : RootState) => state.budjetit.budjettiRivinPoistoDialog)
const budjetit = useSelector((state : RootState) => state.budjetit.budjetti);
const dispatch = useDispatch<AppDispatch>();


const [poistettava] = useState<Budjetti>(budjetit.find((budjetti : Budjetti) => Number(props.id) === budjetti.id));

const poista = () => {
dispatch(poistaBudjettiRivi(poistettava?.id))
dispatch(haeTaulut());
router.dismiss(1)
}


    return(
            <View>
                <Portal>
                    <Dialog visible={dialogAuki} onDismiss={() => dispatch(budjettiRivinPoistoDialog(false))}>
                        <Dialog.Title>Varoitus</Dialog.Title>
                        <Dialog.Content>
                            <Text>Poistetaanko rivi {poistettava?.nimi}?</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button mode="contained" style={styles.button} onPress={() => dispatch(budjettiRivinPoistoDialog(false))}>Takaisin</Button>
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

export default VahvistaBudjettiRivinPoistoDialog;