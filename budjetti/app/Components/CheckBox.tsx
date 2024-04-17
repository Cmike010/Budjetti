import { router, useLocalSearchParams } from 'expo-router';
import Checkbox from 'expo-checkbox';
import React, { useEffect, useRef, useState } from 'react';
import {Picker} from '@react-native-picker/picker';
import { Dropdown } from 'react-native-element-dropdown';
import { View, StyleSheet } from 'react-native';
import { TextInput, Text, Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../Redux/store';
import { haeTaulut, tallennaBudjettiRivi, vaihdaValittuLuokka } from '../../Redux/budjettiSlice';

interface Props {
    luokkaId : number
}

const CheckBox : React.FC<Props> = (props : Props) : React.ReactElement => {

    const [isChecked, setChecked] = useState(false);

    return (
        <Checkbox style={styles.checkbox} value={isChecked} onValueChange={setChecked}/>
    )
}

const styles = StyleSheet.create({
    checkbox: {
      margin: 8,
    },
  });

export default CheckBox