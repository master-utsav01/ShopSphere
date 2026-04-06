import { useState } from "react";
import { Alert, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RegisterPage() {
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const buildRegistrationError = (err) => {
    if (err.response?.data?.message) {
      return err.response.data.message;
    }

    if (err.code === "ERR_NETWORK") {
      return "Cannot reach the backend. Make sure Spring Boot is running and CORS is enabled for the frontend URL.";
    }

    return "Registration failed. Try a different email address and check that the backend is running.";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(buildRegistrationError(err));
    }
  };

  return (
    <Paper sx={{ maxWidth: 520, mx: "auto", p: 4, borderRadius: 5 }}>
      <Stack spacing={3} component="form" onSubmit={handleSubmit}>
        <div>
          <Typography variant="h4" gutterBottom>
            Create your account
          </Typography>
          <Typography color="text.secondary">Register to save your cart, place orders, and view purchase history.</Typography>
        </div>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="Full name"
          value={form.fullName}
          onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
          required
        />
        <TextField
          label="Email"
          type="email"
          value={form.email}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          helperText="Use a fresh email. Demo addresses like admin@shop.com and user@shop.com already exist."
          required
        />
        <TextField
          label="Password"
          type="password"
          value={form.password}
          onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
          helperText="Use at least 8 characters."
          required
        />
        <Button type="submit" variant="contained" size="large" disabled={loading}>
          Register
        </Button>
        <Typography color="text.secondary">
          Already have an account?{" "}
          <Typography component={RouterLink} to="/login" color="primary" sx={{ textDecoration: "none", fontWeight: 600 }}>
            Sign in
          </Typography>
        </Typography>
      </Stack>
    </Paper>
  );
}

export default RegisterPage;
