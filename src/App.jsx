import React, { useState, useEffect } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { Moon, Sun, Clock, BarChart3, Settings } from 'lucide-react';

export default function App() {
  const [buffer, setBuffer] = useState(15);
  const [targetTime, setTargetTime] = useState('07:00');
  const [calcMode, setCalcMode] = useState('backwards');
  const [surveyStep, setSurveyStep] = useState(0);
  const [chartWidth, setChartWidth] = useState(getChartWidth());
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('sleep_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('sleep_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    const onResize = () => setChartWidth(getChartWidth());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  function getChartWidth() {
    const padding = 64;
    const minWidth = 260;
    const maxWidth = 420;
    return Math.max(minWidth, Math.min(maxWidth, window.innerWidth - padding));
  }

  const getCalculatedTimes = () => {
    const [hours, minutes] = targetTime.split(':').map(Number);
    const baseDate = new Date();
    baseDate.setHours(hours, minutes, 0, 0);

    return [6, 5, 4].map((c) => {
      const cycleMs = c * 90 * 60000;
      const bufferMs = Number(buffer) * 60000;

      const result = new Date(
        calcMode === 'backwards'
          ? baseDate.getTime() - (cycleMs + bufferMs)
          : baseDate.getTime() + cycleMs + bufferMs
      );

      return {
        cycles: c,
        time: result.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        hours: c * 1.5,
      };
    });
  };

  const handleWakeSurvey = (score) => {
    const newEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
      }),
      wakeDifficulty: score,
      energyScore: null,
      totalScore: null,
      cycles: 5,
      buffer: parseInt(buffer, 10),
    };

    setHistory((prev) => [...prev, newEntry]);
    setSurveyStep(0);

    setTimeout(() => {
      setSurveyStep(2);
    }, 10000);
  };

  const handleEnergySurvey = (score) => {
    setHistory((prev) => {
      const updated = [...prev];
      const latest = updated[updated.length - 1];

      if (latest) {
        latest.energyScore = score;
        latest.totalScore = ((11 - latest.wakeDifficulty) + score) / 2;
      }

      return [...updated];
    });

    setSurveyStep(0);
  };

  const chartData = history.filter((item) => item.totalScore !== null);

  return (
    <div
      style={{
        backgroundColor: '#020617',
        minHeight: '100vh',
        color: '#f8fafc',
        fontFamily: 'sans-serif',
        padding: '20px',
      }}
    >
      <div
        style={{
          maxWidth: '480px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <header style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Moon color="#38bdf8" size={32} />
          <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Sleep Architect</h1>
        </header>

        <section style={s.card}>
          <div style={s.row}>
            <Settings size={18} color="#94a3b8" />
            <label style={s.label}>Buffer: {buffer}m</label>
          </div>
          <input
            type="range"
            min="0"
            max="60"
            step="5"
            value={buffer}
            onChange={(e) => setBuffer(e.target.value)}
            style={{ width: '100%' }}
          />
        </section>

        <section style={s.card}>
          <div
            style={{
              display: 'flex',
              backgroundColor: '#1e293b',
              borderRadius: '8px',
              padding: '4px',
              marginBottom: '15px',
            }}
          >
            <button
              onClick={() => setCalcMode('backwards')}
              style={calcMode === 'backwards' ? s.activeTab : s.tab}
            >
              Wake Up At
            </button>
            <button
              onClick={() => setCalcMode('forwards')}
              style={calcMode === 'forwards' ? s.activeTab : s.tab}
            >
              Sleep At
            </button>
          </div>

          <input
            type="time"
            value={targetTime}
            onChange={(e) => setTargetTime(e.target.value)}
            style={s.timeInput}
          />

          <div style={s.grid}>
            {getCalculatedTimes().map((res, i) => (
              <div key={i} style={s.resItem}>
                <Clock size={14} color="#38bdf8" />
                <div style={{ fontWeight: 'bold', color: '#38bdf8' }}>{res.time}</div>
                <div style={{ fontSize: '0.65rem', color: '#64748b' }}>{res.hours}h</div>
              </div>
            ))}
          </div>
        </section>

        <section>
          {surveyStep === 0 && (
            <button onClick={() => setSurveyStep(1)} style={s.awakeBtn}>
              <Sun size={20} />
              I'M AWAKE
            </button>
          )}

          {surveyStep === 1 && (
            <div style={s.surveyCard}>
              <p style={s.surveyTitle}>Wake Difficulty? (1–10)</p>
              <div style={s.scoreGrid}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleWakeSurvey(num)}
                    style={s.scoreBtn}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          )}

          {surveyStep === 2 && (
            <div style={s.surveyCard}>
              <p style={s.surveyTitle}>Energy Level? (1–10)</p>
              <div style={s.scoreGrid}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleEnergySurvey(num)}
                    style={s.scoreBtn}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        <section style={s.card}>
          <div style={s.row}>
            <BarChart3 size={18} color="#38bdf8" />
            <h3 style={{ margin: 0 }}>Efficiency</h3>
          </div>

          <div style={s.chartWrap}>
            {chartData.length > 0 ? (
              <LineChart
                width={chartWidth}
                height={190}
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 10]} stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#f8fafc',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="totalScore"
                  stroke="#38bdf8"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            ) : (
              <div style={s.emptyState}>
                Complete a wake and energy survey to see your chart.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

const s = {
  card: {
    backgroundColor: '#0f172a',
    padding: '20px',
    borderRadius: '16px',
    border: '1px solid #1e293b',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px',
  },
  label: {
    fontSize: '0.9rem',
    color: '#94a3b8',
  },
  tab: {
    flex: 1,
    padding: '8px',
    border: 'none',
    background: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
  },
  activeTab: {
    flex: 1,
    padding: '8px',
    border: 'none',
    backgroundColor: '#38bdf8',
    color: '#020617',
    fontWeight: 'bold',
    borderRadius: '6px',
  },
  timeInput: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#1e293b',
    color: 'white',
    fontSize: '1.5rem',
    textAlign: 'center',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px',
    marginTop: '15px',
  },
  resItem: {
    textAlign: 'center',
    padding: '10px',
    backgroundColor: '#1e293b',
    borderRadius: '10px',
  },
  awakeBtn: {
    width: '100%',
    padding: '15px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: '#38bdf8',
    color: '#020617',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
  },
  surveyCard: {
    backgroundColor: '#1e293b',
    padding: '20px',
    borderRadius: '12px',
    border: '2px solid #38bdf8',
    textAlign: 'center',
    minHeight: '220px',
    display: 'flex',
    flexDirection: 'column',
  },
  surveyTitle: {
    margin: 0,
    flex: 1.65,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '1.75rem',
    textAlign: 'center',
    padding: '0 28px',
    lineHeight: 1.2,
  },
  scoreGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '10px',
    marginTop: '0',
  },
  scoreBtn: {
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid #334155',
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  chartWrap: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    overflow: 'hidden',
    minHeight: '190px',
    alignItems: 'center',
  },
  emptyState: {
    color: '#94a3b8',
    textAlign: 'center',
    fontSize: '0.95rem',
    padding: '20px',
  },
};