from database import SessionLocal
from models import Vendor, VendorStatus, PaymentMethod
import random

def clear_data():
    """Clear existing vendor data"""
    db = SessionLocal()
    try:
        db.query(Vendor).delete()
        db.commit()
        print("Cleared existing vendor data")
    finally:
        db.close()

def seed_vendors():
    """seed database with 25+ diverse vendors (edge cases)"""
    db = SessionLocal()
    
    # seed vendor array
    vendors_data = [
        {
            "name": "LinkedIn",
            "category": "SaaS / Software",
            "owner": "Dana Afkhami",
            "total_spend": 15459.47,
            "thirty_day_spend": 0.00,
            "ninety_day_spend": 0.00,
            "payment_method": PaymentMethod.CARD,
            "location": "Boston",
            "department": "Implementations",
            "status": VendorStatus.ACTIVE,
            "tax_details_submitted": "No",
            "vendor_1099_2024": "No",
            "vendor_1099_2025": "No"
        },
        {
            "name": "Workgrounds INC",
            "category": "Lodging",
            "owner": None,
            "total_spend": 11368.00,
            "thirty_day_spend": 0.00,
            "ninety_day_spend": 0.00,
            "payment_method": PaymentMethod.CARD,
            "location": None,
            "department": None,
            "status": VendorStatus.ACTIVE,
            "tax_details_submitted": "No",
            "vendor_1099_2024": "No",
            "vendor_1099_2025": "No"
        },
        {
            "name": "Airalo",
            "category": "Lodging",
            "owner": None,
            "total_spend": 11181.63,
            "thirty_day_spend": 0.00,
            "ninety_day_spend": 0.00,
            "payment_method": PaymentMethod.CARD,
            "location": None,
            "department": None,
            "status": VendorStatus.ACTIVE,
            "tax_details_submitted": "No",
            "vendor_1099_2024": "No",
            "vendor_1099_2025": "No"
        },
        {
            "name": "Delta",
            "category": "Gas and Gas",
            "owner": None,
            "total_spend": 10202.01,
            "thirty_day_spend": 0.00,
            "ninety_day_spend": 0.00,
            "payment_method": PaymentMethod.CARD,
            "location": None,
            "department": None,
            "status": VendorStatus.ACTIVE,
            "tax_details_submitted": "No",
            "vendor_1099_2024": "No",
            "vendor_1099_2025": "No"
        },
        {
            "name": "Peamill",
            "category": "Accounting",
            "owner": "Kevin Malone",
            "total_spend": 10000.00,
            "thirty_day_spend": 0.00,
            "ninety_day_spend": 0.00,
            "payment_method": PaymentMethod.CARD,
            "location": "Boston",
            "department": "Finance & Accounting",
            "status": VendorStatus.ACTIVE,
            "tax_details_submitted": "No",
            "vendor_1099_2024": "No",
            "vendor_1099_2025": "No"
        },
        {
            "name": "Uber",
            "category": "Service Providers",
            "owner": None,
            "total_spend": 8683.67,
            "thirty_day_spend": 0.00,
            "ninety_day_spend": 0.00,
            "payment_method": PaymentMethod.CARD,
            "location": None,
            "department": None,
            "status": VendorStatus.ACTIVE,
            "tax_details_submitted": "No",
            "vendor_1099_2024": "No",
            "vendor_1099_2025": "No"
        },
        {
            "name": "Hyatt Union Square New York",
            "category": "Lodging",
            "owner": None,
            "total_spend": 7911.26,
            "thirty_day_spend": 0.00,
            "ninety_day_spend": 0.00,
            "payment_method": PaymentMethod.CARD,
            "location": None,
            "department": None,
            "status": VendorStatus.ACTIVE,
            "tax_details_submitted": "No",
            "vendor_1099_2024": "No",
            "vendor_1099_2025": "No"
        },
        {
            "name": "Giants suites",
            "category": "Other",
            "owner": None,
            "total_spend": 7100.00,
            "thirty_day_spend": 0.00,
            "ninety_day_spend": 0.00,
            "payment_method": PaymentMethod.CARD,
            "location": None,
            "department": None,
            "status": VendorStatus.ACTIVE,
            "tax_details_submitted": "No",
            "vendor_1099_2024": "No",
            "vendor_1099_2025": "No"
        },
        {
            "name": "Cloudy",
            "category": "Electronics",
            "owner": None,
            "total_spend": 5444.78,
            "thirty_day_spend": 0.00,
            "ninety_day_spend": 0.00,
            "payment_method": PaymentMethod.CARD,
            "location": None,
            "department": None,
            "status": VendorStatus.ACTIVE,
            "tax_details_submitted": "No",
            "vendor_1099_2024": "No",
            "vendor_1099_2025": "No"
        },
        {
            "name": "Amazon",
            "category": "E-commerce",
            "owner": "Jeff Bezos",
            "total_spend": 45230.50,
            "thirty_day_spend": 1200.00,
            "ninety_day_spend": 8500.00,
            "payment_method": PaymentMethod.CARD,
            "location": "Seattle",
            "department": "Operations",
            "status": VendorStatus.ACTIVE,
            "tax_details_submitted": "Yes",
            "vendor_1099_2024": "Yes",
            "vendor_1099_2025": "Yes"
        },
        {
            "name": "Amazon Web Services",
            "category": "SaaS / Software",
            "owner": "Tech Team",
            "total_spend": 89450.25,
            "thirty_day_spend": 7500.00,
            "ninety_day_spend": 22500.00,
            "payment_method": PaymentMethod.ACH,
            "location": "Seattle",
            "department": "Engineering",
            "status": VendorStatus.ACTIVE,
            "tax_details_submitted": "Yes",
            "vendor_1099_2024": "No",
            "vendor_1099_2025": "No"
        },
        {
            "name": "Google Workspace",
            "category": "SaaS / Software",
            "owner": "IT Department",
            "total_spend": 12800.00,
            "thirty_day_spend": 1200.00,
            "ninety_day_spend": 3600.00,
            "payment_method": PaymentMethod.CARD,
            "location": "Mountain View",
            "department": "IT",
            "status": VendorStatus.ACTIVE,
            "tax_details_submitted": "Yes",
            "vendor_1099_2024": "No",
            "vendor_1099_2025": "No"
        },
        {
            "name": "Slack Technologies",
            "category": "SaaS / Software",
            "owner": "HR Team",
            "total_spend": 8640.00,
            "thirty_day_spend": 720.00,
            "ninety_day_spend": 2160.00,
            "payment_method": PaymentMethod.CARD,
            "location": "San Francisco",
            "department": "Communications",
            "status": VendorStatus.ACTIVE,
            "tax_details_submitted": "No",
            "vendor_1099_2024": "No",
            "vendor_1099_2025": "No"
        },
        {
            "name": "Microsoft Corporation",
            "category": "SaaS / Software",
            "owner": "Enterprise Team",
            "total_spend": 125000.00,
            "thirty_day_spend": 10000.00,
            "ninety_day_spend": 30000.00,
            "payment_method": PaymentMethod.ACH,
            "location": "Redmond",
            "department": "IT",
            "status": VendorStatus.ACTIVE,
            "tax_details_submitted": "Yes",
            "vendor_1099_2024": "Yes",
            "vendor_1099_2025": "Yes"
        },
        {
            "name": "Salesforce",
            "category": "SaaS / Software",
            "owner": "Sales Team",
            "total_spend": 78400.00,
            "thirty_day_spend": 6533.33,
            "ninety_day_spend": 19600.00,
            "payment_method": PaymentMethod.CARD,
            "location": "San Francisco",
            "department": "Sales",
            "status": VendorStatus.ACTIVE,
            "tax_details_submitted": "Yes",
            "vendor_1099_2024": "No",
            "vendor_1099_2025": "No"
        },
        {
            "name": "FedEx",
            "category": "Shipping",
            "owner": None,
            "total_spend": 15680.00,
            "thirty_day_spend": 1250.00,
            "ninety_day_spend": 4100.00,
            "payment_method": PaymentMethod.CARD,
            "location": "Memphis",
            "department": "Logistics",
            "status": VendorStatus.ACTIVE,
            "tax_details_submitted": "No",
            "vendor_1099_2024": "No",
            "vendor_1099_2025": "No"
        },
        {
            "name": "UPS",
            "category": "Shipping",
            "owner": None,
            "total_spend": 18900.00,
            "thirty_day_spend": 1575.00,
            "ninety_day_spend": 4725.00,
            "payment_method": PaymentMethod.ACH,
            "location": "Atlanta",
            "department": "Logistics",
            "status": VendorStatus.ACTIVE,
            "tax_details_submitted": "Yes",
            "vendor_1099_2024": "Yes",
            "vendor_1099_2025": "No"
        },
        {
            "name": "WeWork",
            "category": "Real Estate",
            "owner": "Facilities",
            "total_spend": 96000.00,
            "thirty_day_spend": 8000.00,
            "ninety_day_spend": 24000.00,
            "payment_method": PaymentMethod.ACH,
            "location": "New York",
            "department": "Facilities",
            "status": VendorStatus.ACTIVE,
            "tax_details_submitted": "Yes",
            "vendor_1099_2024": "No",
            "vendor_1099_2025": "No"
        },
        {
            "name": "Starbucks",
            "category": "Food & Beverage",
            "owner": None,
            "total_spend": 3240.00,
            "thirty_day_spend": 270.00,
            "ninety_day_spend": 810.00,
            "payment_method": PaymentMethod.CARD,
            "location": "Seattle",
            "department": "Office",
            "status": VendorStatus.ACTIVE,
            "tax_details_submitted": "No",
            "vendor_1099_2024": "No",
            "vendor_1099_2025": "No"
        },
        {
            "name": "Zoom Video Communications",
            "category": "SaaS / Software",
            "owner": "IT Department",
            "total_spend": 14400.00,
            "thirty_day_spend": 1200.00,
            "ninety_day_spend": 3600.00,
            "payment_method": PaymentMethod.CARD,
            "location": "San Jose",
            "department": "IT",
            "status": VendorStatus.ACTIVE,
            "tax_details_submitted": "No",
            "vendor_1099_2024": "No",
            "vendor_1099_2025": "No"
        },
        {
            "name": "Adobe Systems",
            "category": "SaaS / Software",
            "owner": "Design Team",
            "total_spend": 22800.00,
            "thirty_day_spend": 1900.00,
            "ninety_day_spend": 5700.00,
            "payment_method": PaymentMethod.CARD,
            "location": "San Jose",
            "department": "Marketing",
            "status": VendorStatus.ACTIVE,
            "tax_details_submitted": "Yes",
            "vendor_1099_2024": "No",
            "vendor_1099_2025": "No"
        },
        {
            "name": "Atlassian",
            "category": "SaaS / Software",
            "owner": "Engineering",
            "total_spend": 18600.00,
            "thirty_day_spend": 1550.00,
            "ninety_day_spend": 4650.00,
            "payment_method": PaymentMethod.CARD,
            "location": "Sydney",
            "department": "Engineering",
            "status": VendorStatus.ACTIVE,
            "tax_details_submitted": "No",
            "vendor_1099_2024": "No",
            "vendor_1099_2025": "No"
        },
        {
            "name": "Dropbox",
            "category": "SaaS / Software",
            "owner": None,
            "total_spend": 7200.00,
            "thirty_day_spend": 600.00,
            "ninety_day_spend": 1800.00,
            "payment_method": PaymentMethod.CARD,
            "location": "San Francisco",
            "department": "IT",
            "status": VendorStatus.ACTIVE,
            "tax_details_submitted": "No",
            "vendor_1099_2024": "No",
            "vendor_1099_2025": "No"
        },
        {
            "name": "DocuSign",
            "category": "SaaS / Software",
            "owner": "Legal Team",
            "total_spend": 9840.00,
            "thirty_day_spend": 820.00,
            "ninety_day_spend": 2460.00,
            "payment_method": PaymentMethod.CARD,
            "location": "San Francisco",
            "department": "Legal",
            "status": VendorStatus.ACTIVE,
            "tax_details_submitted": "Yes",
            "vendor_1099_2024": "No",
            "vendor_1099_2025": "No"
        },
        {
            "name": "HubSpot",
            "category": "SaaS / Software",
            "owner": "Marketing Team",
            "total_spend": 36000.00,
            "thirty_day_spend": 3000.00,
            "ninety_day_spend": 9000.00,
            "payment_method": PaymentMethod.ACH,
            "location": "Cambridge",
            "department": "Marketing",
            "status": VendorStatus.ACTIVE,
            "tax_details_submitted": "Yes",
            "vendor_1099_2024": "Yes",
            "vendor_1099_2025": "No"
        },
        {
            "name": "GitHub",
            "category": "SaaS / Software",
            "owner": "Engineering",
            "total_spend": 16800.00,
            "thirty_day_spend": 1400.00,
            "ninety_day_spend": 4200.00,
            "payment_method": PaymentMethod.CARD,
            "location": "San Francisco",
            "department": "Engineering",
            "status": VendorStatus.ACTIVE,
            "tax_details_submitted": "No",
            "vendor_1099_2024": "No",
            "vendor_1099_2025": "No"
        },
        {
            "name": "Stripe",
            "category": "Payment Processing",
            "owner": "Finance",
            "total_spend": 52300.00,
            "thirty_day_spend": 4358.33,
            "ninety_day_spend": 13075.00,
            "payment_method": PaymentMethod.ACH,
            "location": "San Francisco",
            "department": "Finance",
            "status": VendorStatus.ACTIVE,
            "tax_details_submitted": "Yes",
            "vendor_1099_2024": "Yes",
            "vendor_1099_2025": "Yes"
        },
        {
            "name": "Acme Office Supplies",
            "category": "Office Supplies",
            "owner": None,
            "total_spend": 4560.00,
            "thirty_day_spend": 380.00,
            "ninety_day_spend": 1140.00,
            "payment_method": PaymentMethod.CARD,
            "location": "Chicago",
            "department": "Operations",
            "status": VendorStatus.ACTIVE,
            "tax_details_submitted": "No",
            "vendor_1099_2024": "No",
            "vendor_1099_2025": "No"
        },
        {
            "name": "Beta Consulting Group",
            "category": "Consulting",
            "owner": "Strategy Team",
            "total_spend": 125000.00,
            "thirty_day_spend": 0.00,
            "ninety_day_spend": 45000.00,
            "payment_method": PaymentMethod.WIRE,
            "location": "New York",
            "department": "Strategy",
            "status": VendorStatus.PENDING,
            "tax_details_submitted": "No",
            "vendor_1099_2024": "No",
            "vendor_1099_2025": "No"
        },
        {
            "name": "TechStart Innovations",
            "category": "SaaS / Software",
            "owner": None,
            "total_spend": 2400.00,
            "thirty_day_spend": 200.00,
            "ninety_day_spend": 600.00,
            "payment_method": PaymentMethod.CARD,
            "location": "Austin",
            "department": "R&D",
            "status": VendorStatus.INACTIVE,
            "tax_details_submitted": "No",
            "vendor_1099_2024": "No",
            "vendor_1099_2025": "No"
        }
    ]
    
    try:
        for vendor_data in vendors_data:
            vendor = Vendor(**vendor_data)
            db.add(vendor)
        
        db.commit()
        print(f"Successfully seeded {len(vendors_data)} vendors!")
        
        # verify
        count = db.query(Vendor).count()
        print(f"Total vendors in database: {count}")
        
    except Exception as e:
        db.rollback()
        print(f"Error seeding data: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    clear_data()
    seed_vendors()