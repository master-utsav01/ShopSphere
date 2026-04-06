import MyLocationOutlinedIcon from "@mui/icons-material/MyLocationOutlined";
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";
import { useState } from "react";
import { Alert, Button, Grid, Link, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { placeOrder } from "../api/orderApi";
import EmptyState from "../components/EmptyState";
import { useCart } from "../context/CartContext";

const paymentOptions = [
  { value: "COD", label: "Cash on Delivery" },
  { value: "UPI", label: "UPI" },
  { value: "CREDIT_CARD", label: "Credit Card" },
  { value: "DEBIT_CARD", label: "Debit Card" },
  { value: "NET_BANKING", label: "Net Banking" },
  { value: "WALLET", label: "Wallet" },
];

function CheckoutPage() {
  const { cart, refreshCart } = useCart();
  const [form, setForm] = useState({
    shippingAddress: "",
    paymentMethod: "COD",
    locationLabel: "",
    latitude: null,
    longitude: null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const navigate = useNavigate();

  if (!cart?.items?.length) {
    return <EmptyState title="No items to checkout" description="Add products to your cart before placing an order." />;
  }

  const mapUrl =
    form.latitude && form.longitude
      ? `https://www.google.com/maps?q=${form.latitude},${form.longitude}`
      : "";

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported in this browser.");
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = Number(position.coords.latitude.toFixed(6));
        const longitude = Number(position.coords.longitude.toFixed(6));
        setForm((prev) => ({
          ...prev,
          shippingAddress:
            prev.shippingAddress || "Deliver to my current location. Use the GPS pin attached to this order.",
          locationLabel: `GPS Pin (${latitude}, ${longitude})`,
          latitude,
          longitude,
        }));
        setError("");
        setLocationLoading(false);
      },
      () => {
        setError("We could not fetch your current location. Please allow location access and try again.");
        setLocationLoading(false);
      }
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await placeOrder(form);
      setSuccess(`Order #${response.id} placed successfully.`);
      setError("");
      await refreshCart();
      setTimeout(() => navigate("/orders"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Order placement failed");
      setSuccess("");
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={7}>
        <Paper sx={{ p: 4, borderRadius: 4 }}>
          <Stack spacing={3} component="form" onSubmit={handleSubmit}>
            <Typography variant="h4">Checkout</Typography>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
            <TextField
              label="Shipping address"
              multiline
              minRows={4}
              value={form.shippingAddress}
              onChange={(event) => setForm((prev) => ({ ...prev, shippingAddress: event.target.value }))}
              required
            />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems={{ xs: "stretch", sm: "center" }}>
              <Button
                type="button"
                variant="outlined"
                startIcon={<MyLocationOutlinedIcon />}
                onClick={handleUseCurrentLocation}
                disabled={locationLoading}
              >
                {locationLoading ? "Fetching location..." : "Use Current Location"}
              </Button>
              {mapUrl && (
                <Link href={mapUrl} target="_blank" rel="noreferrer" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
                  <RoomOutlinedIcon fontSize="small" />
                  View selected pin
                </Link>
              )}
            </Stack>
            <TextField
              label="Location label"
              value={form.locationLabel}
              onChange={(event) => setForm((prev) => ({ ...prev, locationLabel: event.target.value }))}
              helperText="Optional. This helps the admin understand your delivery pin."
            />
            <TextField
              select
              label="Payment method"
              value={form.paymentMethod}
              onChange={(event) => setForm((prev) => ({ ...prev, paymentMethod: event.target.value }))}
              required
            >
              {paymentOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <Button type="submit" variant="contained" size="large">
              Place Order
            </Button>
          </Stack>
        </Paper>
      </Grid>
      <Grid item xs={12} md={5}>
        <Paper sx={{ p: 4, borderRadius: 4 }}>
          <Typography variant="h5" gutterBottom>
            Order Summary
          </Typography>
          <Stack spacing={2}>
            {cart.items.map((item) => (
              <Stack key={item.id} direction="row" justifyContent="space-between">
                <Typography>
                  {item.productName} x {item.quantity}
                </Typography>
                <Typography fontWeight={600}>Rs. {item.subtotal}</Typography>
              </Stack>
            ))}
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">Payment</Typography>
              <Typography>{paymentOptions.find((option) => option.value === form.paymentMethod)?.label}</Typography>
            </Stack>
            {mapUrl && (
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">Pinned location</Typography>
                <Link href={mapUrl} target="_blank" rel="noreferrer">
                  Open map
                </Link>
              </Stack>
            )}
            <Typography variant="h6" sx={{ pt: 2, borderTop: "1px solid rgba(0,0,0,0.08)" }}>
              Total: Rs. {cart.totalAmount}
            </Typography>
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default CheckoutPage;
