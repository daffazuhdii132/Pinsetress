import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { LogBox, StyleSheet, Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./screens/Home";
import LoginScreen from "./screens/Login";
import { NativeBaseProvider } from "native-base";
import LandingPage from "./screens/LandingPage";
import RegisterScreen from "./screens/Register";
import { useEffect } from "react";
import { useState } from "react";
import SearchScreen from "./screens/Search";
import ProfileScreen from "./screens/Profile";
import NewPostScreen from "./screens/NewPost";
import InboxScreen from "./screens/Inbox";

import {
  Entypo,
  FontAwesome,
  FontAwesome6,
  Ionicons,
} from "@expo/vector-icons";
import { ApolloProvider } from "@apollo/client";
import client from "./config/apollo";
import AuthContext from "./contexts/authContext";
import { useContext } from "react";
import * as SecureStore from "expo-secure-store";
import Create from "./screens/Create";
import PostDetail from "./screens/PostDetail";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    LogBox.ignoreLogs([
      "In React 18, SSRProvider is not necessary and is a noop. You can remove it from your app.",
    ]);
    async function checkToken() {
      let token = await SecureStore.getItemAsync("access_token");
      if (token) {
        setIsLoggedIn(true);
      }
    }
    checkToken();
  }, []);
  const CreateButton = () => null;
  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <ApolloProvider client={client}>
        <NavigationContainer>
          <NativeBaseProvider>
            {isLoggedIn ? (
              <>
                <Tab.Navigator
                  // screenOptions={{
                  //   tabBarActiveTintColor: "tomato",
                  //   tabBarInactiveTintColor: "gray",
                  // }}
                  screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                      let iconName;

                      if (route.name === "Home") {
                        color = focused ? "black" : "lightgrey";
                        return <Entypo name="home" size={25} color={color} />;
                      } else if (route.name === "Search") {
                        color = focused ? "black" : "lightgrey";
                        return (
                          <FontAwesome name="search" size={25} color={color} />
                        );
                      } else if (route.name === "Create") {
                        color = focused ? "black" : "lightgrey";
                        return (
                          <FontAwesome6 name="plus" size={25} color={color} />
                        );
                      } else if (route.name === "Inbox") {
                        color = focused ? "black" : "lightgrey";
                        return (
                          <Ionicons
                            name="chatbubble-ellipses-sharp"
                            size={25}
                            color={color}
                          />
                        );
                      } else if (route.name === "Profile") {
                        color = focused ? "black" : "lightgrey";
                        return (
                          <Ionicons name="person" size={25} color={color} />
                        );
                      }
                    },
                    tabBarActiveTintColor: "black",
                    tabBarInactiveTintColor: "lightgrey",
                    tabBarLabelStyle: {
                      fontSize: 12,
                      margin: 0,
                      padding: 0,
                    },
                    tabBarStyle: {
                      padding: 8,
                    },
                  })}
                >
                  <Tab.Screen name="Home" component={HomeScreen} />
                  <Tab.Screen name="Search" component={SearchScreen} />
                  <Tab.Screen name="Create" component={Create} />
                  <Tab.Screen name="Inbox" component={InboxScreen} />
                  <Tab.Screen name="Profile" component={ProfileScreen} />
                  <Tab.Screen
                    name="PostDetail"
                    component={PostDetail}
                    options={{
                      tabBarButton: (props) => null, //like this
                    }}
                  />
                </Tab.Navigator>
              </>
            ) : (
              <>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="Landing Page" component={LandingPage} />
                  <Stack.Screen name="Login" component={LoginScreen} />
                  <Stack.Screen name="Register" component={RegisterScreen} />
                </Stack.Navigator>
              </>
            )}
          </NativeBaseProvider>
        </NavigationContainer>
      </ApolloProvider>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
