const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
require("dotenv").config({ path: "../env/development.env" });
const petService = require('../service/pet-service'); // 테스트할 모듈을 가져옵니다.


describe('Pet Service Unit Tests', function () {
  let addedPetId;
  let defaultImg = `https://${process.env.s3_bucket}.s3.${process.env.s3_region}.amazonaws.com/pet-profile/default-img`;
  
  async function afterTest(addedPetId){
    if (addedPetId) {
      const deletedRows = await petService.deletePet(addedPetId);
      expect(deletedRows).to.equal(1);
    }
  }

  
  describe('getPets', function () {
    it('should not throw an error if pets are found', async function () {
      const pets = await petService.getPets();
      expect(() => {
        if (!pets.length) {
          throw new Error('Pets not found');
        }
      }).to.not.throw();
    });
  });

  describe('getPetById', function () {
    it('should return a pet by ID', async function () {
      const pet = await petService.getPetById(1);
      expect(pet).to.be.an('object');
      expect(pet.PET_ID).to.equal(1);
    });

    it('should throw an error if pet is not found', async function () {
      await expect(petService.getPetById(9999)).to.be.rejectedWith('Pet not found');
    });
  });

  describe('addPet', function () {
    let addedPetId;

    it('should add a new pet', async function () {
      const pet = {
        PET_NAME: 'new pet',
        PET_IMAGE: defaultImg,
        USER_ID: 1,
        IS_DELETED: 0,
        // 다른 필드들도 추가하세요
      };
      const addedPet = await petService.addPet(pet);
      expect(addedPet).to.be.an('object');
      expect(addedPet.PET_NAME).to.equal('new pet');
      expect(addedPet.PET_IMAGE).to.equal(defaultImg);
      addedPetId = addedPet.PET_ID;
      console.log(addedPetId)
    });
    after(async function () {
      const deletedRows = await petService.deletePet(addedPetId);
      expect(deletedRows).to.equal(1);
    });
  });

  describe('updatePet', function () {
    let addedPetId;
    before(async function () {
      const petDummy = {
        PET_NAME: 'dummy',
        PET_IMAGE: defaultImg,
        USER_ID: 1,
      };
      const createdPet = await petService.addPet(petDummy);
      expect(createdPet).to.be.an('object');
      expect(createdPet.PET_NAME).to.equal('dummy');
      expect(createdPet.PET_IMAGE).to.equal(defaultImg);
      expect(createdPet.PET_ID).to.be.a('number');
      addedPetId = createdPet.PET_ID;
    })

    it('should update a pet', async function () {
      const updatedPetInfo = {
        PET_NAME: 'updated pet',
        PET_IMAGE: 'https://example.com/updated-pet-img',
        // 다른 필드들도 추가하세요
      };
      const updatedPet = await petService.updatePet(updatedPetInfo, addedPetId);
      console.log(updatedPet)
      expect(updatedPet).to.be.an('object');
      expect(updatedPet.PET_NAME).to.equal('updated pet');
      expect(updatedPet.PET_IMAGE).to.equal('https://example.com/updated-pet-img');
    });

    it('should throw an error if pet is not found', async function () {
      const petId = 9999;
      const petInfo = {
        PET_NAME: 'non-existent pet',
        PET_IMAGE: 'https://example.com/non-existent-pet-img',
      };
      await expect(petService.updatePet(petInfo,petId)).to.be.rejectedWith('Pet not found');
    });
    after(async function () {
      if (addedPetId) {
        const deletedRows = await petService.deletePet(addedPetId);
        expect(deletedRows).to.equal(1);
      }
    })
  });
  describe('getPetByUserId', function () {
    it('should return a pet by USER_ID', async function () {
      const pet = await petService.getPetByUserId(1);
      expect(pet).to.be.an('array');
      expect(pet[0].PET_ID).to.equal(1);
    });

    it('should throw an error if pet is not found', async function () {
      await expect(petService.getPetByUserId(9999)).to.be.rejectedWith('Pet not found');
    });
  });

  describe('deletePet', function () {
    let isDeleted = false;
    before(async function () {
      const petDummy = {
        PET_NAME: 'dummy',
        PET_IMAGE: defaultImg,
        USER_ID: 1,
      };
      const createdPet = await petService.addPet(petDummy);
      expect(createdPet).to.be.an('object');
      expect(createdPet.PET_NAME).to.equal('dummy');
      expect(createdPet.PET_IMAGE).to.equal(defaultImg);
      expect(createdPet.PET_ID).to.be.a('number');
      addedPetId = createdPet.PET_ID;
    });
    it('should delete a pet', async function () {
      const deletedRows = await petService.deletePet(addedPetId);
      expect(deletedRows).to.equal(1);
      isDeleted = true;
    });

    it('should throw an error if pet is not found', async function () {
      await expect(petService.deletePet(9999)).to.be.rejectedWith('Pet not found');
    });

    after(async function () {
      if (isDeleted) return;
      else{
        const deletedRows = await petService.deletePet(addedPetId);
        expect(deletedRows).to.equal(1);
      }
    });
  });

  describe('deletePetImg', function () {
    let addedPetId;
    before(async function () {
      const petDummy = {
        PET_NAME: 'dummy',
        PET_IMAGE: '222',
        USER_ID: 1,
      };
      const createdPet = await petService.addPet(petDummy);
      expect(createdPet).to.be.an('object');
      expect(createdPet.PET_IMAGE).to.equal('222');
      expect(createdPet.PET_ID).to.be.a('number');
      addedPetId = createdPet.PET_ID;
    })
    it('should delete a pet image', async function () {
      const deletedRows = await petService.deletePetImg(addedPetId);
      expect(deletedRows).to.equal(1);
    });

    it('should throw an error if pet is not found', async function () {
      await expect(petService.deletePetImg(9999)).to.be.rejectedWith('Pet not found');
    });
  });

  describe('uploadPetImg', function () {
    let addedPetId;
    before(async function () {
      const petDummy = {
        PET_NAME: 'dummy',
        PET_IMAGE: defaultImg,
        USER_ID: 1,
      };
      const createdPet = await petService.addPet(petDummy);
      expect(createdPet).to.be.an('object');
      expect(createdPet.PET_IMAGE).to.equal(defaultImg);
      expect(createdPet.PET_ID).to.be.a('number');
      addedPetId = createdPet.PET_ID;
    })
    it('should upload a pet image', async function () {
      const key = 'https://example.com/new-pet-img';
      const uploadedRows = await petService.uploadPetImg(addedPetId, key);
      expect(uploadedRows).to.equal(1);
    });

    it('should throw an error if pet is not found', async function () {
      const key = 'https://example.com/new-pet-img';
      await expect(petService.uploadPetImg(9999, key)).to.be.rejectedWith('Pet not found');
    });
    after(async function () {
      if (addedPetId) {
        const deletedRows = await petService.deletePet(addedPetId);
        expect(deletedRows).to.equal(1);
      }
    })
  });
});
