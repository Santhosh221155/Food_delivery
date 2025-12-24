"""
Menu service - Business logic for menu operations
"""
from app.config.database import get_database
from typing import List

class MenuService:
    
    async def get_menu(self, restaurant_id: str) -> dict:
        """
        Get complete menu for a restaurant
        """
        db = get_database()
        
        if not db:
            return self._get_mock_menu(restaurant_id)
        
        try:
            # Fetch menu items from database
            items = await db.menuItems.find({
                "restaurantId": restaurant_id,
                "isAvailable": True
            }).to_list(100)
            
            if not items:
                return self._get_mock_menu(restaurant_id)
            
            return {
                "restaurantId": restaurant_id,
                "items": items
            }
            
        except Exception as e:
            print(f"Error fetching menu: {e}")
            return self._get_mock_menu(restaurant_id)
    
    async def get_menu_by_category(self, restaurant_id: str, category: str) -> List[dict]:
        """
        Get menu items by category
        """
        db = get_database()
        
        if not db:
            menu = self._get_mock_menu(restaurant_id)
            return [item for item in menu.get("items", []) if item.get("category") == category]
        
        try:
            items = await db.menuItems.find({
                "restaurantId": restaurant_id,
                "category": category,
                "isAvailable": True
            }).to_list(100)
            
            return items
            
        except Exception as e:
            print(f"Error fetching menu by category: {e}")
            return []
    
    def _get_mock_menu(self, restaurant_id: str) -> dict:
        """
        Return mock menu data for development
        """
        menus = {
            "res-1": [
                {"id": "m1", "name": "Butter Chicken", "description": "Tender chicken in rich tomato gravy", "category": "Main Course", "price": 299, "isVeg": False, "restaurantId": "res-1", "restaurantName": "Spice Garden"},
                {"id": "m2", "name": "Paneer Tikka", "description": "Grilled cottage cheese with spices", "category": "Starters", "price": 199, "isVeg": True, "restaurantId": "res-1", "restaurantName": "Spice Garden"},
                {"id": "m3", "name": "Dal Makhani", "description": "Creamy black lentils", "category": "Main Course", "price": 179, "isVeg": True, "restaurantId": "res-1", "restaurantName": "Spice Garden"},
                {"id": "m4", "name": "Garlic Naan", "description": "Fresh bread with garlic", "category": "Breads", "price": 49, "isVeg": True, "restaurantId": "res-1", "restaurantName": "Spice Garden"}
            ],
            "res-2": [
                {"id": "m5", "name": "Margherita Pizza", "description": "Classic tomato and mozzarella", "category": "Pizza", "price": 349, "isVeg": True, "restaurantId": "res-2", "restaurantName": "Pizza Paradise"},
                {"id": "m6", "name": "Pepperoni Pizza", "description": "Loaded with pepperoni", "category": "Pizza", "price": 399, "isVeg": False, "restaurantId": "res-2", "restaurantName": "Pizza Paradise"}
            ],
            "res-3": [
                {"id": "m10", "name": "Classic Burger", "description": "Juicy beef patty with fresh veggies", "category": "Burgers", "price": 199, "isVeg": False, "restaurantId": "res-3", "restaurantName": "Burger Hub"},
                {"id": "m11", "name": "Veggie Burger", "description": "Plant-based patty", "category": "Burgers", "price": 179, "isVeg": True, "restaurantId": "res-3", "restaurantName": "Burger Hub"}
            ],
            "res-4": [
                {"id": "m7", "name": "Masala Dosa", "description": "Crispy crepe with spiced potatoes", "category": "South Indian", "price": 149, "isVeg": True, "restaurantId": "res-4", "restaurantName": "Saravana Bhavan"},
                {"id": "m8", "name": "Idly Sambar", "description": "Steamed rice cakes with lentil soup", "category": "South Indian", "price": 99, "isVeg": True, "restaurantId": "res-4", "restaurantName": "Saravana Bhavan"},
                {"id": "m9", "name": "Medu Vada", "description": "Crispy lentil donuts", "category": "Snacks", "price": 79, "isVeg": True, "restaurantId": "res-4", "restaurantName": "Saravana Bhavan"}
            ],
            "res-5": [
                {"id": "m12", "name": "California Roll", "description": "Crab, avocado, cucumber", "category": "Sushi", "price": 399, "isVeg": False, "restaurantId": "res-5", "restaurantName": "Sushi Master"},
                {"id": "m13", "name": "Veggie Roll", "description": "Fresh vegetables and rice", "category": "Sushi", "price": 299, "isVeg": True, "restaurantId": "res-5", "restaurantName": "Sushi Master"}
            ],
            "res-6": [
                {"id": "m14", "name": "Chicken Tacos", "description": "Grilled chicken with salsa", "category": "Tacos", "price": 249, "isVeg": False, "restaurantId": "res-6", "restaurantName": "Taco Fiesta"},
                {"id": "m15", "name": "Bean Burrito", "description": "Wrapped beans with cheese", "category": "Burritos", "price": 199, "isVeg": True, "restaurantId": "res-6", "restaurantName": "Taco Fiesta"}
            ]
        }
        
        return {
            "restaurantId": restaurant_id,
            "items": menus.get(restaurant_id, [])
        }
