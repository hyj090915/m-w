import React, { useState } from 'react';
import './App.css';

// OpenWeather API Key를 입력하세요
const API_KEY = '68007445d1067cec020d94aa4ff5bb08';

function App() {
  // 입력된 도시명을 저장하는 state
  const [city, setCity] = useState('');
  // 날씨 정보(도시명, 온도, 설명, 아이콘)를 저장하는 state
  const [weather, setWeather] = useState(null);
  // 에러 메시지 state
  const [error, setError] = useState('');

  // 입력값이 바뀔 때마다 city state를 업데이트
  const handleInputChange = (e) => {
    setCity(e.target.value);
    setError(''); // 입력이 바뀌면 에러 메시지 초기화
  };

  // 엔터 키로도 검색이 되게 처리
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 검색 버튼 클릭 또는 엔터 시 실행되는 함수
  const handleSearch = async () => {
    if (!city) return; // 입력값이 없으면 아무것도 하지 않음

    try {
      // OpenWeather API 호출 (단위: metric = 섭씨)
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=kr`
      );
      if (!response.ok) {
        // 도시를 찾을 수 없는 경우
        setWeather(null);
        setError('도시를 찾을 수 없습니다');
        return;
      }
      const data = await response.json();
      // 날씨 정보 추출
      const temp = Math.round(data.main.temp);
      const desc = data.weather[0].description;
      const name = data.name;
      const icon = data.weather[0].icon; // 아이콘 코드
      setWeather({ name, temp, desc, icon });
      setError('');
    } catch (error) {
      // 네트워크 오류 등 기타 에러 처리
      setWeather(null);
      setError('날씨 정보를 불러오는 중 오류가 발생했습니다');
    }
  };

  return (
    <div className="weather-app">
      {/* 검색창과 버튼을 감싸는 영역 */}
      <div className="weather-search">
        {/* 도시 이름 입력창 */}
        <input
          type="text"
          value={city}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="도시 이름을 입력하세요"
        />
        {/* 검색 버튼 */}
        <button onClick={handleSearch}>검색</button>
      </div>
      {/* 에러 메시지 표시 (빨간 글씨) */}
      {error && <div className="weather-error">{error}</div>}
      {/* 날씨 정보 표시 영역 (카드 형태) */}
      {weather && !error && (
        <div className="weather-info">
          {/* 날씨 아이콘 */}
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt={weather.desc}
            className="weather-icon"
          />
          {/* 도시명 */}
          <div className="weather-city">{weather.name}</div>
          {/* 온도 */}
          <div className="weather-temp">{weather.temp}°C</div>
          {/* 날씨 설명 */}
          <div className="weather-desc">{weather.desc}</div>
        </div>
      )}
    </div>
  );
}

export default App;
