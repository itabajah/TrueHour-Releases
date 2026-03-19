# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.0.x   | Yes       |

Only the latest release receives security updates. Users are encouraged to update promptly.

## Reporting a Vulnerability

If you discover a security issue in the distributed TrueHour binary, update mechanism, or release infrastructure, please report it **privately**.

- **Preferred:** Open a [private security advisory](https://github.com/itabajah/TrueHour-Releases/security/advisories/new) in this repository.
- **Alternative:** Contact Ibrahim Tabajah directly via GitHub profile: [@itabajah](https://github.com/itabajah).

**Please do not open public GitHub issues for suspected vulnerabilities.**

### What to include

- Affected version(s) and release tag
- Detailed reproduction steps
- Impact assessment (what an attacker could achieve)
- Any relevant logs, screenshots, or proof-of-concept

## Scope

This policy covers:

- Released `TrueHour.exe` artifacts distributed through this repository
- The Authenticode code-signing and signature-verification process
- Release packaging metadata and GitHub Actions deployment workflows
- The offline activation / licensing mechanism

Out of scope:

- The private source repository (report to the maintainer directly)
- Third-party dependencies not shipped in the binary

## Response Timeline

| Stage | Target |
|-------|--------|
| Acknowledgement | 3 business days |
| Status updates | Every 7 business days while investigation is active |
| Fix release | As soon as practicable after validation |

## Disclosure

Coordinated disclosure is preferred. A public security advisory will be published after remediation and validation are complete.

## Security Design

TrueHour's binary is built with security in mind:

- **Database encryption:** AES-256-CBC via SQLCipher with page-level encryption
- **Password hashing:** PBKDF2-HMAC-SHA256 (600K iterations, 32-byte salt)
- **Constant-time comparison:** `hmac.compare_digest` for all credential checks
- **Code signing:** Authenticode-signed `.exe` with thumbprint verification on USB/online updates
- **Tamper detection:** `auth.json` ↔ database state consistency verification
- **Audit trail:** Every data mutation recorded with old and new values
