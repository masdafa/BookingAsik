import { Drawer, List, ListItemButton, ListItemText, Toolbar, Box } from "@mui/material";
import { Link } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 240,
          boxSizing: "border-box",
          borderRight: "none",
          background: "#ffffff",
          paddingTop: 2,
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto", px: 1 }}>
        <List>
          <ListItemButton component={Link} to="/admin/dashboard">
            <ListItemText primary="Dashboard" />
          </ListItemButton>

          <ListItemButton component={Link} to="/admin/hotels">
            <ListItemText primary="Hotels" />
          </ListItemButton>

          <ListItemButton component={Link} to="/admin/bookings">
            <ListItemText primary="Bookings" />
          </ListItemButton>

          <ListItemButton component={Link} to="/admin/users">
            <ListItemText primary="Users" />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );
}
