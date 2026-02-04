import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { setup3DParallax, setupMagnetic } from "../utils/cardEffects";
import "../styles/global.css";

export default function HotelCard({ hotel }) {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // aktifkan efek 3D parallax
    setup3DParallax(card);

    // aktifkan efek magnetic hover
    setupMagnetic(card);

    card.setAttribute("data-parallax", "true");
  }, []);

  const imageUrl = `http://localhost:4000/hotels/${hotel.image}`;

  return (
    <Link
      to={`/hotel/${hotel.id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div className="card-airbnb" ref={cardRef}>
        <img
          src={imageUrl}
          alt={hotel.name}
          className="hotel-card-image"
        />

        <h3 className="hotel-card-title">{hotel.name}</h3>
        <p className="hotel-card-city">{hotel.city}</p>
      </div>
    </Link>
  );
}
