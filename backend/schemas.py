from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from models import VendorStatus, PaymentMethod

# main vendor model
class VendorBase(BaseModel):
    name: str
    category: Optional[str] = None
    owner: Optional[str] = None
    total_spend: float = 0.0
    thirty_day_spend: float = 0.0
    ninety_day_spend: float = 0.0
    payment_method: Optional[PaymentMethod] = None
    location: Optional[str] = None
    department: Optional[str] = None
    status: VendorStatus = VendorStatus.ACTIVE
    tax_details_submitted: Optional[str] = None
    vendor_1099_2024: Optional[str] = None
    vendor_1099_2025: Optional[str] = None

class VendorCreate(VendorBase):
    pass

class VendorUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    owner: Optional[str] = None
    payment_method: Optional[PaymentMethod] = None
    location: Optional[str] = None
    department: Optional[str] = None
    status: Optional[VendorStatus] = None

class VendorResponse(VendorBase):
    id: int
    creation_date: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True