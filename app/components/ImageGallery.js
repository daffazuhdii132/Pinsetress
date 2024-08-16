import React from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { Box, FlatList, VStack, HStack, Center } from "native-base";

// const data = [
//   { id: "1", src: "https://via.placeholder.com/150" },
//   { id: "2", src: "https://via.placeholder.com/150" },
//   { id: "3", src: "https://via.placeholder.com/150" },
//   { id: "4", src: "https://via.placeholder.com/150" },
//   // Add more images as needed
// ];

const ImageGallery = ({ data, navigation, route }) => {
  console.log("DATA", data);
  function handlePress(data) {
    console.log("tombol", data);
    navigation.navigate("PostDetail");
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
        />
      </TouchableOpacity>
    </Box>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.container}
    />
  );
};

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

export default ImageGallery;
