#!/bin/bash
# Reload Zoraxy config via REST API
curl -X POST http://localhost:${ZORAXY_PORT:-9500}/api/reload
