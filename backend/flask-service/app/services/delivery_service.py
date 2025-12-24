"""
Delivery service - Business logic for delivery operations
"""
import random
from app.models.schemas import DeliveryAddress

class DeliveryService:
    
    async def calculate_eta(self, restaurant_id: str, delivery_address: DeliveryAddress) -> int:
        """
        Calculate estimated time of arrival based on distance and traffic
        In production, this would use actual map APIs like Google Maps
        """
        # Mock ETA calculation
        base_eta = 25
        distance_factor = random.randint(-5, 10)  # Simulate distance variation
        traffic_factor = random.randint(0, 5)     # Simulate traffic
        
        eta = base_eta + distance_factor + traffic_factor
        
        # Ensure ETA is reasonable
        return max(15, min(eta, 60))
    
    async def assign_delivery(self, assignment: dict) -> dict:
        """
        Assign a delivery partner to the order
        In production, this would match with available delivery partners
        """
        # Mock delivery assignment
        return {
            "orderId": assignment.orderId,
            "deliveryPartnerId": f"DP{random.randint(1000, 9999)}",
            "deliveryPartnerName": random.choice([
                "Raj Kumar", "Amit Sharma", "Priya Singh", 
                "Vikram Patel", "Sneha Reddy"
            ]),
            "phone": f"+91 98765{random.randint(10000, 99999)}",
            "status": "ASSIGNED",
            "estimatedPickupTime": 15
        }
    
    async def update_delivery_status(self, order_id: str, status: str) -> dict:
        """
        Update delivery status for an order
        """
        return {
            "orderId": order_id,
            "status": status,
            "updatedAt": "2024-12-23T10:30:00Z",
            "message": f"Order status updated to {status}"
        }
