const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const expect = chai.expect;

// Import the functions you're testing
const userController = require('../controller/user-controller');
const userService = require('../service/user-service');
const jwtUtil = require('../util/jwt-util');
const {p_user} = require('../models');
const bcrypt = require('bcrypt');

chai.use(chaiHttp);

describe('User Controller', function() {
    afterEach(function() {
        // Restore all the stubbed methods after each test
        sinon.restore();
    });

    describe('login', function() {
        let USER_EMAIL = 'test@google.com';
        let USER_PASSWORD = '1234';
      it('should login successfully', async function() {
        const req = {
            body: {
                USER_EMAIL: USER_EMAIL,
                USER_PASSWORD: USER_PASSWORD
            }
        };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis(),
            setHeader: sinon.stub().returnsThis(),
            end: sinon.stub().returnsThis()
        };

        const mockUser = {
            USER_EMAIL: USER_EMAIL,
            USER_PASSWORD: bcrypt.hashSync(USER_PASSWORD, 10)
        };

        sinon.stub(userService, 'getUserByEmail').returns(mockUser);
        sinon.stub(jwtUtil, 'sign').returns('mockToken');
        sinon.stub(p_user, 'update').resolves(true);

        await userController.login(req, res);
        expect(res.status.args[0][0]).to.equal(200);
        expect(res.json.args[0][0]).to.deep.equal({ token: 'mockToken' });
      });
    });
    
    // describe('deleteUserImg', function() {
    //     afterEach(function() {
    //       sinon.restore();
    //     });
    //     it('should delete image when logged in as admin', async function() {
    //       const req = {
    //         params: { id: '1' }
    //       };
    //       const res = {
    //         locals: {
    //           userInfo: {
    //             USER_AUTH: 'admin'
    //           }
    //         },
    //         status: sinon.stub().returnsThis(),
    //         json: sinon.stub()
    //       };
      
    //       sinon.stub(userService, 'getUserById').resolves({
    //         USER_ID: '1',
    //         USER_IMAGE: 'domain/path/user-profile/some-image'
    //       });
      
    //       const deleteImgStub = sinon.stub().resolves();
    //       sinon.stub(userService, 'deleteUserImg').resolves();
      
    //       await deleteUserImg(req, res);
    //       expect(res.status.calledWith(200)).to.be.true;
    //       expect(deleteImgStub.called).to.be.true;
    //       expect(res.json.calledWith({ success: true, message: 'Delete success' })).to.be.true;
    //     });
      
    //     // ... (You can continue for other scenarios)
      
    //   });

    // Similarly, you can write tests for other functions like `logout`, `getUser`, etc.
    // Just make sure to mock all the necessary interactions with services and the database.
});

