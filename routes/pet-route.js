var express = require('express');
var router = express.Router();
const petController = require('../controller/pet-controller');
const {normalAuth, adminAuth} = require('./middle/jwt');
let petImg = require('./middle/aws-s3').imageReq('pet-profile');
/* GET pets listing. */
router.get('/', adminAuth, petController.getPets);

router.post('/',normalAuth, petController.addPet);

router.post('/pet-img/:id',
  normalAuth,
  petImg.single('image'),
  petController.uploadPetImg);
router.delete('/pet-img/:id',
  normalAuth,
  petController.deletePetImg)
router.get('/:id', normalAuth, petController.getPet);
router.put('/:id', normalAuth, petController.updatePet);
router.delete('/:id', normalAuth, petController.deletePet);

module.exports = router;
