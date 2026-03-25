import React from "react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { RootState } from "../store/store";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Stack,
} from "@mui/material";
import {
  People,
  TrendingUp,
  Warning,
  CheckCircle,
  NotificationsActiveOutlined,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useNotifications } from "../hooks/useNotifications";
import { showNotification } from "../store/slices/uiSlice";

const Dashboard: React.FC = () => {
  const { patients } = useAppSelector((state: RootState) => state.patients);
  const { user } = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const { sendNotification, requestPermission } = useNotifications();

  const stats = {
    totalPatients: patients.length,
    activePatients: patients.filter((p) => p.status === "Active").length,
    criticalPatients: patients.filter((p) => p.status === "Critical").length,
    recoveredPatients: patients.filter((p) => p.status === "Recovered").length,
  };

  const recoveryRate =
    stats.totalPatients > 0
      ? ((stats.recoveredPatients / stats.totalPatients) * 100).toFixed(1)
      : "0.0";

  const weeklyData = [
    { day: "Mon", patients: 12 },
    { day: "Tue", patients: 19 },
    { day: "Wed", patients: 15 },
    { day: "Thu", patients: 22 },
    { day: "Fri", patients: 28 },
    { day: "Sat", patients: 18 },
    { day: "Sun", patients: 10 },
  ];

  const genderData = [
    { name: "Male", value: patients.filter((p) => p.gender === "Male").length },
    {
      name: "Female",
      value: patients.filter((p) => p.gender === "Female").length,
    },
    {
      name: "Other",
      value: patients.filter((p) => p.gender === "Other").length,
    },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  const handleSendDigest = async () => {
    const granted = await requestPermission();
    if (!granted) return;

    await sendNotification("Clinical digest ready", {
      body: "Morning safety huddle: new labs uploaded for 2 patients.",
      data: "/dashboard",
    });
    dispatch(
      showNotification({
        message: "Sent daily digest via notification",
        type: "info",
      }),
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
        mb={2}
      >
        <Box>
          <Typography variant="h4" component="h1" fontWeight={700}>
            Welcome back, {user?.email?.split("@")[0] || "Operator"}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Live pulse of your population across engagement, risk, and follow-up.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            startIcon={<NotificationsActiveOutlined />}
            onClick={() => void handleSendDigest()}
          >
            Send daily digest
          </Button>
          <Button variant="outlined" onClick={() => void requestPermission()}>
            Refresh permissions
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Patients
                  </Typography>
                  <Typography variant="h4">{stats.totalPatients}</Typography>
                </Box>
                <People sx={{ fontSize: 48, color: "primary.main" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Active Patients
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {stats.activePatients}
                  </Typography>
                </Box>
                <CheckCircle sx={{ fontSize: 48, color: "success.main" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Critical Cases
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    {stats.criticalPatients}
                  </Typography>
                </Box>
                <Warning sx={{ fontSize: 48, color: "error.main" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Recovery Rate
                  </Typography>
                  <Typography variant="h4">
                    {recoveryRate}%
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 48, color: "info.main" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Weekly Patient Visits
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="patients" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Gender Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {genderData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
