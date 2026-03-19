<!-- markdownlint-disable MD033 MD041 -->

<h1 align="center">TrueHour</h1>
<p align="center">
  <strong>Workforce Time Tracking &amp; Payroll Management for Windows</strong><br>
  Import attendance logs &middot; Calculate hours &middot; Resolve anomalies &middot; Export to payroll
</p>
<p align="center"><em>by Tabajah Stack</em></p>

<p align="center">
  <a href="https://github.com/itabajah/TrueHour-Releases/releases/latest"><img src="https://img.shields.io/github/v/release/itabajah/TrueHour-Releases?label=latest%20release&style=flat-square" alt="Latest Release"></a>
  <img src="https://img.shields.io/badge/platform-Windows%2010+-0078D6?style=flat-square&logo=windows" alt="Windows 10+">
  <img src="https://img.shields.io/badge/signed-Authenticode-green?style=flat-square" alt="Code Signed">
  <img src="https://img.shields.io/badge/languages-EN%20%7C%20HE%20%7C%20AR-blue?style=flat-square" alt="Languages">
</p>

---

## Download

> **[Download the latest release](https://github.com/itabajah/TrueHour-Releases/releases/latest)**

After downloading, right-click `TrueHour.exe` → **Properties** → **Digital Signatures** → verify the publisher before running.

## What is TrueHour?

TrueHour is a standalone Windows desktop application that takes raw attendance log files (`.dat` / `.txt`) from ZKTeco biometric terminals, parses login/logout events, and calculates the exact hours worked by each employee. It gives managers a clean interface to import data, fix anomalies, configure pay rates, and export payroll-ready reports — all without an internet connection.

**Single `.exe` file. No installation. No runtime dependencies.**

## Features

| Category | What you get |
|----------|-------------|
| **Smart Import** | Drag-and-drop `.dat` files from ZKTeco terminals. Automatic merge and deduplication — importing the same file twice is safe. |
| **Employee Management** | Auto-detects new worker IDs on import. Set names, hourly or daily pay rates. |
| **Timesheet View** | Full shift grid with filters by employee, date range, and status. Color-coded anomaly and edit indicators. |
| **Anomaly Detection** | Flags missing logouts/logins, short/long shifts, unusual durations, and invalid time ranges. Severity-coded (critical, warning, info). |
| **Resolution Options** | Manual edit, type-specific quick fix, auto-fix using worker history, or batch resolve all. |
| **Dashboard** | Summary stat cards, per-employee reliability scores and behavior drift, salary estimates. |
| **Payroll Export** | Excel (with live formulas and summary sheet) or CSV. Headers localized to the selected language. RTL-aware. |
| **Full Audit Trail** | Every edit tracked with old/new values. Preview diffs, restore any snapshot, or checkout and branch. |
| **Password Protection** | Optional AES-256 database encryption (SQLCipher) with PBKDF2-HMAC-SHA256 key derivation (600K iterations). |
| **Demo Mode** | Try all features with pre-loaded sample data (16 employees, ~500 shifts). No activation required. |
| **Offline Activation** | Machine-bound Ed25519 activation codes — no server, no internet needed. |
| **USB Update** | Update from a USB drive with Authenticode signature verification — fully air-gapped. |
| **Online Update** | Optional GitHub Releases polling with streaming download + signature verification. |
| **Trilingual** | Full English, Hebrew (RTL), and Arabic (RTL) support. |

## How It Works

```
  Import .dat    →    Detect       →    Review       →    Set Pay    →    Export
  (drag & drop)       Anomalies         Timesheet         Rates           CSV/Excel
```

1. **Import** — Drag a `.dat` file onto the drop zone. New employees are auto-detected and named.
2. **Fix Anomalies** — Review each flagged shift. Choose manual edit, quick fix, or auto-resolve.
3. **Review Timesheet** — Filter, sort, and edit shifts. Every change is tracked in the audit trail.
4. **Set Rates** — Configure hourly or daily rates per employee. The dashboard shows salary estimates.
5. **Export** — Select employees and a date range. Excel exports include live formulas and a summary sheet.

## Install

1. Download `TrueHour.exe` from the [latest release](https://github.com/itabajah/TrueHour-Releases/releases/latest).
2. (Recommended) Right-click → **Properties** → **Digital Signatures** → verify the publisher signature.
3. Double-click `TrueHour.exe` — no Python runtime or installer required.
4. On first launch, follow the setup wizard or click **Try Demo** to explore with sample data.

## Requirements

| Requirement | Details |
|-------------|---------|
| **OS** | Windows 10 or newer (x64) |
| **Disk** | ~60 MB for the executable; database grows with usage |
| **Permissions** | User-level write access to `%LOCALAPPDATA%` |
| **Network** | Not required (optional for online update checks) |
| **Display** | 1280×720 minimum recommended |

## Input File Format

TrueHour reads ZKTeco attendance logs (`.dat` or `.txt`), tab or space-separated:

```
101    2026-01-21 08:00:03    1    0    0    0
101    2026-01-21 16:30:04    1    1    0    0
```

| Column | Content |
|--------|---------|
| 1 | Worker ID (integer) |
| 2–3 | Timestamp (`YYYY-MM-DD HH:MM:SS`) |
| 4 | Verification type (1 = fingerprint, 2 = card) |
| 5 | In/Out flag (0 = in, 1 = out) |
| 6–7 | Reserved (always 0) |

## FAQ

<details>
<summary><strong>Do I need to install anything?</strong></summary>
No. TrueHour is a single portable <code>.exe</code> — no installer, no Python runtime, no dependencies.
</details>

<details>
<summary><strong>Can I try it before activating?</strong></summary>
Yes. Click <strong>Try Demo</strong> on the activation screen to explore all features with pre-loaded sample data. Demo data is automatically cleaned up on exit.
</details>

<details>
<summary><strong>How do I get an activation code?</strong></summary>
Launch TrueHour and copy your <em>Request Code</em> from the activation screen. Send it to the vendor — you will receive a machine-specific <em>Activation Code</em> in return.
</details>

<details>
<summary><strong>Does it require an internet connection?</strong></summary>
No. TrueHour works fully offline. Internet is only used for optional online update checks.
</details>

<details>
<summary><strong>How do I update on an air-gapped machine?</strong></summary>
Copy the new <code>TrueHour.exe</code> to a USB drive. In TrueHour, go to <strong>Settings → Check for Update</strong> and select the file. The Authenticode signature is verified before replacement.
</details>

<details>
<summary><strong>What biometric terminals are supported?</strong></summary>
Any ZKTeco terminal that exports attendance logs in the standard <code>.dat</code> / <code>.txt</code> format (tab or space-separated with Worker ID, timestamp, verification type, and in/out flag).
</details>

<details>
<summary><strong>I forgot my database password — can I recover?</strong></summary>
Yes. On the login screen, use the <strong>Forgot Password</strong> option to restore from any encrypted backup using that backup's password.
</details>

## Report an Issue

If you encounter a bug or have a feature request, please [open an issue](https://github.com/itabajah/TrueHour-Releases/issues/new/choose).

For security vulnerabilities, see [SECURITY.md](SECURITY.md).

## Links

- [Changelog](CHANGELOG.md) — release history
- [License](LICENSE) — binary distribution terms
- [Security](SECURITY.md) — vulnerability reporting

---

<p align="center"><em>Built for reliable workforce management by Tabajah Stack.</em></p>
