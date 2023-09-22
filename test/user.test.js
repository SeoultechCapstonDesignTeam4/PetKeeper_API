// require("dotenv").config({ path: "./env/development.env" });
// const testAdminToken = process.env.testAdminToken;

// const app = require('../app');
// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const { getUsers, addUser, updateUser, deleteUser } = require('../service/user-service'); // 적절한 모듈 경로로 변경하세요.


// const expect = chai.expect;
// chai.use(chaiHttp);

// describe('User API Tests', function () {
//   // 테스트 전에 데이터 초기화 또는 필요한 설정을 수행할 수 있습
//   let addedUserId;
//   let userEmailDummy = Date.now();
//   let userPhoneDummy = Date.now();
//   let token;
//   before(function () {

//   });
  
//   describe('POST /user', function () {
//     // 사용자 추가 테스트
//     it('should add a new user', async function () {
//       const user = {
//         "USER_EMAIL": userEmailDummy+"@test.com",
//         "USER_PASSWORD": "12341234",
//         "USER_PHONE": userPhoneDummy
//       };
//       const response = await chai.request(app).post('/user/').send(user);

//       if (response.status === 200) {
//         // 추가 성공
//         addedUserId = response.body.USER_ID;
//       } else {
//         // 추가 실패, 에러 메시지 출력
//         console.error(response.body.message);
//       }
//       expect(response.status).to.equal(200);
//     });
//     after(async function () {
//       const deletedRows = await deleteUser(addedUserId);
//       expect(deletedRows).to.equal(1);
//     });
//   });

//   describe('POST /user/login', function () {
//     // 로그인 테스트
//     it('should return a token', async function () {
//       const user = {
//         "USER_EMAIL": 'test',
//         "USER_PASSWORD": "1234"
//       };
//       const response = await chai.request(app).post('/user/login').send(user);
//       expect(response.status).to.equal(200);
//       if(response.body.token){
//         token = response.body.token;
//       }
//       expect(response.body).to.have.property('token');
//   })
//   });

//   // getUsers 함수 테스트
//   describe('GET /user/list',function () {
//     it('should not return an array of users', async function () {
//       return chai
//         .request(app)
//         .get(`/user/list`)
//         .set('Authorization', `Bearer ${token}`)
//         .then(response => {
//           expect(response.status).to.equal(200);
//         });
//     });
//   });
  
//   // getUser 함수 테스트
//   describe('GET /user/:id',function () {
//     it('should return an array of user', async function () {
//       return chai
//         .request(app)
//         .get(`/user/${addedUserId}`)
//         .set('Authorization', `Bearer ${token}`)
//         .then(response => {
//           expect(response.status).to.equal(200);
//         });
//     });
//   });

//   describe('PUT /user/:id',function () {
//     it('should update the added user', async function () {
//       const user = {
//         "USER_EMAIL": userEmailDummy+"@test.com",
//         "USER_PASSWORD": "12341234",
//         "USER_PHONE": userPhoneDummy
//       };
//       const response = await chai.request(app)
//       .put(`/user/${addedUserId}`)
//       .set('Authorization', `Bearer ${token}`)
//       .send(user);
//       console.log(response.body);
//       expect(response.status).to.equal(200);
//     });
//   });
  

//   describe(`DELETE /user/:id`, function () {
//     it('should delete the added user', async function () {
//       const response = await chai.request(app)
//       .delete(`/user/${addedUserId}`)
//       .set('Authorization', `Bearer ${token}`)
//       expect(response.status).to.equal(200);
//     });
//   });
// });
