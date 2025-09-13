const Redis = require('ioredis');

// Connect to local Redis server
const redis = new Redis({
  host: '127.0.0.1',  // Redis server host
  port: 6379,         // Redis default port
  // password: 'yourpassword', // uncomment if Redis has password
});

redis.on('connect', () => {
  console.log('Connected to Redis');
});

redis.on('error', (err) => {
  console.error('Redis error:', err);
});

module.exports = redis;
