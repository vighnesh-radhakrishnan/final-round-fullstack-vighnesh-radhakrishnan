from sqlalchemy import Column, Integer, String, Float, DateTime, Enum as SQLEnum
from sqlalchemy.sql import func
from database import Base
import enum

class VendorStatus(str, enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    PENDING = "pending"

class PaymentMethod(str, enum.Enum):
    CARD = "card"
    ACH = "ach"
    CHECK = "check"
    WIRE = "wire"

class Vendor(Base):
    __tablename__ = "vendors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    category = Column(String, nullable=True)
    owner = Column(String, nullable=True)
    
    # financial details
    total_spend = Column(Float, default=0.0)
    thirty_day_spend = Column(Float, default=0.0)
    ninety_day_spend = Column(Float, default=0.0)
    
    # payment information
    payment_method = Column(SQLEnum(PaymentMethod), nullable=True)
    
    # location
    location = Column(String, nullable=True)
    department = Column(String, nullable=True)
    
    # status
    status = Column(SQLEnum(VendorStatus), default=VendorStatus.ACTIVE)
    
    # tax details (visual only)
    tax_details_submitted = Column(String, nullable=True)  # "Yes", "No", or null
    vendor_1099_2024 = Column(String, nullable=True)
    vendor_1099_2025 = Column(String, nullable=True)
    
    # metadata
    creation_date = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<Vendor(name={self.name}, status={self.status})>"