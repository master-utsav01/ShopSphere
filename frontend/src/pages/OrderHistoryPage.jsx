import { useEffect, useState } from "react";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import { Alert, Chip, Link, Pagination, Paper, Stack, Typography } from "@mui/material";
import { getOrderHistory } from "../api/orderApi";
import EmptyState from "../components/EmptyState";

function OrderHistoryPage() {
  const [ordersPage, setOrdersPage] = useState({ content: [] });
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getOrderHistory({ page: page - 1, size: 5 });
        setOrdersPage(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load order history");
      }
    };

    loadOrders();
  }, [page]);

  if (!ordersPage.content?.length && !error) {
    return <EmptyState title="No orders yet" description="Your completed purchases will show up here." />;
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Order History</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {ordersPage.content?.map((order) => (
        <Paper key={order.id} sx={{ p: 3, borderRadius: 4 }}>
          {(() => {
            const mapUrl =
              order.latitude && order.longitude
                ? `https://www.google.com/maps?q=${order.latitude},${order.longitude}`
                : "";

            return (
              <>
          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2} sx={{ mb: 2 }}>
            <div>
              <Typography variant="h6">Order #{order.id}</Typography>
              <Typography color="text.secondary">{new Date(order.createdAt).toLocaleString()}</Typography>
              <Typography variant="body2" color="text.secondary">
                Payment: {order.paymentMethod.replaceAll("_", " ")}
              </Typography>
              {order.locationLabel && (
                <Typography variant="body2" color="text.secondary">
                  Location: {order.locationLabel}
                </Typography>
              )}
              {mapUrl && (
                <Link href={mapUrl} target="_blank" rel="noreferrer" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                  <OpenInNewOutlinedIcon fontSize="inherit" />
                  Open pinned location
                </Link>
              )}
            </div>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip label={order.status} color="primary" />
              <Typography variant="h6">Rs. {order.totalAmount}</Typography>
            </Stack>
          </Stack>
          <Stack spacing={1.2}>
            {order.items.map((item) => (
              <Stack key={item.id} direction="row" justifyContent="space-between">
                <Typography>
                  {item.productName} x {item.quantity}
                </Typography>
                <Typography>Rs. {item.subtotal}</Typography>
              </Stack>
            ))}
          </Stack>
              </>
            );
          })()}
        </Paper>
      ))}
      <Stack alignItems="center">
        <Pagination count={ordersPage.totalPages || 1} page={page} onChange={(_, nextPage) => setPage(nextPage)} />
      </Stack>
    </Stack>
  );
}

export default OrderHistoryPage;
