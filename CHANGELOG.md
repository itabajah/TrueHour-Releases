# Changelog

All notable changes to TrueHour releases are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows semantic versioning for release labels.

## [1.0.1] — 2026-09-25

### Added

- Terminal Sync (Ethernet): pull attendance straight from a ZKTeco biometric terminal over the network (ZK protocol, TCP or UDP port 4370) instead of carrying a `.dat` file on a USB stick. **Sync from Terminal** imports only new punches, **Preview Terminal Data** opens them in the regular import preview, and an optional automatic sync runs every few minutes while TrueHour is open. The terminal is only read; TrueHour never changes it.
- Terminal Connection dialog (Settings → Biometric Terminal) with **Test Connection**: device name, serial number, firmware, record counts and a clock check.
- New employees found on the terminal are named from the terminal's user list.

### Changed

- Punches with impossible dates (made while the terminal's clock was reset to 2000 or to a far-future date) are held back and reported instead of imported, and TrueHour warns when the terminal clock differs from the PC's.

## [1.0.0] — 2026-03-15

### Added

- Initial public release of TrueHour as a signed Windows executable.
- Smart import: drag-and-drop `.dat` / `.txt` files from ZKTeco biometric terminals with automatic merge and deduplication.
- Employee management with auto-detection of new worker IDs, name assignment, and hourly/daily pay rates.
- Timesheet view with filters by employee, date range, and shift status; color-coded anomaly and edit indicators.
- Anomaly detection engine: missing logins/logouts, short/long shifts, unusual durations, invalid time ranges. Severity levels: critical, warning, info.
- Four resolution modes: manual edit, type-specific quick fix, auto-fix from worker history, batch resolve all.
- Dashboard with stat cards, per-employee reliability scores, behavior drift analysis, and salary estimates.
- Payroll export to CSV and formatted Excel (with live formulas and summary sheet). Localized headers. RTL-aware.
- Full audit trail: every edit recorded with old/new values; preview diffs, restore snapshots, checkout and branch.
- Optional database encryption via SQLCipher (AES-256-CBC) with PBKDF2-HMAC-SHA256 key derivation (600K iterations).
- Forgot-password recovery from any encrypted backup using that backup's password.
- First-run setup wizard with optional password configuration and RTL rendering for Hebrew/Arabic.
- Demo mode: 16 employees, ~500 shifts, all anomaly types, salary estimates. Auto-cleanup on exit.
- Machine-bound offline activation via Ed25519 request/activation codes — no server required.
- USB update with Authenticode signature verification for air-gapped environments.
- Optional online update via GitHub Releases polling with streaming download and signature verification.
- Trilingual interface: English, Hebrew (RTL), and Arabic (RTL).
- Automatic maintenance: snapshot pruning, WAL checkpoint, `PRAGMA optimize`, conditional `VACUUM`.
- Single-instance mutex lock per database to prevent concurrent corruption.
- Community channels: GitHub Issues (bug report and feature request templates), GitHub Discussions (Q&A, Ideas, Announcements).

[Unreleased]: https://github.com/itabajah/TrueHour-Releases/compare/v1.0.1...HEAD
[1.0.1]: https://github.com/itabajah/TrueHour-Releases/releases/tag/v1.0.1
[1.0.0]: https://github.com/itabajah/TrueHour-Releases/releases/tag/v1.0.0
