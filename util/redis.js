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

function deleteResetToken(email) {
  client.del(`reset:${email}`);
}

async function verifyResetToken(email, token, callback) {
    await client.get(`reset:${email}`, function (err, reply) {
        if (err) {
            callback(err, null);
            return;
        }
        if (reply === token) {
          const data = jsonwebtoken.verify(token,secret);
          deleteResetToken(email);
          return data;
        } else {
          callback(new Error('Token does not match'), null);
        }
    });
}



module.exports = {
  createResetToken,
  verifyResetToken,
  deleteResetToken,
  generateRandomString
};
