import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar, Button, HStack, Text, VStack } from "native-base";
import * as SecureStore from "expo-secure-store";
import { useContext } from "react";
import AuthContext from "../contexts/authContext";
import { gql, useQuery } from "@apollo/client";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

function ProfileScreen() {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  async function handleSignout() {
    await SecureStore.deleteItemAsync("access_token");
    setIsLoggedIn(false);
  }
  const QUERY_GETUSER = gql`
    query GetUserById {
      getUserById {
        _id
        name
        username
        email
        followerDetails {
          _id
          name
          username
          email
        }
        followingDetails {
          _id
          name
          username
          email
        }
      }
    }
  `;
  let { error, loading, data, refetch } = useQuery(QUERY_GETUSER);
  console.log(data);
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );
  return (
    <>
      {loading ? (
        <>
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <ActivityIndicator size="large" />
          </View>
        </>
      ) : (
        <>
          <View style={{ flex: 1, alignItems: "center", marginTop: 75 }}>
            <Avatar
              bg="green.500"
              size={"2xl"}
              source={{
                uri: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541",
              }}
            ></Avatar>
            <Text fontSize={30}>{data.getUserById.name}</Text>
            <Text fontSize={25}>{data.getUserById.username}</Text>
            <HStack marginTop={3} space={3} justifyContent="center">
              <VStack>
                <TouchableOpacity style={styles.follow}>
                  <Text style={styles.textFollow}>Following</Text>
                  <Text style={styles.textFollow}>
                    {data.getUserById.followingDetails &&
                      data.getUserById.followingDetails.length}
                  </Text>
                </TouchableOpacity>
              </VStack>
              <VStack>
                <TouchableOpacity style={styles.follow}>
                  <Text style={styles.textFollow}>Followers</Text>
                  <Text style={styles.textFollow}>
                    {data.getUserById.followerDetails &&
                      data.getUserById.followerDetails.length}
                  </Text>
                </TouchableOpacity>
              </VStack>
            </HStack>
          </View>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Button
              colorScheme={"red"}
              variant={"subtle"}
              onPress={() => {
                handleSignout();
              }}
            >
              Sign out
            </Button>
          </View>
        </>
      )}
    </>
  );
}
const styles = StyleSheet.create({
  follow: {
    alignItems: "center",
    marginHorizontal: 25,
  },
  textFollow: {
    fontSize: 18,
  },
});

export default ProfileScreen;
