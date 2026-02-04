import { useLocation } from "react-router-dom";
import { Button } from "@mui/material";

export default function Payment() {
  const { state } = useLocation();

  return (
    <div style={{ padding: 20 }}>
      <h2>Mock Payment</h2>
      <p>Check-in: {state.checkIn.toString()}</p>
      <p>Check-out: {state.checkOut.toString()}</p>

      <Button variant="contained" color="success">
        Pay Now (Mock)
      </Button>
    </div>
  );
}
