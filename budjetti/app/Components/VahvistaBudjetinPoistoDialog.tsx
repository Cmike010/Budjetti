import React from 'react'
import { View, StyleSheet } from 'react-native';
import { Button, Dialog, Portal, PaperProvider, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { budjetinPoistoDialog, haeTaulut, luokanPoistoDialog, poistaBudjetti, poistaLuokka } from '../../Redux/budjettiSlice';
import { AppDispatch, RootState } from '../../Redux/store';
import { router } from 'expo-router';

interface Props {
    id : number
}

const VahvistaBudjetinPoistoDialog : React.FC<Props> = (props : Props) : React.ReactElement => {

const dialogAuki = useSelector((state : RootState) => state.budjetit.budjetinPoistoDialog)
const budjetit =  useSelector((state : RootState) => state.budjetit.budjetit)
const dispatch = useDispatch<AppDispatch>();

const nimi : string = budjetit.find((budjetti : {id : number, nimi : string}) => {
    return budjetti.id === props.id;
})?.nimi;

const poista = () => {
dispatch(poistaBudjetti(props.id));
dispatch(haeTaulut());
dispatch(budjetinPoistoDialog(false));
router.dismiss(1)
    
}


    return(
            <View>
                <Portal>
                    <Dialog visible={dialogAuki} onDismiss={() => dispatch(budjetinPoistoDialog(false))}>
                        <Dialog.Title>Varoitus</Dialog.Title>
                        <Dialog.Content>
                            <Text>Poistetaanko budjetti {nimi}?</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button mode="contained" style={styles.button} onPress={() => dispatch(budjetinPoistoDialog(false))}>Takaisin</Button>
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

export default VahvistaBudjetinPoistoDialog;