import React from "react";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography, Box, Divider } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HotelIcon from "@mui/icons-material/Hotel";
import ExploreIcon from "@mui/icons-material/Explore";
import PeopleIcon from "@mui/icons-material/People";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link, useLocation, useNavigate } from "react-router-dom";

const menu = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
  { text: "Hotels", icon: <HotelIcon />, path: "/admin/hotels" },
  { text: "Tempat Wisata", icon: <ExploreIcon />, path: "/admin/attractions" },
  { text: "Users", icon: <PeopleIcon />, path: "/admin/users" },
  { text: "Bookings", icon: <BookOnlineIcon />, path: "/admin/bookings" },
  { text: "Invoices", icon: <ReceiptLongIcon />, path: "/admin/invoices" },
];

const drawerWidth = 230;

export default function SidebarAdmin() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: "linear-gradient(135deg, #1976d2 80%, #42a5f5 100%)",
          color: "#fff",
          border: 0,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh', // <-- agar tidak muncul scrollbar pada sidebar
          overflow: 'hidden', // <-- penting! agar tidak nambah scroll
        },
      }}
    >
      <Toolbar sx={{ minHeight: 72, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', gap: 0.5 }}>
        <Typography variant="h6" fontWeight={800} letterSpacing={1} sx={{ fontSize: '1.1rem' }}>
          Admin Panel
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.75rem', letterSpacing: 0.5 }}>
          BookingAsik.com
        </Typography>
      </Toolbar>
      <List>
        {menu.map((item) => (
          <ListItem
            button
            key={item.text}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            sx={{
              my: 0.5,
              borderRadius: 2,
              background: location.pathname === item.path ? 'rgba(255,255,255,0.13)' : undefined,
              '&:hover': { background: 'rgba(255,255,255,0.10)' },
              color: '#fff',
            }}
          >
            <ListItemIcon sx={{ color: '#fff' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: location.pathname === item.path ? 700 : 500 }} />
          </ListItem>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', mx: 2 }} />
      <List sx={{ pb: 2 }}>
        <ListItem
          button
          onClick={handleLogout}
          sx={{
            my: 0.5,
            mx: 1,
            borderRadius: 2,
            '&:hover': { background: 'rgba(255,255,255,0.15)' },
            color: '#fff',
          }}
        >
          <ListItemIcon sx={{ color: '#fff' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 500 }} />
        </ListItem>
      </List>
    </Drawer>
  );
}
