# Docker Setup Guide - Load Balanced Multi-Instance Architecture

## Overview

This Docker setup creates a **production-ready, load-balanced architecture** with:

- **3 Node.js API Gateway instances** behind Nginx
- **2 Python FastAPI instances** for internal services
- **1 MongoDB container** for data persistence
- **1 React Frontend**
- **1 Nginx Load Balancer** distributing traffic

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Nginx Load Balancer                  │
│                    (Port 80 / 443)                      │
└────────────┬────────────────────────┬───────────────────┘
             │                        │
      ┌──────▼──────┐          ┌──────▼──────┐
      │  Node API 1 │          │   Frontend  │
      │ (Port 3000) │          │  (Port 5173)│
      └──────┬──────┘          └─────────────┘
             │
      ┌──────┴──────┬──────────┐
      │             │          │
   ┌──▼──┐      ┌──▼──┐   ┌──▼──┐
   │Node2│      │Node3│   │Node4│
   └──┬──┘      └──┬──┘   └─────┘
      │            │
      └────┬───────┘
           │
    ┌──────▼────────┐
    │  MongoDB      │
    │  (Persistent) │
    └───────────────┘
    
    ├─ Python API 1 (5000)
    └─ Python API 2 (5000)
```

---

## Prerequisites

1. **Docker Desktop** installed and running
2. **Docker Compose** v1.29+ (included with Docker Desktop)
3. At least **4GB RAM** available for containers
4. Ports 80, 443, 3000, 5000, 5173, 27017 available

### Installation

**Windows:**
1. Download Docker Desktop from https://www.docker.com/products/docker-desktop
2. Install and restart your machine
3. Verify: `docker --version` and `docker-compose --version`

**macOS:**
```bash
brew install docker docker-compose
# or use Docker Desktop
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install docker.io docker-compose

# Start Docker daemon
sudo systemctl start docker
sudo systemctl enable docker
```

---

## Quick Start

### 1. Build and Start All Services

```bash
cd "d:\System Design\Food_delivery_app"
docker-compose up --build -d
```

**Flags explained:**
- `--build`: Rebuild images before starting
- `-d`: Run in detached mode (background)

### 2. Verify Services are Running

```bash
docker-compose ps
```

Expected output:
```
NAME                              STATUS              PORTS
fooddelivery-mongodb              Up (healthy)        27017
fooddelivery-python-api-1         Up (healthy)        
fooddelivery-python-api-2         Up (healthy)        
fooddelivery-node-api-1           Up (healthy)        
fooddelivery-node-api-2           Up (healthy)        
fooddelivery-node-api-3           Up (healthy)        
fooddelivery-frontend             Up (healthy)        
fooddelivery-nginx-lb             Up (healthy)        0.0.0.0:80->80, 0.0.0.0:443->443
```

### 3. Access the Application

- **Frontend**: http://localhost
- **API Gateway**: http://localhost/api
- **Health Check**: http://localhost/healthz
- **Nginx Stats**: http://localhost/nginx_stats

---

## Common Commands

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f node-api-1
docker-compose logs -f python-api-1
docker-compose logs -f nginx-lb
```

### Stop All Services

```bash
docker-compose down
```

### Stop and Remove Data (including MongoDB)

```bash
docker-compose down -v
```

### Restart Services

```bash
docker-compose restart
```

### Rebuild and Restart

```bash
docker-compose up --build --force-recreate
```

### Scale Services (add more instances)

```bash
# Add 2 more Node.js instances
docker-compose up --scale node-api=5 -d

# Add 1 more Python instance
docker-compose up --scale python-api=3 -d
```

---

## Service Details

### Nginx Load Balancer

**Configuration**: `./nginx/nginx-lb.conf`

**Load Balancing Strategy**: 
- **Least Connections** (least_conn) - distributes to instance with fewest active connections
- Monitors health with 3 retries, 30s timeout

**Routes:**
- `GET /api/*` → Node.js instances (round-robin)
- `GET /` → React Frontend
- `GET /healthz` → Health check endpoint

**Diagram:**
```
Client Request (http://localhost/api/users)
    ↓
Nginx LB (Port 80)
    ↓
    ├─→ Node API 1 (70% traffic)
    ├─→ Node API 2 (20% traffic)
    └─→ Node API 3 (10% traffic)
```

### Node.js API Gateway

**Containers**: `node-api-1`, `node-api-2`, `node-api-3`
**Port**: 3000 (internal, exposed via Nginx)
**Instances**: 3 (configurable in docker-compose.yml)

**Responsibilities:**
- Authenticate requests (JWT)
- Validate input
- Business logic
- Call Python backend for data

**Inter-service Communication:**
```
Node API 1 → Python API 1
Node API 2 → Python API 2
Node API 3 → Python API 1 (fallback)
```

### Python FastAPI Backend

**Containers**: `python-api-1`, `python-api-2`
**Port**: 5000 (internal)
**Instances**: 2 (configurable in docker-compose.yml)

**Responsibilities:**
- Restaurant listing
- Menu management
- ETA calculation
- Delivery tracking

### MongoDB

**Container**: `fooddelivery-mongodb`
**Port**: 27017 (internal + external for dev)
**Credentials**:
- Username: `santhosh_db_user`
- Password: `san221155`
- Database: `fooddelivery_prod`

**Persistence**: Data stored in `mongodb_data` volume

**Connect from host:**
```bash
mongosh mongodb://santhosh_db_user:san221155@localhost:27017/fooddelivery_prod
```

### React Frontend

**Container**: `fooddelivery-frontend`
**Port**: 5173 (internal, exposed via Nginx)
**Build**: Multi-stage build (builder + production)
**Served by**: `serve` package

---

## Load Balancing in Action

### How Traffic is Distributed

**Before (Single Instance):**
```
All 1000 requests → Node API 1 (bottleneck)
```

**After (3 Instances):**
```
Requests → Nginx → Distributed:
  ├─ 334 requests → Node API 1
  ├─ 333 requests → Node API 2
  └─ 333 requests → Node API 3
```

### Health Checks

Each service has health checks running every 10 seconds:
```bash
# Node.js
GET http://localhost:3000/api/health

# Python
GET http://localhost:5000/healthz

# MongoDB
mongosh ping

# Nginx
GET http://localhost/healthz
```

If a service fails 3 health checks in a row (30 seconds), it's marked as down and excluded from load balancing.

---

## Testing Load Distribution

### Monitor which instance handles requests

**Terminal 1: Watch Nginx logs**
```bash
docker-compose logs -f nginx-lb | grep -i "proxy_pass"
```

**Terminal 2: Send test requests**
```bash
# Linux/Mac
for i in {1..20}; do curl -s http://localhost/api/health | jq .; sleep 0.5; done

# Windows PowerShell
for ($i = 1; $i -le 20; $i++) { 
  curl -s http://localhost/api/health | ConvertFrom-Json
  Start-Sleep -Milliseconds 500
}
```

**Expected**: Requests distributed among node-api-1, node-api-2, node-api-3

### Simulate Instance Failure

```bash
# Stop one Node.js instance
docker-compose stop node-api-1

# Monitor with htop
docker stats

# New requests now go to node-api-2 and node-api-3
# When node-api-1 comes back up, it rejoins the pool
docker-compose start node-api-1
```

---

## Performance Tuning

### Increase Replicas

Edit `docker-compose.yml`:

**Node.js (3 → 5 instances):**
```yaml
node-api-4:  # Add copy of node-api-1
  build: ...
  container_name: fooddelivery-node-api-4
  ...

node-api-5:  # Add copy of node-api-2
  build: ...
  container_name: fooddelivery-node-api-5
  ...
```

Update Nginx config (`./nginx/nginx-lb.conf`):
```nginx
upstream node_backend {
    server node-api-1:3000;
    server node-api-2:3000;
    server node-api-3:3000;
    server node-api-4:3000;
    server node-api-5:3000;
}
```

Then restart:
```bash
docker-compose up --build -d
```

### Increase Container Resources

Edit `docker-compose.yml`:
```yaml
node-api-1:
  deploy:
    resources:
      limits:
        cpus: '0.5'        # 50% of 1 CPU
        memory: 512M       # 512MB RAM
      reservations:
        cpus: '0.25'
        memory: 256M
```

### Enable Rate Limiting

Uncomment in `./nginx/nginx-lb.conf`:
```nginx
location /api/auth/ {
    limit_req zone=auth_limit burst=10 nodelay;
    proxy_pass http://node_backend;
}
```

---

## Monitoring

### Real-time Container Stats

```bash
docker stats

# Specific container
docker stats fooddelivery-node-api-1
```

### View Nginx Upstream Status

```bash
curl http://localhost/nginx_stats
```

### Database Monitoring

```bash
# Connect to MongoDB
docker exec -it fooddelivery-mongodb mongosh -u santhosh_db_user -p san221155

# Inside mongosh:
use fooddelivery_prod
db.stats()
db.users.count()
db.orders.count()
```

---

## Troubleshooting

### Containers not starting

```bash
# Check logs
docker-compose logs --tail=50

# Specific service
docker-compose logs python-api-1
```

### Port already in use

```bash
# Find process using port 80
lsof -i :80                    # macOS/Linux
netstat -ano | findstr :80     # Windows

# Kill it
kill -9 <PID>                  # macOS/Linux
taskkill /PID <PID> /F         # Windows
```

### MongoDB connection failed

```bash
# Check MongoDB logs
docker-compose logs mongodb

# Restart MongoDB and dependent services
docker-compose restart mongodb
docker-compose restart node-api-1 node-api-2 node-api-3
```

### High memory usage

```bash
# Check which container uses most memory
docker stats

# Reduce replicas or increase host RAM
docker-compose down
# Edit docker-compose.yml, remove some replicas
docker-compose up -d
```

---

## Production Deployment

### Before Going Live

1. **Change JWT Secret**
   ```bash
   # Generate strong secret
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Update in `docker-compose.yml`:
   ```yaml
   JWT_SECRET: <your-generated-secret>
   ```

2. **Enable HTTPS**
   - Get SSL certificates (Let's Encrypt recommended)
   - Place in `./nginx/certs/`
   - Uncomment SSL lines in `./nginx/nginx-lb.conf`

3. **Set Production Environment**
   ```yaml
   NODE_ENV: production
   CORS_ORIGIN: https://yourdomain.com
   ```

4. **Configure Backups**
   ```bash
   # Regular MongoDB backups
   docker exec fooddelivery-mongodb mongodump --out /backup
   ```

5. **Enable Monitoring**
   - Set up Prometheus + Grafana
   - Configure log aggregation (ELK stack)
   - Set up alerts

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy to Docker
on: [push]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build images
        run: docker-compose build
      - name: Push to registry
        run: docker-compose push
      - name: Deploy
        run: docker-compose up -d
```

---

## Clean Up

```bash
# Stop all services
docker-compose down

# Remove data volumes
docker-compose down -v

# Remove unused images
docker image prune -a

# Remove unused networks
docker network prune

# Remove everything (nuclear option)
docker system prune -a --volumes
```

---

## Next Steps

1. ✅ All services running
2. Test API endpoints at http://localhost/api
3. Monitor with `docker stats`
4. Add more instances as needed
5. Deploy to production cluster

---

**Last Updated**: December 23, 2025
**Version**: 1.0.0 - Docker Multi-Instance Architecture
