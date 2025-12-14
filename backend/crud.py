from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc
from models import Vendor, VendorStatus, PaymentMethod
from schemas import VendorCreate, VendorUpdate
from typing import Optional, List

# Create
def create_vendor(db: Session, vendor: VendorCreate) -> Vendor:
    """Create a new vendor in the database"""
    db_vendor = Vendor(**vendor.model_dump())
    db.add(db_vendor)
    db.commit()
    db.refresh(db_vendor)  # get the ID and timestamps
    return db_vendor

# Read
def get_vendor(db: Session, vendor_id: int) -> Optional[Vendor]:
    """Get a single vendor by ID"""
    return db.query(Vendor).filter(Vendor.id == vendor_id).first()

def get_vendors(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    sort_by: Optional[str] = None,
    sort_order: str = "asc"
) -> List[Vendor]:
    """
    Get all vendors with optional search and sorting
    
    Args:
        db: Database session
        skip: Number of records to skip (pagination)
        limit: Maximum number of records to return
        search: Search term to filter by name, category, or owner
        sort_by: Column name to sort by
        sort_order: 'asc' or 'desc'
    """
    query = db.query(Vendor)
    
    # Apply search filter
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            or_(
                Vendor.name.ilike(search_filter),
                Vendor.category.ilike(search_filter),
                Vendor.owner.ilike(search_filter)
            )
        )
    
    # apply sorting
    if sort_by:
        #map frontend column names to model attributes
        sort_column = getattr(Vendor, sort_by, None)
        if sort_column is not None:
            if sort_order.lower() == "desc":
                query = query.order_by(desc(sort_column))
            else:
                query = query.order_by(asc(sort_column))
    else:
        # Default sort by creation date (newest first)
        query = query.order_by(desc(Vendor.creation_date))
    
    return query.offset(skip).limit(limit).all()

def get_vendors_count(db: Session, search: Optional[str] = None) -> int:
    """Get total count of vendors (for pagination)"""
    query = db.query(Vendor)
    
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            or_(
                Vendor.name.ilike(search_filter),
                Vendor.category.ilike(search_filter),
                Vendor.owner.ilike(search_filter)
            )
        )
    
    return query.count()

# Update
def update_vendor(db: Session, vendor_id: int, vendor_update: VendorUpdate) -> Optional[Vendor]:
    """Update an existing vendor"""
    db_vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    
    if db_vendor is None:
        return None
    
    # Update only provided fields
    update_data = vendor_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_vendor, field, value)
    
    db.commit()
    db.refresh(db_vendor)
    return db_vendor

# Delete
def delete_vendor(db: Session, vendor_id: int) -> bool:
    """Delete a vendor"""
    db_vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    
    if db_vendor is None:
        return False
    
    db.delete(db_vendor)
    db.commit()
    return True