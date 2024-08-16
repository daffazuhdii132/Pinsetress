import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Box, FlatList, Image, ScrollView, VStack } from "native-base";
import { gql, useQuery } from "@apollo/client";
import FastImage from "react-native-fast-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";
import ImageGallery from "../components/ImageGallery";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

function HomeScreen({ navigation, route }) {
  const QUERY_GETPOST = gql`
    query getAllPosts {
      getAllPosts {
        _id
        content
        tags
        imgUrl
        authorId
        author {
          name
          username
        }
        likes {
          username
        }
        createdAt
        updatedAt
      }
    }
  `;
  let { error, loading, data, refetch } = useQuery(QUERY_GETPOST);
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  console.log(data, "<<<<<LOADINGGG");
  // console.log(data);
  const pinterestLogo = require("../assets/pinterest-logo.png");

  console.log("DATA", data);
  function handlePress(data) {
    console.log("tombol", data);
    navigation.navigate("PostDetail", { data: data });
  }
  const renderItem = ({ item }) => (
    <Box style={styles.item}>
      <TouchableOpacity
        onPress={() => {
          handlePress(item);
        }}
      >
        <Image
          source={{ uri: item.imgUrl }}
          style={styles.image}
          borderRadius={10}
          alt={item.imgUrl}
        />
      </TouchableOpacity>
    </Box>
  );

  return (
    <FlatList
      data={data.getAllPosts}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
  },
  row: {
    justifyContent: "space-between",
  },
  item: {
    flex: 1,
    margin: 4,
  },
  image: {
    width: "100%",
    height: 150,
  },
});
export default HomeScreen;
