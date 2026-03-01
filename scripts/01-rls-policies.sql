-- RLS Policies for cart table
DROP POLICY IF EXISTS "Users can view their own cart" ON public.cart;
DROP POLICY IF EXISTS "Users can insert into their own cart" ON public.cart;
DROP POLICY IF EXISTS "Users can update their own cart" ON public.cart;
DROP POLICY IF EXISTS "Users can delete from their own cart" ON public.cart;

CREATE POLICY "Users can view their own cart" ON public.cart
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their own cart" ON public.cart
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart" ON public.cart
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own cart" ON public.cart
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for orders table
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;

CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for shipping_addresses table
DROP POLICY IF EXISTS "Users can view their own addresses" ON public.shipping_addresses;
DROP POLICY IF EXISTS "Users can insert addresses" ON public.shipping_addresses;
DROP POLICY IF EXISTS "Users can update their own addresses" ON public.shipping_addresses;
DROP POLICY IF EXISTS "Users can delete their own addresses" ON public.shipping_addresses;

CREATE POLICY "Users can view their own addresses" ON public.shipping_addresses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert addresses" ON public.shipping_addresses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own addresses" ON public.shipping_addresses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own addresses" ON public.shipping_addresses
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for wishlist table
DROP POLICY IF EXISTS "Users can view their own wishlist" ON public.wishlist;
DROP POLICY IF EXISTS "Users can insert into their wishlist" ON public.wishlist;
DROP POLICY IF EXISTS "Users can delete from their wishlist" ON public.wishlist;

CREATE POLICY "Users can view their own wishlist" ON public.wishlist
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their wishlist" ON public.wishlist
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from their wishlist" ON public.wishlist
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for reviews table
DROP POLICY IF EXISTS "Users can view reviews" ON public.reviews_ratings;
DROP POLICY IF EXISTS "Users can create their own reviews" ON public.reviews_ratings;
DROP POLICY IF EXISTS "Users can update their own reviews" ON public.reviews_ratings;
DROP POLICY IF EXISTS "Users can delete their own reviews" ON public.reviews_ratings;

CREATE POLICY "Users can view reviews" ON public.reviews_ratings
  FOR SELECT USING (true);

CREATE POLICY "Users can create their own reviews" ON public.reviews_ratings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON public.reviews_ratings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" ON public.reviews_ratings
  FOR DELETE USING (auth.uid() = user_id);
