require("dotenv").config({ path: "./env/development.env" });
const testAdminToken = process.env.testAdminToken;
const app = process.env.app;

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Router Tests', function () {
  // GET / 루트 경로 테스트
  describe('GET /', function () {
    it('status200, json , message:"success"', function (done) {
      chai.request(app)
        .get('/')
        .set('Authorization', `Bearer ${testAdminToken}`)
        .end(function (err, res) {
          expect(res).to.have.status(200);
          //반환되는 json 데이터의 값이 'success'인지 확인
          expect(res.body.message).to.equal('success');
          // //반환되는 json 데이터의 data의 key값이 title인지 확인
          // expect(res.body.data).to.have.property('title');
          // //반환되는 json 데이터의 data의 key값이 name인지 확인
          // expect(res.body.data).to.have.property('name');

          done();
        });
    });
  });

  // GET /apiTest 경로 테스트
  describe('GET /apiTest', function () {
    it('should return a JSON response', function (done) {
      chai.request(app)
        .get('/apiTest')
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          done();
        });
    });
  });

  // POST /apiTest 경로 테스트
  describe('POST /apiTest', function () {
    it('should return a JSON response', function (done) {
      chai.request(app)
        .post('/apiTest')
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          done();
        });
    });
  });

  // GET /hospital 경로 테스트
  describe('GET /hospital', function () {
    const X = 37.5666103;
    const Y = 126.9783882;
    it('should return a JSON response', function (done) {
      chai.request(app)
        .get(`/hospital?X=${X}&Y=${Y}`)
        .end(function (err, res) {
          console.log(res.body.data[0]);
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          done();
        });
    });
  });

  // adminAuth가 필요한 경우 테스트 (주석 해제 후 사용)
  // describe('GET /hospitalUpdate', function () {
  //   it('should return a JSON response with admin authentication', function (done) {
  //     chai.request(app)
  //       .get('/hospitalUpdate')
  //       .set('Authorization', 'Bearer YOUR_ADMIN_TOKEN')
  //       .end(function (err, res) {
  //         expect(res).to.have.status(200);
  //         expect(res).to.be.json;
  //         done();
  //       });
  //   });
  // });
});
