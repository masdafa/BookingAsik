import { useEffect, useState } from "react";
import { fetchBookings, deleteBooking } from "../../api/bookingApi";
import {
  Table, TableHead, TableRow, TableCell,
  TableBody, IconButton, Paper, Typography
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function BookingList({ onEdit }) {
  const [bookings, setBookings] = useState([]);

  const loadData = async () => {
    const res = await fetchBookings();
    setBookings(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this booking?")) return;
    await deleteBooking(id);
    loadData();
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" mb={2}>
        Booking List
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell>Hotel</TableCell>
            <TableCell>Check-in</TableCell>
            <TableCell>Check-out</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {bookings.map((b) => (
            <TableRow key={b.id}>
              <TableCell>{b.userName}</TableCell>
              <TableCell>{b.hotelName}</TableCell>
              <TableCell>{b.check_in}</TableCell>
              <TableCell>{b.check_out}</TableCell>
              <TableCell>Rp {b.total_price}</TableCell>

              <TableCell>
                <IconButton color="error" onClick={() => handleDelete(b.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
