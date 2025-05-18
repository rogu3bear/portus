# Security Hardening Guide

This document outlines recommended security settings for deploying Portus.

## Environment Variables
- **SECRET_KEY**: Set to a long, random string.
- **AUTH_ENABLED**: Keep `true` in production to enforce login.
- **AUTH_SESSION_EXPIRY_MINUTES**: Adjust according to desired session length.

## HTTP Security Headers
Portus sets the following headers via middleware:
- `Strict-Transport-Security`
- `X-Frame-Options`
- `X-Content-Type-Options`
- `Referrer-Policy`
- `Content-Security-Policy`

Ensure TLS is enabled so HSTS takes effect.
