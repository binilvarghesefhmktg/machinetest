dotenv.config();
let redis_url = process.env.REDIS_URL;
let client = require('redis').createClient(redis_url);
let Redis = require('ioredis');
let redis = new Redis(redis_url);


