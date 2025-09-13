const redis = require('../redis/redisClient'); // adjust path to your redis client

/**
 * Clear cached messages between two users
 * @param {string} user1 - userId of first user
 * @param {string} user2 - userId of second user
 */
const clearMessageCache = async (user1, user2) => {
  const cacheKey1 = `messages:${user1}:${user2}`;
  const cacheKey2 = `messages:${user2}:${user1}`;
  await redis.del(cacheKey1);
  await redis.del(cacheKey2);
};

/**
 * Get cached messages if exists
 * @param {string} from 
 * @param {string} to 
 * @returns {Array|null} - Returns cached messages or null
 */
const getCachedMessages = async (from, to) => {
  const cacheKey = `messages:${from}:${to}`;
  const cached = await redis.get(cacheKey);
  return cached ? JSON.parse(cached) : null;
};

/**
 * Set messages in cache
 * @param {string} from 
 * @param {string} to 
 * @param {Array} messages 
 * @param {number} ttl - time to live in seconds
 */
const setCachedMessages = async (from, to, messages, ttl = 60) => {
  const cacheKey = `messages:${from}:${to}`;
  await redis.set(cacheKey, JSON.stringify(messages), 'EX', ttl);
};

module.exports = {
  clearMessageCache,
  getCachedMessages,
  setCachedMessages
};
