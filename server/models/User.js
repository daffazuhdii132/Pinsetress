const { ObjectId } = require("mongodb");
const database = require("../config/mongodb");

class User {
  static async create(newUser) {
    newUser.createdAt = newUser.updatedAt = new Date();
    const result = await database.collection("Users").insertOne(newUser);
    console.log(result);
    return newUser;
  }
  static async getAll() {
    const result = await database.collection("Users").find().toArray();
    return result;
  }
  static async getUserByUsername(username) {
    const result = await database
      .collection("Users")
      .find({
        username,
      })
      .toArray();
    return result;
  }
  static async getUserById(id) {
    let agg = [
      {
        $match: {
          _id: new ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "Follows",
          localField: "_id",
          foreignField: "followingId",
          as: "Followers",
        },
      },
      {
        $lookup: {
          from: "Users",
          localField: "Followers.followerId",
          foreignField: "_id",
          as: "followerDetails",
        },
      },
      {
        $lookup: {
          from: "Follows",
          localField: "_id",
          foreignField: "followerId",
          as: "Followings",
        },
      },
      {
        $lookup: {
          from: "Users",
          localField: "Followings.followingId",
          foreignField: "_id",
          as: "followingDetails",
        },
      },
    ];
    const result = await database.collection("Users").aggregate(agg).toArray();

    return result[0];
  }
  static async findByEmail(userData) {
    const result = await database
      .collection("Users")
      .findOne({ email: userData.email });
    return result;
  }
  static async findByUsername(userData) {
    const result = await database
      .collection("Users")
      .findOne({ username: userData.username });
    return result;
  }
}
module.exports = User;
