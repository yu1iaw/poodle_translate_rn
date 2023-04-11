import React, {memo} from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { Foundation } from '@expo/vector-icons';
import colors from "../utils/colors";

function LanguageItem({text, selected, onPress}) {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={styles.iconContainer}>
                {selected && <Foundation name="checkbox" size={22} color={colors.primary} />}
            </View>
            <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
    )
}

export default memo(LanguageItem);

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 12,
        borderBottomColor: colors.lightGrey,
        borderBottomWidth: 1
    },
    iconContainer: {
        paddingRight: 7, 
        width: 30,
        alignItems: "center"
    },
    text: {
        flex: 1,
        fontFamily: "PTMono",
        fontSize: 15
    }
})