import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { scheduleApi } from '../../api/services';

const HOURS = ['8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM'];
const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const DATES = [1,2,3,4,5,6,7];

const mockEvents = [
  { id: '1', title: 'Mid Term Test', subject: 'Chemistry', date: '2026-02-01', start_time: '09:00', end_time: '10:00', type: 'exam' },
  { id: '2', title: 'Mid Term Test', subject: 'Biology', date: '2026-02-05', start_time: '08:00', end_time: '09:00', type: 'exam' },
  { id: '3', title: 'Mid Term Test', subject: 'Physics', date: '2026-02-03', start_time: '12:00', end_time: '13:00', type: 'exam' },
];

function timeToRow(time: string) {
  const [h, m] = time.split(':').map(Number);
  return (h - 8) * 60 + (m || 0);
}

export default function SchedulesPage() {
  const [month, setMonth] = useState('February');
  const [week, setWeek] = useState(1);


  const { data: events = [] } = useQuery({
    queryKey: ['schedule', month, week],
    queryFn: () => scheduleApi.getEvents(month, week),
    placeholderData: mockEvents as any,
  });

  const evts = (events as any[]).length ? events : mockEvents;

  // Map events to grid: dayIndex (0=Mon) → event
  const dayEventMap: Record<number, any[]> = {};
  evts.forEach((ev: any) => {
    const d = new Date(ev.date).getDay(); // 0=Sun
    const dayIdx = d === 0 ? 6 : d - 1; // Mon=0
    if (!dayEventMap[dayIdx]) dayEventMap[dayIdx] = [];
    dayEventMap[dayIdx].push(ev);
  });

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-navy">Schedule</h1>

      {/* Controls */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-navy">February 2026</span>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded font-medium">Week {week}</span>
        </div>
        <div className="flex items-center gap-2">
          <select value={month} onChange={e => setMonth(e.target.value)} className="input-field py-1 w-auto text-xs">
            {['January','February','March','April','May','June','July','August','September','October','November','December'].map(m => <option key={m}>{m}</option>)}
          </select>
          <select value={week} onChange={e => setWeek(Number(e.target.value))} className="input-field py-1 w-auto text-xs">
            {[1,2,3,4].map(w => <option key={w} value={w}>Week {w}</option>)}
          </select>
          <select className="input-field py-1 w-auto text-xs"><option>All events</option><option>Exams</option><option>Assignments</option></select>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="card overflow-hidden">
        {/* Day headers */}
        <div className="grid border-b border-gray-100" style={{ gridTemplateColumns: '72px repeat(7, 1fr)' }}>
          <div className="p-2" />
          {DAYS.map((d, i) => (
            <div key={d} className="p-2 text-center border-l border-gray-100">
              <p className="text-[10px] text-gray-400 font-medium">{d}</p>
              <p className="text-sm font-semibold text-navy">{String(DATES[i]).padStart(2, '0')}</p>
            </div>
          ))}
        </div>

        {/* Time grid */}
        <div className="overflow-y-auto max-h-[520px]">
          {HOURS.map((h, hi) => (
            <div key={h} className="grid border-b border-gray-50" style={{ gridTemplateColumns: '72px repeat(7, 1fr)', minHeight: 60 }}>
              <div className="px-2 py-1 text-[10px] text-gray-400 font-medium shrink-0">{h}</div>
              {DAYS.map((_, di) => {
                const events = (dayEventMap[di] || []).filter((ev: any) => {
                  const startMin = timeToRow(ev.start_time);
                  return Math.floor(startMin / 60) === hi;
                });
                return (
                  <div key={di} className="border-l border-gray-50 relative p-0.5">
                    {events.map((ev: any) => {
                      const startMin = timeToRow(ev.start_time);
                      const endMin = timeToRow(ev.end_time);
                      const h = endMin - startMin;
                      return (
                        <div key={ev.id} className="bg-primary-light border border-primary/20 rounded-lg p-1.5 mb-0.5" style={{ minHeight: Math.max(h * 0.8, 40) }}>
                          <p className="text-[10px] font-bold text-primary leading-tight">{ev.title}</p>
                          <p className="text-[9px] text-primary/70">{ev.subject}</p>
                          <p className="text-[9px] text-gray-500">{ev.start_time} - {ev.end_time}</p>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
