import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  Avatar,
  Badge,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Menu as MenuIcon,
  DashboardOutlined,
  GroupOutlined,
  QueryStatsOutlined,
  NotificationsActiveOutlined,
  Logout,
} from "@mui/icons-material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { RootState } from "../store/store";
import { logout } from "../store/slices/authSlice";
import { hideNotification } from "../store/slices/uiSlice";
import { useNotifications } from "../hooks/useNotifications";

const drawerWidth = 240;

const navItems = [
  { label: "Dashboard", icon: <DashboardOutlined />, path: "/dashboard" },
  { label: "Patients", icon: <GroupOutlined />, path: "/patients" },
  { label: "Analytics", icon: <QueryStatsOutlined />, path: "/analytics" },
];

const Layout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const { notification } = useSelector((state: RootState) => state.ui);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { requestPermission, permission } = useNotifications();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    await signOut(auth);
    dispatch(logout());
    navigate("/login");
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const drawer = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
      }}
    >
      <Box sx={{ p: 3, pb: 2 }}>
        <Typography variant="h6" fontWeight={700}>
          PulseCare
        </Typography>
        <Typography variant="body2" color="text.secondary">
          B2B Healthcare Console
        </Typography>
      </Box>
      <Divider />
      <List sx={{ flex: 1 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.path}
            selected={location.pathname.startsWith(item.path)}
            onClick={() => handleNavigate(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Avatar sx={{ bgcolor: "primary.main" }}>
          {user?.email?.[0]?.toUpperCase() || "U"}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.email || "Guest"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Care Team Admin
          </Typography>
        </Box>
        <IconButton size="small" onClick={handleLogout}>
          <Logout fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 20% 20%, rgba(14,165,233,0.08), transparent 25%), radial-gradient(circle at 80% 0%, rgba(168,85,247,0.1), transparent 30%), #0b1021",
        color: "text.primary",
      }}
    >
      <AppBar
        position="fixed"
        elevation={0}
        color="transparent"
        sx={{
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid",
          borderColor: "divider",
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Provider Command Center
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Badge
            color="secondary"
            variant={permission === "granted" ? "standard" : "dot"}
            overlap="circular"
          >
            <Button
              color="inherit"
              startIcon={<NotificationsActiveOutlined />}
              onClick={() => void requestPermission()}
              disabled={permission === "granted"}
            >
              {permission === "granted" ? "Notifications On" : "Enable Alerts"}
            </Button>
          </Badge>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="navigation"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 3, md: 4 },
          mt: { xs: 8, md: 10 },
          width: "100%",
        }}
      >
        <Outlet />
      </Box>

      <Snackbar
        open={Boolean(notification?.show)}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={() => dispatch(hideNotification())}
      >
        <Alert
          severity={notification?.type || "info"}
          onClose={() => dispatch(hideNotification())}
          variant="filled"
          sx={{ minWidth: 280 }}
        >
          {notification?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Layout;
