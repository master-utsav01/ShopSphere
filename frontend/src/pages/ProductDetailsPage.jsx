import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Chip,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById } from "../api/productApi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function ProductDetailsPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProductById(productId);
        setProduct(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load product");
      }
    };

    loadProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      await addItem(product.id, Number(quantity));
      navigate("/cart");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add item to cart");
    }
  };

  if (!product) {
    return <Paper sx={{ p: 4 }}>Loading product...</Paper>;
  }

  return (
    <Paper sx={{ p: 4, borderRadius: 5 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <img
            src={product.imageUrl || "https://via.placeholder.com/600x420?text=Product"}
            alt={product.name}
            style={{ width: "100%", borderRadius: "24px", objectFit: "cover", maxHeight: "460px" }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack spacing={2.5}>
            {error && <Alert severity="error">{error}</Alert>}
            <Chip label={product.category?.name} color="primary" variant="outlined" sx={{ width: "fit-content" }} />
            <Typography variant="h4">{product.name}</Typography>
            <Typography variant="h5" color="secondary.main">
              Rs. {product.price}
            </Typography>
            <Typography color="text.secondary">{product.description}</Typography>
            <Typography>Available stock: {product.stockQuantity}</Typography>
            <TextField
              select
              label="Quantity"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              sx={{ maxWidth: 180 }}
            >
              {Array.from({ length: Math.min(product.stockQuantity, 10) }, (_, index) => index + 1).map((qty) => (
                <MenuItem key={qty} value={qty}>
                  {qty}
                </MenuItem>
              ))}
            </TextField>
            <Button variant="contained" size="large" onClick={handleAddToCart}>
              Add to cart
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default ProductDetailsPage;
