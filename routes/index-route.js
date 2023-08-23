var express = require('express');
var router = express.Router();
const indexController = require('../controller/index-controller');

const {normalAuth, adminAuth} = require('./middle/jwt');
// let p_user = require('../models').p_user;

/* GET home page. */
/**
 * @api {get} /user/:id Request User information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "firstname": "John",
 *       "lastname": "Doe"
 *     }
 *
 * @apiError UserNotFound The id of the User was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 */
router.get('/',normalAuth,indexController.index);

router.get('/apiTest',indexController.getTest);
router.post('/apiTest',indexController.postTest);

module.exports = router;
