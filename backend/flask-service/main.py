"""
FastAPI main application - Internal Service Server
Handles: Restaurant listing, Menu management, Delivery logic, ETA calculation
Exposed ONLY to Node.js backend
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Food Delivery Internal Service",
    description="Python FastAPI backend for restaurant and delivery management",
    version="1.0.0"
)

# CORS - only allow Node.js backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("ALLOWED_ORIGIN", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event
@app.on_event("startup")
async def startup_event():
    print("✓ Python FastAPI service started")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    print("✓ Python FastAPI service stopped")

# Health check
@app.get("/healthz")
async def health_check():
    return JSONResponse({
        "status": "ok",
        "service": "python-fastapi-service",
        "version": "1.0.0"
    })

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Food Delivery Internal Service API",
        "version": "1.0.0",
        "docs": "/docs"
    }

# Restaurant routes
@app.get("/internal/restaurants")
async def get_restaurants(cuisine: str = None, rating: float = None, search: str = None):
    """Get list of restaurants with optional filters"""
    return {
        "restaurants": [
            {
                "id": "res-1",
                "name": "Spice Garden",
                "cuisine": ["North Indian", "Chinese"],
                "rating": 4.3,
                "eta": 30
            },
            {
                "id": "res-4",
                "name": "Saravana Bhavan",
                "cuisine": ["South Indian"],
                "rating": 4.6,
                "eta": 25
            }
        ]
    }

@app.get("/internal/restaurants/{restaurant_id}")
async def get_restaurant(restaurant_id: str):
    """Get restaurant details by ID"""
    restaurants = {
        "res-1": {
            "id": "res-1",
            "name": "Spice Garden",
            "cuisine": ["North Indian", "Chinese"],
            "rating": 4.3,
            "eta": 30
        },
        "res-4": {
            "id": "res-4",
            "name": "Saravana Bhavan",
            "cuisine": ["South Indian"],
            "rating": 4.6,
            "eta": 25
        }
    }
    return restaurants.get(restaurant_id, {"error": "Restaurant not found"})

# Menu routes
@app.get("/internal/menu/{restaurant_id}")
async def get_menu(restaurant_id: str):
    """Get menu for a restaurant"""
    menus = {
        "res-1": {
            "restaurantId": "res-1",
            "items": [
                {"id": "m1", "name": "Butter Chicken", "price": 299, "isVeg": False, "category": "Curries"},
                {"id": "m2", "name": "Paneer Tikka", "price": 199, "isVeg": True, "category": "Curries"}
            ]
        },
        "res-4": {
            "restaurantId": "res-4",
            "items": [
                {"id": "m7", "name": "Masala Dosa", "price": 149, "isVeg": True, "category": "Dosa"},
                {"id": "m8", "name": "Idly Sambar", "price": 89, "isVeg": True, "category": "Idly"}
            ]
        }
    }
    return menus.get(restaurant_id, {"restaurantId": restaurant_id, "items": []})

# Delivery routes
@app.post("/internal/eta")
async def calculate_eta(request: dict):
    """Calculate estimated delivery time"""
    return {"eta": 30, "unit": "minutes"}

@app.post("/internal/delivery/assign")
async def assign_delivery(assignment: dict):
    """Assign delivery for an order"""
    return {
        "success": True,
        "orderId": assignment.get("orderId"),
        "status": "ASSIGNED"
    }

@app.patch("/internal/delivery/{order_id}")
async def update_delivery_status(order_id: str, request: dict):
    """Update delivery status"""
    return {
        "success": True,
        "orderId": order_id,
        "status": request.get("status", "UNKNOWN")
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 5000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=False,
        workers=1
    )

