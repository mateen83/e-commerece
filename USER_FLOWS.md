# PakMart User Flows

This document shows the complete user journeys through the PakMart application.

## 🛍️ Customer Journey: Shopping & Checkout

```
START
  ↓
[Homepage] / 
  ├─ Browse Featured Products
  ├─ View Categories
  └─ Search Products
  ↓
[Products Page] /products
  ├─ Sort by Price/Rating
  ├─ Filter by Category
  └─ Search Results
  ↓
[Product Detail] /products/[slug]
  ├─ View Images
  ├─ Read Description
  ├─ Check Price & Stock
  ├─ Read Reviews
  └─ View Related Products
  ↓
[Decision] Add to Cart?
  ├─ NO → Continue Shopping (back to products)
  └─ YES ↓
     [Add to Cart] 
       ├─ Select Quantity
       └─ Confirm
     ↓
[Notification] Item Added
     ├─ Continue Shopping
     └─ View Cart
     ↓
[Shopping Cart] /cart
  ├─ Review Items
  ├─ Adjust Quantities
  ├─ Remove Items
  ├─ See Subtotal
  └─ Proceed to Checkout
  ↓
[Authentication Check]
  ├─ Logged In? → Continue to Checkout
  └─ Not Logged In?
     ├─ [Login] /auth/login
     └─ [Sign Up] /auth/signup
        ↓
[Enter Email & Password]
  ↓
[Email Confirmation] (optional)
  ↓
[Checkout] /checkout
  ├─ Step 1: Shipping Address
  │  ├─ Select Existing Address
  │  └─ Add New Address
  │     ├─ Full Name
  │     ├─ Phone Number
  │     ├─ Street Address
  │     ├─ City (Zone-based)
  │     └─ Postal Code
  │     ↓
  │     [Shipping Cost Calculated by Zone]
  │
  ├─ Step 2: Payment Method
  │  ├─ Cash on Delivery (COD)
  │  ├─ JazzCash
  │  ├─ EasyPaisa
  │  ├─ Bank Transfer
  │  └─ Credit/Debit Card
  │
  └─ Step 3: Review Order
     ├─ Order Summary
     ├─ Item List with Prices
     ├─ Subtotal (PKR)
     ├─ Tax 17% GST (PKR)
     ├─ Shipping Cost (PKR)
     ├─ Total (PKR)
     └─ Confirm Purchase
     ↓
[Processing Order]
  ↓
[Order Created]
  ↓
[Confirmation] /order-confirmation
  ├─ Order Number
  ├─ Estimated Delivery
  ├─ Tracking Info
  └─ Email Confirmation Sent
  ↓
[Order Tracking] /orders
  ├─ View Order Status
  ├─ Track Shipment
  └─ Contact Support
  ↓
END
```

## 👤 Customer Journey: Account Management

```
START
  ↓
[Sign Up] /auth/signup
  ├─ Enter Email
  ├─ Create Password
  ├─ Confirm Password
  └─ Submit
  ↓
[Email Confirmation]
  ├─ Check Email
  └─ Click Confirmation Link
  ↓
[Login] /auth/login
  ├─ Enter Email
  ├─ Enter Password
  └─ Sign In
  ↓
[Account] /account
  ├─ View Profile
  ├─ Edit Basic Info
  │  ├─ Full Name
  │  ├─ Phone Number
  │  ├─ Avatar
  │  └─ Save
  │
  ├─ Manage Addresses
  │  ├─ View All Addresses
  │  ├─ Add New Address
  │  │  └─ [Same as Checkout Form]
  │  ├─ Edit Address
  │  └─ Delete Address
  │
  ├─ View Orders
  │  ├─ List All Orders
  │  ├─ Click Order
  │  └─ View Details
  │
  ├─ View Wishlist
  │  ├─ All Saved Products
  │  ├─ Remove Item
  │  └─ Add to Cart
  │
  ├─ Subscription
  │  ├─ Subscribe to Newsletter
  │  └─ Get Discounts
  │
  └─ Account Settings
     ├─ Change Password
     ├─ Privacy Settings
     └─ Logout
  ↓
END
```

## 📦 Order Lifecycle

```
Customer Places Order
  ↓
Order Status: PENDING
  ├─ Payment Processing
  │  ├─ COD: Pending at Delivery
  │  ├─ JazzCash: Processing
  │  ├─ Card: Processing
  │  └─ Bank: Waiting for Transfer
  └─ Email: Order Confirmation
  ↓
Order Status: CONFIRMED
  ├─ Payment Verified
  └─ Email: Payment Confirmed
  ↓
Order Status: PROCESSING
  ├─ Warehouse Picking Items
  └─ Email: Preparing Shipment
  ↓
Order Status: SHIPPED
  ├─ Items Packed
  ├─ Package in Transit
  └─ Email: Tracking Details
  ↓
Order Status: DELIVERED
  ├─ Package Delivered
  └─ Email: Delivery Confirmation
  ↓
[Customer Can Now]
  ├─ Leave Review
  ├─ Rate Product
  └─ Request Returns (if applicable)
  ↓
END
```

## 🔐 Admin Dashboard Flow

```
[Admin Login] /auth/login
  ├─ Email
  └─ Password
  ↓
[Admin Verify]
  ├─ User is Admin? YES → Continue
  └─ User is Admin? NO → Access Denied
  ↓
[Admin Dashboard] /admin
  ├─ View Statistics
  │  ├─ Total Orders
  │  ├─ Total Revenue
  │  ├─ Total Products
  │  └─ Low Stock Alert
  │
  ├─ Manage Products
  │  ├─ View All Products
  │  ├─ Add New Product
  │  │  ├─ Name
  │  │  ├─ Category
  │  │  ├─ Price
  │  │  ├─ Stock
  │  │  ├─ Description
  │  │  ├─ Images
  │  │  └─ Save
  │  │
  │  ├─ Edit Product
  │  │  └─ [Same as Add]
  │  │
  │  └─ Delete Product
  │
  ├─ Manage Inventory
  │  ├─ View Stock Levels
  │  ├─ Low Stock Items
  │  └─ Update Stock
  │
  ├─ Manage Categories
  │  ├─ View Categories
  │  ├─ Add Category
  │  ├─ Edit Category
  │  └─ Delete Category
  │
  ├─ View Orders
  │  ├─ All Orders List
  │  ├─ Filter by Status
  │  ├─ View Order Details
  │  │  ├─ Items
  │  │  ├─ Customer Info
  │  │  ├─ Shipping Address
  │  │  ├─ Payment Info
  │  │  └─ Status
  │  │
  │  └─ Update Order Status
  │     ├─ Pending
  │     ├─ Confirmed
  │     ├─ Processing
  │     ├─ Shipped
  │     ├─ Delivered
  │     └─ Cancelled
  │
  ├─ Payment Management
  │  ├─ View Payment Methods
  │  ├─ Payment Status
  │  └─ Transaction History
  │
  └─ Analytics
     ├─ Sales Report
     ├─ Popular Products
     ├─ Revenue by Category
     └─ Customer Metrics
  ↓
END
```

## 🔍 Product Search Flow

```
START
  ↓
[Search Bar] (Header)
  ├─ Enter Search Query
  └─ Press Enter
  ↓
[Search Results] /search?q=query
  ├─ Show Matching Products
  ├─ Sort Options
  │  ├─ Newest
  │  ├─ Price: Low to High
  │  ├─ Price: High to Low
  │  ├─ Best Rated
  │  └─ Most Popular
  │
  ├─ Filter Options
  │  ├─ Price Range
  │  ├─ Category
  │  ├─ Rating
  │  └─ In Stock Only
  │
  └─ Results
     ├─ Product Cards
     ├─ Pagination
     └─ Click to View Details
  ↓
[Product Detail]
  ↓
END
```

## 💳 Payment Methods Flow

```
[Select Payment Method] (Checkout)
  ↓
  ├─ Cash on Delivery (COD)
  │  ├─ Payment on Delivery
  │  └─ No Upfront Cost
  │  ↓
  │
  ├─ JazzCash
  │  ├─ Redirect to JazzCash
  │  ├─ Enter Account & PIN
  │  ├─ Confirm Payment
  │  └─ Return to App
  │  ↓
  │
  ├─ EasyPaisa
  │  ├─ Redirect to EasyPaisa
  │  ├─ Enter Account & Code
  │  ├─ Confirm Payment
  │  └─ Return to App
  │  ↓
  │
  ├─ Bank Transfer
  │  ├─ Show Bank Details
  │  ├─ Customer Transfers
  │  └─ Verify Payment (Manual)
  │  ↓
  │
  └─ Credit/Debit Card
     ├─ Redirect to Stripe
     ├─ Enter Card Details
     ├─ 3D Secure (if needed)
     ├─ Confirm Payment
     └─ Return to App
     ↓
[Payment Processing]
  ↓
[Order Confirmation]
  ↓
END
```

## 📍 City-Based Shipping Zones

```
Customer Selects City
  ↓
City → Zone Mapping
  ├─ Zone 1 (Karachi, Hyderabad)
  │  └─ Shipping Cost: PKR 300
  │
  ├─ Zone 2 (Lahore, Faisalabad)
  │  └─ Shipping Cost: PKR 350
  │
  ├─ Zone 3 (Islamabad, Rawalpindi, Peshawar)
  │  └─ Shipping Cost: PKR 400
  │
  └─ Zone 4 (Multan, Quetta, Others)
     └─ Shipping Cost: PKR 500
  ↓
Shipping Cost Added to Total
  ↓
  Tax (17% GST) Calculated on Subtotal
  ↓
Final Total = Subtotal + Tax + Shipping
  ↓
END
```

## 🎁 Wishlist Flow

```
[Product Page]
  ↓
[Add to Wishlist Button]
  ├─ Click Heart Icon
  └─ Item Saved
  ↓
[View Wishlist] /account
  ├─ See All Saved Items
  ├─ See Price
  ├─ See Stock Status
  ├─ See Rating
  │
  ├─ Actions:
  │  ├─ Add to Cart
  │  ├─ View Details
  │  └─ Remove from Wishlist
  │
  └─ Continue Shopping
  ↓
END
```

## ⭐ Review & Rating Flow

```
[Delivery Complete]
  ↓
[Email Invite to Review]
  ├─ Click Link
  └─ Go to Product Page
  ↓
[Product Page] /products/[slug]
  ↓
[Review Section]
  ├─ Rate 1-5 Stars
  ├─ Write Review (Optional)
  │  └─ Max 500 characters
  │
  └─ Submit
  ↓
[Review Posted]
  ├─ Appears on Product Page
  ├─ Visible to Other Customers
  └─ Affects Product Rating
  ↓
END
```

## 🔔 Notification Flow

```
[System Event]
  ├─ New Order
  ├─ Payment Received
  ├─ Order Shipped
  ├─ Product Review Posted
  ├─ Price Drop on Wishlist Item
  └─ Promotional Offer
  ↓
[Send Notification]
  ├─ Email (Configured)
  ├─ SMS (Optional)
  └─ In-App (Ready for Implementation)
  ↓
[Customer Receives]
  └─ Takes Action
  ↓
END
```

---

## Quick Reference: Page URLs

### Public Pages
- `/` - Homepage
- `/products` - Product Listing
- `/products/[slug]` - Product Details
- `/category/[slug]` - Category Browsing
- `/search?q=query` - Search Results
- `/setup` - Database Setup Guide

### Auth Pages
- `/auth/login` - Login
- `/auth/signup` - Sign Up

### Protected Pages (Login Required)
- `/cart` - Shopping Cart
- `/checkout` - Checkout
- `/account` - User Account
- `/orders` - Order History
- `/order-confirmation` - Order Confirmation

### Admin Pages (Admin Only)
- `/admin` - Dashboard
- `/admin/products` - Product Management
- `/admin/inventory` - Inventory Management
- `/admin/orders` - Order Management

---

## City Zones Reference

| City | Zone | Shipping Cost |
|------|------|----------------|
| Karachi | 1 | PKR 300 |
| Hyderabad | 1 | PKR 300 |
| Lahore | 2 | PKR 350 |
| Faisalabad | 2 | PKR 350 |
| Islamabad | 3 | PKR 400 |
| Rawalpindi | 3 | PKR 400 |
| Peshawar | 3 | PKR 400 |
| Multan | 4 | PKR 500 |
| Quetta | 4 | PKR 500 |
| Others | 4 | PKR 500 |

---

## Payment Methods Summary

| Method | Processing | Fees | Time |
|--------|-----------|------|------|
| COD | On Delivery | None | N/A |
| JazzCash | Instant | Varies | < 1 min |
| EasyPaisa | Instant | Varies | < 1 min |
| Bank | Manual | Varies | 1-2 days |
| Card | Instant | Varies | < 1 min |

---

**All flows are designed to be intuitive and user-friendly for the Pakistani market!**
