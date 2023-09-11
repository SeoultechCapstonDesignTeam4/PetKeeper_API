const userService = require('../service/user-service');
const { default: axios } = require('axios');
const proj4 = require('proj4');
const { Op } = require('sequelize');
const sequelize = require('../models').sequelize;
let initModels = require('../models/init-models');
let {p_hospital} = initModels(sequelize);

function waitHalfSecond() {
  setTimeout(function () {
    // 이곳에 원하는 작업을 추가하세요.
    console.log("2초가 경과했습니다.");
  }, 2000);
}
async function updateHostpital(req,res){
  try{
    const eps2097 = "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs";
    const wgs84 = "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees";
    for(let i = 1; i < 10; i++){
      let start= 100 * (i-1) + 1;
      let end = 100 * i;
      const url = `http://openapi.seoul.go.kr:8088/${process.env.HOSPITAL_API_KEY}/json/LOCALDATA_020301/${start}/${end}`
    let data = await axios.get(url);
    data = data.data['LOCALDATA_020301'];
    const extractedData = await data.row.map(async(row) => {
      if (row.X === undefined || row.Y === undefined){
        return null;
      }else if(row.X === null || row.Y === null){
        return null;
      }else if(row.X === '' || row.Y === ''){
        return null;
      }

      const easting = parseFloat(row.X);
      const northing = parseFloat(row.Y);
      const eps2097p = proj4(eps2097, wgs84, [easting, northing]);
      let tel = row.SITETEL.split('-');
      if (tel.length == 3){
        tel = `${tel[0]}-${tel[1]}-${tel[2]}`;
      }else if(tel.length == 2){
        tel = `02-${tel[0]}-${tel[1]}`;
      }else{
        tel = '';
      }
      console.log(tel)
      if (row.TRDSTATEGBN === '01'){
        await p_hospital.create({
          HOSPITAL_NAME: row.BPLCNM,
          HOSPITAL_PHONE: tel,
          HOSPITAL_ADDRESS: row.RDNWHLADDR,
          HOSPITAL_X: parseFloat(eps2097p[1].toFixed(6)), // X 좌표를 소수점 아래 6자리로 제한
          HOSPITAL_Y: parseFloat(eps2097p[0].toFixed(6)), // Y 좌표를 소수점 아래 6자리로 제한          
        })
      } else {
        return null;
      }
    }).filter((item) => item !== null);
    await waitHalfSecond();
    }
    

  

    return res.status(200).json({
      message: 'success'
    })
    
    
  }catch(err){
    return res.status(403).json({
      success: false,
      message: err.message
    })
  }
}
// async function getHostpital(req,res){
//   try{
//     const {start,end,X,Y} = req.query;
//     if(start === undefined || end === undefined){
//       throw new Error('start or end is undefined');
//     }else if(start.isNaN || end.isNaN){
//       throw new Error('start or end is NaN');
//     }else if(start < 0 || end < 0){
//       throw new Error('start or end is negative');
//     }else if(start > end){
//       throw new Error('start is bigger than end');
//     }else if(end - start > 1000){
//       throw new Error('end - start is bigger than 1000');
//     }

//     const eps2097 = "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs";
//     const wgs84 = "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees";
//     const url = `http://openapi.seoul.go.kr:8088/${process.env.HOSPITAL_API_KEY}/json/LOCALDATA_020301/${start}/${end}`
    
//     let data = await axios.get(url);
//     data = data.data['LOCALDATA_020301'];
//     const extractedData = await data.row.map((row) => {
//       const easting = parseFloat(row.X);
//       const northing = parseFloat(row.Y);
//       const eps2097p = proj4(eps2097, wgs84, [easting, northing]);
//       if (row.TRDSTATEGBN === '01'){
//         return {
//           NAME: row.BPLCNM,
//           ADDRESS: row.RDNWHLADDR,
//           PHONE: row.SITETEL,
//           X: parseFloat(eps2097p[1].toFixed(6)), // X 좌표를 소수점 아래 6자리로 제한
//           Y: parseFloat(eps2097p[0].toFixed(6)), // Y 좌표를 소수점 아래 6자리로 제한
//         };
//       } else {
//         return null;
//       }
//     }).filter((item) => item !== null);

//     return res.status(200).json({
//       data:extractedData
//     })
//   }catch(err){
//     return res.status(403).json({
//       success: false,
//       message: err.message
//     })
//   }
// }

async function getHostpital(req,res){
  try{
    let {X,Y} = req.query;
    X = parseFloat(X);
    Y = parseFloat(Y);
    const earthRadiusKm = 6371; // 지구의 반지름 (평균 반지름 사용)
    const centerLongitude = X; // 중심 지점의 경도
    const centerLatitude = Y; // 중심 지점의 위도 (원하는 값으로 대체하세요)
    const radiusKm = 5; // 반경 (5km)

    // 중심 지점의 위도를 라디안으로 변환
    const centerLatitudeRad = (centerLatitude * Math.PI) / 180;

    // 위도 변화량 계산
    const deltaLatitude = radiusKm / earthRadiusKm;

    // 경도 변화량 계산
    const deltaLongitude = (180 / Math.PI) * (deltaLatitude / centerLatitudeRad);

    // 결과 출력
    const minLongitude = centerLongitude - deltaLongitude;
    const maxLongitude = centerLongitude + deltaLongitude;
    const minLatitude = centerLatitude - (deltaLatitude * 180) / Math.PI;
    const maxLatitude = centerLatitude + (deltaLatitude * 180) / Math.PI;

    console.log("최소 경도:", minLongitude);
    console.log("최대 경도:", maxLongitude);
    console.log("최소 위도:", minLatitude);
    console.log("최대 위도:", maxLatitude);
    await p_hospital.findAll({
      attributes: ['HOSPITAL_NAME','HOSPITAL_PHONE','HOSPITAL_ADDRESS','HOSPITAL_X','HOSPITAL_Y'],
      where: {
        HOSPITAL_X: {
          [Op.between]: [minLongitude,maxLongitude]
        },
        HOSPITAL_Y: {
          [Op.between]: [minLatitude,maxLatitude]
        }
      }
    }).then((data) => {
      console.log(data);
      return res.status(200).json({
        data: data
      })
    })
  }catch(err){
    return res.status(403).json({
      success: false,
      message: err.message
    })
  }
}


function index(req, res, next) {
  res.json({
    message: 'success'
  });
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
  getHostpital,
  updateHostpital
}