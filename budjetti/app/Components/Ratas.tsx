import React from "react"
import { Pressable } from "react-native"
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../Redux/store";

const Ratas : React.FC = () : React.ReactElement => {

    const dispatch = useDispatch<AppDispatch>();

    return (
        <Pressable onPress={() => console.log("Tänne asetukset asetusvalikon avaamiseksi")}>
            <Ionicons name="settings-outline" size={24} color="black" />
        </Pressable>
    )
}

export default Ratas