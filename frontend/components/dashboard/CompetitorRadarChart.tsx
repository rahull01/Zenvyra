"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const radarData = [
  { subject: "Privacy", A: 90, B: 65, C: 50, fullMark: 100 },
  { subject: "Cookies", A: 85, B: 80, C: 60, fullMark: 100 },
  { subject: "SSL", A: 100, B: 100, C: 80, fullMark: 100 },
  { subject: "Accessibility", A: 80, B: 60, C: 45, fullMark: 100 },
  { subject: "Performance", A: 70, B: 75, C: 55, fullMark: 100 },
];

export default function CompetitorRadarChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
          <PolarGrid stroke="var(--bg-tertiary)" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--text-secondary)", fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "var(--text-muted)", fontSize: 10 }} />
          <Radar name="You" dataKey="A" stroke="var(--info)" fill="var(--info)" fillOpacity={0.3} strokeWidth={2} />
          <Radar name="Competitor A" dataKey="B" stroke="var(--danger)" fill="var(--danger)" fillOpacity={0.1} strokeWidth={2} />
          <Radar name="Competitor B" dataKey="C" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.1} strokeWidth={2} />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--bg-secondary-darker)",
              border: "1px solid var(--bg-tertiary)",
              borderRadius: "12px",
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
