# Caching Proxy

A high-performance HTTP caching proxy server that caches responses from any origin server with configurable TTL (Time To Live). Built with TypeScript, Express, and Docker support.

> **Note**: This project is based on the [Caching Server](https://roadmap.sh/projects/caching-server) challenge from [roadmap.sh](https://roadmap.sh).

## Features

- 🚀 **Fast Caching**: In-memory caching with SHA256-based cache keys
- ⏱️ **Configurable TTL**: Set custom time-to-live for cached responses
- 🔒 **HTTPS Support**: Built-in support for HTTPS origins with custom agent
- 🎯 **Smart Cache Keys**: Intelligent cache key generation based on method, URL, query params, and selected headers
- 📊 **Cache Status Headers**: `X-Cache: HIT` or `X-Cache: MISS` headers for debugging
- 🐳 **Docker Ready**: Complete Docker and Docker Compose support
- 🛠️ **CLI Interface**: Easy-to-use command-line interface

## Installation

### Prerequisites

- Node.js 20.x or higher
- npm or yarn

### Local Installation

```bash
# Clone the repository
git clone https://github.com/Mahesh77r/caching-proxy.git
cd caching-proxy

# Install dependencies
npm install

# Build the project
npm run build

# Link globally (optional)
npm link
```

## Usage

### CLI

```bash
caching-proxy --port <PORT> --origin <ORIGIN_URL> --ttl <TTL_SECONDS>
```

**Options:**
- `--port <number>`: Port number for the proxy server (default: `8001`)
- `--origin <url>`: Origin server URL to proxy requests to (default: `https://example.com`)
- `--ttl <number>`: Cache TTL in seconds (default: `604800` - 7 days)
- `--clear-cache`: Clear the cache (optional)

**Example:**
```bash
caching-proxy --port 8000 --origin 'https://dummyjson.com' --ttl 120
```

### Docker

#### Build and Run

```bash
# Build the Docker image
docker build -t caching-proxy .

# Run the container
docker run -p 4400:8000 caching-proxy --port 8000 --origin 'https://dummyjson.com' --ttl 120
```

**Note:** Map the host port to the container's internal port using `-p <host_port>:<container_port>`

#### Docker Compose

```bash
# Start the service
docker-compose up

# Start in detached mode
docker-compose up -d

# Stop the service
docker-compose down
```

**Customize Docker Compose:**

Edit `docker-compose.yml` to change default settings:

```yaml
services:
  caching-proxy:
    command: ["--port", "8000", "--origin", "https://your-api.com", "--ttl", "300"]
    ports:
      - "4400:8000"  # host:container
```

### Local Development

```bash
# Run in development mode with hot reload
npm run dev

# Run the CLI in development
npm run cli -- --port 8000 --origin 'https://dummyjson.com' --ttl 120


## How It Works

### Caching Strategy

1. **Cache Key Generation**: Each request generates a unique cache key using SHA256 hash of:
   - HTTP method
   - URL path
   - Query parameters
   - Selected headers (authorization, accept, content-type)

2. **Cache Lookup**: Incoming requests check if a valid cached response exists
   - If found and not expired: Returns cached response with `X-Cache: HIT` header
   - If not found or expired: Forwards request to origin server with `X-Cache: MISS` header

3. **TTL Management**: Cached responses expire after the configured TTL period

### Supported HTTP Methods

Only the following methods are cached:
- `GET`
- `HEAD`
- `OPTIONS`

Other methods (POST, PUT, DELETE, etc.) are forwarded to the origin without caching.

### Header Management

The proxy automatically:
- Removes problematic headers before forwarding (`host`, `connection`, `content-length`, `accept-encoding`)
- Preserves response headers from the origin
- Adds `X-Cache` header to indicate cache status

## API Endpoints

### Proxy Endpoint

**All routes** (except `/api/health-check`) are proxied to the origin server.

```bash
# Example: Proxy GET request
curl http://localhost:8000/products

# Check cache status
curl -I http://localhost:8000/products | grep X-Cache
```

### Health Check

**GET** `/api/health-check`

Returns the health status of the proxy server.

```bash
curl http://localhost:8000/api/health-check
```

**Response:**
```json
{
  "message": "OK"
}
```

## Project Structure

```
caching-proxy/
├── src/
│   ├── cache.ts                    # Cache management (get, set, clear)
│   ├── index.ts                    # CLI entry point
│   ├── server.ts                   # Express server setup
│   ├── proxy.ts                    # Proxy handler logic
│   ├── enums/
│   │   └── methods.enum.ts         # HTTP methods enum
│   └── lib/
│       ├── cache/
│       │   └── buildKey.ts         # Cache key generation
│       ├── http/
│       │   └── httpClient.ts       # Axios client configuration
│       └── types/
│           └── custom.types.ts     # TypeScript type definitions
├── dist/                           # Compiled JavaScript (generated)
├── Dockerfile                      # Docker image definition
├── docker-compose.yml              # Docker Compose configuration
├── .dockerignore                   # Docker ignore file
├── tsconfig.json                   # TypeScript configuration
├── package.json                    # Project metadata
└── README.md                       # This file
```

## Configuration

### Environment Variables

When using Docker, you can set environment variables:

```bash
docker run -p 8000:8000 \
  -e PORT=8000 \
  -e ORIGIN=https://api.example.com \
  -e TTL=300 \
  caching-proxy
```

### TypeScript Configuration

The project uses TypeScript with ES modules. Key settings in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

## Performance

- **In-memory caching**: Fast lookups with O(1) complexity
- **SHA256 hashing**: Secure and collision-resistant cache keys
- **Efficient TTL**: Automatic expiration without background jobs
- **Connection pooling**: Reuses HTTP connections to origin server

## Security Considerations

- The proxy disables SSL certificate verification for HTTPS origins (configured in `httpClient.ts`)
- Consider enabling certificate verification for production use
- Implement authentication/authorization as needed for your use case

## Troubleshooting

### Port Already in Use

If you get an "EADDRINUSE" error, the port is already occupied:

```bash
# Use a different port
caching-proxy --port 9000 --origin 'https://dummyjson.com' --ttl 120
```

### Docker Port Mapping

Ensure the host port and container port are correctly mapped:

```bash
# Correct: Map host port 4400 to container port 8000
docker run -p 4400:8000 caching-proxy --port 8000 --origin 'https://dummyjson.com' --ttl 120

# Access via: http://localhost:4400
```

### Cache Not Working

Check the `X-Cache` header in the response to verify caching status:

```bash
curl -I http://localhost:8000/your-endpoint | grep X-Cache
```

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Author

Mahesh Rohane

---

**Note**: This is a development/educational project. For production use, consider additional features like:
- Persistent caching (Redis, Memcached)
- Cache invalidation strategies
- Rate limiting
- Authentication
- Monitoring and metrics
- SSL certificate verification
