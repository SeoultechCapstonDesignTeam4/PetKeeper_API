const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
let defaultImg = `https://${process.env.s3_bucket}.s3.${process.env.s3_region}.amazonaws.com/user-profile/default-img`;
const userService = require('../service/user-service'); // 테스트할 모듈을 가져옵니다.

let addedUserId;
let userEmailDummy = Date.now();
let userPhoneDummy = Date.now();

describe('User Service Unit Tests', function () {
  
  describe('getUsers', function () {
    it('should not throw an error if users are found', async function () {
      const users = await userService.getUsers();
      expect(() => {
        if (!users.length) {
          throw new Error('Users not found');
        }
      }).to.not.throw();
    });
  });

  describe('getUserByPhone', function () {
    it('should not throw an error if users are found', async function () {
      const user = await userService.getUserByPhone('000-0000-0000');
      expect(() => {
        if (!user) {
          throw new Error('Users not found');
        }
      }).to.not.throw();
    });
  });

  // getUserById 함수 테스트
  describe('getUserById', function () {
    it('should return a user by ID', async function () {
      const user = await userService.getUserById(1); // 1은 존재하는 사용자 ID로 대체하세요
      expect(() => {
        if (!user) {
          throw new Error('Users not found');
        }
      }).to.not.throw();
      expect(user).to.be.an('object');
      expect(user.USER_ID).to.equal(1); // 사용자 ID를 변경하세요
    });

    it('should throw an error if user is not found', async function () {
      // 존재하지 않는 사용자 ID를 사용하여 예외 상황을 테스트합니다.
      await expect(userService.getUserById(9999)).to.be.rejectedWith('User not found');
    });
  });

  // addUser 함수 테스트
  describe('addUser', function () {
    let isUserAdded = false; // 테스트 후에 더미 사용자 데이터가 삭제되었는지 확인하기 위한 변수
    it('should add a new user', async function () {
      const user = {
        USER_EMAIL: userEmailDummy,
        USER_PASSWORD: 'password123',
        USER_PHONE: userPhoneDummy,
      };
      const addedUser = await userService.addUser(user);
      expect(addedUser).to.be.an('object');
      expect(addedUser.USER_EMAIL).to.equal(userEmailDummy); // 사용자 정보를 변경하세요
      console.log(addedUser);
      addedUserId = addedUser.USER_ID;
      isUserAdded = true;
    });

    it('should throw an error if user already exists', async function () {
      const user = {
        USER_EMAIL: 'test', // 이미 존재하는 이메일을 사용하세요
        USER_PASSWORD: 'password123',
        USER_PHONE: '000-0000-0000',
      };
      await expect(userService.addUser(user)).to.be.rejectedWith('User already exists');
    });
    after(async function () {
      if(!isUserAdded) return;
      else{
        const deletedUser = await userService.deleteUser(addedUserId);
        expect(deletedUser).to.be.equal(1);
      }
    })
  });

  describe('updateUser', function () {
    let dummyUser; // 테스트에서 사용할 더미 사용자 데이터
    before(async function () {
      // 테스트 전에 사용자 데이터를 생성합니다.
      const userDummy = {
        USER_EMAIL: userEmailDummy,
        USER_PHONE: userPhoneDummy,
        USER_PASSWORD: 'password123',
      };
      dummyUser = await userService.addUser(userDummy);
  
      // 생성된 더미 사용자 데이터를 검증합니다.
      expect(dummyUser).to.be.an('object');
      expect(dummyUser.USER_EMAIL).to.equal(userEmailDummy);
      expect(dummyUser.USER_PHONE).to.equal(userPhoneDummy);
      expect(dummyUser.USER_PASSWORD).to.equal('password123');
      expect(dummyUser.USER_ID).to.be.a('number');
    });
  
    it('should update a user', async function () {
      // 업데이트할 사용자 정보를 정의합니다.
      const updatedUserInfo = {
        USER_EMAIL: 'updated@example.com', // 변경할 이메일
        USER_PHONE: '33', // 변경할 전화번호
      };
  
      // 사용자 정보를 업데이트합니다.
      const updatedUser = await userService.updateUser(updatedUserInfo, dummyUser.USER_ID);
  
      // 업데이트된 사용자 정보를 검증합니다.
      expect(updatedUser).to.be.an('object');
      expect(updatedUser.USER_EMAIL).to.equal('updated@example.com');
      expect(updatedUser.USER_PHONE).to.equal('33');
    });

    it('should throw an error if user is not found', async function () {
    const user = {
      USER_EMAIL: 'new@example.com',
      USER_PHONE: '1234567890',
    };
    // 존재하지 않는 사용자 ID를 사용하여 예외 상황을 테스트합니다.
    await expect(userService.updateUser(user, 9999)).to.be.rejectedWith('User not found');
  });

    it('should throw an error if email already exists for another user', async function () {
      const user = {
        USER_EMAIL: 'test', // 이미 존재하는 이메일을 사용하세요
        USER_PHONE: '100-0000-0000',
      };
      // 다른 사용자의 이메일을 변경하려는 경우에 대한 예외 상황을 테스트합니다.
      await expect(userService.updateUser(user, dummyUser.USER_ID)).to.be.rejectedWith('Email already exists');
    });
    it('should throw an error if phone already exists for another user', async function () {
      const user = {
        USER_EMAIL: 'testawefwadsf', // 이미 존재하는 이메일을 사용하세요
        USER_PHONE: '000-0000-0000',
      };
      // 다른 사용자의 이메일을 변경하려는 경우에 대한 예외 상황을 테스트합니다.
      await expect(userService.updateUser(user, dummyUser.USER_ID)).to.be.rejectedWith('Phone already exists');
    });
  
    after(async function () {
      // 테스트 후에 생성된 더미 사용자 데이터를 삭제합니다.
      const deletedUser = await userService.deleteUser(dummyUser.USER_ID);
      expect(deletedUser).to.be.equal(1);
    });
  });
  
  // deleteUser 함수 테스트
  describe('deleteUser', function () {
    let dummyUser; // 테스트에서 사용할 더미 사용자 데이터
    let isDeleted = false; // 테스트 후에 더미 사용자 데이터가 삭제되었는지 확인하기 위한 변수
    before(async function () {
      // 테스트 전에 사용자 데이터를 생성합니다.
      const userDummy = {
        USER_EMAIL: userEmailDummy,
        USER_PHONE: userPhoneDummy,
        USER_PASSWORD: 'password123',
      };
      dummyUser = await userService.addUser(userDummy);
  
      // 생성된 더미 사용자 데이터를 검증합니다.
      expect(dummyUser).to.be.an('object');
      expect(dummyUser.USER_EMAIL).to.equal(userEmailDummy);
      expect(dummyUser.USER_PHONE).to.equal(userPhoneDummy);
      expect(dummyUser.USER_PASSWORD).to.equal('password123');
      expect(dummyUser.USER_ID).to.be.a('number');
    });
    it('should delete a user', async function () {
      
      const deletedRows = await userService.deleteUser(dummyUser.USER_ID);
      expect(deletedRows).to.be.a('number');
      expect(deletedRows).to.equal(1); // 삭제된 행 수를 확인하세요
      isDeleted = true;
    });

    it('should throw an error if user is not found', async function () {
      // 존재하지 않는 사용자 ID를 사용하여 예외 상황을 테스트합니다.
      await expect(userService.deleteUser(9999)).to.be.rejectedWith('User not found');
    });

    after(async function () {
      if(isDeleted) return;
      else{
        const deletedUser = await userService.deleteUser(dummyUser.USER_ID);
        expect(deletedUser).to.be.equal(1);
      }
    });
  });

  describe('uploadUserImg', function () {
    let dummyUser;
    before(async function () {
      const userDummy = {
        USER_EMAIL: userEmailDummy,
        USER_PHONE: userPhoneDummy,
        USER_PASSWORD: 'password123',
      };
      dummyUser = await userService.addUser(userDummy);
  
      // 생성된 더미 사용자 데이터를 검증합니다.
      expect(dummyUser).to.be.an('object');
      expect(dummyUser.USER_EMAIL).to.equal(userEmailDummy);
      expect(dummyUser.USER_PHONE).to.equal(userPhoneDummy);
      expect(dummyUser.USER_PASSWORD).to.equal('password123');
      expect(dummyUser.USER_ID).to.be.a('number');
    });

    it('should upload a user image', async function () {
      const updatedUser = await userService.uploadUserImg(dummyUser.USER_ID,'test');
      expect(updatedUser).to.be.an('string');
      expect(updatedUser).to.equal('test');
    });

    after(async function () {
      const deletedUser = await userService.deleteUser(dummyUser.USER_ID);
      expect(deletedUser).to.be.equal(1);
    });
    
  });

  describe('deleteUserImg', function () {
    let dummyUser;
    before(async function () {
      const userDummy = {
        USER_EMAIL: userEmailDummy,
        USER_PHONE: userPhoneDummy,
        USER_PASSWORD: 'password123',
      };
      dummyUser = await userService.addUser(userDummy);
      // 생성된 더미 사용자 데이터를 검증합니다.
      expect(dummyUser).to.be.an('object');
      expect(dummyUser.USER_EMAIL).to.equal(userEmailDummy);
      expect(dummyUser.USER_PHONE).to.equal(userPhoneDummy);
      expect(dummyUser.USER_PASSWORD).to.equal('password123');
      expect(dummyUser.USER_ID).to.be.a('number');
    });

    it('should delete a user image', async function () {
      const updatedUser = await userService.deleteUserImg(dummyUser.USER_ID);
      expect(updatedUser).to.be.an('string');
      expect(updatedUser).to.equal(defaultImg);
    });
    after(async function () {
      const deletedUser = await userService.deleteUser(dummyUser.USER_ID);
      expect(deletedUser).to.be.equal(1);
    });
  });
});
