import { router, useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import { Button, DataTable } from "react-native-paper";
import { useState } from "react";
import { budjetinPoistoDialog, luokanPoistoDialog } from "../../Redux/budjettiSlice";
import VahvistaLuokanPoistoDialog from "./VahvistaLuokanPoistoDialog";
import VahvistaBudjetinPoistoDialog from "./VahvistaBudjetinPoistoDialog";


const BudjetinTarkastelu : React.FC = () : React.ReactElement => {

    const { id } = useLocalSearchParams<{ id : string }>();

    const taulut =  useSelector((state : RootState) => state.budjetit)
    const budjetinPoistoDialogi = useSelector((state : RootState) => state.budjetit.budjetinPoistoDialog)
    const dispatch = useDispatch<AppDispatch>()

    const [riviLisatty, setRiviLisatty] = useState<boolean>(false)

    const arviotYhteensa = () : number => {
        let summa = 0;

        taulut.budjetti.map((budjetti : any) => {
            budjetti.budjetitId === Number(id) ? summa += budjetti.arvio : null
        })
        return Number(summa.toFixed(2));
    }

    const toteutunutYhteensa = () : number => {
        let summa = 0;

        taulut.budjetti.map((budjetti : any) => {
            budjetti.budjetitId === Number(id) ? summa += budjetti.toteuma : null
        })
        return Number(summa.toFixed(2));
    }

    const poista = () => {
        dispatch(budjetinPoistoDialog(true));
        console.log(budjetinPoistoDialogi)
    }
    console.log("ID " + id )
    return (

        <View>
            <Text>{taulut.budjetit.find((item : any) => Number(id) === item.id)?.nimi}</Text>
            <DataTable>
                <DataTable.Header>
                    <DataTable.Title>Nimi</DataTable.Title>
                    <DataTable.Title>Luokka</DataTable.Title>
                    <DataTable.Title>Arvio</DataTable.Title>
                    <DataTable.Title>Toteutunut</DataTable.Title>
                </DataTable.Header>
                {taulut.budjetti.map((budjetti : any, idx : number) => {
                    if (budjetti.budjetitId === Number(id)) {
                        return (
                            <DataTable.Row key={idx}>
                                <DataTable.Cell>{budjetti.nimi}</DataTable.Cell>
                                <DataTable.Cell>
                                    {taulut.luokat.find((item: any) => item.id === budjetti.luokkaId)?.nimi}
                                </DataTable.Cell>
                                <DataTable.Cell>{budjetti.arvio}</DataTable.Cell>
                                <DataTable.Cell>{budjetti.toteuma}</DataTable.Cell>
                            </DataTable.Row>
                        )
                    }
                })} 
                <DataTable.Row style={{borderTopWidth : 1, borderTopColor : 'black'}}>
                    <DataTable.Cell textStyle={{fontWeight: 'bold'}}>Yhteensä</DataTable.Cell>
                    <DataTable.Cell> </DataTable.Cell>
                    <DataTable.Cell>{arviotYhteensa()}</DataTable.Cell>
                    <DataTable.Cell>{toteutunutYhteensa()}</DataTable.Cell>
                </DataTable.Row>
            </DataTable>
            <Button
                  style={styles.button} 
                  mode='contained'
                  onPress={() => router.push({
                    pathname: "/Components/[Id]LisaaRiviBudjettiin",
                    params: { id : id}
                  })}
                  >Lisää rivi</Button>
            <Button mode="contained" style={styles.button}>Lisää luokka</Button>
            <Button mode="contained" style={styles.buttonDanger} onPress={() => dispatch(budjetinPoistoDialog(true))}>Poista koko budjetti</Button>
            {(Boolean(budjetinPoistoDialogi))
            ? <View>
                <VahvistaBudjetinPoistoDialog id={Number(id)}/>
              </View>
            : null
            }
        </View>

    )
}

const styles = StyleSheet.create({
    button: {
      margin : 5
    },
    buttonDanger: {
      backgroundColor : "red",
      margin : 5,
      marginTop : 20
    }
  });

export default BudjetinTarkastelu;