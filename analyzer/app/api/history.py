from fastapi import APIRouter
from ..storage.models import get_all_history

router = APIRouter()

@router.get("/history")
async def list_history():
    return get_all_history()
