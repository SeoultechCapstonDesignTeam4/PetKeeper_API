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
      console.log(pet)
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

describe('펫 백신 단위테스트', function () {

  describe('펫 백신 추가', function () {
    let addedPetVaccinationId;
    it('백신 추가', async function () {
      let pet_id = 1;
      const petVaccination = {
        PET_VACCINATION_NAME: '코로나',
        PET_VACCINATION_DATE: '2021-01-01',
        PET_VACCINATION_PERIOD: 365,
      };
      const addedPetVaccination = await petService.addPetVaccination(petVaccination,pet_id);
      expect(addedPetVaccination).to.be.an('object');
      expect(addedPetVaccination.PET_VACCINATION_NAME).to.equal('코로나');
      expect(addedPetVaccination.PET_VACCINATION_DATE).to.equal('2021-01-01');
      expect(addedPetVaccination.PET_VACCINATION_PERIOD).to.equal(365);
      addedPetVaccinationId = addedPetVaccination.PET_VACCINATION_ID;
    });
    after(async function () {
      const deletedRows = await petService.deletePetVaccination(addedPetVaccinationId);
      expect(deletedRows).to.equal(1);
    });
  });
  
  describe('펫 백신 수정', function () {
    let addedPetVaccinationId;
    before(async function () {
      let pet_id = 1;
      const petVaccination = {
        PET_VACCINATION_NAME: '코로나',
        PET_VACCINATION_DATE: '2021-01-01',
        PET_VACCINATION_PERIOD: 365,
      };
      const addedPetVaccination = await petService.addPetVaccination(petVaccination,pet_id);
      expect(addedPetVaccination).to.be.an('object');
      expect(addedPetVaccination.PET_VACCINATION_NAME).to.equal('코로나');
      expect(addedPetVaccination.PET_VACCINATION_DATE).to.equal('2021-01-01');
      expect(addedPetVaccination.PET_VACCINATION_PERIOD).to.equal(365);
      addedPetVaccinationId = addedPetVaccination.PET_VACCINATION_ID;
      console.log(addedPetVaccinationId)
    })
    it('백신 수정', async function () {
      const petVaccination = {
        PET_VACCINATION_NAME: '독감',
        PET_VACCINATION_DATE: '2021-01-02',
        PET_VACCINATION_PERIOD: 10,
      };
      const updatedPetVaccination = await petService.updatePetVaccination(petVaccination,addedPetVaccinationId);
      expect(updatedPetVaccination).to.be.an('object');
      expect(updatedPetVaccination.PET_VACCINATION_NAME).to.equal('독감');
      expect(updatedPetVaccination.PET_VACCINATION_DATE).to.equal('2021-01-02');
      expect(updatedPetVaccination.PET_VACCINATION_PERIOD).to.equal(10);
    });
    after(async function () {
      const deletedRows = await petService.deletePetVaccination(addedPetVaccinationId);
      expect(deletedRows).to.equal(1);
    });
  });

  describe('펫 백신 삭제', function () {
    let addedPetVaccinationId;
    before(async function () {
      let pet_id = 1;
      const petVaccination = {
        PET_VACCINATION_NAME: '코로나',
        PET_VACCINATION_DATE: '2021-01-01',
        PET_VACCINATION_PERIOD: 365,
      };
      const addedPetVaccination = await petService.addPetVaccination(petVaccination,pet_id);
      expect(addedPetVaccination).to.be.an('object');
      expect(addedPetVaccination.PET_VACCINATION_NAME).to.equal('코로나');
      expect(addedPetVaccination.PET_VACCINATION_DATE).to.equal('2021-01-01');
      expect(addedPetVaccination.PET_VACCINATION_PERIOD).to.equal(365);
      addedPetVaccinationId = addedPetVaccination.PET_VACCINATION_ID;
    })
    it('백신 삭제', async function () {
      const deletedRows = await petService.deletePetVaccination(addedPetVaccinationId);
      expect(deletedRows).to.equal(1);
    });
  });
  describe('펫 백신 조회', function () {
    it('백신 전체 조회', async function () {
      const petVaccinations = await petService.getPetVaccinations(1);
      expect(petVaccinations).to.be.an('array');
    });
    it('백신 날짜 조회', async function () {
      const petVaccination = await petService.getPetVaccinationByDate(1,'2024-02-15');
      expect(petVaccination).to.be.an('array');
    });
  });
});

describe('펫 체중 단위테스트', function () {
  describe('펫 체중 추가', function () {
    let addedPetWeightId;
    let pet_id = 1;
    const petWeight ={
      PET_WEIGHT: 10.5,
      PET_WEIGHT_DATE: '2021-01-01',
    }
    it('체중 추가', async function () {
      const addedPetWeight = await petService.addPetWeight(petWeight,pet_id);
      expect(addedPetWeight).to.be.an('object');
      expect(addedPetWeight.PET_WEIGHT).to.equal(10.5);
      expect(addedPetWeight.PET_WEIGHT_DATE).to.equal('2021-01-01');
      addedPetWeightId = addedPetWeight.PET_WEIGHT_ID;
    });
    after(async function () {
      const deletedRows = await petService.deletePetWeight(addedPetWeightId);
      expect(deletedRows).to.equal(1);
    });
  });

  describe('펫 체중 수정', function () {
    let addedPetWeightId;
    let pet_id = 1;
    before(async function () {
      const petWeight ={
        PET_WEIGHT: 10.5,
        PET_WEIGHT_DATE: '2021-01-01',
      }
      const addedPetWeight = await petService.addPetWeight(petWeight,pet_id);
      expect(addedPetWeight).to.be.an('object');
      expect(addedPetWeight.PET_WEIGHT).to.equal(10.5);
      expect(addedPetWeight.PET_WEIGHT_DATE).to.equal('2021-01-01');
      addedPetWeightId = addedPetWeight.PET_WEIGHT_ID;
    })
    it('체중 수정', async function () {
      const petWeight ={
        PET_WEIGHT: 3.3,
        PET_WEIGHT_DATE: '2020-01-01',
      }
      const updatedPetWeight = await petService.updatePetWeight(petWeight,addedPetWeightId);
      expect(updatedPetWeight).to.be.an('object');
      expect(updatedPetWeight.PET_WEIGHT).to.equal(3.3);
      expect(updatedPetWeight.PET_WEIGHT_DATE).to.equal('2020-01-01');
    });
    after(async function () {
      const deletedRows = await petService.deletePetWeight(addedPetWeightId);
      expect(deletedRows).to.equal(1);
    });
  });

  describe('펫 체중 삭제', function () {
    let addedPetWeightId;
    let pet_id = 1;
    before(async function () {
      const petWeight ={
        PET_WEIGHT: 10.5,
        PET_WEIGHT_DATE: '2021-01-01',
      }
      const addedPetWeight = await petService.addPetWeight(petWeight,pet_id);
      expect(addedPetWeight).to.be.an('object');
      expect(addedPetWeight.PET_WEIGHT).to.equal(10.5);
      expect(addedPetWeight.PET_WEIGHT_DATE).to.equal('2021-01-01');
      addedPetWeightId = addedPetWeight.PET_WEIGHT_ID;
    })
    it('체중 삭제', async function () {
      const deletedRows = await petService.deletePetWeight(addedPetWeightId);
      expect(deletedRows).to.equal(1);
    });
  });

  describe('펫 체중 조회', function () {
    it('체중 전체 조회', async function () {
      const petWeights = await petService.getPetWeights(1);
      expect(petWeights).to.be.an('array');
      expect(petWeights[0].PET_ID).to.equal(1);
    });
    it('체중 날짜별 조회', async function () {
      const petWeights = await petService.getPetWeightByDate(1,'2024-02-15');
      expect(petWeights).to.be.an('array');
      expect(petWeights[0].PET_ID).to.equal(1);
    });
  });
});