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
  InputLabel
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import api from '../../api/axios';

const ReviewAdminPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await api.get('/admin/reviews');
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await api.delete(`/admin/reviews/${id}`);
        fetchReviews();
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };

  const handleEdit = (review) => {
    setSelectedReview(review);
    setOpenDialog(true);
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/admin/reviews/${selectedReview.id}`, selectedReview);
      setOpenDialog(false);
      setSelectedReview(null);
      fetchReviews();
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  const filteredReviews = reviews.filter(review => {
    if (filter === 'all') return true;
    if (filter === 'approved') return review.status === 'approved';
    if (filter === 'pending') return review.status === 'pending';
    if (filter === 'rejected') return review.status === 'rejected';
    return true;
  });

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
          Review Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage all hotel reviews and ratings
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Status Filter</InputLabel>
            <Select
              value={filter}
              label="Status Filter"
              onChange={(e) => setFilter(e.target.value)}
            >
              <MenuItem value="all">All Reviews</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="body1">
            Total: {filteredReviews.length} reviews
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Hotel</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Comment</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>{review.hotel?.name}</TableCell>
                  <TableCell>{review.user?.name || 'Anonymous'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={`${review.rating} ⭐`} 
                      color={review.rating >= 4 ? 'success' : review.rating >= 3 ? 'warning' : 'error'}
                    />
                  </TableCell>
                  <TableCell>{review.comment.substring(0, 50)}...</TableCell>
                  <TableCell>{new Date(review.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip 
                      label={review.status} 
                      color={
                        review.status === 'approved' ? 'success' : 
                        review.status === 'pending' ? 'warning' : 'error'
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => handleEdit(review)}
                      sx={{ minWidth: 0, p: 1, mr: 1 }}
                    >
                      <EditIcon fontSize="small" />
                    </Button>
                    <Button
                      size="small"
                      onClick={() => handleDelete(review.id)}
                      color="error"
                      sx={{ minWidth: 0, p: 1 }}
                    >
                      <DeleteIcon fontSize="small" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit Review</DialogTitle>
        <DialogContent>
          {selectedReview && (
            <Box sx={{ pt: 2 }}>
              <TextField
                fullWidth
                label="Rating"
                type="number"
                value={selectedReview.rating}
                onChange={(e) => setSelectedReview({...selectedReview, rating: parseInt(e.target.value)})}
                sx={{ mb: 2 }}
                inputProps={{ min: 1, max: 5 }}
              />
              <TextField
                fullWidth
                label="Comment"
                multiline
                rows={4}
                value={selectedReview.comment}
                onChange={(e) => setSelectedReview({...selectedReview, comment: e.target.value})}
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedReview.status}
                  label="Status"
                  onChange={(e) => setSelectedReview({...selectedReview, status: e.target.value})}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ReviewAdminPage;
