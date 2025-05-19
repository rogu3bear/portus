# Advanced Configuration

This document outlines optional settings for customizing a Portus deployment.

## Override Ports

- `API_PORT` - API server port
- `UI_PORT` - React UI port
- `DNS_PORT` - CoreDNS listening port
- `ZORAXY_PORT` - Zoraxy proxy port

## Enabling TLS

Traefik can be configured to terminate TLS. Update `docker-compose.prod.yml` and
provide certificates via volumes or an ACME provider.

## Custom CoreDNS Zone

Adjust `DNS_DOMAIN` and update `Corefile` to serve additional zones or records.

## Authentication Settings

- `AUTH_ENABLED` toggles login requirement.
- `AUTH_SESSION_EXPIRY_MINUTES` controls session duration.

Refer to `project_config.md` for full configuration reference.
