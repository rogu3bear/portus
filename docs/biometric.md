# WebAuthn Biometric Setup

Portus supports optional biometric authentication using the WebAuthn standard. The backend relies on the optional `fido2` Python package. If the package is not installed, the `/auth/webauthn` endpoints return a `501` status code.

The biometric implementation stores credentials in-memory and is intended for development use only. Production deployments should replace this with persistent storage.

## Registration
- Begin registration by sending a `GET /auth/webauthn?username=<name>` request.
- Pass the returned options to `navigator.credentials.create()` in the browser.
- POST the resulting credential to `/auth/webauthn?username=<name>` to complete registration.
- Alternatively, navigate to the WebAuthn registration page in the UI (future feature) and follow your browser prompts to register a security key, fingerprint reader, or facial recognition device.

## Login
- Initiate authentication with `GET /auth/webauthn?username=<name>`.
- Call `navigator.credentials.get()` with the provided options.
- POST the assertion back to `/auth/webauthn?username=<name>` to establish a session.
- Alternatively, after registration, choose **Biometric Login** on the login screen and provide your biometric credentials when prompted.

If biometric hardware is unavailable, you can still authenticate using the traditional username and password flow.
