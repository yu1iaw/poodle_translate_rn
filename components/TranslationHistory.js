import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import colors from "../utils/colors";
import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { setSavedItems } from "../store/savedItemsSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

function TranslationHistory({itemId, size, color}) {
    const dispatch = useDispatch();
    const item = useSelector(state => {
        return state.history.items.find(item => itemId === item.id) ||
        state.savedItems.items.find(item => itemId === item.id);
    });
    const savedItems = useSelector(state => state.savedItems.items);
    const isSaved = savedItems.some(item => item.id === itemId);
    const starIcon = isSaved ? "star" : "star-outline";

    const starItem = useCallback(async () => {
        let newSavedItems;
        if (isSaved) {
            newSavedItems = savedItems.filter(item => item.id !== itemId);
        } else {
            newSavedItems = savedItems.slice();
            newSavedItems.push(item);
        }
        await AsyncStorage.setItem('savedItems', JSON.stringify(newSavedItems));
        
        dispatch(setSavedItems({items: newSavedItems}));
    }, [dispatch, savedItems])

    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text   
                    numberOfLines={4}
                    style={styles.title}>{item.original_text}</Text>
                <Text 
                    numberOfLines={4}
                    style={styles.subtitle}>{item.translated_text[item.to]}</Text>
            </View>

            <TouchableOpacity style={styles.iconContainer} onPress={starItem}>
                <MaterialIcons name={starIcon} size={size ? size : 21} color={color ? color : colors.subtextColor} />
            </TouchableOpacity>
        </View>
    )
}

export default TranslationHistory;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        paddingHorizontal: 10,
        paddingVertical: 20,
        backgroundColor: "white",
        borderColor: colors.lightGrey,
        borderWidth: 0.5,
        borderTopWidth: 0
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
        color: colors.subtextColor
    },
    iconContainer: {
        width: 30,
        alignItems: "center",
        justifyContent: "center"
    }
})