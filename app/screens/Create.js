import { Button, FormControl, Input, Text } from "native-base";
import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { gql, useMutation } from "@apollo/client";

function Create({ navigation, route }) {
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const CREATEPOST_MUTATION = gql`
    mutation AddPost($content: String, $tags: [String], $imgUrl: String) {
      addPost(content: $content, tags: $tags, imgUrl: $imgUrl)
    }
  `;
  const [doNewPost] = useMutation(CREATEPOST_MUTATION);
  async function handleCreate() {
    try {
      console.log("masuk handleCreate");
      let tagArray = tags.split(",");
      const result = await doNewPost({
        variables: {
          content: content,
          tags: tagArray,
          imgUrl: imageUrl,
        },
      });

      console.log(result);
      Alert.alert(result.data.addPost);
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert(error.message);
    }
  }
  return (
    <>
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
            <Text fontSize={15}>Content</Text>
          </FormControl.Label>
          <Input
            variant="unstyled"
            fontSize={15}
            type="text"
            placeholder="Enter the content of your post"
            value={content}
            onChangeText={setContent}
          />
          <FormControl.Label>
            <Text fontSize={15}>Tags</Text>
          </FormControl.Label>
          <Input
            variant="unstyled"
            fontSize={15}
            type="text"
            placeholder="Enter tags (separated by comma)"
            value={tags}
            onChangeText={setTags}
          />
          <FormControl.Label>
            <Text fontSize={15}>Image URL</Text>
          </FormControl.Label>
          <Input
            variant="unstyled"
            fontSize={15}
            type="text"
            placeholder="Enter image URL"
            value={imageUrl}
            onChangeText={setImageUrl}
          />
        </FormControl>
        <Button
          size={"lg"}
          colorScheme={"red"}
          style={{ borderRadius: 50, width: 350 }}
          onPress={() => {
            handleCreate();
          }}
        >
          <Text color={"white"} bold>
            Post
          </Text>
        </Button>
      </View>
    </>
  );
}

export default Create;
