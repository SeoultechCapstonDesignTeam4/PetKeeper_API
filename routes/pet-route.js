var express = require('express');
var router = express.Router();
const petController = require('../controller/pet-controller');
const {normalAuth, adminAuth} = require('./middle/jwt');
let petImg = require('./middle/aws-s3').imageReq('pet-profile');
/* GET pets listing. */
/**
 * @api {get} /pet Request All Pets information
 * @apiName getPets
 * @apiGroup Pet
 * @apiPermission admin
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
[
    {
        "PET_ID": 7,
        "USER_ID": 3,
        "PET_NAME": "화구",
        "PET_KIND": null,
        "PET_SPECIES": null,
        "PET_GENDER": null,
        "PET_BIRTHDATE": null,
        "PET_IMAGE": "https://petkeeper.s3.ap-northeast-2.amazonaws.com/pet-profile/7_1683124049471",
        "IS_DELETED": 1,
        "createdAt": "2023-05-01T12:48:07.000Z",
        "updatedAt": "2023-05-03T14:27:29.000Z"
    },
    {
        "PET_ID": 16,
        "USER_ID": null,
        "PET_NAME": null,
        "PET_KIND": null,
        "PET_SPECIES": null,
        "PET_GENDER": null,
        "PET_BIRTHDATE": null,
        "PET_IMAGE": "https://petkeeper.s3.ap-northeast-2.amazonaws.com/pet-profile/default-img",
        "IS_DELETED": 0,
        "createdAt": "2023-05-18T03:29:20.000Z",
        "updatedAt": "2023-05-18T03:29:20.000Z"
    }
]
 */
router.get('/list', adminAuth, petController.getPets);
/**
 * @api {post} /pet Add Pet
 * @apiName addPet
 * @apiGroup Pet
 * @apiPermission normal
 * @apiParam {Number} id Pet unique ID.
 * @apiParamExample {json} Request-Example:
 *{
    {
            "USER_ID": "6",
            "PET_NAME":"테스트백구",
            "PET_KIND":"진도"
    }
 *}
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *{
    {
            "USER_ID": "6",
            "PET_NAME":"테스트백구",
            "PET_KIND":"진도"
    }
 *}
 */
router.post('/',normalAuth, petController.addPet);
/**
 * @api {post} /pet/pet-img/:id upload Pet Image
 * @apiName uploadPetImg
 * @apiGroup Pet
 * @apiPermission normal
 * @apiParam {Number} id Pet unique ID.
 * @apiParamExample {form-data} Request-Example:
 * Key: image, Value: image file
 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *{
    url: "https://petkeeper.s3.ap-northeast-2.amazonaws.com/pet-profile/9_1683162282101"
 *}
 */
router.post('/pet-img/:id',
  normalAuth,
  petImg.single('image'),
  petController.uploadPetImg);
/**
 * @api {delete} /pet/pet-img/:id delete Pet Image
 * @apiName deletePetImg
 * @apiGroup Pet
 * @apiPermission normal
 *
 * @apiParamExample {Params} Request-Example:
 * Key: id, Value: pet id
 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *{
    url: "https://petkeeper.s3.ap-northeast-2.amazonaws.com/pet-profile/default-img"
 *}
 */

router.delete('/pet-img/:id',
  normalAuth,
  petController.deletePetImg)

/**
 * @api {get} /pet/:id get Pet information
 * @apiName getPet
 * @apiGroup Pet
 * @apiPermission normal
 *
 * @apiParamExample {Params} Request-Example:
 * Key: id, Value: pet_id
 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *{
    
 *}
 */

router.get('/:id', normalAuth, petController.getPet);
/**
 * @api {put} /pet/:id update Pet information
 * @apiName updatePet
 * @apiGroup Pet
 * @apiPermission normal
 *
 * @apiParamExample {Params} Request-Example:
 * Key: id, Value: pet_id
 * @apiBodyExample {json} Request-Example:
 * {
 *    "PET_NAME": "테스트백구",
 *    "PET_KIND": "진도"
 * }
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
  * {
 *    "PET_NAME": "테스트백구",
 *    "PET_KIND": "진도"
 * }
 */
router.put('/:id', normalAuth, petController.updatePet);
/**
 * @api {delete} /pet/:id delete Pet information
 * @apiName deletePet
 * @apiGroup Pet
 * @apiPermission normal
 *
 * @apiParamExample {Params} Request-Example:
 * Key: id, Value: pet_id
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
  * {
 *    "PET_NAME": "테스트백구",
 *    "PET_KIND": "진도"
 * }
 */
router.delete('/:PET_ID', normalAuth, petController.deletePet);
router.post('/vaccination/:PET_ID', normalAuth, petController.addPetVaccination);
router.delete('/vaccination/:PET_VACCINATION_ID', normalAuth, petController.deletePetVaccination);
router.put('/vaccination/:PET_VACCINATION_ID', normalAuth, petController.updatePetVaccination);
router.post('/weight/:PET_ID',normalAuth,petController.addPetWeight);
router.delete('/weight/:PET_WEIGHT_ID',normalAuth,petController.deletePetWeight);
router.put('/weight/:PET_WEIGHT_ID',normalAuth,petController.updatePetWeight);
module.exports = router;
