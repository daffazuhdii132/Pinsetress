import { Button, Text, Heading, Image } from "native-base";
import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import * as SecureStore from "expo-secure-store";

function LandingPage({ navigation, route }) {
  const pinterestLogo = require("../assets/pinterest-logo.png");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "flex-end",
          marginBottom: "5%",
          gap: 10,
        }}
      >
        <Image source={pinterestLogo} alt="Alternate Text" size="lg" />

        <Heading style={{ marginBottom: 15 }}>Welcome to Pinsetres</Heading>
        <Button
          size={"lg"}
          colorScheme={"red"}
          style={{ borderRadius: 50, width: 350 }}
          onPress={() => {
            navigation.navigate("Register");
          }}
        >
          <Text color={"white"}>Sign Up</Text>
        </Button>
        <Button
          size={"lg"}
          style={{
            borderRadius: 50,
            width: 350,
            backgroundColor: "#dbdbdb",
          }}
          onPress={() => {
            navigation.navigate("Login");
          }}
        >
          <Text color={"black"}>Log in</Text>
        </Button>
        <Text
          style={{
            width: 350,
            textAlign: "center",
            fontSize: 11,
            lineHeight: 12,
            marginTop: 10,
          }}
        >
          By continuing, you agree to Pinsetres's Terms of Service and
          acknowledge you've read our Privacy Policy. Notice at Collection
        </Text>
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

export default LandingPage;
