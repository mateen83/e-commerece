# PakMart Setup Checklist

Use this checklist to track your setup progress. Check off items as you complete them.

## Phase 1: Prerequisites ✅

- [ ] Supabase account created (free tier is fine)
- [ ] Project created in Supabase
- [ ] Supabase connected to v0 UI (check Vars section)
- [ ] Environment variables visible:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`

## Phase 2: Database Setup 📊

### Create Tables
- [ ] Open Supabase SQL Editor
- [ ] Copy `00-create-tables.sql` from `DATABASE_SETUP.md`
- [ ] Run SQL script to create all tables
- [ ] Verify tables appear in "Table Editor"
  - [ ] categories
  - [ ] products
  - [ ] orders
  - [ ] cart
  - [ ] wishlist
  - [ ] shipping_addresses
  - [ ] user_profiles
  - [ ] payments
  - [ ] payment_methods
  - [ ] order_items
  - [ ] reviews_ratings

### Enable RLS & Policies
- [ ] Copy RLS section from `DATABASE_SETUP.md`
- [ ] Run "ALTER TABLE ... ENABLE ROW LEVEL SECURITY" for all tables
- [ ] Create all RLS policies
- [ ] Test that policies work:
  - [ ] Public read on products
  - [ ] Public read on categories
  - [ ] User isolation on cart
  - [ ] User isolation on orders
  - [ ] User isolation on addresses

### Seed Initial Data
- [ ] Copy seed data SQL from `DATABASE_SETUP.md`
- [ ] Run SQL to insert payment methods
- [ ] Run SQL to insert sample categories
- [ ] Verify data appears in database:
  - [ ] 5 payment methods created
  - [ ] 5+ categories created
  - [ ] Payment methods accessible in dropdown

## Phase 3: Application Testing 🧪

### Homepage
- [ ] Application loads at http://localhost:3000
- [ ] No database errors
- [ ] Setup banner displays
- [ ] Hero section visible
- [ ] Categories appear
- [ ] Featured products section shows (empty is OK)
- [ ] Features section visible
- [ ] CTA section present

### Navigation
- [ ] Header displays with logo
- [ ] Search bar functional
- [ ] User menu visible
- [ ] Cart icon shows
- [ ] Mobile menu works

### Authentication
- [ ] Navigate to `/auth/signup`
- [ ] Sign up form loads
- [ ] Create new test account
- [ ] Receive confirmation email (or skip if not configured)
- [ ] Login with test account
- [ ] User menu shows account name
- [ ] Can access protected pages
- [ ] Logout works

### Products
- [ ] Add sample products via Supabase SQL
- [ ] Homepage shows products
- [ ] `/products` page loads
- [ ] Product cards display correctly
- [ ] Product images load (or fallback shows)
- [ ] Click product to see details
- [ ] Product detail page loads
- [ ] All info displays (price, description, etc.)

### Categories
- [ ] Homepage shows categories
- [ ] Click category to browse
- [ ] Category page filters products
- [ ] Breadcrumb navigation works

### Shopping
- [ ] Add product to cart
- [ ] Cart count increases
- [ ] `/cart` page loads
- [ ] Cart items display
- [ ] Quantity can be adjusted
- [ ] Subtotal calculates correctly
- [ ] Tax (17% GST) calculates
- [ ] Total shows correctly
- [ ] Can proceed to checkout

### Checkout
- [ ] `/checkout` page loads
- [ ] Shipping address form appears
- [ ] Can select city
- [ ] Shipping cost calculates by zone
- [ ] Payment method dropdown shows 5 options
- [ ] Can select each payment method
- [ ] Order summary displays
- [ ] Can complete checkout
- [ ] Order created in database

### Orders
- [ ] Navigate to `/orders` after purchase
- [ ] Order appears in list
- [ ] Order detail shows all info
- [ ] Status shows (e.g., "pending")
- [ ] Can track order

### Account
- [ ] Navigate to `/account`
- [ ] User profile shows
- [ ] Can edit profile info
- [ ] Addresses section present
- [ ] Can add new address
- [ ] Can edit existing address
- [ ] Can delete address
- [ ] Password change works

### Admin
- [ ] Navigate to `/admin`
- [ ] Admin dashboard loads
- [ ] Shows statistics:
  - [ ] Total orders
  - [ ] Total revenue
  - [ ] Total products
  - [ ] Low stock count
- [ ] Product management works
- [ ] Can add new product
- [ ] Can edit products
- [ ] Can delete products
- [ ] Category management works
- [ ] Orders list shows all orders
- [ ] Can update order status

### Setup Guide
- [ ] Navigate to `/setup`
- [ ] Setup instructions display
- [ ] SQL script available
- [ ] Can copy script
- [ ] Links to Supabase work

## Phase 4: Data Verification 📈

- [ ] Open Supabase Table Editor
- [ ] Check each table has correct structure
- [ ] Verify indexes are created:
  - [ ] products.category_id_idx
  - [ ] products.slug_idx
  - [ ] cart.user_id_idx
  - [ ] orders.user_id_idx
  - [ ] wishlist.user_id_idx
  - [ ] And others...
- [ ] Check RLS policies enabled on all tables
- [ ] Verify sample data exists
- [ ] Test data isolation with RLS

## Phase 5: Performance 🚀

- [ ] Homepage loads in < 2 seconds
- [ ] Product search responds quickly
- [ ] Checkout completes quickly
- [ ] Images load properly
- [ ] No console errors
- [ ] Mobile version responsive
- [ ] All links work

## Phase 6: Deployment Prep 📤

- [ ] All tests passed
- [ ] No TODO comments in code
- [ ] Error handling complete
- [ ] Documentation updated
- [ ] Environment variables confirmed
- [ ] Database backups configured
- [ ] Analytics enabled

## Phase 7: Go Live 🎉

- [ ] Click "Publish" in v0 UI
- [ ] Select Vercel deployment
- [ ] Build completes successfully
- [ ] App accessible at live URL
- [ ] All features work on live site
- [ ] Database connection confirmed
- [ ] Payment methods functional
- [ ] Send test order

## Phase 8: Post-Launch 📊

- [ ] Monitor error logs
- [ ] Check user feedback
- [ ] Track analytics
- [ ] Monitor database usage
- [ ] Setup automated backups
- [ ] Configure alerts
- [ ] Plan next features

## Quick Commands Reference

### Start Development
```bash
pnpm dev
```

### Build for Production
```bash
pnpm build
pnpm start
```

### Useful Supabase URLs
- Dashboard: https://app.supabase.com
- SQL Editor: https://app.supabase.com/project/[project-id]/editor
- Table Editor: https://app.supabase.com/project/[project-id]/editor
- Auth: https://app.supabase.com/project/[project-id]/auth

## Troubleshooting Checklist

If something isn't working, check:

- [ ] Supabase project is running
- [ ] Environment variables are set correctly
- [ ] Database tables exist
- [ ] RLS policies are enabled
- [ ] Sample data was inserted
- [ ] Browser console shows errors
- [ ] Network tab shows API calls
- [ ] Supabase logs show errors
- [ ] Database has space available
- [ ] Rate limits not exceeded

## File References

- **Database Setup**: `DATABASE_SETUP.md`
- **Quick Start**: `QUICK_START.md`
- **Deployment**: `DEPLOYMENT.md`
- **Implementation Details**: `IMPLEMENTATION_GUIDE.md`
- **Project Overview**: `README.md`

## Success Criteria ✨

You're done when:
- ✅ All checkboxes above are checked
- ✅ Application running without errors
- ✅ All features tested and working
- ✅ Database properly secured with RLS
- ✅ App deployed live (or ready to deploy)
- ✅ Team is ready to launch

---

**Estimate: 30-60 minutes to complete**

Start with Phase 1, work through each phase in order, and check off as you go!
