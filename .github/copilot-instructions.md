# AI Coding Agent Instructions - ELK Bruteforce Demo

## Project Overview

This is a **security demonstration project** showcasing an ELK (Elasticsearch-Logstash-Kibana) stack that logs and visualizes login attempts, including brute force attack scenarios. The system consists of 6 containerized services orchestrated by Docker Compose.

### Architecture

```
nginx (port 80) → app (Node.js, port 3000) → filebeat → logstash (port 5044) → elasticsearch (port 9200)
                                                                                        ↓
                                                                                     kibana (port 5601)
```

**Data Flow:**
1. **nginx** serves `login.html` and reverse-proxies `/api/login` to Node.js app
2. **app** (Express.js) receives login attempts, logs them to `app-logs.log` with IP, username, password, status
3. **filebeat** monitors `app-logs.log` and ships logs to Logstash
4. **logstash** parses logs using GROK pattern, extracts fields (IP, username, password, status), timestamps
5. **elasticsearch** stores indexed logs by date (`forcebrute-YYYY.MM.dd`)
6. **kibana** visualizes attack patterns and brute force attempts

## Key Files & Patterns

### Log Format (Critical)
The app logs in a specific ISO8601 format that Logstash GROK pattern depends on:
```
[2025-01-15T10:30:45.123Z] 192.168.1.100 - /api/login - username:admin - password:pass123 - status:401
```
**Never change this format without updating `logstash/logstash.conf` GROK pattern.**

### API Endpoint
- **File:** `app/server.js`
- **Route:** `POST /api/login` - accepts `{username, password}` JSON
- **Success condition:** `password === "secret"` returns 200, otherwise 401
- **Logging:** Always logs attempt regardless of success/failure

### Docker Network
All services communicate via Docker internal network using service names as hostnames:
- Filebeat → Logstash: `logstash:5044`
- Logstash → Elasticsearch: `http://elasticsearch:9200`
- Kibana → Elasticsearch: `http://elasticsearch:9200`
- Nginx → App: `http://app:3000`

## Common Development Tasks

### Start the Stack
```bash
docker compose up -d
```

### View Logs
```bash
docker compose logs -f app          # App logs
docker compose logs -f logstash     # Logstash parsing/indexing
docker compose logs -f filebeat     # Filebeat collection
```

### Test Login Endpoint
```bash
curl -X POST http://localhost/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"secret"}'
```

### Access Kibana
Navigate to `http://localhost:5601` to view indexes and create visualizations.

### Monitor Elasticsearch
```bash
curl http://localhost:9200/_cat/indices?v    # View indexes
curl http://localhost:9200/forcebrute-*/_search  # Query logs
```

## Important Conventions

1. **Port Mapping Consistency:** External ports on docker-compose.yml match service defaults (3000→3000, 5601→5601, etc.)
2. **Volume Mounts:** App logs stored in `./app/app-logs.log` shared between app and filebeat containers
3. **Security Disabled:** Elasticsearch has `xpack.security.enabled=false` for demo purposes—never use in production
4. **Stateless Design:** No persistent data volumes; indexes lost on `docker compose down`
5. **Dependencies:** Kibana waits for Elasticsearch; Filebeat/Logstash don't have explicit wait logic

## When Modifying Components

- **Adding new app endpoint:** Ensure logs follow ISO8601 timestamp format; update Logstash GROK if log format changes
- **Changing log parsing:** Test with `logstash -f logstash.conf --config.test_and_exit` or simulate logs
- **Updating Docker images:** Pin specific versions in docker-compose.yml (currently 8.12.0 for ELK stack)
- **Nginx configuration:** Remember to rebuild app container if nginx.conf changes require reload
- **Filebeat monitoring:** Paths in filebeat.yml are container paths; map via volumes in docker-compose.yml

## Testing & Debugging

- **Brute force simulation:** Script multiple `/api/login` requests to generate detectable patterns in Kibana
- **Log parsing issues:** Check Logstash logs for GROK filter failures; test pattern at https://grokdebug.herokuapp.com/
- **Network connectivity:** Use `docker exec <container> curl <service>:<port>` to verify inter-service communication
- **File permissions:** If filebeat can't read logs, verify volume mount and file permissions in app container

---

**Last updated:** November 17, 2025
