const redis = require('redis');
const jwt = require('./jwt-util');
const client = redis.createClient();
const crypto = require('crypto');

client.on('error', (err) => {
    console.error('Redis error:', err);
});

function generateRandomString(length) {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

function createResetToken(data) {
  const token = jwt.sign(data)
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
          const data = jwt.verify(token);
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
