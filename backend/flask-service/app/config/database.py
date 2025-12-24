"""
Database configuration for MongoDB Atlas
"""
from pymongo import MongoClient
from motor.motor_asyncio import AsyncIOMotorClient
import os

mongo_client = None
db = None

async def connect_db():
    global mongo_client, db
    mongo_uri = os.getenv("MONGODB_URI")
    
    if not mongo_uri:
        print("⚠️  MONGODB_URI not set - running without database")
        return
    
    try:
        # Use motor for async MongoDB operations
        mongo_client = AsyncIOMotorClient(
            mongo_uri,
            serverSelectionTimeoutMS=5000
        )
        
        # Test connection
        await mongo_client.admin.command('ping')
        
        # Get database name from connection string
        db = mongo_client.get_default_database()
        print(f"✓ MongoDB connected: {db.name}")
        
    except Exception as e:
        print(f"❌ MongoDB connection failed: {str(e)}")
        mongo_client = None
        db = None

async def close_db():
    global mongo_client
    if mongo_client:
        mongo_client.close()
        print("✓ MongoDB connection closed")

def get_database():
    return db
