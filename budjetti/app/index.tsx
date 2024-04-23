import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { haeTaulut, luoTaulut } from '../Redux/budjettiSlice';
import { AppDispatch, RootState } from '../Redux/store';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import { router } from 'expo-router';

const Index : React.FC = () : React.ReactElement => {

  const haettu : React.MutableRefObject<boolean> = useRef(false);

  const taulut =  useSelector((state : RootState) => state.budjetit)
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

  const lisaaBudjetti = () => {

    router.push({
      pathname: "/Components/LisaaBudjetti",
    })
  }


  if (isLoading){
    return (
      <View>
        <Text>Ladataan tietoja...</Text>
      </View>
    )
  }

    return (
        <ScrollView>
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
          <Button style={styles.lisaaButton} mode='elevated' onPress={() => lisaaBudjetti()}>Lisää budjetti</Button>
        </ScrollView>
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
      marginTop : 10,
      width : 300,
      alignSelf : "center",
      borderColor : "black",
      borderWidth : 1
    },
    lisaaButton: {
      margin : 15,
      backgroundColor : "#90EE90",
      textDecorationColor : "white",
      width : 150,
      alignSelf : "center",
      borderColor : "black",
      borderWidth : 1
    }
  });

export default Index;