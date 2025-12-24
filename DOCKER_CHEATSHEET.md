# Docker Cheat Sheet - Food Delivery App

## Quick Commands

### Start Everything
```bash
docker-compose up --build -d
```

### Check Status
```bash
docker-compose ps
```

### View Logs
```bash
docker-compose logs -f
docker-compose logs -f node-api-1
docker-compose logs -f python-api-1
```

### Stop Everything
```bash
docker-compose down
```

### Restart
```bash
docker-compose restart
```

---

## Architecture at a Glance

```
HTTP Requests
    ↓
Nginx (Port 80)
    ↓
    ├─ Node API 1 (internal port 3000)
    ├─ Node API 2 (internal port 3000)
    └─ Node API 3 (internal port 3000)
    ↓
Each Node talks to Python APIs
    ├─ Python API 1 (port 5000)
    └─ Python API 2 (port 5000)
    ↓
MongoDB (port 27017)
```

---

## Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost | React App |
| API | http://localhost/api | REST API |
| Health | http://localhost/healthz | Status check |
| MongoDB | localhost:27017 | Database |

---

## Services Breakdown

| Container | Role | Instances | Port |
|-----------|------|-----------|------|
| nginx-lb | Load Balancer | 1 | 80/443 |
| node-api-* | API Gateway | 3 | 3000 |
| python-api-* | Internal Service | 2 | 5000 |
| mongodb | Database | 1 | 27017 |
| frontend | UI | 1 | 5173 |

---

## Scaling

### Add Node.js Instance (to 4)
1. Edit `docker-compose.yml`
2. Copy `node-api-3` block → `node-api-4`
3. Update `nginx/nginx-lb.conf`: add `server node-api-4:3000`
4. `docker-compose up --build -d`

### Add Python Instance (to 3)
1. Edit `docker-compose.yml`
2. Copy `python-api-2` block → `python-api-3`
3. Point some Node instances to it
4. `docker-compose up --build -d`

---

## Debugging

### See what's running
```bash
docker ps
```

### Inspect container
```bash
docker inspect fooddelivery-node-api-1
```

### Enter container shell
```bash
docker exec -it fooddelivery-node-api-1 /bin/sh
```

### View detailed logs
```bash
docker-compose logs mongodb --tail=100
```

### Test API from container
```bash
docker exec fooddelivery-nginx-lb curl http://node-api-1:3000/api/health
```

---

## Cleanup

### Stop and remove containers
```bash
docker-compose down
```

### Remove everything including data
```bash
docker-compose down -v
```

### Remove unused images
```bash
docker image prune -a
```

---

## Performance Check

### Container resource usage
```bash
docker stats
```

### Database size
```bash
docker exec fooddelivery-mongodb mongosh -u santhosh_db_user -p san221155 --eval "db.stats()"
```

### Nginx upstreams status
```bash
curl http://localhost/nginx_stats
```

---

## Common Issues

| Issue | Fix |
|-------|-----|
| Port 80 in use | `lsof -i :80` then kill process |
| Container won't start | `docker-compose logs <name>` to see error |
| MongoDB connection error | Restart: `docker-compose restart mongodb` |
| High memory | Check `docker stats`, reduce replicas |
| Nginx not balancing | Check `nginx-lb.conf` upstream block |
| Node not reaching Python | Verify internal network connectivity |

---

## Configuration Files

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Service orchestration |
| `backend/node-service/Dockerfile` | Node.js image |
| `backend/flask-service/Dockerfile` | Python image |
| `frontend/Dockerfile` | React image |
| `nginx/nginx-lb.conf` | Load balancer config |
| `.env.docker` | Environment variables |

---

## What Gets Load Balanced?

**Nginx distributes:**
- ✅ All `/api/*` requests across 3 Node.js instances
- ✅ Health checks to verify instance availability
- ❌ NOT WebSocket (unless configured)
- ❌ NOT direct Python calls (Node calls Python internally)

**Result:**
- 1000 requests → distributed ~333 each to 3 instances
- If 1 instance fails → 500 requests split between 2
- When it recovers → auto-rebalances to 3

---

## Environment Variables

**Node.js:**
- `MONGODB_URI` - Database connection
- `JWT_SECRET` - Auth token secret
- `CORS_ORIGIN` - Allowed origins
- `DOWNSTREAM_BASE_URL` - Python service URL

**Python:**
- `MONGODB_URI` - Database connection
- `ALLOWED_ORIGIN` - Allow Node.js origin

**Frontend:**
- `VITE_API_URL` - API endpoint (http://localhost/api)

---

## Security Tips

1. **Change JWT_SECRET** before production
2. **Enable HTTPS** in nginx config
3. **Update MongoDB credentials** in docker-compose.yml
4. **Restrict CORS_ORIGIN** to your domain
5. **Use .env.prod** with secure values
6. **Enable rate limiting** in Nginx

---

**Last Updated**: December 23, 2025
