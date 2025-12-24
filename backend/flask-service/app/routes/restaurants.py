"""
Restaurant routes - Internal endpoints for restaurant management
"""
from fastapi import APIRouter, HTTPException, Query
from app.models.schemas import Restaurant
from app.services.restaurant_service import RestaurantService
from typing import List, Optional

router = APIRouter()
service = RestaurantService()

@router.get("/", response_model=List[Restaurant])
async def get_restaurants(
    cuisine: Optional[str] = Query(None),
    rating: Optional[float] = Query(None),
    search: Optional[str] = Query(None)
):
    """
    Get list of restaurants with optional filters
    """
    try:
        restaurants = await service.get_restaurants(cuisine=cuisine, rating=rating, search=search)
        return restaurants
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{restaurant_id}", response_model=Restaurant)
async def get_restaurant(restaurant_id: str):
    """
    Get restaurant details by ID
    """
    try:
        restaurant = await service.get_restaurant_by_id(restaurant_id)
        if not restaurant:
            raise HTTPException(status_code=404, detail="Restaurant not found")
        return restaurant
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
