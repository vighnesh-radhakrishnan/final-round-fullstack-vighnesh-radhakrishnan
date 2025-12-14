from database import SessionLocal
from models import Vendor

def test_database():
    db = SessionLocal()
    try:
        # Get total count
        total = db.query(Vendor).count()
        print(f"Total vendors: {total}")
        
        # get first 5 vendors
        vendors = db.query(Vendor).limit(5).all()
        print("\nFirst 5 vendors:")
        for vendor in vendors:
            print(f"  - {vendor.name} ({vendor.category}) - ${vendor.total_spend:,.2f}")
        
        # Test search
        search_result = db.query(Vendor).filter(Vendor.name.ilike("%amazon%")).all()
        print(f"\nSearch for 'amazon': {len(search_result)} results")
        for vendor in search_result:
            print(f"  - {vendor.name}")
            
    finally:
        db.close()

if __name__ == "__main__":
    test_database()