import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api';
import { Container, Typography, TextField, Button, Grid, Card, CardContent } from '@mui/material';

export default function Admin() {
  const { t } = useTranslation();
  const [hotels, setHotels] = useState([]);
  const [name, setName] = useState(''); const [city, setCity] = useState(''); const [price, setPrice] = useState('');

  useEffect(() => { api.get('/hotels').then(r => setHotels(r.data)).catch(() => { }); }, []);

  const add = () => {
    api.post('/hotels', { name, city, price }).then(() => { setName(''); setCity(''); setPrice(''); api.get('/hotels').then(r => setHotels(r.data)); }).catch(() => { });
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Typography variant='h4'>{t('admin_hotels_title')}</Typography>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} md={4}>
          <Card><CardContent>
            <TextField fullWidth label={t('name_label')} value={name} onChange={e => setName(e.target.value)} sx={{ mb: 1 }} />
            <TextField fullWidth label={t('city_label')} value={city} onChange={e => setCity(e.target.value)} sx={{ mb: 1 }} />
            <TextField fullWidth label={t('price_label')} value={price} onChange={e => setPrice(e.target.value)} sx={{ mb: 2 }} />
            <Button variant="contained" onClick={add}>{t('add_hotel_button')}</Button>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            {hotels.map(h => (
              <Grid item xs={12} md={6} key={h.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{h.name}</Typography>
                    <Typography>{h.city}</Typography>
                    <Typography>Rp {h.price}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
