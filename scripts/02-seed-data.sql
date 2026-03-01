-- Insert default payment methods if they don't exist
INSERT INTO public.payment_methods (name, code, description, enabled) VALUES
  ('Cash on Delivery (COD)', 'COD', 'Pay when your order arrives', TRUE),
  ('JazzCash', 'JAZZCASH', 'Mobile wallet payment via JazzCash', TRUE),
  ('EasyPaisa', 'EASYPAISA', 'Mobile wallet payment via EasyPaisa', TRUE),
  ('Bank Transfer', 'BANK', 'Direct bank transfer to our account', TRUE),
  ('Card Payment', 'CARD', 'Visa/Mastercard international payments', TRUE)
ON CONFLICT (code) DO NOTHING;

-- Insert sample categories for Pakistan market
INSERT INTO public.categories (name, slug, description) VALUES
  ('Electronics', 'electronics', 'Mobile phones, laptops, and accessories'),
  ('Fashion & Apparel', 'fashion-apparel', 'Clothing, shoes, and fashion items'),
  ('Home & Kitchen', 'home-kitchen', 'Home appliances and kitchen items'),
  ('Books & Media', 'books-media', 'Books, magazines, and media'),
  ('Sports & Outdoors', 'sports-outdoors', 'Sports equipment and outdoor gear'),
  ('Beauty & Personal Care', 'beauty-personal-care', 'Cosmetics and personal care products'),
  ('Toys & Games', 'toys-games', 'Toys and games for all ages'),
  ('Groceries', 'groceries', 'Food and grocery items')
ON CONFLICT (slug) DO NOTHING;
