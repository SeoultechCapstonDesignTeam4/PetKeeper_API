const {handleErrorResponse} = require('./error')

function formatDateFromAndroid(str) {
  if (str.includes('년')) {
    const yearMatch = str.match(/(\d+)년/);
    const monthMatch = str.match(/(\d+)월/);
    const dayMatch = str.match(/(\d+)일/);
  
    if (yearMatch && monthMatch && dayMatch) {
        const year = yearMatch[1];
        const month = monthMatch[1].padStart(2, '0'); // 한 자리 월을 두 자리로 변환
        const day = dayMatch[1].padStart(2, '0');    // 한 자리 일을 두 자리로 변환
  
        return `${year}-${month}-${day}`;
    }
  } else {
      return str;
  }
}

function formatPhoneNumber(res, str) {
  try{
    let cleanStr = str.replace(/-/g, ''); // 하이픈 제거
    cleanStr = cleanStr.replace(/\s/g, ''); // 공백 제거
    if (cleanStr.length !== 11) {
        throw new Error('Invalid Phone Number') ;
    }
    return `${cleanStr.substring(0, 3)}-${cleanStr.substring(3, 7)}-${cleanStr.substring(7, 11)}`;
  }catch(err){
    handleErrorResponse(err, res);
  }
  
}

module.exports={
  formatDateFromAndroid,
  formatPhoneNumber
}