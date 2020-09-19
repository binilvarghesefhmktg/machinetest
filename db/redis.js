const Redis = require("ioredis");

const redis = new Redis({
  port: 16749,
  host: 'redis-16749.c241.us-east-1-4.ec2.cloud.redislabs.com',
  password: 'NGxiDFHKJdkMLHlG1MsxSIDqK9TRZvcs',
  db: 'test'
});


