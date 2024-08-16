import { Button, FormControl, Image, Input, Text } from "native-base";
import { useState } from "react";
import { Alert, StyleSheet, TextInput, View } from "react-native";
import { gql, useMutation } from "@apollo/client";

function RegisterScreen({ navigation, route }) {
  const pinterestLogo = require("../assets/pinterest-logo.png");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const REGISTER_MUTATION = gql`
    mutation Register(
      $name: String
      $username: String
      $email: String
      $password: String
    ) {
      register(
        name: $name
        username: $username
        email: $email
        password: $password
      )
    }
  `;
  const [doRegister] = useMutation(REGISTER_MUTATION);
  async function handleRegister() {
    try {
      console.log("masuk handleRegister");
      const result = await doRegister({
        variables: {
          name: name,
          username: username,
          email: email,
          password: password,
        },
      });

      console.log(result);
      Alert.alert(result.data.register);
      navigation.navigate("Login");
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
          //   backgroundColor: "red",
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
          //   backgroundColor: "blue",
        }}
      >
        <FormControl w="100%" maxW={350}>
          <FormControl.Label>
            <Text fontSize={15}>Name</Text>
          </FormControl.Label>
          <Input
            variant="unstyled"
            fontSize={15}
            type="text"
            placeholder="Enter name"
            value={name}
            onChangeText={setName}
          />
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
            <Text fontSize={15}>Email</Text>
          </FormControl.Label>
          <Input
            variant="unstyled"
            fontSize={15}
            type="text"
            placeholder="Enter email"
            value={email}
            onChangeText={setEmail}
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
            handleRegister();
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

export default RegisterScreen;
