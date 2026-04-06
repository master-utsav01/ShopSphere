import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import DashboardCustomizeOutlinedIcon from "@mui/icons-material/DashboardCustomizeOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import {
  AppBar,
  Badge,
  Box,
  Button,
  Container,
  Stack,
  Tooltip,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const cartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleAdminAccess = () => {
    if (isAdmin) {
      navigate("/admin");
      return;
    }

    if (isAuthenticated) {
      logout();
    }
    navigate("/login?mode=admin");
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "linear-gradient(90deg, rgba(15,118,110,0.92), rgba(13,148,136,0.84))",
        backdropFilter: "blur(18px)",
        borderBottom: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "0 12px 30px rgba(16,42,43,0.12)",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            justifyContent: "space-between",
            py: 1,
            gap: 1.5,
            flexWrap: { xs: "wrap", md: "nowrap" },
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.2} sx={{ minWidth: 0 }}>
            <Box
              sx={{
                width: { xs: 38, md: 42 },
                height: { xs: 38, md: 42 },
                display: "grid",
                placeItems: "center",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.12)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18)",
              }}
            >
              <StorefrontOutlinedIcon />
            </Box>
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                color: "#fff",
                textDecoration: "none",
                fontWeight: 700,
                letterSpacing: 0.2,
                fontSize: { xs: "1.05rem", md: "1.2rem" },
              }}
            >
              ShopSphere
            </Typography>
          </Stack>

          <Stack
            direction="row"
            spacing={{ xs: 0.6, md: 1.2 }}
            alignItems="center"
            sx={{ flexWrap: "wrap", justifyContent: { xs: "flex-end", md: "flex-start" } }}
          >
            {!isAuthenticated && (
              <Button color="inherit" component={RouterLink} to="/" size="small">
                Home
              </Button>
            )}
            {isAuthenticated && !isAdmin && (
              <>
                <Button color="inherit" component={RouterLink} to="/" size="small">
                  Home
                </Button>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/orders"
                  size="small"
                  startIcon={<ReceiptLongOutlinedIcon />}
                  sx={{ ".MuiButton-startIcon": { mr: { xs: 0, md: 1 } } }}
                >
                  Orders
                </Button>
                <Button color="inherit" component={RouterLink} to="/cart" size="small" sx={{ minWidth: { xs: 40, md: 64 } }}>
                  <Badge badgeContent={cartCount} color="secondary">
                    <ShoppingCartOutlinedIcon />
                  </Badge>
                </Button>
              </>
            )}
            {isAuthenticated && isAdmin && (
              <Button
                color="inherit"
                component={RouterLink}
                to="/admin"
                size="small"
                startIcon={<DashboardCustomizeOutlinedIcon />}
              >
                Admin Dashboard
              </Button>
            )}
            {!isAuthenticated && (
              <Tooltip title="Use the admin demo account to manage products and orders">
                <Button color="inherit" onClick={handleAdminAccess} size="small" startIcon={<DashboardCustomizeOutlinedIcon />}>
                  Admin Access
                </Button>
              </Tooltip>
            )}
            {isAuthenticated ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: { xs: 0, md: 0.5 } }}>
                <Typography
                  variant="body2"
                  sx={{
                    display: { xs: "none", md: "block" },
                    px: 1.2,
                    py: 0.55,
                    borderRadius: "999px",
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.14)",
                  }}
                >
                  {user?.fullName}
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleLogout}
                  sx={{
                    borderRadius: "999px",
                    px: 2,
                    minWidth: { xs: 88, md: 96 },
                    boxShadow: "0 10px 22px rgba(217,119,6,0.22)",
                    transition: "transform 180ms ease, box-shadow 180ms ease",
                    "&:hover": {
                      transform: "translateY(-1px)",
                      boxShadow: "0 14px 24px rgba(217,119,6,0.28)",
                    },
                  }}
                >
                  Logout
                </Button>
              </Box>
            ) : (
              <>
                <Button color="inherit" component={RouterLink} to="/login" size="small">
                  Login
                </Button>
                <Button variant="contained" color="secondary" component={RouterLink} to="/register" size="small" sx={{ borderRadius: "999px" }}>
                  Register
                </Button>
              </>
            )}
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
