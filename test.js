const crypto = require('crypto');

function generateRandomString(length) {
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

// 예시 사용법:
const newPassword = generateRandomString(10);  // 10자리의 임시 비밀번호
console.log(newPassword);
