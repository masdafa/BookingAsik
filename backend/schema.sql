CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200),
  email VARCHAR(200) UNIQUE,
  password VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  points BIGINT DEFAULT 0
);

CREATE TABLE hotels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  city VARCHAR(100),
  price INT,
  description TEXT
);

CREATE TABLE hotel_photos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  hotel_id INT,
  photo VARCHAR(512)
);

CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  hotel_id INT,
  start_date DATE,
  end_date DATE,
  total_price INT,
  rooms INT DEFAULT 1
);
