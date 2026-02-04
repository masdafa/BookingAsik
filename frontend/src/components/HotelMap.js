import React, { useState, useMemo } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Link } from "react-router-dom";
import { Box, Paper, Typography, Button } from "@mui/material";
import HotelIcon from "@mui/icons-material/Hotel";

// Alias mapbox-gl to maplibre-gl untuk kompatibilitas
if (typeof window !== "undefined") {
  window.maplibregl = maplibregl;
}

export default function HotelMap({ hotels }) {
  const [popupInfo, setPopupInfo] = useState(null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "500px",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        position: "relative",
      }}
    >
      <Map
        mapLib={maplibregl}
        initialViewState={{
          longitude: 106.8166,
          latitude: -6.2000,
          zoom: 11,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle={{
          version: 8,
          sources: {
            "osm-tiles": {
              type: "raster",
              tiles: [
                "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
              ],
              tileSize: 256,
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            },
          },
          layers: [
            {
              id: "osm-tiles-layer",
              type: "raster",
              source: "osm-tiles",
              minzoom: 0,
              maxzoom: 19,
            },
          ],
        }}
        // Alternatif style yang lebih menarik (uncomment salah satu jika ingin):
        // Style CartoDB Positron (clean & minimal):
        // mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        // Style CartoDB Dark Matter (dark theme):
        // mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
        // Style Stamen Toner (artistic black & white):
        // mapStyle dengan custom style JSON untuk Stamen
        reuseMaps
      >
        {hotels?.map((hotel, i) =>
          hotel.latitude && hotel.longitude ? (
            <Marker
              key={i}
              longitude={parseFloat(hotel.longitude)}
              latitude={parseFloat(hotel.latitude)}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setPopupInfo(hotel);
              }}
            >
              <Box
                sx={{
                  cursor: "pointer",
                  transform: "translate(-50%, -100%)",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translate(-50%, -100%) scale(1.1)",
                  },
                }}
              >
                <Box
                  sx={{
                    bgcolor: "#1976d2",
                    width: 40,
                    height: 40,
                    borderRadius: "50% 50% 50% 0",
                    transform: "rotate(-45deg)",
                    border: "3px solid white",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <HotelIcon
                    sx={{
                      transform: "rotate(45deg)",
                      color: "white",
                      fontSize: 20,
                    }}
                  />
                </Box>
              </Box>
            </Marker>
          ) : null
        )}

        {popupInfo && (
          <Popup
            longitude={parseFloat(popupInfo.longitude)}
            latitude={parseFloat(popupInfo.latitude)}
            anchor="bottom"
            onClose={() => setPopupInfo(null)}
            closeOnClick={false}
          >
            <Paper sx={{ p: 2, minWidth: 220, maxWidth: 280 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontSize: "16px" }}>
                {popupInfo.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                📍 {popupInfo.city}
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontWeight: 700, color: "#2e7d32", mb: 2 }}
              >
                {formatCurrency(popupInfo.price || 0)}
              </Typography>
              <Button
                component={Link}
                to={`/hotel/${popupInfo.id}`}
                variant="contained"
                size="small"
                fullWidth
                sx={{
                  bgcolor: "#1976d2",
                  "&:hover": { bgcolor: "#1565c0" },
                }}
              >
                View Details →
              </Button>
            </Paper>
          </Popup>
        )}
      </Map>
    </Box>
  );
}
