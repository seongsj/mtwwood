
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, Tab } from "@/components/ui/tabs";

export default function App() {
  const [locationAllowed, setLocationAllowed] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [memo, setMemo] = useState("");
  const [photo, setPhoto] = useState(null);

  const [weeklyPlanUpdatedAt, setWeeklyPlanUpdatedAt] = useState("2024-04-05T10:00:00");
  const [dailyPlanUpdatedAt, setDailyPlanUpdatedAt] = useState("2024-04-05T11:00:00");
  const [lastViewedWeekly, setLastViewedWeekly] = useState(null);
  const [lastViewedDaily, setLastViewedDaily] = useState(null);

  const locations = [
    { name: "생산동", lat: 37.332814, lon: 127.570095 },
    { name: "판매장", lat: 37.298137, lon: 127.634745 },
    { name: "교육장", lat: 37.298137, lon: 127.634745 },
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

  const handleCheckIn = () => {
    setCheckInTime(new Date().toLocaleTimeString());
  };

  const handleCheckOut = () => {
    setCheckOutTime(new Date().toLocaleTimeString());
  };

  const viewWeeklyPlan = () => {
    setLastViewedWeekly(new Date().toISOString());
  };

  const viewDailyPlan = () => {
    setLastViewedDaily(new Date().toISOString());
  };

  const hasNewWeekly = !lastViewedWeekly || new Date(lastViewedWeekly) < new Date(weeklyPlanUpdatedAt);
  const hasNewDaily = !lastViewedDaily || new Date(lastViewedDaily) < new Date(dailyPlanUpdatedAt);

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-xl font-bold text-center">(주)월화수 <span className="text-sm font-normal">근태관리</span></h1>

      {!locationAllowed && (
        <p className="text-red-500 text-center">지정된 장소에서만 사용 가능합니다.</p>
      )}

      {locationAllowed && (
        <Card>
          <CardContent className="space-y-4 pt-4">
            <div className="flex justify-between">
              <Button onClick={handleCheckIn}>출근하기</Button>
              <Button onClick={handleCheckOut}>퇴근하기</Button>
            </div>
            <div>
              <label className="block mb-1 font-medium">메모</label>
              <Textarea value={memo} onChange={(e) => setMemo(e.target.value)} />
            </div>
            <div>
              <label className="block mb-1 font-medium">사진 업로드</label>
              <Input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} />
            </div>
            <div>
              <p>출근 시간: {checkInTime || "-"}</p>
              <p>퇴근 시간: {checkOutTime || "-"}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around p-2">
        <button onClick={viewWeeklyPlan} className="relative">
          주간계획
          {hasNewWeekly && <span className="absolute -top-1 -right-3 text-xs text-white bg-red-500 rounded-full px-1">N</span>}
        </button>
        <button onClick={viewDailyPlan} className="relative">
          당일작업
          {hasNewDaily && <span className="absolute -top-1 -right-3 text-xs text-white bg-red-500 rounded-full px-1">N</span>}
        </button>
        <button>통계</button>
        <button>설정</button>
      </nav>
    </main>
  );
}
