INSERT IGNORE INTO app_users (id, full_name, email, password, role, created_at)
VALUES
    (1, 'Admin User', 'admin@shop.com', '{noop}Admin@123', 'ADMIN', CURRENT_TIMESTAMP),
    (2, 'Demo Customer', 'user@shop.com', '{noop}User@123', 'USER', CURRENT_TIMESTAMP);

INSERT IGNORE INTO carts (id, user_id)
VALUES
    (1, 1),
    (2, 2);

INSERT IGNORE INTO categories (id, name, description, created_at)
VALUES
    (1, 'Electronics', 'Smart devices and everyday gadgets', CURRENT_TIMESTAMP),
    (2, 'Fashion', 'Trending wearables and accessories', CURRENT_TIMESTAMP),
    (3, 'Home', 'Essentials for your living space', CURRENT_TIMESTAMP);

INSERT IGNORE INTO products (id, name, description, price, stock_quantity, image_url, active, category_id, created_at, updated_at)
VALUES
    (1, 'Noise Cancelling Headphones', 'Wireless over-ear headphones with rich sound and long battery life.', 8999.00, 20, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e', true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (2, 'Smart Watch Pro', 'Fitness focused smart watch with AMOLED display and heart-rate tracking.', 12999.00, 15, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30', true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (3, 'Classic Denim Jacket', 'Comfortable denim jacket for casual and semi-formal styling.', 3499.00, 30, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab', true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (4, 'Minimal Table Lamp', 'Warm ambient lamp for study desks and bedside corners.', 1999.00, 25, 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85', true, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (5, 'Ergonomic Office Chair', 'Supportive office chair with adjustable height and lumbar support.', 15999.00, 8, 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455', true, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
