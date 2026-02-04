import { useState } from "react";
import { createBooking, updateBooking } from "../../api/bookingApi";
import { TextField, Button, Paper, Stack, Typography } from "@mui/material";

export default function BookingForm({ selected, refresh }) {
  const [form, setForm] = useState(
    selected || {
      user_id: "",
      hotel_id: "",
      check_in: "",
      check_out: "",
      total_price: "",
    }
  );

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (selected)
      await updateBooking(selected.id, form);
    else
      await createBooking(form);

    refresh();
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" mb={2}>
        {selected ? "Edit Booking" : "Add Booking"}
      </Typography>

      <Stack spacing={2}>
        <TextField label="User ID" name="user_id" value={form.user_id} onChange={handleChange} />
        <TextField label="Hotel ID" name="hotel_id" value={form.hotel_id} onChange={handleChange} />
        <TextField type="date" label="Check In" name="check_in" InputLabelProps={{ shrink: true }} value={form.check_in} onChange={handleChange} />
        <TextField type="date" label="Check Out" name="check_out" InputLabelProps={{ shrink: true }} value={form.check_out} onChange={handleChange} />
        <TextField label="Total Price" name="total_price" value={form.total_price} onChange={handleChange} />

        <Button variant="contained" onClick={handleSubmit}>
          Save
        </Button>
      </Stack>
    </Paper>
  );
}
