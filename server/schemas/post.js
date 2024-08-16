const redis = require("../config/redis");
const Post = require("../models/Post");

const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Post {
    _id: ID
    content: String
    tags: [String]
    imgUrl: String
    authorId: ID
    author: AuthorDetail
    comments: [Comment]
    likes: [Like]
    createdAt: String
    updatedAt: String
  }

  type AuthorDetail{
    _id: ID
    name: String
    username: String
    email: String
  }

  type Comment{
    content: String
    username: String
    createdAt: String
    updatedAt: String
  }

  type Like{
    username: String
    createdAt: String
    updatedAt: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    getAllPosts: [Post]
    getPostById(id: String):Post
  }

  type Mutation{
    
    addPost(content: String, tags: [String], imgUrl: String): String
    addComment(content: String, postId: String): String
    addLike(postId: String): String
  }

`;

const resolvers = {
  Query: {
    getAllPosts: async (_, __, { auth }) => {
      auth();
      let cache = await redis.get("posts:all");
      if (cache) {
        console.log("masuk caceh");
        return JSON.parse(cache);
      }
      const posts = await Post.getAllPosts();
      await redis.set("posts:all", JSON.stringify(posts));
      return posts;
    },
    getPostById: async (_, args, { auth }) => {
      auth();
      const post = await Post.getPostById(args.id);
      return post;
    },
  },
  Mutation: {
    addPost: async (_, args, { auth }) => {
      const user = auth();
      console.log(user);
      const { content, tags, imgUrl } = args;
      console.log(content);
      await redis.del("posts:all");
      await Post.create({ content, tags, imgUrl }, user.id);
      return "Post added";
    },
    addComment: async (_, args, { auth }) => {
      const username = auth().username;
      const { content, postId } = args;
      await redis.del("posts:all");
      await Post.addComment({ username, content }, postId);
      return "Comment added";
    },
    addLike: async (_, args, { auth }) => {
      const username = auth().username;
      const { postId } = args;
      await redis.del("posts:all");
      await Post.addLike({ username }, postId);
      return "Like added";
    },
  },
};
module.exports = { typeDefs, resolvers };
