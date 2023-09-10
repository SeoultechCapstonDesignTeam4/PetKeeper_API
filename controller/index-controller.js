const userService = require('../service/user-service');
const { default: axios } = require('axios');
const proj4 = require('proj4');

async function getHostpital(req,res){
  const {start,end} = req.query;
  const eps2097 = "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs";
  const wgs84 = "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees";
  const url = `http://openapi.seoul.go.kr:8088/${process.env.HOSPITAL_API_KEY}/json/LOCALDATA_020301/${start}/${end}`
  
  let data = await axios.get(url);
  data = data.data['LOCALDATA_020301'];
  const extractedData = await data.row.map((row) => {
    const easting = parseFloat(row.X);
    const northing = parseFloat(row.Y);
    const eps2097p = proj4(eps2097, wgs84, [easting, northing]);
    return {
      NAME: row.BPLCNM,
      ADDRESS: row.RDNWHLADDR,
      PHONE: row.SITETEL,
      X: eps2097p[1],
      Y: eps2097p[0],
    };
  });
  return res.status(200).json({
    data:extractedData
  })
}
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
  postTest,
  getHostpital
}