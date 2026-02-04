-- Migration: Tambahkan kolom latitude dan longitude ke tabel hotels
-- Jalankan query ini di database MySQL

ALTER TABLE hotels 
ADD COLUMN latitude DECIMAL(10, 8) NULL,
ADD COLUMN longitude DECIMAL(11, 8) NULL,
ADD COLUMN address TEXT NULL;

-- Index untuk performa query berdasarkan koordinat
CREATE INDEX idx_hotel_coordinates ON hotels(latitude, longitude);

