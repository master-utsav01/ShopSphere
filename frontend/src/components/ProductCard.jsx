import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

function ProductCard({ product, onAddToCart }) {
  return (
    <Card
      className="floating-card glass-panel"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        borderRadius: 4,
      }}
    >
      <CardMedia
        component="img"
        height="170"
        image={product.imageUrl || "https://via.placeholder.com/400x300?text=Product"}
        alt={product.name}
        sx={{
          objectFit: "cover",
          transition: "transform 320ms ease",
          ".floating-card:hover &": {
            transform: "scale(1.02)",
          },
        }}
      />
      <CardContent sx={{ flexGrow: 1, p: 1.4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.8 }}>
          <Chip label={product.category?.name} color="primary" variant="outlined" size="small" />
          <Typography variant="subtitle2" color="secondary.main" fontWeight={700}>
            Rs. {product.price}
          </Typography>
        </Stack>
        <Typography variant="h6" gutterBottom className="section-title" sx={{ fontSize: "0.96rem", mb: 0.6 }}>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ minHeight: 34, fontSize: "0.84rem", lineHeight: 1.45 }}>
          {product.description}
        </Typography>
      </CardContent>
      <CardActions sx={{ p: 1.4, pt: 0, justifyContent: "space-between" }}>
        <Button
          component={RouterLink}
          to={`/products/${product.id}`}
          startIcon={<VisibilityOutlinedIcon />}
          size="small"
          sx={{ borderRadius: "999px", px: 1.2, minWidth: 0 }}
        >
          Details
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<ShoppingBagOutlinedIcon />}
          onClick={() => onAddToCart(product.id)}
          size="small"
          sx={{
            borderRadius: "999px",
            px: 1.4,
            minWidth: 0,
            boxShadow: "0 8px 16px rgba(15,118,110,0.18)",
            "&:hover": {
              boxShadow: "0 10px 18px rgba(15,118,110,0.22)",
            },
          }}
        >
          Add
        </Button>
      </CardActions>
    </Card>
  );
}

export default ProductCard;
