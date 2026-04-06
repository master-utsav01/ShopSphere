import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Grid,
  MenuItem,
  Paper,
  Pagination,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../api/categoryApi";
import { getProducts } from "../api/productApi";
import ProductCard from "../components/ProductCard";
import EmptyState from "../components/EmptyState";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const initialFilters = {
  keyword: "",
  categoryId: "",
  minPrice: "",
  maxPrice: "",
  sortBy: "id",
  direction: "desc",
};

function HomePage() {
  const [productsPage, setProductsPage] = useState({ content: [] });
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();

  const loadProducts = async () => {
    try {
      const data = await getProducts({
        ...filters,
        categoryId: filters.categoryId || undefined,
        minPrice: filters.minPrice || undefined,
        maxPrice: filters.maxPrice || undefined,
        page: page - 1,
        size: 8,
      });
      setProductsPage(data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load products");
    }
  };

  useEffect(() => {
    loadProducts();
  }, [page, filters]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load categories");
      }
    };

    loadCategories();
  }, []);

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      await addItem(productId, 1);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add item to cart");
    }
  };

  return (
    <Stack spacing={4}>
      <Paper
        className="hero-gradient glass-panel stagger-in"
        data-delay="1"
        sx={{
          p: { xs: 2.5, sm: 3, md: 4 },
          borderRadius: { xs: 4, md: 5 },
          background: "linear-gradient(135deg, rgba(15,118,110,0.95) 0%, rgba(13,148,136,0.82) 55%, rgba(217,119,6,0.78) 100%)",
          color: "#fff",
          position: "relative",
        }}
      >
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={{ xs: 2, md: 3 }}>
          <Box sx={{ maxWidth: 760, position: "relative", zIndex: 1 }}>
            <Stack direction="row" spacing={1} sx={{ mb: 1.5, flexWrap: "wrap", rowGap: 1 }}>
              <Chip label="Fast checkout" sx={{ bgcolor: "rgba(255,255,255,0.16)", color: "#fff" }} />
              <Chip label="Admin-ready" sx={{ bgcolor: "rgba(255,255,255,0.16)", color: "#fff" }} />
              <Chip label="Live filters" sx={{ bgcolor: "rgba(255,255,255,0.16)", color: "#fff" }} />
            </Stack>
            <Typography
              variant="h2"
              gutterBottom
              className="section-title"
              sx={{ lineHeight: 1.08, fontSize: { xs: "2rem", sm: "2.5rem", md: "3.25rem" }, mb: 1.2 }}
            >
              Curated commerce for modern teams and homes.
            </Typography>
            <Typography sx={{ maxWidth: 680, opacity: 0.92, fontSize: { xs: "1rem", md: "1.08rem" } }}>
              Browse featured products, filter by category and price, manage your cart, and complete checkout through a clean full-stack flow.
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {error && <Alert severity="error">{error}</Alert>}

      <Paper className="glass-panel stagger-in" data-delay="2" sx={{ p: { xs: 2, md: 2.5 }, borderRadius: { xs: 4, md: 5 } }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} lg={3}>
            <TextField
              fullWidth
              label="Search products"
              size="small"
              value={filters.keyword}
              onChange={(event) => setFilters((prev) => ({ ...prev, keyword: event.target.value }))}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={2}>
            <TextField
              select
              fullWidth
              label="Category"
              size="small"
              value={filters.categoryId}
              onChange={(event) => setFilters((prev) => ({ ...prev, categoryId: event.target.value }))}
            >
              <MenuItem value="">All</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6} sm={4} lg={2}>
            <TextField
              fullWidth
              type="number"
              label="Min price"
              size="small"
              value={filters.minPrice}
              onChange={(event) => setFilters((prev) => ({ ...prev, minPrice: event.target.value }))}
            />
          </Grid>
          <Grid item xs={6} sm={4} lg={2}>
            <TextField
              fullWidth
              type="number"
              label="Max price"
              size="small"
              value={filters.maxPrice}
              onChange={(event) => setFilters((prev) => ({ ...prev, maxPrice: event.target.value }))}
            />
          </Grid>
          <Grid item xs={8} sm={4} lg={2}>
            <TextField
              select
              fullWidth
              label="Sort by"
              size="small"
              value={filters.sortBy}
              onChange={(event) => setFilters((prev) => ({ ...prev, sortBy: event.target.value }))}
            >
              <MenuItem value="id">Newest</MenuItem>
              <MenuItem value="price">Price</MenuItem>
              <MenuItem value="name">Name</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={4} lg={1}>
            <Button fullWidth variant="outlined" size="small" sx={{ height: "100%", minHeight: 40 }} onClick={() => setFilters(initialFilters)}>
              Reset
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {productsPage.content?.length ? (
        <>
          <Grid container spacing={2.2}>
            {productsPage.content.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={product.id} className="stagger-in" data-delay={(product.id % 4) + 1}>
                <ProductCard product={product} onAddToCart={handleAddToCart} />
              </Grid>
            ))}
          </Grid>
          <Box display="flex" justifyContent="center">
            <Pagination
              count={productsPage.totalPages || 1}
              page={page}
              color="primary"
              onChange={(_, nextPage) => setPage(nextPage)}
            />
          </Box>
        </>
      ) : (
        <EmptyState title="No products found" description="Try changing your filters or search keyword." />
      )}
    </Stack>
  );
}

export default HomePage;
