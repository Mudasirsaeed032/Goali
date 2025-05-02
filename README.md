
# **Goali Project**

### **Description:**
Goali is a platform designed for fundraising, auctions, and event management. Users can create fundraisers, auction items, and events, make donations, place bids, and track progress. The platform integrates Stripe and Google Pay for payment processing and real-time bidding updates via Socket.io.

---

### **Features:**

- **Fundraisers**: Users can create and donate to fundraisers. The donation process supports both Stripe and Google Pay.
- **Auctions**: Users can place bids on auction items in real-time with Socket.io updates.
- **Events**: Users can view and create events.
- **Admin Dashboard**: Admins can manage fundraisers, auctions, events, and users.
- **Authentication**: Users can sign up, log in, and manage their profile.
- **Payment Integration**: Payments are processed via Stripe and Google Pay.
- **Real-Time Updates**: Live bid updates in auctions and donation progress in fundraisers.

---

## **Installation & Setup**

### **Backend (Node.js/Express)**

1. **Clone the repository:**

   ```bash
   git clone <repository_url>
   cd <repository_name>
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Setup environment variables:**

   Create a `.env` file in the root directory and add the following keys:

   ```env
   STRIPE_SECRET_KEY=<your_stripe_secret_key>
   SUPABASE_URL=<your_supabase_url>
   SUPABASE_ANON_KEY=<your_supabase_anon_key>
   STRIPE_WEBHOOK_SECRET=<your_stripe_webhook_secret>
   ```

4. **Run the backend:**

   ```bash
   npm start
   ```

5. **Ensure the backend is running on `http://localhost:5000`**

---

### **Frontend (React)**

1. **Clone the repository:**

   ```bash
   git clone <repository_url>
   cd <repository_name>
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the frontend:**

   ```bash
   npm start
   ```

4. **Frontend will run on `http://localhost:5173`**

---

## **Frontend Components Overview**

### **1. Fundraiser Management:**

- **Fundraiser List**:
  - Fetches and displays all active fundraisers.
  - Shows progress bar indicating how much has been raised vs. the goal.

- **Fundraiser Detail**:
  - Displays details of a specific fundraiser, including description, supporters, and donation progress.
  - Allows users to donate to the fundraiser via Stripe or Google Pay.

### **2. Auction Management:**

- **Auction List**:
  - Displays all active auctions.
  - Each item shows current bid and time remaining.

- **Auction Detail**:
  - Displays auction item details and current bid.
  - Allows users to place bids in real-time, with live updates via Socket.io.

- **Create Auction Item**:
  - Allows authenticated users to create new auction items.
  - Uploads images to Cloudinary and sets start and end times for the auction.

### **3. Event Management:**

- **Event List**:
  - Displays upcoming events with details like location, date, and price.

- **Create Event**:
  - Allows users to create and manage events.

### **4. User Authentication:**

- **Sign Up**: 
  - Users can register by providing email, password, and full name.
  
- **Login**:
  - Allows users to log in and access restricted pages.

- **Logout**:
  - Users can log out and end their session.

### **5. Admin Dashboard:**

- **Admin Routes**:
  - Admins can manage fundraisers, auctions, events, and users.
  - Admins have restricted access to certain routes based on roles.

---

## **Payment Integration**

### **1. Stripe Payment Integration:**

- **Stripe Webhook**:
  - Used for listening to Stripe payment events.
  - Handles successful payments and updates the database with payment details.

- **Donation Processing**:
  - Users can donate via Stripe.
  - After successful donation, users are redirected to the success page.

### **2. Google Pay Integration:**

- **Google Pay Button**:
  - Adds a Google Pay button for donations.
  - Sends payment data to the backend for processing after payment is completed.

---

## **Backend API Endpoints**

### **1. Fundraiser Routes:**

- **GET /fundraisers**:
  - Fetch all fundraisers with optional search/filter.

- **POST /fundraisers/:id/pay**:
  - Accepts donation amounts and processes payments via Stripe.

- **GET /fundraisers/with-progress**:
  - Fetches fundraisers with their collected amounts based on payment data.

### **2. Auction Routes:**

- **POST /auction**:
  - Allows users to create auction items.
  
- **GET /auction/:id**:
  - Fetches auction item details.

- **POST /auction/:id/bid**:
  - Allows users to place bids on auction items.

### **3. User Authentication Routes:**

- **POST /auth/register-user**:
  - Registers a new user in the database after successful sign-up.

- **POST /auth/login**:
  - Logs in the user.

- **POST /auth/logout**:
  - Logs out the user and clears session data.

### **4. Admin Routes:**

- **POST /admin/fundraisers**:
  - Admins can manage fundraisers.

- **POST /admin/auctions**:
  - Admins can manage auction items.

---

## **Running Tests**

- **Backend Tests**: 
  - You can use tools like `jest` or `mocha` to run backend tests.

- **Frontend Tests**:
  - Use `jest` and `react-testing-library` to run tests for the frontend components.

---

## **Conclusion**

This project combines a variety of features for fundraising, auctions, and event management. With integrated payment systems like Stripe and Google Pay, real-time auction bidding, and a fully responsive UI, Goali is a powerful platform that enables users to contribute to causes, bid on auction items, and attend events.
