# Inventory Transaction API
A simple backend API to manage products, stock levels, and transaction history. This single README contains everything needed to run the project from scratch.

# How to Run the Project
1. Install Node.js and MongoDB on your system.

2. Clone the repository:
git clone https://github.com/codaksh7/inventory-api.git
cd inventory-api

3. Install dependencies:
npm install

4. Create a `.env` file inside the project folder with the following content:
PORT=5000
MONGO_URI=mongodb://localhost:27017/inventory

5. Start MongoDB using ONE of these:
mongod

6. Start the server:
npm run dev

Your API will now run at:
http://localhost:5000


# API Endpoints (Use Postman or Thunder Client)

### ➤ Add a New Product  
POST  
http://localhost:5000/products

Body:
{
"name": "Laptop",
"sku": "LP101",
"initialStock": 20
}

### ➤ Increase Stock  
POST
http://localhost:5000/products/ < productId > /increase

Body:
{
"quantity": 5
}


### ➤ Decrease Stock  
POST  
http://localhost:5000/products/ <productId> /decrease

Body:
{
"quantity": 3
}


### ➤ Get Product Details  
GET  
http://localhost:5000/products/ <productId>


### ➤ Get Product Transactions  
GET  
http://localhost:5000/products/ <productId> /transactions



## 🧹 Notes
- `sku` must be unique  
- `initialStock` must be non-negative  
- `quantity` must be positive  
- `.env` and `node_modules` are intentionally excluded from GitHub  
- API auto-prevents negative stock


