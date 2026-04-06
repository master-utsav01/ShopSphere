import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import {
  Alert,
  Button,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import { useCart } from "../context/CartContext";

function CartPage() {
  const { cart, updateItem, removeItem, loading } = useCart();

  if (!cart?.items?.length) {
    return <EmptyState title="Your cart is empty" description="Browse products and add something you love." />;
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Shopping Cart</Typography>
      {loading && <Alert severity="info">Updating cart...</Alert>}
      <Paper sx={{ borderRadius: 4, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Subtotal</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cart.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <img
                      src={item.imageUrl || "https://via.placeholder.com/90x90?text=Item"}
                      alt={item.productName}
                      style={{ width: "72px", height: "72px", objectFit: "cover", borderRadius: "16px" }}
                    />
                    <Typography>{item.productName}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>Rs. {item.price}</TableCell>
                <TableCell>
                  <TextField
                    select
                    size="small"
                    value={item.quantity}
                    onChange={(event) => updateItem(item.id, Number(event.target.value))}
                    sx={{ width: 100 }}
                  >
                    {Array.from({ length: 10 }, (_, index) => index + 1).map((qty) => (
                      <MenuItem key={qty} value={qty}>
                        {qty}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>
                <TableCell>Rs. {item.subtotal}</TableCell>
                <TableCell align="right">
                  <IconButton color="error" onClick={() => removeItem(item.id)}>
                    <DeleteOutlineOutlinedIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Typography variant="overline">Total</Typography>
          <Typography variant="h4">Rs. {cart.totalAmount}</Typography>
        </div>
        <Button variant="contained" component={RouterLink} to="/checkout">
          Proceed to Checkout
        </Button>
      </Paper>
    </Stack>
  );
}

export default CartPage;
