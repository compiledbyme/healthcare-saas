import React, { useMemo } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Chip,
  Stack,
} from "@mui/material";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const Analytics: React.FC = () => {
  const { patients } = useSelector((state: RootState) => state.patients);

  const { statusCounts, avgAge, conditionData, monthlyTrend, ageBands } =
    useMemo(() => {
      const statusCounts = {
        Active: 0,
        Recovered: 0,
        Critical: 0,
      };
      let ageTotal = 0;
      const conditionMap: Record<string, number> = {};
      const monthlyMap = new Map<string, number>();
      const ageBuckets: Record<string, number> = {
        "18-30": 0,
        "31-45": 0,
        "46-60": 0,
        "60+": 0,
      };

      patients.forEach((patient) => {
        statusCounts[patient.status] += 1;
        ageTotal += patient.age;
        conditionMap[patient.condition] =
          (conditionMap[patient.condition] || 0) + 1;

        const visitDate = new Date(patient.lastVisit);
        const monthKey = `${visitDate.getFullYear()}-${visitDate.getMonth() + 1}`;
        monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + 1);

        if (patient.age <= 30) ageBuckets["18-30"] += 1;
        else if (patient.age <= 45) ageBuckets["31-45"] += 1;
        else if (patient.age <= 60) ageBuckets["46-60"] += 1;
        else ageBuckets["60+"] += 1;
      });

      const conditionData = Object.entries(conditionMap)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6);

      const monthlyTrend = Array.from(monthlyMap.entries())
        .map(([key, value]) => {
          const [year, month] = key.split("-");
          const date = new Date(Number(year), Number(month) - 1, 1);
          return {
            month: date.toLocaleString("default", {
              month: "short",
              year: "2-digit",
            }),
            visits: value,
            ts: date.getTime(),
          };
        })
        .sort((a, b) => a.ts - b.ts)
        .map(({ ts, ...rest }) => rest);

      const ageBands = Object.entries(ageBuckets).map(([name, value]) => ({
        name,
        value,
      }));

      return {
        statusCounts,
        avgAge: patients.length ? Math.round(ageTotal / patients.length) : 0,
        conditionData,
        monthlyTrend,
        ageBands,
      };
    }, [patients]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Analytics
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Operational insight across cohorts, acuity, and engagement.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Chip label={`Active ${statusCounts.Active}`} color="primary" />
          <Chip label={`Critical ${statusCounts.Critical}`} color="error" />
          <Chip label={`Recovered ${statusCounts.Recovered}`} color="success" />
        </Stack>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Last Visit Volume (by month)
            </Typography>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={monthlyTrend}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="visits"
                  stroke="#0ea5e9"
                  fillOpacity={1}
                  fill="url(#colorVisits)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Snapshot
            </Typography>
            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Average Age
                </Typography>
                <Typography variant="h4">{avgAge || "—"}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Condition Concentration
                </Typography>
                <Stack spacing={1}>
                  {conditionData.map((condition) => (
                    <Box
                      key={condition.name}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        bgcolor: "action.hover",
                        px: 2,
                        py: 1,
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="body2">{condition.name}</Typography>
                      <Chip label={condition.value} size="small" />
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Age Cohorts
            </Typography>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={ageBands} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#a855f7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Conditions (Top 6)
            </Typography>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={conditionData} layout="vertical" barSize={18}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis type="number" allowDecimals={false} />
                <YAxis type="category" dataKey="name" width={120} />
                <Tooltip />
                <Bar dataKey="value" fill="#22c55e" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Analytics;
