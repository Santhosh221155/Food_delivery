# Food Delivery Application - Docker Architecture

## System Architecture Overview

```
┌────────────────────────────────────────────────────────────────────────────┐
│                         CLIENT REQUESTS                                    │
│                    (Browser, Mobile App, etc.)                             │
└───────────────────────────────┬──────────────────────────────────────────────┘
                                │
                                │ HTTP/HTTPS
                                │ (Port 80/443)
                                ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                     NGINX LOAD BALANCER                                    │
│                   (fooddelivery-nginx-lb)                                  │
│                                                                             │
│  ┌─────────────┐  ┌──────────────────────────────────────────────────┐    │
│  │ Port 80/443 │  │ Algorithms:                                      │    │
│  │ (HTTP/HTTPS)│  │ • Least connections                              │    │
│  └─────────────┘  │ • Health checks every 10s                        │    │
│                   │ • Auto-failover on 3 consecutive failures        │    │
│                   └──────────────────────────────────────────────────┘    │
└───────────┬───────────────────────────────────┬────────────────────────────┘
            │                                   │
    ┌───────▼────────┐              ┌──────────▼───────────┐
    │ /api/* Routes  │              │  / Routes            │
    │ (API Gateway)  │              │ (Frontend)           │
    └───────┬────────┘              └──────────┬───────────┘
            │                                  │
            │                        ┌─────────▼────────┐
            │                        │ REACT FRONTEND   │
            │                        │ (Port 5173)      │
            │                        │                  │
            │                        │ • User interface │
            │                        │ • Zustand store  │
            │                        │ • React Router   │
            │                        └──────────────────┘
            │
    ┌───────┴────────────────────────────────┐
    │                                        │
    ▼                                        ▼
┌────────────────┐                ┌─────────────────┐
│  NODE-API-1    │                │  NODE-API-2     │
│  (Port 3000)   │                │  (Port 3000)    │
│                │                │                 │
│ ┌────────────┐ │                │ ┌────────────┐  │
│ │Controllers │ │                │ │Controllers │  │
│ │ • Auth     │ │                │ │ • Auth     │  │
│ │ • Orders   │ │                │ │ • Orders   │  │
│ │ • Users    │ │                │ │ • Users    │  │
│ └──────┬─────┘ │                │ └──────┬─────┘  │
│        │       │                │        │       │
│ ┌──────▼─────┐ │                │ ┌──────▼─────┐ │
│ │ Services   │ │                │ │ Services   │ │
│ │ • Validate │ │                │ │ • Validate │ │
│ │ • Business │ │                │ │ • Business │ │
│ │ • DB Calls │ │                │ │ • DB Calls │ │
│ └──────┬─────┘ │                │ └──────┬─────┘ │
│        │       │                │        │       │
│ ┌──────▼──────────────────────┐ │        │       │
│ │ Middleware                   │ │        │       │
│ │ • JWT Auth                   │ │        │       │
│ │ • Error Handler              │ │        │       │
│ │ • Validation                 │ │        │       │
│ └──────┬──────────────────────┘ │        │       │
└────────┼──────────────────────────────┬──┘
         │                             │
    ┌────▼─────────────────────────────▼──┐
    │ Both call Python Backend Services   │
    │ (Internal microservice)             │
    └────┬────────────────────────────┬───┘
         │                            │
         ▼                            ▼
    ┌─────────────┐            ┌──────────────┐
    │ PYTHON-API-1│            │ PYTHON-API-2 │
    │ (Port 5000) │            │ (Port 5000)  │
    │             │            │              │
    │ FastAPI     │            │ FastAPI      │
    │ Uvicorn     │            │ Uvicorn      │
    │             │            │              │
    │ Routes:     │            │ Routes:      │
    │ • /healthz  │            │ • /healthz   │
    │ • /internal/│            │ • /internal/ │
    │   restaurants           │   restaurants
    │ • /internal/│            │ • /internal/ │
    │   menu      │            │   menu       │
    │ • /internal/│            │ • /internal/ │
    │   eta       │            │   eta        │
    │ • /internal/│            │ • /internal/ │
    │   delivery  │            │   delivery   │
    └────────┬────┘            └──────┬───────┘
             │                       │
             └───────────┬───────────┘
                         │
                         ▼
            ┌─────────────────────────┐
            │      MONGODB            │
            │ (fooddelivery-mongodb)  │
            │   (Port 27017)          │
            │                         │
            │ Collections:            │
            │ • users                 │
            │ • orders                │
            │ • restaurants           │
            │ • menu_items            │
            │ • deliveries            │
            │                         │
            │ Persistence:            │
            │ mongodb_data volume     │
            └─────────────────────────┘
```

---

## Network Topology (Docker Network)

```
Docker Network: fooddelivery-network (bridge)
├── nginx-lb:
│   ├── Port 80 (exposed to host)
│   ├── Port 443 (exposed to host)
│   └── Internal DNS: nginx-lb
│
├── node-api-1:
│   ├── Port 3000 (internal only)
│   └── Internal DNS: node-api-1
│
├── node-api-2:
│   ├── Port 3000 (internal only)
│   └── Internal DNS: node-api-2
│
├── node-api-3:
│   ├── Port 3000 (internal only)
│   └── Internal DNS: node-api-3
│
├── python-api-1:
│   ├── Port 5000 (internal only)
│   └── Internal DNS: python-api-1
│
├── python-api-2:
│   ├── Port 5000 (internal only)
│   └── Internal DNS: python-api-2
│
├── frontend:
│   ├── Port 5173 (internal, served via nginx)
│   └── Internal DNS: frontend
│
└── mongodb:
    ├── Port 27017 (exposed to host for dev)
    └── Internal DNS: mongodb
```

---

## Request Flow Examples

### Example 1: User Signup

```
┌─────────────────────────────────────────────────────────────┐
│ 1. BROWSER SENDS REQUEST                                    │
│    POST http://localhost/api/auth/signup                    │
│    Content: {email, name, password}                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│ 2. NGINX LOAD BALANCER                                      │
│    • Receives request on port 80                            │
│    • Checks upstream nodes health status                    │
│    • Selects node with least connections                    │
│    • Forwards to (example) node-api-2                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│ 3. NODE-API-2 GATEWAY                                       │
│    • Receives request via /api/auth/signup                  │
│    • Routes to authController.signup()                      │
│    • Validates input with express-validator                │
│    • Calls authService.signup()                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│ 4. USER SERVICE                                             │
│    • Checks for duplicate email in MongoDB                  │
│    • Hashes password with bcryptjs                          │
│    • Generates JWT token                                    │
│    • Saves user to database                                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│ 5. MONGODB                                                  │
│    • Stores new user in 'users' collection                  │
│    • Returns success acknowledgment                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│ 6. RESPONSE BACK                                            │
│    {success: true, data: {user, token}}                     │
│    • Node API 2 → Nginx → Browser                           │
│    • Browser stores token in localStorage                   │
│    • Frontend redirects to /home                            │
└─────────────────────────────────────────────────────────────┘
```

### Example 2: Place Order

```
┌─────────────────────────────────────────────────────────────┐
│ 1. USER CLICKS "ORDER" (Authenticated)                      │
│    POST http://localhost/api/orders                         │
│    Headers: Authorization: Bearer <jwt_token>               │
│    Body: {restaurantId, items, total, deliveryAddress}      │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│ 2. NGINX ROUTES TO NODE (Least connections algo)            │
│    → Selects node-api-1 (has fewest active requests)        │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│ 3. NODE-API-1                                               │
│    • Auth middleware verifies JWT                           │
│    • Validation middleware checks input                     │
│    • Calls orderController.createOrder()                    │
│    • Calls orderService.createOrder()                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│ 4. PYTHON BACKEND CALL (with retry logic)                   │
│    • Node calls python-api-1:5000/internal/eta              │
│    • Axios retry: if fails, tries python-api-2              │
│    • Python calculates delivery ETA (30 mins)               │
│    • Python assigns delivery partner                        │
│    • Returns {eta: 30, assignedTo: "John"}                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│ 5. SAVE TO MONGODB                                          │
│    • Order saved to 'orders' collection                     │
│    • Delivery saved to 'deliveries' collection              │
│    • Returns order confirmation                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│ 6. RESPONSE TO USER                                         │
│    {success: true, data: {orderId, status, eta}}            │
│    • Frontend shows "Order Placed!"                         │
│    • Redirects to order tracking page                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Load Balancing in Action

### Request Distribution Visualization

```
INCOMING: 10 requests (simulated)

Nginx sees:
┌──────────────────────────────────┐
│ Request 1 → Node 1 (50 active)   │
│ Request 2 → Node 3 (45 active) ✓ │  Least connections
│ Request 3 → Node 3 (46 active)   │  chooses Node 3
│ Request 4 → Node 2 (48 active)   │
│ Request 5 → Node 3 (47 active) ✓ │
│ Request 6 → Node 1 (51 active)   │
│ Request 7 → Node 2 (49 active)   │
│ Request 8 → Node 3 (48 active) ✓ │
│ Request 9 → Node 1 (52 active)   │
│ Request 10→ Node 2 (50 active)   │
└──────────────────────────────────┘

RESULT:
Node 1: 3 requests (30%)
Node 2: 3 requests (30%)
Node 3: 4 requests (40%) ← had fewest connections initially
```

---

## Failure Handling Sequence

### Scenario: Node-API-2 Crashes at T=0

```
T=0:      Node API 2 process dies (connection reset)
          ├─ Running requests fail immediately
          └─ Nginx health check still shows healthy (cache)

T=0-10s:  Nginx sends periodic requests:
          ├─ Node 1: ✓ 200 OK
          ├─ Node 2: ✗ Connection refused (1st fail)
          └─ Node 3: ✓ 200 OK
          
          New requests:
          ├─ Node 1: some traffic
          ├─ Node 2: still getting ~33% (health not failed yet)
          └─ Node 3: some traffic

T=10-20s: Health checks continue:
          ├─ Node 1: ✓ 200 OK
          ├─ Node 2: ✗ Connection refused (2nd fail)
          └─ Node 3: ✓ 200 OK
          
          New requests: (same distribution, still 33%)

T=20-30s: Health checks:
          ├─ Node 1: ✓ 200 OK
          ├─ Node 2: ✗ Connection refused (3rd fail - THRESHOLD)
          └─ Node 3: ✓ 200 OK
          
          ACTION: Nginx marks Node 2 as DOWN
          
          New requests now only go to:
          ├─ Node 1: ~50%
          └─ Node 3: ~50%
          (Node 2 EXCLUDED)

T=30s+:   Node 2 comes back online
          ├─ Starts responding again
          └─ Nginx detects ✓ 200 OK
          
          AUTOMATIC: Node 2 added back to pool
          
          New requests distribution:
          ├─ Node 1: ~33%
          ├─ Node 2: ~33%
          └─ Node 3: ~34%
          (Back to balanced)
```

---

## Container Lifecycle

```
┌──────────────────────────────────────────────────────────────┐
│                  docker-compose up --build -d                │
└──────────────────┬───────────────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
  ┌──────────────┐    ┌────────────────┐
  │ BUILD IMAGES │    │ PULL IMAGES    │
  │              │    │ (mongo, nginx) │
  │ Node Image   │    └────────┬───────┘
  │ Python Image │             │
  │ Frontend     │             │
  └──────┬───────┘             │
         └──────────┬──────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │ MONGODB STARTS FIRST  │
        │                       │
        │ Port 27017            │
        │ Wait for health: OK   │
        └───────────┬───────────┘
                    │
    ┌───────────────┼───────────────┐
    │               │               │
    ▼               ▼               ▼
┌────────┐   ┌────────┐      ┌─────────┐
│Python1 │   │Python2 │      │Frontend │
│Start   │   │Start   │      │Start    │
│:5000   │   │:5000   │      │:5173    │
│Wait ✓  │   │Wait ✓  │      │Build ✓  │
└───┬────┘   └───┬────┘      └────┬────┘
    │           │                 │
    └─────┬─────┴─────────────────┘
          │
          ▼
    ┌──────────────────────┐
    │ NODE APIS START      │
    │                      │
    │ node-api-1:3000 ✓    │
    │ node-api-2:3000 ✓    │
    │ node-api-3:3000 ✓    │
    │                      │
    │ All call Python ✓    │
    └──────────┬───────────┘
               │
               ▼
        ┌──────────────────┐
        │ NGINX STARTS     │
        │                  │
        │ Port 80 ✓        │
        │ Port 443 ✓       │
        │                  │
        │ Upstream health: │
        │ All 3 nodes: OK  │
        └─────────┬────────┘
                  │
                  ▼
        ┌──────────────────┐
        │ ALL READY!       │
        │                  │
        │ http://localhost │
        │ (ready to serve) │
        └──────────────────┘
```

---

## Resource Usage Example

```
BEFORE (Single Instance):
┌────────────────────────────────────┐
│ Node API    │ CPU: 45%  MEM: 180MB │
│ Python API  │ CPU: 25%  MEM: 150MB │
│ MongoDB     │ CPU: 15%  MEM: 300MB │
│ Frontend    │ CPU: 10%  MEM: 100MB │
├────────────────────────────────────┤
│ TOTAL       │ CPU: 95%  MEM: 730MB │
│ STATUS      │ High CPU, reaching limit
└────────────────────────────────────┘

AFTER Docker (3 Node + 2 Python + MongoDB):
┌────────────────────────────────────┐
│ Node API 1  │ CPU: 15%  MEM: 120MB │
│ Node API 2  │ CPU: 16%  MEM: 125MB │
│ Node API 3  │ CPU: 14%  MEM: 118MB │
│ Python API1 │ CPU: 12%  MEM: 90MB  │
│ Python API2 │ CPU: 13%  MEM: 92MB  │
│ MongoDB     │ CPU: 10%  MEM: 300MB │
│ Frontend    │ CPU: 8%   MEM: 95MB  │
│ Nginx       │ CPU: 5%   MEM: 50MB  │
├────────────────────────────────────┤
│ TOTAL       │ CPU: 93%  MEM: 990MB │
│ STATUS      │ More resources used, but:
│             │ - Better distributed
│             │ - 3x throughput
│             │ - Auto-failover
│             │ - Much better scaling
└────────────────────────────────────┘

BENEFIT: CPU per instance much lower, can handle 3x traffic
```

---

**Last Updated**: December 23, 2025
