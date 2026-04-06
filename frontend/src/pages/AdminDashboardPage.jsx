import { useEffect, useState } from "react";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  Link,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  TextField,
  Typography,
} from "@mui/material";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../api/categoryApi";
import { createAdminUser, getAdminOrders, getAdminSummary, getAdminUsers, updateAdminOrderStatus } from "../api/adminApi";
import { createProduct, deleteProduct, getProducts, updateProduct } from "../api/productApi";

const emptyCategory = { id: null, name: "", description: "" };
const emptyAdmin = { fullName: "", email: "", password: "" };
const emptyProduct = {
  id: null,
  name: "",
  description: "",
  price: "",
  stockQuantity: "",
  imageUrl: "",
  active: true,
  categoryId: "",
};

const orderStatuses = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [adminForm, setAdminForm] = useState(emptyAdmin);
  const [categoryForm, setCategoryForm] = useState(emptyCategory);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const [summaryResponse, categoriesResponse, productsResponse, usersResponse, ordersResponse] = await Promise.all([
        getAdminSummary(),
        getCategories(),
        getProducts({ page: 0, size: 50, sortBy: "id", direction: "desc" }),
        getAdminUsers({ page: 0, size: 25 }),
        getAdminOrders({ page: 0, size: 25 }),
      ]);

      setSummary(summaryResponse);
      setCategories(categoriesResponse);
      setProducts(productsResponse.content);
      setUsers(usersResponse.content);
      setOrders(ordersResponse.content);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load admin dashboard data");
    }
  };

  const handleCreateAdmin = async (event) => {
    event.preventDefault();
    try {
      await createAdminUser(adminForm);
      setMessage(`Admin ${adminForm.email} created successfully.`);
      setAdminForm(emptyAdmin);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create admin account");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCategorySubmit = async (event) => {
    event.preventDefault();
    try {
      if (categoryForm.id) {
        await updateCategory(categoryForm.id, {
          name: categoryForm.name,
          description: categoryForm.description,
        });
        setMessage("Category updated successfully.");
      } else {
        await createCategory({
          name: categoryForm.name,
          description: categoryForm.description,
        });
        setMessage("Category created successfully.");
      }
      setCategoryForm(emptyCategory);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save category");
    }
  };

  const handleProductSubmit = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        ...productForm,
        price: Number(productForm.price),
        stockQuantity: Number(productForm.stockQuantity),
        categoryId: Number(productForm.categoryId),
      };
      if (productForm.id) {
        await updateProduct(productForm.id, payload);
        setMessage("Product updated successfully.");
      } else {
        await createProduct(payload);
        setMessage("Product created successfully.");
      }
      setProductForm(emptyProduct);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save product");
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await updateAdminOrderStatus(orderId, status);
      setMessage(`Order #${orderId} updated to ${status}.`);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update order status");
    }
  };

  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Admin Control Center</Typography>
        <Typography color="text.secondary">
          Monitor the whole store, add inventory, manage categories, review customers, and control order status in one place.
        </Typography>
      </div>
      {message && <Alert severity="success">{message}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}

      <Paper sx={{ borderRadius: 4 }}>
        <Tabs
          value={activeTab}
          onChange={(_, nextValue) => setActiveTab(nextValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Overview" value="overview" />
          <Tab label="Orders" value="orders" />
          <Tab label="Customers" value="customers" />
          <Tab label="Inventory" value="inventory" />
        </Tabs>
      </Paper>

      {activeTab === "overview" && (
        <Grid container spacing={3}>
          {[
            { label: "Total Users", value: summary?.totalUsers ?? 0 },
            { label: "Total Products", value: summary?.totalProducts ?? 0 },
            { label: "Total Orders", value: summary?.totalOrders ?? 0 },
            { label: "Revenue", value: `Rs. ${summary?.totalRevenue ?? 0}` },
            { label: "Pending Orders", value: summary?.pendingOrders ?? 0 },
            { label: "Delivered Orders", value: summary?.deliveredOrders ?? 0 },
          ].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.label}>
              <Card sx={{ borderRadius: 4 }}>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    {item.label}
                  </Typography>
                  <Typography variant="h4">{item.value}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {activeTab === "orders" && (
        <Paper sx={{ p: 3, borderRadius: 4 }}>
          <Typography variant="h6" gutterBottom>
            All Orders
          </Typography>
          <Box sx={{ overflow: "auto" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Payment</TableCell>
                  <TableCell>Delivery</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Items</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => {
                  const mapUrl =
                    order.latitude && order.longitude
                      ? `https://www.google.com/maps?q=${order.latitude},${order.longitude}`
                      : "";

                  return (
                    <TableRow key={order.id}>
                      <TableCell>#{order.id}</TableCell>
                      <TableCell>
                        <Typography fontWeight={600}>{order.userName}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {order.userEmail}
                        </Typography>
                      </TableCell>
                      <TableCell>Rs. {order.totalAmount}</TableCell>
                      <TableCell>{order.paymentMethod.replaceAll("_", " ")}</TableCell>
                      <TableCell sx={{ minWidth: 240 }}>
                        <Typography variant="body2">{order.shippingAddress}</Typography>
                        {order.locationLabel && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                            {order.locationLabel}
                          </Typography>
                        )}
                        {mapUrl && (
                          <Link href={mapUrl} target="_blank" rel="noreferrer" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                            <OpenInNewOutlinedIcon fontSize="inherit" />
                            Open map
                          </Link>
                        )}
                      </TableCell>
                      <TableCell sx={{ minWidth: 180 }}>
                        <TextField
                          select
                          size="small"
                          fullWidth
                          value={order.status}
                          onChange={(event) => handleUpdateOrderStatus(order.id, event.target.value)}
                        >
                          {orderStatuses.map((status) => (
                            <MenuItem key={status} value={status}>
                              {status}
                            </MenuItem>
                          ))}
                        </TextField>
                      </TableCell>
                      <TableCell sx={{ minWidth: 220 }}>
                        <Stack spacing={0.5}>
                          {order.items.map((item) => (
                            <Typography key={item.id} variant="body2">
                              {item.productName} x {item.quantity}
                            </Typography>
                          ))}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      )}

      {activeTab === "customers" && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 4 }}>
              <Typography variant="h6" gutterBottom>
                Add New Admin
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Create multiple admin accounts with their own email and password.
              </Typography>
              <Stack spacing={2} component="form" onSubmit={handleCreateAdmin}>
                <TextField
                  label="Full name"
                  value={adminForm.fullName}
                  onChange={(event) => setAdminForm((prev) => ({ ...prev, fullName: event.target.value }))}
                  required
                />
                <TextField
                  label="Admin email"
                  type="email"
                  value={adminForm.email}
                  onChange={(event) => setAdminForm((prev) => ({ ...prev, email: event.target.value }))}
                  required
                />
                <TextField
                  label="Password"
                  type="password"
                  helperText="Use at least 8 characters."
                  value={adminForm.password}
                  onChange={(event) => setAdminForm((prev) => ({ ...prev, password: event.target.value }))}
                  required
                />
                <Button type="submit" variant="contained">
                  Create Admin
                </Button>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, borderRadius: 4 }}>
              <Typography variant="h6" gutterBottom>
                Customers and Admin Users
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Orders</TableCell>
                    <TableCell>Joined</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.fullName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{user.totalOrders}</TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
        </Grid>
      )}

      {activeTab === "inventory" && (
        <Stack spacing={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, borderRadius: 4 }}>
                <Typography variant="h6" gutterBottom>
                  {categoryForm.id ? "Update Category" : "Create Category"}
                </Typography>
                <Stack spacing={2} component="form" onSubmit={handleCategorySubmit}>
                  <TextField
                    label="Category name"
                    value={categoryForm.name}
                    onChange={(event) => setCategoryForm((prev) => ({ ...prev, name: event.target.value }))}
                    required
                  />
                  <TextField
                    label="Description"
                    multiline
                    minRows={3}
                    value={categoryForm.description}
                    onChange={(event) => setCategoryForm((prev) => ({ ...prev, description: event.target.value }))}
                  />
                  <Stack direction="row" spacing={1}>
                    <Button type="submit" variant="contained">
                      {categoryForm.id ? "Update" : "Create"}
                    </Button>
                    <Button variant="outlined" onClick={() => setCategoryForm(emptyCategory)}>
                      Reset
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            </Grid>

            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, borderRadius: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Categories
                </Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell>{category.name}</TableCell>
                        <TableCell>{category.description}</TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => setCategoryForm(category)}>
                            <EditOutlinedIcon />
                          </IconButton>
                          <IconButton color="error" onClick={() => deleteCategory(category.id).then(loadData)}>
                            <DeleteOutlineOutlinedIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </Grid>
          </Grid>

          <Divider />

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, borderRadius: 4 }}>
                <Typography variant="h6" gutterBottom>
                  {productForm.id ? "Update Product" : "Add New Product"}
                </Typography>
                <Stack spacing={2} component="form" onSubmit={handleProductSubmit}>
                  <TextField
                    label="Product name"
                    value={productForm.name}
                    onChange={(event) => setProductForm((prev) => ({ ...prev, name: event.target.value }))}
                    required
                  />
                  <TextField
                    label="Description"
                    multiline
                    minRows={3}
                    value={productForm.description}
                    onChange={(event) => setProductForm((prev) => ({ ...prev, description: event.target.value }))}
                    required
                  />
                  <TextField
                    label="Price"
                    type="number"
                    value={productForm.price}
                    onChange={(event) => setProductForm((prev) => ({ ...prev, price: event.target.value }))}
                    required
                  />
                  <TextField
                    label="Stock quantity"
                    type="number"
                    value={productForm.stockQuantity}
                    onChange={(event) => setProductForm((prev) => ({ ...prev, stockQuantity: event.target.value }))}
                    required
                  />
                  <TextField
                    label="Image URL"
                    value={productForm.imageUrl}
                    onChange={(event) => setProductForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
                  />
                  <TextField
                    select
                    label="Category"
                    value={productForm.categoryId}
                    onChange={(event) => setProductForm((prev) => ({ ...prev, categoryId: event.target.value }))}
                    required
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    label="Active"
                    value={String(productForm.active)}
                    onChange={(event) => setProductForm((prev) => ({ ...prev, active: event.target.value === "true" }))}
                  >
                    <MenuItem value="true">True</MenuItem>
                    <MenuItem value="false">False</MenuItem>
                  </TextField>
                  <Stack direction="row" spacing={1}>
                    <Button type="submit" variant="contained">
                      {productForm.id ? "Update" : "Add Item"}
                    </Button>
                    <Button variant="outlined" onClick={() => setProductForm(emptyProduct)}>
                      Reset
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            </Grid>

            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, borderRadius: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Products
                </Typography>
                <Box sx={{ maxHeight: 620, overflow: "auto" }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Stock</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{product.category?.name}</TableCell>
                          <TableCell>Rs. {product.price}</TableCell>
                          <TableCell>{product.stockQuantity}</TableCell>
                          <TableCell align="right">
                            <IconButton
                              onClick={() =>
                                setProductForm({
                                  ...product,
                                  categoryId: product.category?.id,
                                })
                              }
                            >
                              <EditOutlinedIcon />
                            </IconButton>
                            <IconButton color="error" onClick={() => deleteProduct(product.id).then(loadData)}>
                              <DeleteOutlineOutlinedIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Stack>
      )}
    </Stack>
  );
}

export default AdminDashboardPage;
