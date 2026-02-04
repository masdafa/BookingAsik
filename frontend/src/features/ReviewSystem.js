import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Rating,
  TextField,
  Button,
  Avatar,
  Paper,
  Chip,
  Divider,
  CircularProgress
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import PersonIcon from '@mui/icons-material/Person';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

const ReviewSystem = ({ hotelId, userId }) => {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [hotelId]);

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/hotels/${hotelId}/reviews`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!rating || !comment.trim()) return;

    setSubmitting(true);
    try {
      const response = await api.post(`/hotels/${hotelId}/reviews`, {
        userId,
        rating,
        comment,
        date: new Date().toISOString()
      });

      setReviews(prev => [response.data, ...prev]);
      setRating(0);
      setComment('');
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const avgRating = getAverageRating();
  const ratingDistribution = getRatingDistribution();

  return (
    <Box className="review-system">
      {/* Summary */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
              {avgRating}
            </Typography>
            <Rating
              value={parseFloat(avgRating)}
              readOnly
              precision={0.1}
              emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
            />
            <Typography variant="body2" color="text.secondary">
              {reviews.length} reviews
            </Typography>
          </Box>

          <Divider orientation="vertical" flexItem />

          <Box sx={{ flexGrow: 1 }}>
            {[5, 4, 3, 2, 1].map(star => (
              <Box key={star} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" sx={{ width: 20 }}>{star}</Typography>
                <StarIcon sx={{ fontSize: 16, ml: 0.5, mr: 1 }} />
                <Box sx={{ flexGrow: 1, height: 8, bgcolor: 'grey.200', borderRadius: 1, overflow: 'hidden' }}>
                  <Box
                    sx={{
                      height: '100%',
                      width: `${(ratingDistribution[star] / reviews.length) * 100 || 0}%`,
                      bgcolor: 'primary.main'
                    }}
                  />
                </Box>
                <Typography variant="body2" sx={{ width: 40, textAlign: 'right', ml: 1 }}>
                  {ratingDistribution[star]}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>

      {/* Write Review */}
      {userId && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>{t('write_review')}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Rating
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
              size="large"
            />
            <Typography variant="body1">{rating} {t('stars')}</Typography>
          </Box>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder={t('share_experience_placeholder')}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            onClick={handleSubmitReview}
            disabled={submitting || !rating || !comment.trim()}
            startIcon={submitting ? <CircularProgress size={20} /> : null}
          >
            {submitting ? t('submitting') : t('submit_review')}
          </Button>
        </Paper>
      )}

      {/* Reviews List */}
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>{t('recent_reviews')}</Typography>
        {reviews.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">{t('no_reviews_yet')}</Typography>
          </Paper>
        ) : (
          reviews.map((review) => (
            <Paper key={review.id} sx={{ p: 3, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ mr: 2 }}>
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                    {review.user?.name || t('anonymous')}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Rating value={review.rating} readOnly size="small" />
                    <Typography variant="caption" color="text.secondary">
                      {new Date(review.date).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Typography>{review.comment}</Typography>
            </Paper>
          ))
        )}
      </Box>
    </Box>
  );
};

export default ReviewSystem;
