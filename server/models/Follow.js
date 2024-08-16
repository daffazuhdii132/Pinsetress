const { ObjectId } = require("mongodb");
const database = require("../config/mongodb");

class Follow {
  static async getAll() {
    let result = await database.collection("Follows").find().toArray();
    return result;
  }
  static async addFollow(data) {
    data.createdAt = data.updatedAt = new Date();
    await database.collection("Follows").insertOne(data);
    // console.log(data);
  }
}
module.exports = Follow;
