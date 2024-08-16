const { ObjectId } = require("mongodb");
const Follow = require("../models/Follow");

const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Follow {
    _id: ID
    followingId: String
    followerId: String
    createdAt: String
    updatedAt: String
  }

  

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    getAllFollow: [Follow]
  }

  type Mutation{
    addFollow(followingId: String): String
    
  }

`;

const resolvers = {
  Query: {
    getAllFollow: async (_, args, { auth }) => {
      auth();
      result = await Follow.getAll();

      return result;
    },
  },
  Mutation: {
    addFollow: async (parent, args, { auth }) => {
      let followerId = auth().id;
      let { followingId } = args;
      followerId = new ObjectId(String(followerId));
      followingId = new ObjectId(String(followingId));
      //   console.log(followerId, followingId);
      await Follow.addFollow({ followerId, followingId });
      return "Success follow user";
    },
  },
};

module.exports = { typeDefs, resolvers };
