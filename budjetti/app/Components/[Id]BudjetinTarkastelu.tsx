import { router, useLocalSearchParams } from "expo-router";
import { View, StyleSheet, Pressable, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import { Button, DataTable } from "react-native-paper";
import { budjetinPoistoDialog } from "../../Redux/budjettiSlice";
import VahvistaBudjetinPoistoDialog from "./VahvistaBudjetinPoistoDialog";


const BudjetinTarkastelu : React.FC = () : React.ReactElement => {

    const { id } = useLocalSearchParams<{ id : string }>();

    const taulut =  useSelector((state : RootState) => state.budjetit)
    const budjetinPoistoDialogi = useSelector((state : RootState) => state.budjetit.budjetinPoistoDialog)
    const dispatch = useDispatch<AppDispatch>()

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

    const muokkaaRivi = (id : number) => {

        router.push({
            pathname: "/Components/[Id]MuokkaaBudjettiRivi",
            params: { id : id}
          })
    }

    const haeTulos = () => {

        const tulos = arviotYhteensa() - toteutunutYhteensa();

        return(
        tulos < 0 
        ? <DataTable.Cell textStyle={{fontWeight : "bold"}} style={{backgroundColor : "#FF474C", display: 'flex', alignSelf : "center",  justifyContent: 'center'}}>{tulos}</DataTable.Cell>
        : <DataTable.Cell textStyle={{fontWeight : "bold"}} style={{backgroundColor : "#90EE90", display: 'flex', alignSelf : "center",  justifyContent: 'center'}}>+{tulos}</DataTable.Cell>
        )
    }

    return (

        <View>
            <ScrollView>
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
                                <Pressable key={idx} onPress={() => muokkaaRivi(budjetti.id)}>
                                    <DataTable.Row>
                                        <DataTable.Cell>{budjetti.nimi}</DataTable.Cell>
                                        <DataTable.Cell>
                                            {taulut.luokat.find((item: any) => item.id === budjetti.luokkaId)?.nimi}
                                        </DataTable.Cell>
                                        <DataTable.Cell>{budjetti.arvio}</DataTable.Cell>
                                        <DataTable.Cell style={budjetti.toteuma < budjetti.arvio 
                                                        ? {backgroundColor : "#90EE90", display: 'flex', alignSelf : "center",  justifyContent: 'center'} 
                                                        : {backgroundColor : "#FF474C", display: 'flex', alignSelf : "center",  justifyContent: 'center'}}
                                                        >{budjetti.toteuma}
                                        </DataTable.Cell>
                                    </DataTable.Row>
                                </Pressable>
                            )
                        }
                    })} 
                    <DataTable.Row style={{borderTopWidth : 1, borderTopColor : 'black'}}>
                        <DataTable.Cell textStyle={{fontWeight: 'bold'}}>Yhteensä</DataTable.Cell>
                        <DataTable.Cell> </DataTable.Cell>
                        <DataTable.Cell>{arviotYhteensa()}</DataTable.Cell>
                        <DataTable.Cell style={{justifyContent : "center"}}>{toteutunutYhteensa()}</DataTable.Cell>
                    </DataTable.Row>
                    <DataTable.Row>
                        <DataTable.Cell textStyle={{fontWeight: 'bold'}}>Voitto/Tappio +-</DataTable.Cell>
                        <DataTable.Cell> </DataTable.Cell>
                        <DataTable.Cell> </DataTable.Cell>
                        {haeTulos()}
                    </DataTable.Row>
                </DataTable>
            </ScrollView>
            <Button
                  style={styles.button} 
                  mode='contained'
                  onPress={() => router.push({
                    pathname: "/Components/[Id]LisaaRiviBudjettiin",
                    params: { id : id}
                  })}
                  >Lisää rivi</Button>
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
      marginTop : 10,
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
  });

export default BudjetinTarkastelu;