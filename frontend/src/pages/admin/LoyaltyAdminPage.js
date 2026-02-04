import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid
} from '@mui/material';
import api from '../../api/axios';

const LoyaltyAdminPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users?includeLoyalty=true');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPoints = (user) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleUpdatePoints = async () => {
    try {
      await api.put(`/admin/users/${selectedUser.id}/loyalty`, {
        points: selectedUser.loyalty.points,
        level: selectedUser.loyalty.level
      });
      setOpenDialog(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error updating points:', error);
    }
  };

  const getLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'bronze': return '#cd7f32';
      case 'silver': return '#c0c0c0';
      case 'gold': return '#ffd700';
      case 'platinum': return '#e5e4e2';
      default: return '#9e9e9e';
    }
  };

  const filteredUsers = users.filter(user => {
    if (filter === 'all') return true;
    if (filter === 'bronze') return user.loyalty?.level === 'Bronze';
    if (filter === 'silver') return user.loyalty?.level === 'Silver';
    if (filter === 'gold') return user.loyalty?.level === 'Gold';
    if (filter === 'platinum') return user.loyalty?.level === 'Platinum';
    return true;
  });

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
          Loyalty Program Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage user loyalty points and levels
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Level Filter</InputLabel>
            <Select
              value={filter}
              label="Level Filter"
              onChange={(e) => setFilter(e.target.value)}
            >
              <MenuItem value="all">All Levels</MenuItem>
              <MenuItem value="bronze">Bronze</MenuItem>
              <MenuItem value="silver">Silver</MenuItem>
              <MenuItem value="gold">Gold</MenuItem>
              <MenuItem value="platinum">Platinum</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="body1">
            Total: {filteredUsers.length} users
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Points</TableCell>
                <TableCell>Level</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {user.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.loyalty?.points || 0} 
                      color="primary" 
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={user.loyalty?.level || 'Bronze'} 
                      sx={{ 
                        bgcolor: getLevelColor(user.loyalty?.level),
                        color: user.loyalty?.level === 'Gold' ? 'black' : 'white'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => handleEditPoints(user)}
                      sx={{ minWidth: 0, p: 1 }}
                    >
                      Edit Points
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Edit Points Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit Loyalty Points</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6">
                    {selectedUser.name} ({selectedUser.email})
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Points"
                    type="number"
                    value={selectedUser.loyalty?.points || 0}
                    onChange={(e) => setSelectedUser({
                      ...selectedUser,
                      loyalty: {
                        ...selectedUser.loyalty,
                        points: parseInt(e.target.value)
                      }
                    })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Level</InputLabel>
                    <Select
                      value={selectedUser.loyalty?.level || 'Bronze'}
                      label="Level"
                      onChange={(e) => setSelectedUser({
                        ...selectedUser,
                        loyalty: {
                          ...selectedUser.loyalty,
                          level: e.target.value
                        }
                      })}
                    >
                      <MenuItem value="Bronze">Bronze</MenuItem>
                      <MenuItem value="Silver">Silver</MenuItem>
                      <MenuItem value="Gold">Gold</MenuItem>
                      <MenuItem value="Platinum">Platinum</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdatePoints} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LoyaltyAdminPage;
