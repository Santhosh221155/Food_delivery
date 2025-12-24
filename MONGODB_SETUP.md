# MongoDB Atlas Setup Guide

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account (M0 tier - Free Forever)
3. Create a new cluster

## Step 2: Configure Database Access

1. In Atlas dashboard, go to **Database Access**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Set username and password (save these!)
5. Set privileges to **"Atlas admin"** for development
6. Click **"Add User"**

## Step 3: Configure Network Access

1. Go to **Network Access**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
   - This adds `0.0.0.0/0` to the whitelist
   - For production, use specific IP addresses
4. Click **"Confirm"**

## Step 4: Get Connection String

1. Go to **Database** section
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 5: Configure Your Application

1. Open `backend/node-service/.env`
2. Replace the `MONGODB_URI` value with your connection string
3. Replace `<username>` with your database username
4. Replace `<password>` with your database password
5. Use the **fooddelivery_prod** database:
   ```
   MONGODB_URI=mongodb+srv://youruser:yourpass@cluster0.xxxxx.mongodb.net/fooddelivery_prod?retryWrites=true&w=majority
   ```

## Example Configuration

```env
# backend/node-service/.env
PORT=3000
DOWNSTREAM_BASE_URL=http://localhost:5000
MONGODB_URI=mongodb+srv://myuser:mypass123@cluster0.abc123.mongodb.net/fooddelivery_prod?retryWrites=true&w=majority
```

## Step 6: Test Connection

1. Start your Node.js service:
   ```powershell
   cd backend/node-service
   npm start
   ```

2. Check the console for:
   ```
   ✅ MongoDB connected successfully
   🚀 Service A (Node.js) running on http://localhost:3000
   ```

## Troubleshooting

### Connection Timeout
- Check if your IP is whitelisted in Network Access
- Verify firewall/VPN isn't blocking MongoDB Atlas

### Authentication Failed
- Double-check username and password
- Ensure no special characters in password (or URL-encode them)
- Password with `@` should be encoded as `%40`

### Database Not Created
- MongoDB creates databases automatically when first document is inserted
- Database will appear after placing your first order

## Collections Created

Once you start using the application, these collections will be created:

- **users** - User accounts with email and passwords
- **orders** - Order history with items and status

## Viewing Data

1. In MongoDB Atlas dashboard, click **"Browse Collections"**
2. Select **fooddelivery_prod** database
3. View **users** and **orders** collections
4. You can manually add/edit documents here for testing

## Clearing Data

To clear all data from the database and start fresh:

```powershell
cd backend/node-service
npm run clear-data
```

This will delete all documents from the **users** and **orders** collections in the **fooddelivery_prod** database.

## Security Notes

⚠️ **Important for Production:**
- Never commit `.env` file to version control
- Use environment variables in production
- Restrict Network Access to specific IPs
- Use strong passwords
- Consider using MongoDB Atlas App Services for authentication
