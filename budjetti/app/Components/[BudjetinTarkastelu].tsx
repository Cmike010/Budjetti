import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { DataTable } from "react-native-paper";

const BudjetinTarkastelu : React.FC = () : React.ReactElement => {

    const { id } = useLocalSearchParams<{ id : string }>();

    const taulut =  useSelector((state : RootState) => state.budjetit)
    console.log(Number(id))
    return (

        <View>
            <Text>{taulut.budjetit[Number(id) -1 ].nimi}</Text>
            <DataTable>
                <DataTable.Header>
                    <DataTable.Title>Nimi</DataTable.Title>
                    <DataTable.Title>Luokka</DataTable.Title>
                    <DataTable.Title>Arvio</DataTable.Title>
                    <DataTable.Title>Toteutunut</DataTable.Title>
                </DataTable.Header>
                {taulut.budjetti.map((budjetti : any, idx : number) => {
                    if (budjetti.budjetitId === Number(id)) {
                        console.log("LuokkaId: " + budjetti.luokkaId)
                        console.log(budjetti.luokkaId)
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
            </DataTable>
        </View>

    )
}

export default BudjetinTarkastelu;