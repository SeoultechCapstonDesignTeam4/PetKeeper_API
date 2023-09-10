const earthRadiusKm = 6371; // 지구의 반지름 (평균 반지름 사용)
const centerLongitude = 37.560102669689634; // 중심 지점의 경도
const centerLatitude = 126.83962639938876; // 중심 지점의 위도 (원하는 값으로 대체하세요)
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
