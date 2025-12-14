from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional

from database import get_db
from schemas import VendorCreate, VendorUpdate, VendorResponse
import crud

app = FastAPI(
    title="Vendor Management API",
    description="API for managing vendors in the system",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite default port
        "http://localhost:3000",  # alternative port
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# health check
@app.get("/")
def read_root():
    return {
        "message": "Vendor Management API",
        "version": "1.0.0",
        "status": "active"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

# vendor management endpoints

@app.get("/vendors")
def list_vendors(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=500, description="Maximum number of records"),
    search: Optional[str] = Query(None, description="Search by name, category, or owner"),
    sort_by: Optional[str] = Query(None, description="Column to sort by"),
    sort_order: str = Query("asc", regex="^(asc|desc)$", description="Sort order"),
    db: Session = Depends(get_db)
):
    """
    Get list of all vendors with optional search and sorting
    
    Query Parameters:
    - skip: Pagination offset
    - limit: Maximum results to return
    - search: Search term (searches name, category, owner)
    - sort_by: Column name to sort by
    - sort_order: 'asc' or 'desc'
    """
    vendors = crud.get_vendors(
        db=db,
        skip=skip,
        limit=limit,
        search=search,
        sort_by=sort_by,
        sort_order=sort_order
    )
    
    total_count = crud.get_vendors_count(db=db, search=search)
    
    return {
        "vendors": vendors,
        "total": total_count,
        "skip": skip,
        "limit": limit
    }

@app.get("/vendors/{vendor_id}", response_model=VendorResponse)
def get_vendor(vendor_id: int, db: Session = Depends(get_db)):
    """Get a specific vendor by ID"""
    vendor = crud.get_vendor(db=db, vendor_id=vendor_id)
    
    if vendor is None:
        raise HTTPException(status_code=404, detail=f"Vendor with id {vendor_id} not found")
    
    return vendor

@app.post("/vendors", response_model=VendorResponse, status_code=201)
def create_vendor(vendor: VendorCreate, db: Session = Depends(get_db)):
    """
    Create a new vendor
    
    Request Body:
    - name: Vendor name (required)
    - category: Business category (optional)
    - owner: Owner name (optional)
    - payment_method: Payment method (optional)
    - location: Location (optional)
    - department: Department (optional)
    - status: Vendor status (optional, defaults to 'active')
    """
    try:
        new_vendor = crud.create_vendor(db=db, vendor=vendor)
        return new_vendor
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error creating vendor: {str(e)}")

@app.put("/vendors/{vendor_id}", response_model=VendorResponse)
def update_vendor(vendor_id: int, vendor_update: VendorUpdate, db: Session = Depends(get_db)):
    """
    Update an existing vendor
    
    Only provided fields will be updated. Omitted fields remain unchanged.
    """
    updated_vendor = crud.update_vendor(db=db, vendor_id=vendor_id, vendor_update=vendor_update)
    
    if updated_vendor is None:
        raise HTTPException(status_code=404, detail=f"Vendor with id {vendor_id} not found")
    
    return updated_vendor

@app.delete("/vendors/{vendor_id}", status_code=204)
def delete_vendor(vendor_id: int, db: Session = Depends(get_db)):
    """Delete vendor"""
    success = crud.delete_vendor(db=db, vendor_id=vendor_id)
    
    if not success:
        raise HTTPException(status_code=404, detail=f"Vendor with id {vendor_id} not found")
    
    return None

# endpoint statistics (summary of vendors for analytics)
@app.get("/vendors/stats/summary")
def get_vendor_statistics(db: Session = Depends(get_db)):
    """Get summary statistics about vendors"""
    from sqlalchemy import func
    from models import Vendor, VendorStatus
    
    total_vendors = db.query(Vendor).count()
    active_vendors = db.query(Vendor).filter(Vendor.status == VendorStatus.ACTIVE).count()
    total_spend = db.query(func.sum(Vendor.total_spend)).scalar() or 0
    
    return {
        "total_vendors": total_vendors,
        "active_vendors": active_vendors,
        "inactive_vendors": total_vendors - active_vendors,
        "total_spend": round(total_spend, 2)
    }