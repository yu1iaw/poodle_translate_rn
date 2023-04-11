import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Entypo } from '@expo/vector-icons';
import colors from "../utils/colors";

export function Button({title, subtitle, icon, color, onPress}) {
    return (
        <TouchableOpacity activeOpacity={0.5} style={styles.container} onPress={onPress}>
            <View style={styles.textContainer}>
                <Text style={styles.title} numberOfLines={1}>{title}</Text>
                <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
            </View>
            <View style={styles.iconContainer}>
                <Entypo name={icon} size={24} color={color} />
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        borderColor: colors.lightGrey,
        borderWidth: 0.5,
        borderTopWidth: 0,
        paddingVertical: 10,
        paddingHorizontal: 15    
    },
    textContainer: {
        flex: 1,
        marginRight: 8
    },
    title: {
        fontFamily: "PTMono",
        fontSize: 15,
        color: colors.textColor
    },
    subtitle: {
        fontFamily: "PTMono",
        color: colors.subtextColor,
        fontSize: 13
    },
    iconContainer: {
        alignItems: "center",
        justifyContent: "center"
    }
})