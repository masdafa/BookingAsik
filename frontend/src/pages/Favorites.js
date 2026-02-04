import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Stack,
  Chip,
} from "@mui/material";
import Navbar from "../components/Navbar";
import {
  getFavorites,
  removeFavoriteHotel,
} from "../utils/favorites";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Favorites() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    setFavorites(getFavorites());

    const handler = () => setFavorites(getFavorites());
    window.addEventListener("favorites-updated", handler);
    return () => window.removeEventListener("favorites-updated", handler);
  }, []);

  const handleRemove = (id) => {
    const updated = removeFavoriteHotel(id);
    setFavorites(updated);
  };

  return (
    <>
      <Navbar />
      <Container sx={{ mt: 6, mb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
          {t('my_favorites')}
        </Typography>

        {favorites.length === 0 ? (
          <Paper sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              {t('no_favorites')}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              {t('save_favorites_desc')}
            </Typography>
            <Button variant="contained" onClick={() => navigate("/")}>
              {t('explore_hotels')}
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {favorites.map((hotel) => (
              <Grid item xs={12} md={6} key={hotel.id}>
                <Paper
                  elevation={3}
                  sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    display: "flex",
                    height: "100%",
                  }}
                >
                  <Box
                    sx={{
                      width: 180,
                      height: "100%",
                      flexShrink: 0,
                      background: "#f5f5f5",
                    }}
                  >
                    <img
                      src={`http://localhost:4000/hotels/${hotel.image}`}
                      alt={hotel.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/300x300?text=Hotel";
                      }}
                    />
                  </Box>
                  <Box sx={{ p: 3, display: "flex", flexDirection: "column", flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {hotel.name}
                    </Typography>
                    <Chip
                      label={hotel.city}
                      size="small"
                      sx={{ width: "fit-content", mt: 1, mb: 2 }}
                    />

                    <Typography sx={{ fontWeight: 700, color: "#2e7d32", mb: 2 }}>
                      Rp {hotel.price?.toLocaleString("id-ID")}
                    </Typography>

                    <Stack direction="row" spacing={1} mt="auto">
                      <Button
                        variant="outlined"
                        onClick={() => navigate(`/hotel/${hotel.id}`)}
                      >
                        {t('see_details')}
                      </Button>
                      <Button
                        variant="text"
                        color="error"
                        onClick={() => handleRemove(hotel.id)}
                      >
                        {t('remove_button_label')}
                      </Button>
                    </Stack>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
}

