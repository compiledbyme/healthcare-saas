import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Avatar,
} from "@mui/material";
import { Patient } from "../store/slices/patientSlice";
import { useNavigate } from "react-router-dom";

interface PatientGridProps {
  patients: Patient[];
}

const PatientGrid: React.FC<PatientGridProps> = ({ patients }) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "success";
      case "Recovered":
        return "info";
      case "Critical":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Grid container spacing={3}>
      {patients.map((patient) => (
        <Grid item xs={12} sm={6} md={4} key={patient.id}>
          <Card
            sx={{
              cursor: "pointer",
              "&:hover": {
                transform: "translateY(-4px)",
                transition: "transform 0.3s ease-in-out",
                boxShadow: 6,
              },
            }}
            onClick={() => navigate(`/patient/${patient.id}`)}
          >
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ mr: 2, bgcolor: "primary.main" }}>
                  {patient.name.charAt(0)}
                </Avatar>
                <Box flex={1}>
                  <Typography variant="h6" component="h3">
                    {patient.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {patient.age} yrs | {patient.gender}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body2" color="text.secondary" gutterBottom>
                {patient.email}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {patient.phone}
              </Typography>

              <Box
                mt={2}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Chip
                  label={patient.status}
                  color={getStatusColor(patient.status) as any}
                  size="small"
                />
                <Typography variant="caption" color="text.secondary">
                  Last visit: {new Date(patient.lastVisit).toLocaleDateString()}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default PatientGrid;
