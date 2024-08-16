const Redis = require("ioredis");
const redis = new Redis({
  host: "redis-13505.c295.ap-southeast-1-1.ec2.redns.redis-cloud.com",
  port: 13505,
  username: "default",
  password: process.env.REDIS_PASSWORD,
});

module.exports = redis;
