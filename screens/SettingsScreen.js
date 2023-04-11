import { View, StyleSheet, Alert } from "react-native";
import { Button } from "../components/Button";
import colors from "../utils/colors";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { clearHistory } from "../store/historySlice";
import { clearSavedItems } from "../store/savedItemsSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function SettingsScreen() {
	const dispatch = useDispatch();

	const deleteHistory = useCallback(async () => {
		try {
			await AsyncStorage.setItem('history', JSON.stringify([]));
			dispatch(clearHistory());
			Alert.alert("Success!", "History cleared!");
		} catch(e) {
			console.log(e);
		}
	}, [dispatch])

	const deleteSavedItems = useCallback(async () => {
		try {
			await AsyncStorage.setItem('savedItems', JSON.stringify([]));
			dispatch(clearSavedItems());
			Alert.alert("Success!", "Saved items cleared!");
		} catch(e) {
			console.log(e);
		}
	}, [dispatch])

    return (
        <View style={styles.container}>
            <Button 
				title="Clear history"
				subtitle="Clears all items from your history"
				icon="bucket"
				color={colors.primary}
				onPress={deleteHistory}
			/>
			<Button 
				title="Clear saved items"
				subtitle="Clears all saved items"
				icon="bucket"
				color="firebrick"
				onPress={deleteSavedItems}
			/>
        </View>
    )
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.bgGrey,
		padding: 15
	},
});