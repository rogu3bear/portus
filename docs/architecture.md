# Architecture Overview

This high-level diagram shows how the main components of Portus interact:

```
[ UI ] ---> [ Backend API ] ---> [ Zoraxy Proxy ]
                 |
                 +--> [ CoreDNS ]
                 |
                 +--> [ SQLite DB ]
```

The UI communicates with the backend API to manage services. The backend updates
both Zoraxy for reverse proxy rules and CoreDNS for DNS records, storing
configuration in SQLite.

For detailed request flows see [function-flow.md](function-flow.md).
