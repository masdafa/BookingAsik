import {
  Box,
  Typography,
  Button,
  IconButton,
  Paper,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

export default function UserList({ users, onEdit, onDelete }) {
  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
        User Management
      </Typography>

      <Button
        variant="contained"
        sx={{ mb: 2 }}
        onClick={() => onEdit(null)}
      >
        + Add User
      </Button>

      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>ID</b></TableCell>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Email</b></TableCell>
              <TableCell><b>Role</b></TableCell>
              <TableCell align="right"><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.id}</TableCell>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.role}</TableCell>

                <TableCell align="right">
                  <IconButton color="primary" onClick={() => onEdit(u)}>
                    <Edit />
                  </IconButton>

                  <IconButton color="error" onClick={() => onDelete(u.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </TableContainer>
    </Box>
  );
}
