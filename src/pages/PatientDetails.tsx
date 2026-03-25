import React, { useMemo } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Chip,
  Stack,
  Divider,
  Button,
  LinearProgress,
} from "@mui/material";
import {
  ArrowBack,
  EmailOutlined,
  LocalPhone,
  CalendarMonth,
  HealingOutlined,
  NotificationsActiveOutlined,
  CheckCircleOutline,
  ErrorOutline,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Patient, updatePatient } from "../store/slices/patientSlice";
import { useNotifications } from "../hooks/useNotifications";
import { showNotification } from "../store/slices/uiSlice";

const PatientDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { patients } = useSelector((state: RootState) => state.patients);
  const { sendNotification, requestPermission, permission } = useNotifications();

  const patient = useMemo(
    () => patients.find((p) => p.id === id),
    [patients, id],
  );

  const vitals = [
    { label: "BP", value: "118 / 78", status: "stable" },
    { label: "HR", value: "74 bpm", status: "stable" },
    { label: "SpO₂", value: "98%", status: "stable" },
    { label: "Temp", value: "98.2°F", status: "stable" },
  ];

  const upcomingVisit = {
    date: "2026-04-10",
    type: "Follow-up Consultation",
    clinician: "Dr. Alicia Perez",
  };

  const handleStatusChange = (status: Patient["status"]) => {
    if (!patient) return;
    dispatch(updatePatient({ ...patient, status }));
    dispatch(
      showNotification({
        message: `Status updated to ${status}`,
        type: "success",
      }),
    );
  };

  const handleReminder = async () => {
    if (!patient) return;
    const granted = await requestPermission();
    if (!granted) {
      dispatch(
        showNotification({
          message: "Enable notifications to send reminders.",
          type: "error",
        }),
      );
      return;
    }

    await sendNotification("Visit reminder", {
      body: `${patient.name}'s follow-up is scheduled on ${new Date(
        upcomingVisit.date,
      ).toLocaleDateString()}.`,
      tag: `patient-${patient.id}-reminder`,
    });

    dispatch(
      showNotification({
        message: "Reminder sent via service worker",
        type: "info",
      }),
    );
  };

  if (!patient) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h6" gutterBottom>
            Patient not found
          </Typography>
          <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            sx={{ borderColor: "divider" }}
          >
            Back
          </Button>
          <Box>
            <Typography variant="h4" fontWeight={700}>
              {patient.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {patient.age} yrs • {patient.gender}
            </Typography>
          </Box>
        </Box>
        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
          <Chip
            label="Mark Active"
            onClick={() => handleStatusChange("Active")}
            color="primary"
            variant={patient.status === "Active" ? "filled" : "outlined"}
            icon={<CheckCircleOutline />}
          />
          <Chip
            label="Mark Recovered"
            onClick={() => handleStatusChange("Recovered")}
            color="success"
            variant={patient.status === "Recovered" ? "filled" : "outlined"}
            icon={<CheckCircleOutline />}
          />
          <Chip
            label="Mark Critical"
            onClick={() => handleStatusChange("Critical")}
            color="error"
            variant={patient.status === "Critical" ? "filled" : "outlined"}
            icon={<ErrorOutline />}
          />
          <Button
            startIcon={<NotificationsActiveOutlined />}
            variant="contained"
            onClick={() => void handleReminder()}
            disabled={permission === "denied"}
          >
            Send Reminder
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Contact
            </Typography>
            <Stack spacing={1.2}>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <EmailOutlined fontSize="small" />
                <Typography variant="body2">{patient.email}</Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <LocalPhone fontSize="small" />
                <Typography variant="body2">{patient.phone}</Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <CalendarMonth fontSize="small" />
                <Typography variant="body2">
                  Last visit:{" "}
                  {new Date(patient.lastVisit).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <HealingOutlined fontSize="small" />
                <Typography variant="body2">{patient.condition}</Typography>
              </Box>
              <Chip
                label={patient.status}
                color={
                  patient.status === "Critical"
                    ? "error"
                    : patient.status === "Recovered"
                    ? "success"
                    : "primary"
                }
                sx={{ width: "fit-content", mt: 1 }}
              />
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Clinical Overview
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Longitudinal summary of vitals and engagement to date.
            </Typography>
            <Grid container spacing={2}>
              {vitals.map((vital) => (
                <Grid item xs={6} md={3} key={vital.label}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderColor: "divider",
                      bgcolor: "background.default",
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {vital.label}
                    </Typography>
                    <Typography variant="h6">{vital.value}</Typography>
                    <Chip
                      label={vital.status}
                      size="small"
                      color="success"
                      sx={{ mt: 1 }}
                    />
                  </Paper>
                </Grid>
              ))}
            </Grid>
            <Divider sx={{ my: 3 }} />
            <Typography variant="subtitle2" color="text.secondary">
              Treatment adherence
            </Typography>
            <LinearProgress
              variant="determinate"
              value={86}
              sx={{ mt: 1, height: 10, borderRadius: 10 }}
            />
            <Typography variant="caption" color="text.secondary">
              86% medication adherence over the last 30 days
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Upcoming
            </Typography>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                <Typography variant="body1" fontWeight={600}>
                  {upcomingVisit.type}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(upcomingVisit.date).toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  · {upcomingVisit.clinician}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1}>
                <Chip label="Telehealth" color="info" variant="outlined" />
                <Chip label="Prep labs uploaded" color="success" />
              </Stack>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PatientDetails;
