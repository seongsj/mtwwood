
import { useState, useEffect } from "react";

export default function App() {
  const [locationAllowed, setLocationAllowed] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [memo, setMemo] = useState("");
  const [photo, setPhoto] = useState(null);
  const [weeklyPlanUpdatedAt] = useState("2024-04-05T10:00:00");
  const [dailyPlanUpdatedAt] = useState("2024-04-05T11:00:00");
  const [lastViewedWeekly, setLastViewedWeekly] = useState(null);
  const [lastViewedDaily, setLastViewedDaily] = useState(null);

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

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const allowed = checkLocation(latitude, longitude);
        setLocationAllowed(allowed);
      },
      () => setLocationAllowed(false)
    );
  }, []);

  const handleCheckIn = () => setCheckInTime(new Date().toLocaleTimeString());
  const handleCheckOut = () => setCheckOutTime(new Date().toLocaleTimeString());
  const viewWeeklyPlan = () => setLastViewedWeekly(new Date().toISOString());
  const viewDailyPlan = () => setLastViewedDaily(new Date().toISOString());
  const hasNewWeekly = !lastViewedWeekly || new Date(lastViewedWeekly) < new Date(weeklyPlanUpdatedAt);
  const hasNewDaily = !lastViewedDaily || new Date(lastViewedDaily) < new Date(dailyPlanUpdatedAt);

  return (
    <main>
      <h1>(주)월화수 <span>근태관리</span></h1>
      {!locationAllowed && <p>지정된 장소에서만 사용 가능합니다.</p>}
      {locationAllowed && (
        <div>
          <button onClick={handleCheckIn}>출근하기</button>
          <button onClick={handleCheckOut}>퇴근하기</button>
          <textarea value={memo} onChange={(e) => setMemo(e.target.value)} />
          <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} />
          <p>출근 시간: {checkInTime || "-"}</p>
          <p>퇴근 시간: {checkOutTime || "-"}</p>
        </div>
      )}
      <nav>
        <button onClick={viewWeeklyPlan}>주간계획 {hasNewWeekly && <span>N</span>}</button>
        <button onClick={viewDailyPlan}>당일작업 {hasNewDaily && <span>N</span>}</button>
        <button>통계</button>
        <button>설정</button>
      </nav>
    </main>
  );
}
