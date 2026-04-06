import { useState } from "react";
import { Alert, Button, Divider, Paper, Stack, TextField, Typography } from "@mui/material";
import { Link as RouterLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const adminMode = searchParams.get("mode") === "admin";

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await login(form);
      navigate(location.state?.from || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const handleDemoLogin = async (credentials) => {
    setError("");
    try {
      await login(credentials);
      navigate(credentials.email === "admin@shop.com" ? "/admin" : "/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <Paper sx={{ maxWidth: 520, mx: "auto", p: 4, borderRadius: 5 }}>
      <Stack spacing={3} component="form" onSubmit={handleSubmit}>
        <div>
          <Typography variant="h4" gutterBottom>
            {adminMode ? "Admin Sign In" : "Welcome back"}
          </Typography>
          <Typography color="text.secondary">
            {adminMode
              ? "Sign in with the admin account to open the dashboard, add products, delete products, and manage orders."
              : "Use your account to continue shopping and manage orders."}
          </Typography>
        </div>
        {adminMode && (
          <Alert severity="info">
            Demo admin account: <strong>admin@shop.com</strong> / <strong>Admin@123</strong>
          </Alert>
        )}
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="Email"
          type="email"
          value={form.email}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          required
        />
        <TextField
          label="Password"
          type="password"
          value={form.password}
          onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
          required
        />
        <Button type="submit" variant="contained" size="large" disabled={loading}>
          Login
        </Button>
        <Divider>Quick access</Divider>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
          <Button
            type="button"
            variant="outlined"
            onClick={() =>
              handleDemoLogin({
                email: "admin@shop.com",
                password: "Admin@123",
              })
            }
            disabled={loading}
          >
            Login as Admin
          </Button>
          <Button
            type="button"
            variant="outlined"
            onClick={() =>
              handleDemoLogin({
                email: "user@shop.com",
                password: "User@123",
              })
            }
            disabled={loading}
          >
            Login as User
          </Button>
        </Stack>
        <Typography color="text.secondary">
          New here?{" "}
          <Typography component={RouterLink} to="/register" color="primary" sx={{ textDecoration: "none", fontWeight: 600 }}>
            Create an account
          </Typography>
        </Typography>
      </Stack>
    </Paper>
  );
}

export default LoginPage;
