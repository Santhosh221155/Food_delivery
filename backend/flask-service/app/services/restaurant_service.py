"""
Restaurant service - Business logic for restaurant operations
"""
from app.config.database import get_database
from typing import List, Optional
import random

class RestaurantService:
    
    async def get_restaurants(self, cuisine: Optional[str] = None, 
                            rating: Optional[float] = None,
                            search: Optional[str] = None) -> List[dict]:
        """
        Get filtered list of restaurants
        """
        db = get_database()
        
        # If no database, return mock data
        if not db:
            return self._get_mock_restaurants()
        
        try:
            # Build filter query
            filter_query = {"isActive": True}
            
            if cuisine:
                filter_query["cuisine"] = cuisine
            
            if rating:
                filter_query["rating"] = {"$gte": rating}
            
            if search:
                filter_query["$or"] = [
                    {"name": {"$regex": search, "$options": "i"}},
                    {"description": {"$regex": search, "$options": "i"}}
                ]
            
            # Query database
            restaurants = await db.restaurants.find(filter_query).sort("rating", -1).to_list(50)
            
            # If no restaurants found, return mock data
            if not restaurants:
                return self._get_mock_restaurants()
            
            return restaurants
            
        except Exception as e:
            print(f"Error fetching restaurants: {e}")
            return self._get_mock_restaurants()
    
    async def get_restaurant_by_id(self, restaurant_id: str) -> Optional[dict]:
        """
        Get restaurant details by ID
        """
        db = get_database()
        
        if not db:
            # Return mock data
            mock_restaurants = self._get_mock_restaurants()
            return next((r for r in mock_restaurants if r.get("id") == restaurant_id), None)
        
        try:
            restaurant = await db.restaurants.find_one({"_id": restaurant_id})
            return restaurant
        except Exception as e:
            print(f"Error fetching restaurant {restaurant_id}: {e}")
            return None
    
    def _get_mock_restaurants(self) -> List[dict]:
        """
        Return mock restaurant data for development
        """
        return [
            {
                "id": "res-1",
                "name": "Spice Garden",
                "description": "Authentic North Indian cuisine",
                "cuisine": ["Indian", "North Indian"],
                "rating": 4.3,
                "totalRatings": 250,
                "eta": 30,
                "isActive": True,
                "image": "https://images.unsplash.com/photo-1585937421612-70a008356fbe",
                "tags": ["Popular", "Fast Delivery"],
                "priceRange": "$$"
            },
            {
                "id": "res-2",
                "name": "Pizza Paradise",
                "description": "Wood-fired authentic Italian pizzas",
                "cuisine": ["Italian", "Pizza"],
                "rating": 4.5,
                "totalRatings": 380,
                "eta": 25,
                "isActive": True,
                "image": "https://images.unsplash.com/photo-1513104890138-7c749659a591",
                "tags": ["Trending", "Premium"],
                "priceRange": "$$$"
            },
            {
                "id": "res-3",
                "name": "Burger Hub",
                "description": "Gourmet burgers and fries",
                "cuisine": ["American", "Fast Food"],
                "rating": 4.2,
                "totalRatings": 190,
                "eta": 20,
                "isActive": True,
                "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
                "tags": ["Quick Bites"],
                "priceRange": "$"
            },
            {
                "id": "res-4",
                "name": "Saravana Bhavan",
                "description": "Traditional South Indian delicacies",
                "cuisine": ["South Indian", "Vegetarian"],
                "rating": 4.6,
                "totalRatings": 420,
                "eta": 25,
                "isActive": True,
                "image": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc",
                "tags": ["Vegetarian", "Highly Rated"],
                "priceRange": "$$"
            },
            {
                "id": "res-5",
                "name": "Sushi Master",
                "description": "Fresh Japanese sushi and rolls",
                "cuisine": ["Japanese", "Sushi"],
                "rating": 4.7,
                "totalRatings": 310,
                "eta": 35,
                "isActive": True,
                "image": "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351",
                "tags": ["Premium", "Exotic"],
                "priceRange": "$$$"
            },
            {
                "id": "res-6",
                "name": "Taco Fiesta",
                "description": "Authentic Mexican street food",
                "cuisine": ["Mexican"],
                "rating": 4.1,
                "totalRatings": 150,
                "eta": 28,
                "isActive": True,
                "image": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47",
                "tags": ["Spicy", "Street Food"],
                "priceRange": "$"
            }
        ]
