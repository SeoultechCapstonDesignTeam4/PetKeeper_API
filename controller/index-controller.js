const userService = require('../service/user-service');

function index(req, res, next) {
  res.render('index', { title: 'Capstone4Team', name: 'PetKeeper' })
}

async function getTest(req,res){
  let data;
  const {id,password} = req.body;
  if (id === undefined || password === undefined){
    data = {
      id: 'id',
      password: 'password'
    }
  }else{
    data = {
      id: id,
      password: password
    }
  }
  try{
    return res.json(data);
  }catch(err){
    console.log(err);
  }
}

async function postTest(req,res){
  let data;
  const {id,password} = req.body;
  if (id === undefined || password === undefined){
    data = {
      id: 'id',
      password: 'password'
    }
  }else{
    data = {
      id: id,
      password: password
    }
  }
  try{
    return res.status(200).json(data).end();
  }catch(err){
    console.log(err);
  }
}
module.exports ={
  index,
  getTest,
  postTest
}