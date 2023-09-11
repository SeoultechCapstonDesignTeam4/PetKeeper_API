require("dotenv").config({ path: "./env/development.env" });
const testAdminToken = process.env.testAdminToken;
const app = process.env.app;

const chai = require('chai');
const chaiHttp = require('chai-http');
const { getUsers, addUser, updateUser, deleteUser } = require('../service/user-service'); // 적절한 모듈 경로로 변경하세요.



const expect = chai.expect;
chai.use(chaiHttp);
describe('User API Tests', function () {
  // 테스트 전에 데이터 초기화 또는 필요한 설정을 수행할 수 있습니다.
  before(function () {
    // 여기에 필요한 초기화 코드 추가
  });

    // getUsers 함수 테스트
  describe('GET /user/list',async function () {
    it('should return an array of users', async function () {
      return chai
        .request(app)
        .get('/user/list')
        .set('Authorization', `Bearer ${testAdminToken}`)
        .then(response => {
          expect(response.status).to.equal(200);
          expect(response.body).to.be.an('array');
        });
    });
  });

  // addUser 함수 테스트
  describe('POST /user', function () {
    it('should add a new user', async function () {
      const newUser = {
          "USER_EMAIL":"test",
          "USER_PASSWORD":"1234",
          "USER_PHONE": "010-3345-5322"
      };

      const response = await chai.request(app).post('/user').send(newUser); // 사용하는 API 경로로 변경하세요.
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('USER_ID');
    });
  });

  // // updateUser 함수 테스트
  // describe('PUT /users/:id', function () {
  //   it('should update an existing user', async function () {
  //     const userId = 1; // 업데이트할 사용자의 ID로 변경하세요.
  //     const updatedUser = {
  //       // 여기에 업데이트된 사용자 정보를 제공하세요.
  //     };

  //     const response = await chai
  //       .request(app)
  //       .put(`/users/${userId}`)
  //       .send(updatedUser); // 사용하는 API 경로로 변경하세요.
  //     expect(response.status).to.equal(200);
  //     expect(response.body).to.have.property('USER_ID', userId);
  //   });
  // });

  // // deleteUser 함수 테스트
  // describe('DELETE /users/:id', function () {
  //   it('should delete an existing user', async function () {
  //     const userId = 1; // 삭제할 사용자의 ID로 변경하세요.

  //     const response = await chai.request(app).delete(`/users/${userId}`); // 사용하는 API 경로로 변경하세요.
  //     expect(response.status).to.equal(200);
  //     expect(response.body).to.have.property('message', 'User deleted');
  //   });
  // });

  // 추가 테스트 케이스 추가 가능
});

// 테스트 후 정리 또는 자원 해제를 수행할 수 있습니다.
after(function () {
  // 여기에 필요한 정리 코드 추가
});
