"""
Pydantic models for data validation
"""
from pydantic import BaseModel, Field, validator
from typing import List, Optional
from datetime import datetime

class Address(BaseModel):
    line1: str
    line2: Optional[str] = None
    city: str
    state: Optional[str] = None
    pincode: str
    coordinates: Optional[dict] = None

class Restaurant(BaseModel):
    id: str = Field(alias="_id")
    name: str
    description: Optional[str] = None
    cuisine: List[str] = []
    rating: float = 0.0
    totalRatings: int = 0
    eta: int = 30
    address: Optional[Address] = None
    contact: Optional[dict] = None
    isActive: bool = True
    image: Optional[str] = None
    tags: List[str] = []
    priceRange: str = "$$"

    class Config:
        populate_by_name = True

class MenuItem(BaseModel):
    id: str = Field(alias="_id")
    restaurantId: str
    name: str
    description: Optional[str] = None
    category: str
    price: float
    image: Optional[str] = None
    isVeg: bool = True
    isAvailable: bool = True
    tags: List[str] = []

    class Config:
        populate_by_name = True

class DeliveryAddress(BaseModel):
    line1: str
    line2: Optional[str] = None
    city: str
    state: Optional[str] = None
    pincode: str

class ETARequest(BaseModel):
    restaurantId: str
    deliveryAddress: DeliveryAddress

class DeliveryAssignment(BaseModel):
    orderId: str
    restaurantId: str
    deliveryAddress: DeliveryAddress

class DeliveryStatusUpdate(BaseModel):
    status: str
    
    @validator('status')
    def validate_status(cls, v):
        valid_statuses = ['PLACED', 'CONFIRMED', 'PREPARING', 'PICKED_UP', 
                         'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED']
        if v not in valid_statuses:
            raise ValueError(f'Status must be one of {valid_statuses}')
        return v
