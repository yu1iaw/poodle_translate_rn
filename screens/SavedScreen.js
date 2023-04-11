import { View, StyleSheet, FlatList, Text } from "react-native";
import { useSelector } from "react-redux";
import TranslationHistory from "../components/TranslationHistory";
import colors from "../utils/colors";

export function SavedScreen() {
	const savedItems = useSelector(state => state.savedItems.items);

	if (!savedItems.length) {
		return (
			<View style={styles.noItemsContainer}>
				<Text style={styles.noItemsText}>There is nothing to show.</Text>
			</View>
		)
	}

    return (
        <View style={styles.container}>
            <FlatList
				data={savedItems}
				renderItem={itemData => <TranslationHistory itemId={itemData.item.id} size={26} color={colors.primary} />}
				keyExtractor={item => item.id}
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
	noItemsContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center"
	},
	noItemsText: {
		fontFamily: "PTMono",
		fontSize: 20,
		color: colors.primary
	}
});