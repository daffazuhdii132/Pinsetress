import { Button, FormControl, Image, Input, Text } from "native-base";
import { useContext, useState } from "react";
import { Alert, StyleSheet, TextInput, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { gql, useMutation } from "@apollo/client";
import AuthContext from "../contexts/authContext";

function LoginScreen({ navigation, route }) {
  const pinterestLogo = require("../assets/pinterest-logo.png");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  console.log(isLoggedIn, setIsLoggedIn, "<<<<<<KONTEKS");
  const LOGIN_MUTATION = gql`
    mutation Login($username: String, $password: String) {
      login(username: $username, password: $password) {
        access_token
      }
    }
  `;
  const [doLogin] = useMutation(LOGIN_MUTATION);
  async function handleLogin() {
    try {
      console.log("masuk handleLogin");
      const result = await doLogin({
        variables: {
          username: username,
          password: password,
        },
      });
      await SecureStore.setItemAsync(
        "access_token",
        result.data?.login?.access_token
      );
      setIsLoggedIn(true);
      console.log(result);
    } catch (error) {
      console.log("ERROR");
      console.log(error);
      Alert.alert(error.message);
    }
  }

  return (
    <>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          // backgroundColor: "red",
        }}
      >
        <Image source={pinterestLogo} alt="Alternate Text" size="md" />
      </View>
      <View
        style={{
          flex: 3,
          alignItems: "center",
          justifyContent: "flex-start",
          gap: 10,
        }}
      >
        <FormControl w="100%" maxW={350}>
          <FormControl.Label>
            <Text fontSize={15}>Username</Text>
          </FormControl.Label>
          <Input
            variant="unstyled"
            fontSize={15}
            type="text"
            placeholder="Enter username"
            value={username}
            onChangeText={setUsername}
          />
          <FormControl.Label>
            <Text fontSize={15}>Password</Text>
          </FormControl.Label>
          <Input
            variant="unstyled"
            fontSize={15}
            type="password"
            placeholder="Enter password"
            value={password}
            onChangeText={setPassword}
          />
        </FormControl>
        <Button
          size={"lg"}
          colorScheme={"red"}
          style={{ borderRadius: 50, width: 350 }}
          onPress={() => {
            handleLogin();
          }}
        >
          <Text color={"white"}>Log in</Text>
        </Button>
        <Button
          size={"lg"}
          style={{
            borderRadius: 50,
            width: 350,
            backgroundColor: "#dbdbdb",
          }}
          onPress={() => {
            navigation.navigate("Landing Page");
          }}
        >
          <Text color={"black"}>Back</Text>
        </Button>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 40,
    width: 250,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default LoginScreen;
