import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import {useDispatch, useSelector} from 'react-redux';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, FlatList, ToastAndroid } from "react-native";
import { MaterialCommunityIcons, MaterialIcons, AntDesign } from "@expo/vector-icons";
import * as Clipboard from 'expo-clipboard';
import colors from "../utils/colors";
import supportedLanguages from "../utils/supportedLanguages";
import { translate } from "../utils/translate";
import { addHistoryItem, saveHistory } from "../store/historySlice";
import { setSavedItems } from "../store/savedItemsSlice";
import TranslationHistory from "../components/TranslationHistory";
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';


const loadData = () => {
	return async dispatch => {
		try {
			const historyString = await AsyncStorage.getItem('history');
			if (historyString !== null) {
				const history = JSON.parse(historyString);
				dispatch(saveHistory({items: history}));
			}
			const savedItemsString = await AsyncStorage.getItem('savedItems');
			if (savedItemsString !== null) {
				const savedItems = JSON.parse(savedItemsString);
				dispatch(setSavedItems({items: savedItems}));
			}
		} catch(e) {
			console.log(e);
		}
	}
}

let from = "en";
let to = "fr";
let txt = '';

export function HomeScreen({ navigation, route }) {
	const params = route.params || {};
	
	const dispatch = useDispatch();
	const history = useSelector(state => state.history.items);

	const [value, setValue] = useState(txt);
	const [output, setOutput] = useState("");
	const [languageFrom, setLanguageFrom] = useState(from);
	const [languageTo, setLanguageTo] = useState(to);
	const [isLoading, setIsLoading] = useState(false);
	const [isCopied, setIsCopied] = useState(false);

	// console.log(from, to);

	useLayoutEffect(() => {
		if (params.languageTo) {
			to = params.languageTo;
			setLanguageTo(to);
		}
		if (params.languageFrom) {
			from = params.languageFrom;
			setLanguageFrom(from);
		}
	}, [params.languageFrom, params.languageTo]);
	

	useEffect(() => {
		dispatch(loadData());
	}, [dispatch])


	useEffect(() => {
		const saveHistory = async () => {
			try {
				await AsyncStorage.setItem('history', JSON.stringify(history));
			} catch(e) {
				console.log(e);
			}
		}
		saveHistory();
	}, [history])

	const onSubmit = useCallback(async () => {
		try {
			setIsLoading(true);
			const result = await translate(value, languageFrom, languageTo)
			if (!result) {
				setOutput("");
				return;
			}
			const translatedResult = result.translated_text[result.to];
			setOutput(translatedResult);

			const id = uuid.v4();
			result.id = id;
			result.dateTime = new Date().toISOString();
			dispatch(addHistoryItem({item: result}))

		} catch(e) {
			console.log(e);
		} finally {
			setIsLoading(false);
		}
	}, [value, languageTo, languageFrom, dispatch]);


	const copyToClipboard = useCallback(async () => {
		setIsCopied(true);
		await Clipboard.setStringAsync(output);
		setTimeout(() => {
			setIsCopied(false);
			txt = '';
			setValue(txt);
			showToastWithGravity();
		}, 200)
	}, [output])

	const reorder = () => {
		[from, to] = [to, from];
		setLanguageTo(to);
		setLanguageFrom(from);
	}

	const showToastWithGravity = () => {
		ToastAndroid.showWithGravity(
		  'Copied!',
		  ToastAndroid.SHORT,
		  ToastAndroid.CENTER,
		);
	  };


	return (
		<View style={styles.container}>
			<View style={styles.languageContainer}>
				<TouchableOpacity
					style={styles.languageOption}
					onPress={() =>
						navigation.replace("LSelect", {
							title: "Transate from",
							mode: "from",
							selected: languageFrom,
						})
					}>
					<Text style={styles.languageOptionText}>{supportedLanguages[languageFrom]}</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.arrowContainer} onPress={reorder}>
					<MaterialCommunityIcons name="arrow-left-right-bold-outline" size={26} color={colors.primary} />
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.languageOption}
					onPress={() =>
						navigation.replace("LSelect", {
							title: "Transate to",
							mode: "to",
							selected: languageTo,
						})
					}>
					<Text style={styles.languageOptionText}>{supportedLanguages[languageTo]}</Text>
				</TouchableOpacity>
			</View>
			<View style={styles.inputContainer}>
				<TextInput 
					multiline 
					placeholder="Enter text to translate" 
					value={value} 
					onChangeText={(text) => {
						txt = text;
						setValue(txt);
					}} 
					style={styles.textInput} 
				/>
				<TouchableOpacity 
					disabled={value === ""} 
					style={styles.iconContainer} 
					onPress={ isLoading ? undefined : onSubmit}
				>
					{isLoading ? <ActivityIndicator size="small" color="#40E0D0" /> : <MaterialIcons name="translate" size={27} color={value ? colors.primary : "#c0c0c0"} />}
				</TouchableOpacity>
			</View>
			<View style={styles.resultContainer}>
				<Text style={styles.resultText}>{output}</Text>
				<TouchableOpacity 
					disabled={output === ""} 
					activeOpacity={0.8}
					style={styles.iconContainer}
					onPress={copyToClipboard}
				>
					<AntDesign name="copy1" size={25} color={isCopied ? colors.bgGrey : output ? colors.primary : "#c0c0c0"} />
				</TouchableOpacity>
			</View>
			<View style={styles.historyContainer}>
				<FlatList 
					data={history.slice().reverse()} 
					renderItem={(itemData) => <TranslationHistory itemId={itemData.item.id} />}
					keyExtractor={item => item.id}
				 />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	languageContainer: {
		flexDirection: "row",
		borderBottomColor: colors.lightGrey,
		borderBottomWidth: 1,
	},
	languageOption: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 15,
	},
	arrowContainer: {
		width: 50,
		alignItems: "center",
		justifyContent: "center",
	},
	languageOptionText: {
		color: colors.primary,
		fontFamily: "PTMono",
	},
	inputContainer: {
		flexDirection: "row",
		borderBottomColor: colors.lightGrey,
		borderBottomWidth: 1
	},
	textInput: {
		flex: 1,
		padding: 15,
		height: 90,
		fontFamily: "PTMono",
		color: colors.textColor,
		textAlignVertical: "top"
	},
	iconContainer: {
		width: 55,
		paddingHorizontal: 12,
		alignItems: "flex-start",
		justifyContent: "center",
	},
	resultContainer: {
		flexDirection: "row",
		borderBottomColor: colors.lightGrey,
		borderBottomWidth: 1,
		height: 90,
		paddingVertical: 15,
	},
	resultText: {
		flex: 1,
		fontFamily: "PTMono",
		color: colors.textColor,
		marginHorizontal: 15,
	},
	historyContainer: {
		flex: 1,
		backgroundColor: colors.bgGrey,
		padding: 15,
	},
});
