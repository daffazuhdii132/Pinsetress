const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { verifyToken } = require("./helpers/jwt");
require("dotenv").config();

const {
  typeDefs: userTypeDefs,
  resolvers: userResolvers,
} = require("./schemas/user");

const {
  typeDefs: postTypeDefs,
  resolvers: postResolvers,
} = require("./schemas/post");

const {
  typeDefs: followTypeDefs,
  resolvers: followResolvers,
} = require("./schemas/follow");
const server = new ApolloServer({
  typeDefs: [userTypeDefs, postTypeDefs, followTypeDefs],
  resolvers: [userResolvers, postResolvers, followResolvers],
  introspection: true,
});

startStandaloneServer(server, {
  listen: { port: process.env.PORT || 4000 },
  context: ({ req, res }) => {
    return {
      auth: () => {
        const auth = req.headers.authorization;
        if (!auth) {
          throw new Error("Unauthenticated");
        }
        const [type, token] = auth.split(" ");
        if (type !== "Bearer") {
          throw new Error("Invalid token");
        }
        const decoded = verifyToken(token);
        return decoded;
      },
    };
  },
}).then(({ url }) => {
  console.log(`🚀  Server ready at: ${url}`);
});
