# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of SentinelChain seriously. If you discover a security vulnerability, please do **NOT** open a public issue.

Instead, please report security vulnerabilities via:
1. **GitHub Private Vulnerability Reporting** directly within this repository.
2. Emailing the core maintainer team at `security@sentinelchain.enterprise`.

### Response Timeline
- We will acknowledge receipt within 24 hours.
- A detailed assessment and remediation plan will be provided within 48 hours.
- Security updates will be deployed directly via CI/CD.

### Security Best Practices Implemented
- **NextAuth.js Encrypted Sessions**: JWT tokens and session cookies signed with high-entropy cryptographic keys.
- **Strict OData API Sanitization**: Zero credential exposure in frontend bundles.
- **CSRF & XSS Protection**: Standard SameSite cookie policies and strict sanitized input vectors.
