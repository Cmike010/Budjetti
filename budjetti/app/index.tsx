import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { haeTaulut, luoTaulut } from '../Redux/budjettiSlice';
import { AppDispatch, RootState } from '../Redux/store';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { router } from 'expo-router';



const Index : React.FC = () : React.ReactElement => {

  console.log("RENDER")
  const haettu : React.MutableRefObject<boolean> = useRef(false);

  const taulut =  useSelector((state : RootState) => state.budjetit)
  console.log(taulut.budjetit)
  const dispatch : AppDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!haettu.current) {

      const alustaTaulut = async () => {
        await dispatch(luoTaulut());
        await dispatch(haeTaulut());
        if (taulut.budjetit){
          setIsLoading(false)
        }
      }
      alustaTaulut();
    }

    return () => {haettu.current = true}
  }, [dispatch]);

  const tulosta = async () => {
    await dispatch(haeTaulut());
    console.log("TULOSTETAAN TAULUT: " + JSON.stringify(taulut.budjetit[0].nimi))
  }

  const lisaaBudjetti = () => {

    router.push({
      pathname: "/Components/LisaaBudjetti",
      //params: { id : id }
    })
  }

  useEffect(() => {
    console.log("Taulujen tila päivittyi")
  },[taulut])

  if (isLoading){
    return (
      <View>
        <Text>Ladataan tietoja...</Text>
      </View>
    )
  }

    return (
        <View>
          {taulut.budjetit.map((budjetti : any, idx : number) => {
            return (
              <Button 
                  key={idx} 
                  style={styles.button} 
                  mode='contained'
                  onPress={() => 
                    router.push({
                      pathname: "/Components/[Id]BudjetinTarkastelu",
                      params: { id : budjetti.id}
                    })
                  }
                  >{budjetti.nimi}
              </Button>
            )
          })}
          <Button onPress={tulosta}>Paina</Button>
          <Button style={styles.button} onPress={() => lisaaBudjetti()}>Lisää budjetti</Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    button: {
      margin : 5
    }
  });

export default Index;