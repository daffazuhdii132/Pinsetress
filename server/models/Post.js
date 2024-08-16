const { ObjectId } = require("mongodb");
const database = require("../config/mongodb");

class Post {
  static async getPostById(id) {
    const agg = [
      {
        $match: {
          _id: new ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "Users",
          localField: "authorId",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: {
          path: "$author",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unset: ["author.password", "author.createdAt", "author.updatedAt"],
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ];
    const result = await database.collection("Posts").aggregate(agg).toArray();
    return result[0];
  }

  static async getAllPosts() {
    const agg = [
      {
        $lookup: {
          from: "Users",
          localField: "authorId",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: {
          path: "$author",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unset: ["author.password", "author.createdAt", "author.updatedAt"],
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ];
    const result = await database.collection("Posts").aggregate(agg).toArray();
    return result;
  }
  static async create(post, authorId) {
    console.log(authorId);
    post.authorId = new ObjectId(String(authorId));
    post.createdAt = post.updatedAt = new Date();
    await database.collection("Posts").insertOne(post);
    return post;
  }
  static async addComment(comment, postId) {
    comment.createdAt = comment.updatedAt = new Date();
    await database.collection("Posts").updateOne(
      {
        _id: new ObjectId(String(postId)),
      },
      {
        $push: { comments: comment },
      }
    );
  }
  static async addLike(like, postId) {
    like.createdAt = like.updatedAt = new Date();
    await database.collection("Posts").updateOne(
      {
        _id: new ObjectId(String(postId)),
      },
      {
        $push: { likes: like },
      }
    );
  }
}

module.exports = Post;
