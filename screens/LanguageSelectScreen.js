import { useCallback, useEffect } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Ionicons } from '@expo/vector-icons'; 
import {HeaderButton, HeaderButtons, Item} from 'react-navigation-header-buttons';
import colors from "../utils/colors";
import supportedLanguages from "../utils/supportedLanguages";
import LanguageItem from "../components/LanguageItem";

const CustomHeaderButton = (props) => {
    return (
        <HeaderButton {...props} IconComponent={Ionicons} iconSize={24} color={props.color || colors.bgGrey} />
    )
}

export function LanguageSelectScreen({navigation, route}) {
    const params = route.params || {};
    const {title, selected, mode} = params;
    // console.log(route);

    useEffect(() => {
        navigation.setOptions({
            title: title,
            headerRight: () => {
                return (
                    <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                        <Item
                            iconName="exit-outline" color="white" onPress={() => navigation.replace('HomeScreen')} />
                    </HeaderButtons>
                )
            }
        })
    }, [navigation])

    const onLangSelect = useCallback((key) => {
        const dataKey = mode === "to" ? "languageTo" : "languageFrom";
        navigation.replace("HomeScreen", {
            screen: "Home",
            params: {
                [dataKey]: key
            }
        })
    }, [params, navigation])

    const renderItem = useCallback((itemData) => {
        const langKey = itemData.item;
        const langValue = supportedLanguages[langKey];
        return <LanguageItem 
            text={langValue} 
            selected={langKey === selected}
            onPress={() => onLangSelect(langKey)}
        />
    }, [])
 
    return (
        <View style={styles.container}>
            <FlatList
                data={Object.keys(supportedLanguages)} 
                renderItem={renderItem}
                maxToRenderPerBatch={64}
                updateCellsBatchingPeriod={100}
                initialNumToRender={23}
                keyExtractor={(_item, index) => index}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "fff"
    }
})