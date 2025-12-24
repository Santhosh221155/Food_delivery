"""
Delivery routes - Internal endpoints for delivery management
"""
from fastapi import APIRouter, HTTPException
from app.models.schemas import ETARequest, DeliveryAssignment, DeliveryStatusUpdate
from app.services.delivery_service import DeliveryService

router = APIRouter()
service = DeliveryService()

@router.post("/eta")
async def calculate_eta(request: ETARequest):
    """
    Calculate estimated delivery time
    """
    try:
        eta = await service.calculate_eta(request.restaurantId, request.deliveryAddress)
        return {"eta": eta, "unit": "minutes"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/delivery/assign")
async def assign_delivery(assignment: DeliveryAssignment):
    """
    Assign delivery for an order
    """
    try:
        result = await service.assign_delivery(assignment)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/delivery/{order_id}")
async def update_delivery_status(order_id: str, update: DeliveryStatusUpdate):
    """
    Update delivery status
    """
    try:
        result = await service.update_delivery_status(order_id, update.status)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
