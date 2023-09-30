const redis = require('redis');
const client = redis.createClient(6379,"127.0.0.1");
client.connect();
const jsonwebtoken = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

const crypto = require('crypto');

client.on('connect', () => {  
  console.info('Redis connected!');
});
client.on('error', (err) => {
  console.error('Redis error:', err);
});

function generateRandomString(length) {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

function createResetToken(data) {
  client.del(`reset:${data.USER_EMAIL}`);
  const token = jsonwebtoken.sign(data, secret, { expiresIn: '1h' });
  client.set(`reset:${data.USER_EMAIL}`, token, 'EX', 3600); // 1시간 저장
  return token;
}

async function deleteResetToken(email) {
  client.del(`reset:${email}`);
}

function getValueFromRedis(key) {
  console.log('Fetching value from Redis for key:', key); // 로그 추가
  return new Promise((resolve, reject) => {
    client.get(key, (err, result) => {
      if (err) {
        console.error('Error fetching value:', err); // 로그 추가
        reject(err);
      } else {
        console.log('Fetched value:', result); // 로그 추가
        resolve(result);
      }
    });
  });
}


async function verifyResetToken(email, token) {
  try {
    const value = await client.get(`reset:${email}`);
    if (value === token) {
      const decoded = jsonwebtoken.verify(token, secret);
      return decoded;
    } else {
      throw new Error('Token does not match');
    }
  } catch(err) {
    console.error(err);
  }
}





module.exports = {
  createResetToken,
  verifyResetToken,
  deleteResetToken,
  generateRandomString
};
