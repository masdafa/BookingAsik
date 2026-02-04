import React from "react";
import { useParams } from "react-router-dom";

export default function HotelAdminEdit() {
  const { id } = useParams();

  return (
    <div style={{ padding: 20 }}>
      <h1>Edit Hotel ID: {id}</h1>
      <p>Form edit hotel disini.</p>
    </div>
  );
}
