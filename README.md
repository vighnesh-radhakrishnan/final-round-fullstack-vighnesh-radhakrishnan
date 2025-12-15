# Vendor Management System (Ramp's vendor interface)

A full-stack vendor management application recreating core functionality from Ramp's vendor interface. Built as a take-home assessment demonstrating fullstack development skills.

## Tech Stack

**Backend:** FastAPI, PostgreSQL, SQLAlchemy, Pydantic  
**Frontend:** React, TypeScript, Vite, TailwindCSS, ShadCN UI

## Project Structure

```
├── backend/
│   ├── main.py              # FastAPI application and route definitions
│   ├── models.py            # SQLAlchemy database models
│   ├── schemas.py           # Pydantic validation schemas
│   ├── crud.py              # Database operations
│   ├── database.py          # Database connection configuration
│   ├── seed.py              # Database seeding script
│   ├── init_db.py           # Database initialization
│   └── requirements.txt     # Python dependencies
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ui/          # ShadCN UI components
    │   │   └── vendors/     # Vendor UI components (VendorTable, VendorTableRow, VendorTableHeader, NewVendorModal, VendorFormFields, VendorActionsMenu, Pagination)
    │   ├── services/        # API integration layer
    │   ├── types/           # TypeScript type definitions
    │   └── hooks/           # Custom hooks (debounce)
    |   └── utils/           # Formatting utilities
    |   └── constants/       # For Constant variables
    └── package.json         # Node dependencies

```

## Features

### Implemented

- Complete CRUD API for vendor management
- Search vendors by name, category, or owner with debouncing
- Column sorting (vendor name, spend amounts, department, creation date, status)
- Right-side slide-in panel for vendor creation
- Pagination support for large datasets
- 30 pre-seeded vendor records with diverse data
- Full type safety with TypeScript and Pydantic
- CORS-enabled API for frontend integration
- Real-time table updates after vendor creation
- Bottom panel on check box selection with functioning deselect all feature
- Simplified New Vendor Form panel that takes basic info and creates a new vendor data to the table (redirects to vendor page after creation as required)
- Added EditVendorModal to support editing status, department, and owner

### Intentionally Omitted (As Per Requirements)

- Kebab menu next to "New Vendor" button
- Left sidebar navigation
- Top navigation bar
- Advanced vendor status filtering
- Checkbox bulk operations
- Contract column interactions
- Tax details editing
- Vendor detail page routing
- Multi-step vendor creation flow

## Installation

### 1. Clone the Repository

```bash
git clone git@github.com:vighnesh-radhakrishnan/final-round-fullstack-vighnesh-radhakrishnan.git
cd final-round-fullstack-vighnesh-radhakrishnan
```

Or using HTTPS:

```bash
git clone https://github.com/vighnesh-radhakrishnan/final-round-fullstack-vighnesh-radhakrishnan.git
cd final-round-fullstack-vighnesh-radhakrishnan
```

## Setup

### Prerequisites

- Node.js 18+
- Python 3.13+
- PostgreSQL 14+

### Backend

1. **Create database:**

```bash
psql postgres
```

```sql
CREATE DATABASE vendor_management;
CREATE USER vendor_user WITH PASSWORD 'vendor_pass';
GRANT ALL PRIVILEGES ON DATABASE vendor_management TO vendor_user;
\q
```

2. **Install and run:**

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. **Create `.env` file:**

```env
DATABASE_URL=postgresql://vendor_user:vendor_pass@localhost/vendor_management
SECRET_KEY=your-secret-key
ENVIRONMENT=development
```

4. **Initialize database:**

```bash
python init_db.py
python seed.py
uvicorn main:app --reload --port 8000
```

Backend runs at `http://localhost:8000`  
API docs at `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

## API Endpoints

| Method | Endpoint             | Description                                          |
| ------ | -------------------- | ---------------------------------------------------- |
| GET    | `/vendors`           | List all vendors (supports search, sort, pagination) |
| GET    | `/vendors/{id}`      | Get single vendor                                    |
| POST   | `/vendors`           | Create vendor                                        |
| PUT    | `/vendors/{id}`      | Update vendor                                        |
| DELETE | `/vendors/{id}`      | Delete vendor                                        |
| GET    | `/api/stats/summary` | Vendor statistics                                    |

### Examples

**Search:**

```bash
curl "http://localhost:8000/vendors?search=amazon"
```

**Sort:**

```bash
curl "http://localhost:8000/vendors?sort_by=total_spend&sort_order=desc"
```

**Create:**

```bash
curl -X POST http://localhost:8000/vendors \
  -H "Content-Type: application/json" \
  -d '{"name": "Acme Corp", "category": "Technology", "status": "active"}'
```

## Database Schema

**Vendors table:**

- `id`, `name`, `category`, `owner`
- `total_spend`, `thirty_day_spend`, `ninety_day_spend`
- `payment_method` (card/ach/check/wire)
- `location`, `department`, `status` (active/inactive/pending)
- `creation_date`, `updated_at`

## Implementation Notes

The vendor table displays all columns from Ramp's interface. Columns with unavailable data show placeholder values.

The vendor creation panel uses a simplified single-step form instead of Ramp's multi-step workflow, collecting basic vendor information with dropdown selections for payment and tax details (Not a full copy of original Ramp experience).

The current scrolling experience is incorrect; the vendor section should scroll independently, with the table header remaining fixed.

## Author

Vighnesh Radhakrishnan

**Repository shared with:** ashtonchew, tanmay-a-sharma
