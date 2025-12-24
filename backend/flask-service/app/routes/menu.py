"""
Menu routes - Internal endpoints for menu management
"""
from fastapi import APIRouter, HTTPException
from app.models.schemas import MenuItem
from app.services.menu_service import MenuService
from typing import List

router = APIRouter()
service = MenuService()

@router.get("/{restaurant_id}", response_model=dict)
async def get_menu(restaurant_id: str):
    """
    Get menu items for a restaurant
    """
    try:
        menu_data = await service.get_menu(restaurant_id)
        return menu_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{restaurant_id}/category/{category}", response_model=List[MenuItem])
async def get_menu_by_category(restaurant_id: str, category: str):
    """
    Get menu items by category
    """
    try:
        items = await service.get_menu_by_category(restaurant_id, category)
        return items
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
