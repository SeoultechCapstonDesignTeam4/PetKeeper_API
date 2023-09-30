const redis = require('redis');
const client = redis.createClient();
client.connect();

client.on('connect', () => {  
  console.info('Redis connected!');

});
client.on('error', (err) => {
  console.error('Redis error:', err);
});

client.get('reset:hchbae1001@gmail.com', (err, result) => {
    console.log(result);
})
