const isEmail = require("../helpers/checkEmail");
const { signToken } = require("../helpers/jwt");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type User {
    _id: ID
    name: String
    username: String
    email: String
    password: String
    createdAt: String
    updatedAt: String
  }

  type UserShort{
    _id: ID
    name: String
    username: String
    email: String
    followerDetails: [UserFollow]
    followingDetails: [UserFollow]
  }
  type UserFollow{
    _id: ID
    name: String
    username: String
    email: String
  }

  type accessToken{
    access_token: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    getAllUsers(username: String): [UserShort]
    getUserById(id: String): UserShort
  }

  type Mutation{
    register(name: String, username: String, email: String, password: String): String
    login(username: String, password: String): accessToken

  }

`;

const resolvers = {
  Query: {
    getAllUsers: async (_, args, { auth }) => {
      auth();
      let result;
      if (args.username) {
        result = await User.getUserByUsername(args.username);
      } else {
        result = await User.getAll();
      }
      return result;
    },
    getUserById: async (_, args, { auth }) => {
      let userId = auth().id;
      let result;
      console.log(args.id, userId);
      if (!args.id) {
        result = await User.getUserById(userId);
      } else {
        result = await User.getUserById(args.id);
      }
      if (!result) {
        throw new Error("User not found");
      }
      return result;
    },
  },
  Mutation: {
    register: async (parent, args) => {
      console.log(args);
      let { name, username, email, password } = args;
      if (!username) {
        throw new Error("Username is required");
      }
      if (!email) {
        throw new Error("Email is required");
      }
      if (!password) {
        throw new Error("Password is required");
      }

      let findUsername = await User.findByUsername({ username });
      let findByEmail = await User.findByEmail({ email });

      //Check email format
      if (!isEmail(email)) {
        throw new Error("Invalid email format");
      }

      if (findUsername) {
        throw new Error("Username must be unique");
      }
      if (findByEmail) {
        throw new Error("Email must be unique");
      }
      if (password.length < 5) {
        throw new Error("Minimun password length is 5 character");
      }

      password = bcrypt.hashSync(password, 10);
      let newUser = { name, username, email, password };
      await User.create(newUser);
      return "Register success";
    },
    login: async (parent, args) => {
      let { username, password } = args;
      if (!username || !password) {
        throw new Error("Username and password is required");
      }
      // console.log(password);
      let findByUsername = await User.findByUsername({ username, password });
      // console.log(findByEmail);
      if (!findByUsername) {
        throw new Error("Invalid username/password");
      }
      let correctPassword = bcrypt.compareSync(
        password,
        findByUsername.password
      );
      if (!correctPassword) {
        throw new Error("Invalid username/password");
      }
      let token = signToken({
        id: findByUsername._id,
        username: findByUsername.username,
        email: findByUsername.email,
      });
      return { access_token: token };
    },
  },
};

module.exports = { typeDefs, resolvers };
