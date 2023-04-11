import { useState, useEffect, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons, MaterialIcons, Feather } from "@expo/vector-icons";
import * as SplashScreen from "expo-splash-screen";
import { HomeScreen } from "./screens/HomeScreen";
import { SettingsScreen } from "./screens/SettingsScreen";
import { SavedScreen } from "./screens/SavedScreen";
import { LanguageSelectScreen } from "./screens/LanguageSelectScreen";
import * as Font from "expo-font";
import { View } from "react-native";
import colors from "./utils/colors";
import { Provider } from "react-redux";
import store from "./store/store";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// AsyncStorage.clear();


SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNav = () => {
	return (
		<Tab.Navigator screenOptions={{ headerShown: false }}>
			<Tab.Screen
				name="Home"
				component={HomeScreen}
				options={{
					tabBarLabel: "Home",
					tabBarIcon: ({ color, size, tintColor }) => <MaterialCommunityIcons name="home-circle-outline" size={34} color={color} />,
				}}
			/>
			<Tab.Screen
				name="Saved"
				component={SavedScreen}
				options={{
					tabBarLabel: "Saved",
					tabBarIcon: ({ color }) => <MaterialIcons name="stars" size={33} color={color} />,
				}}
			/>
			<Tab.Screen
				name="Settings"
				component={SettingsScreen}
				options={{
					tabBarLabel: "Settings",
					tabBarIcon: ({ color }) => <Feather name="settings" size={28} color={color} />,
				}}
			/>
		</Tab.Navigator>
	);
};

export default function App() {
	const [isAppLoaded, setIsAppLoaded] = useState(false);

	useEffect(() => {
		const prepare = async () => {
			try {
				await Font.loadAsync({
					PTMono: require("./assets/fonts/PTMono-Regular.ttf"),
				});
			} catch (e) {
				console.log(e.message);
			} finally {
				setIsAppLoaded(true);
			}
		};
		prepare();
	}, []);

	const onLayout = useCallback(async() => {
		if (isAppLoaded) {
			await SplashScreen.hideAsync();
		}
	}, [isAppLoaded]);

	if (!isAppLoaded) return null;

	return (
		<Provider store={store}>
			<NavigationContainer >
				<StatusBar style="light" />
				<View onLayout={onLayout} style={{flex: 1}}>
					<Stack.Navigator
						screenOptions={{
							headerTitleAlign: "center",
				headerTitleStyle: {
				fontFamily: 'PTMono', 
				color: "white"
				},
				headerStyle: {backgroundColor: colors.primary}
						}}>
						<Stack.Screen
							name="HomeScreen"
							component={TabNav}
							options={{
								headerTitle: "Translate",
							}}
						/>
				<Stack.Screen name="LSelect" component={LanguageSelectScreen} />
					</Stack.Navigator>
				</View>
			</NavigationContainer>
		</Provider>
	);
}
