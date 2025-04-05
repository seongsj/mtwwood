
import { useState, useEffect } from "react";

export default function App() {
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [inputName, setInputName] = useState("");
  const [locationAllowed, setLocationAllowed] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [memo, setMemo] = useState("");
  const [photo, setPhoto] = useState(null);
  const [workLog, setWorkLog] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const locations = [
    { name: "생산동", lat: 37.332814, lon: 127.570095 },
    { name: "판매장", lat: 37.298137, lon: 127.634745 },
    { name: "교육장", lat: 37.298137, lon: 127.634745 }
  ];

  const checkLocation = (lat, lon) => {
    return locations.some(loc => {
      const dist = Math.sqrt((lat - loc.lat) ** 2 + (lon - loc.lon) ** 2);
      return dist < 0.01;
    });
  };

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const allowed = checkLocation(latitude, longitude);
        setLocationAllowed(allowed);
      },
      () => setLocationAllowed(false)
    );
  };

  useEffect(() => {
    if (username) {
      getLocation();
      setIsAdmin(username === "mtwwood21");
    }
  }, [username]);

  const handleCheckIn = () => {
    const time = new Date().toLocaleTimeString();
    setCheckInTime(time);
    setWorkLog(prev => [...prev, { type: "출근", time, memo, photo: photo?.name }]);
  };

  const handleCheckOut = () => {
    const time = new Date().toLocaleTimeString();
    setCheckOutTime(time);
    setWorkLog(prev => [...prev, { type: "퇴근", time, memo, photo: photo?.name }]);
  };

  const handleLogin = () => {
    localStorage.setItem("username", inputName);
    setUsername(inputName);
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    setUsername("");
    setInputName("");
    setCheckInTime(null);
    setCheckOutTime(null);
    setIsAdmin(false);
  };

  if (!username) {
    return (
      <main className="p-4 space-y-4 text-center">
        <h1 className="text-xl font-bold text-blue-700">(주)월화수 <span className="text-sm font-normal text-gray-500">근태관리</span></h1>
        <input
          className="border p-2 rounded w-2/3"
          placeholder="이름 또는 아이디 입력"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
        />
        <br />
        <button className="bg-blue-500 text-white px-4 py-2 rounded mt-2" onClick={handleLogin}>
          로그인
        </button>
      </main>
    );
  }

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-xl font-bold text-center text-blue-700">(주)월화수 <span className="text-sm font-normal text-gray-500">근태관리</span></h1>
      <p className="text-sm text-center text-gray-600">👤 {username} 
        <button onClick={handleLogout} className="text-blue-500 underline ml-2">로그아웃</button>
        {isAdmin && <span className="ml-2 text-white bg-blue-500 px-2 py-1 rounded text-xs">관리자</span>}
      </p>

      {!isAdmin && (
        <>
          {!locationAllowed && (
            <p className="text-red-500 text-center">지정된 장소에서만 출근/퇴근이 가능합니다.</p>
          )}
          {locationAllowed && (
            <div className="space-y-4">
              <div className="flex justify-between">
                <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleCheckIn}>출근하기</button>
                <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleCheckOut}>퇴근하기</button>
              </div>
              <div>
                <label className="block mb-1 font-medium">메모</label>
                <textarea className="border w-full p-2" value={memo} onChange={(e) => setMemo(e.target.value)} />
              </div>
              <div>
                <label className="block mb-1 font-medium">사진 업로드</label>
                <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} />
              </div>
              <div>
                <p>출근 시간: {checkInTime || "-"}</p>
                <p>퇴근 시간: {checkOutTime || "-"}</p>
              </div>
            </div>
          )}
        </>
      )}

      {isAdmin && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-center">직원 근무 현황</h2>
          {workLog.length === 0 ? (
            <p className="text-center text-gray-500">아직 기록이 없습니다.</p>
          ) : (
            <ul className="text-sm space-y-2">
              {workLog.map((log, idx) => (
                <li key={idx} className="border p-2 rounded shadow-sm">
                  ✅ {log.type} - {log.time}
                  {log.memo && <div>📝 메모: {log.memo}</div>}
                  {log.photo && <div>📷 사진: {log.photo}</div>}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </main>
  );
}
