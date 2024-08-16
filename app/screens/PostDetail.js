import React from "react";
import { Alert, Image, ScrollView } from "react-native";
import {
  NativeBaseProvider,
  Box,
  Text,
  Avatar,
  HStack,
  VStack,
  Button,
  IconButton,
  Icon,
  Input,
} from "native-base";
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import { useMutation, gql, useQuery } from "@apollo/client";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

function PostDetail({ route, navigation }) {
  const postData = route.params.data;

  const QUERY_GETPOST = gql`
    query GetPostById($getPostByIdId: String) {
      getPostById(id: $getPostByIdId) {
        _id
        content
        tags
        imgUrl
        authorId
        author {
          _id
          name
          username
          email
        }
        comments {
          content
          username
          createdAt
          updatedAt
        }
        likes {
          username
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
    }
  `;

  let { error, loading, data, refetch } = useQuery(QUERY_GETPOST, {
    variables: {
      getPostByIdId: postData._id,
    },
  });
  console.log("BY ID", data);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );
  const [newComment, setNewComment] = useState("");
  const comments = [
    {
      id: 1,
      avatar: "https://via.placeholder.com/150",
      name: "John Doe",
      comment: "This is a great post!",
    },
    {
      id: 2,
      avatar: "https://via.placeholder.com/150",
      name: "Jane Smith",
      comment: "Thanks for sharing!",
    },
  ];
  //   console.log(postData);

  const ADDCOMMENT_MUTATION = gql`
    mutation AddComment($content: String, $postId: String) {
      addComment(content: $content, postId: $postId)
    }
  `;
  const [doNewPost] = useMutation(ADDCOMMENT_MUTATION);
  async function handleAddComment() {
    try {
      let result = doNewPost({
        variables: {
          content: newComment,
          postId: postData._id,
        },
      });
      Alert.alert("Success add comment");
    } catch (error) {
      Alert.alert(error.message);
    }
  }
  return (
    <ScrollView>
      {loading ? (
        <Text>Loading</Text>
      ) : (
        <Box p={4}>
          <Image
            source={{ uri: data.getPostById.imgUrl }}
            style={{ width: "100%", height: 200, borderRadius: 10 }}
          />
          <HStack mt={4} alignItems="center">
            <VStack ml={2}>
              <Text bold>{data.getPostById.author.name}</Text>
              <Text color="gray.500">{data.getPostById.author.username}</Text>
            </VStack>
            <IconButton
              icon={<Icon as={FontAwesome} name="heart-o" size="sm" />}
              onPress={() => alert("Liked")}
              ml="auto"
            />
          </HStack>
          <Box mt={4}>
            {data.getPostById?.comments?.map((comment, index) => (
              <HStack key={index} alignItems="center" mb={4}>
                <Avatar
                  source={{
                    uri: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541",
                  }}
                  size="sm"
                />
                <VStack ml={2}>
                  <Text bold>{comment.username}</Text>
                  <Text>{comment.content}</Text>
                </VStack>
              </HStack>
            ))}
          </Box>
          <Box mt={4}>
            <HStack space={2} alignItems="center">
              <Input
                flex={1}
                placeholder="Add a comment"
                value={newComment}
                onChangeText={setNewComment}
              />
              <Button
                onPress={() => {
                  handleAddComment();
                }}
              >
                Post
              </Button>
            </HStack>
          </Box>
        </Box>
      )}
    </ScrollView>
  );
}

export default PostDetail;
