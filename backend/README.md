# FoodDash Backends

Two services behind an nginx load balancer, with MongoDB Atlas connectivity placeholders.

- **node-service** (Service A): public-facing API, calls Flask for menus.
- **flask-service** (Service B): internal menu provider, can be extended for core domain logic.
- **nginx-lb**: fronts node-service at port 8080.
- **MongoDB Atlas**: configure `MONGODB_URI` env var (shared by both services).

## Run locally (Docker)

```bash
cd backend
# set MONGODB_URI if you want live DB connectivity
# on PowerShell:
# $env:MONGODB_URI="mongodb+srv://user:pass@cluster0.example.mongodb.net/fooddash"
docker-compose up --build
```

- Nginx LB: http://localhost:8080
- Node API: http://localhost:3000 (proxied via LB)
  - Health: `GET /healthz`
  - Restaurants: `GET /api/restaurants`
  - Menu (proxy to Flask): `GET /api/menu/:restaurantId`
- Flask internal: http://localhost:5000
  - Health: `GET /healthz`
  - Menu: `GET /internal/menu/:restaurantId`

## Environment
- `MONGODB_URI` (optional for now). Use Atlas SRV string.
- `DOWNSTREAM_BASE_URL` defaults to Flask service inside compose.

## Extending
- Add schemas/models in Node (Mongoose) and Flask (PyMongo) as needed.
- Update nginx.conf for more routes or path-based routing.
- Add auth (JWT) and rate limiting at Node or nginx.
