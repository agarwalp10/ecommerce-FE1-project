# E-Commerce Product Catalog & Shopping Cart

A React-based e-commerce application that displays products from the FakeStore API, allowing users to filter by category, add items to a shopping cart, and simulate a checkout experience. The App also allows users to secure orders and view order history. The app demonstrates React Query for server data and Redux Toolkit for global state management. We have also used Firebase for Authentication and Firestore for database design

## Features Overview
### Product Catalog
https://github.com/agarwalp10/ecommerce-FE1-project/blob/main/README.md
Displays all products retrieved from the FakeStore API

**Each product shows:**
Title
Price
Category
Description
Rating
Image

Users can add products directly to the shopping cart from the product listing page

### Graceful Image Fallback

* Some FakeStore API image URLs return 404 errors (API-side issue)
* The app handles this gracefully by displaying a placeholder image when an image fails to load, ensuring a consistent UI

### Category Navigation

* Dynamic category dropdown populated from the API
* Categories are not hard-coded
* Selecting a category filters the displayed products
* Product data is fetched using React Query for efficient caching and state management

### Shopping Cart (Redux Toolkit)

**Global cart state managed using Redux Toolkit**

**Supports:**
* Adding products to cart
* Updating product quantity
* Removing products from cart
* Clearing cart on checkout

Users can add products from the Home page and manage them in the Cart page

### Cart Persistence (sessionStorage)

* Cart state is stored in sessionStorage

* Cart persists across page reloads within the same browser session

* Cart is stored as an array of product objects with quantities

### Cart Totals & Real-Time Updates

**Displays:**
* Total number of products in the cart
* Total price of all products
* Totals update automatically as users modify the cart

### Checkout Simulation

FakeStore API does not support real orders

Checkout is simulated by:
* Clearing Redux cart state
* Clearing sessionStorage
* User receives visual confirmation when checkout is complete

### Orders and Checkout update
* when users place items in the cart and checkout, orders are stored in firestore as immutable documents containing user id, items, total cost, and its timestamp

### Order details
* View all past orders for the logged-in user
* View detailed breakdown of a single order
* Orders are sorted by most recent
* Users can only see their own orders

### Tech Stack
React	-- UI development
TypeScript	-- Type safety
React Router --	Page navigation
TanStack React Query	-- Server state management (products & categories)
Axios --	API requests
Redux Toolkit	-- Global cart state management
React Redux --	Connect Redux to React
sessionStorage	-- Cart persistence
Bootstrap -- 	Layout and styling
@smastrom/react-rating	-- Product rating display
Backend - Firebase
* firebase authentication
* Firestore for db design
* firestore security rules 


## Architecture & State Management
### Server State (API Data)

Managed using React Query

Handles:
* Data fetching
* Caching
* Loading & error states

Used for:
* Products
* Categories

### Global App State

Managed using Redux Toolkit
Used for:
* Shopping cart
* Cart totals
* Cart persistence logic

### Local UI State
Managed with useState
Used for:
* Category selection
* UI-only interactions

## Application Flow
User opens app
   ↓
Home Page
   ↓
React Query fetches products & categories
   ↓
User filters by category (dropdown)
   ↓
User adds products to cart
   ↓
Redux Toolkit updates cart state
   ↓
Cart saved to sessionStorage
   ↓
User navigates to Cart page
   ↓
User updates quantities or removes items
   ↓
Totals update in real-time
   ↓
User clicks Checkout
   ↓
Redux state + sessionStorage cleared
   ↓
Checkout confirmation displayed
   ↓
Order Histry
   ↓
Order Details 

## Getting Started
Clone the Repository
* git clone https://github.com/your-username/your-repo-name.git
* cd your-repo-name

Install Dependencies
* npm install

Run the Application
*npm run dev


The app will be available at:

http://localhost:5173

📁 Project Structure (High-Level)
src/
├── api/            # API calls (Axios + FakeStoreAPI)
├── components/     # Reusable UI components (ProductCard)
├── context/        # AuthContext 
├── lib/firebase     # Firebase SDKs
├── pages/          # Page components (Home, Cart, Admin Products, login/logout, orders, profile, register)
├── store/          # Redux store, slice, and hooks
├── service/     # firestore
├── types/          # TypeScript types
├── Utils/     # isAdmin for admin email 
├── App.tsx         # Routing + providers
└── main.tsx        # App entry point


Notes

This project was built to demonstrate:
* Modern React architecture
* Clear separation of concerns
* Real-world state management patterns
* Code is structured for readability, scalability, and maintainability
