import React, { useEffect } from "react";
import { RootState } from "../store/store";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  setPatients,
  Patient,
  setLoading as setPatientLoading,
} from "../store/slices/patientSlice";
import { setViewMode, showNotification } from "../store/slices/uiSlice";
import { patientsData } from "../data/patients";
import {
  Container,
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  Alert,
} from "@mui/material";
import { GridView, List } from "@mui/icons-material";
import PatientGrid from "../components/PatientGrid";
import PatientList from "../components/PatientList";

const Patients: React.FC = () => {
  const dispatch = useAppDispatch();
  const { patients, loading, error } = useAppSelector(
    (state: RootState) => state.patients,
  );
  const { viewMode } = useAppSelector((state: RootState) => state.ui);

  useEffect(() => {
    dispatch(setPatientLoading(true));
    const timer = setTimeout(() => {
      dispatch(setPatients(patientsData as Patient[]));
      dispatch(showNotification({ message: "Patients synced", type: "info" }));
    }, 400);

    return () => clearTimeout(timer);
  }, [dispatch]);

  const handleViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newView: "grid" | "list" | null,
  ) => {
    if (newView !== null) {
      dispatch(setViewMode(newView));
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4" component="h1">
          Patient Management
        </Typography>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewChange}
          aria-label="view mode"
        >
          <ToggleButton value="grid" aria-label="grid view">
            <GridView />
          </ToggleButton>
          <ToggleButton value="list" aria-label="list view">
            <List />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {viewMode === "grid" ? (
        <PatientGrid patients={patients} />
      ) : (
        <PatientList patients={patients} />
      )}
    </Container>
  );
};

export default Patients;
