# PostHog Self-driving setup report

## Summary

PostHog Self-driving is configured with its core project products enabled, native health/error/support responders active, a selective four-scout troop, and two Replay Vision monitors that emit confirmed findings to the inbox. The existing mobile app instrumentation and current project recording evidence were reviewed; no application source files needed changes. Findings should start appearing in the [Self-driving inbox](https://us.posthog.com/project/588279/inbox) within about 30 minutes.

## AI data processing

Approved by the wizard’s organization-level gate before this setup ran.

## GitHub

The PostHog GitHub App was already connected before this setup. GitHub Issues was not selected as an additional Self-driving source in this run.

## Products enabled

| Product | Result | Notes |
|---|---|---|
| Session Replay | Already enabled | The server-side product toggle is on. The repository is a mobile Expo app with `posthog-react-native`; native replay readiness is not confirmed by this setup. A recent web recording exists in the project. |
| Error Tracking | Already enabled | The server-side product toggle is on. The app already captures handled authentication exceptions. |
| Support (Conversations) | Already enabled | Ticket ingestion requires an inbound email, inbox, or Slack channel before support tickets can reach Self-driving. |

## Signal sources

| Signal source | Action | Notes |
|---|---|---|
| `health_checks` / `health_issue` | Already enabled | Setup-health findings are actionable for every project. |
| `error_tracking` / `issue_created` | Already enabled | Native error-tracking route. |
| `error_tracking` / `issue_reopened` | Already enabled | Native error-tracking route. |
| `error_tracking` / `issue_spiking` | Already enabled | Native error-tracking route. |
| `conversations` / `ticket` | Already enabled | Dormant until an inbound support channel is connected. |
| `signals_scout` / `cross_source_issue` | Left on by default | No opt-out config exists; scout findings can enter the inbox. |
| `session_replay` / `session_analysis_cluster` | Deliberately skipped | Retired route; Replay Vision monitors provide replay coverage instead. |
| `replay_vision` | Deliberately skipped as a source row | Monitor-level `emits_signals: true` is the Self-driving responder configuration. |

## Connected tools

No connected-tool source was selected in the integration picker. Consequently, no issue tracker, support desk, error tracker, security scanner, review source, or search-analytics responder was added. The pre-existing GitHub App connection remains unchanged.

## Scout troop

**Active scouts (4):**

| Scout | Why it is active |
|---|---|
| `signals-scout-general` | Cross-product investigation and unassigned surfaces. |
| `signals-scout-health-checks` | Prioritizes actionable PostHog setup-health findings. |
| `signals-scout-product-analytics` | Monitors product-flow conversion and engagement regressions. |
| `signals-scout-web-analytics` | Monitors traffic, acquisition, and landing-page health. |

**Disabled scouts (23):**

| Scouts | Reason |
|---|---|
| `signals-scout-ai-observability`, `signals-scout-apm`, `signals-scout-logs` | No evidence of LLM observability, distributed tracing, or PostHog Logs use. |
| `signals-scout-conversations` | Support is enabled but no inbound support channel is confirmed yet. |
| `signals-scout-csp-violations` | No CSP reporting configuration was found. |
| `signals-scout-customer-analytics` | No account/group analytics surface was found. |
| `signals-scout-data-pipelines`, `signals-scout-data-warehouse` | No active data-pipeline or warehouse surface was found. |
| `signals-scout-error-tracking` | Covered by native error-tracking responders. |
| `signals-scout-session-replay` | Covered by the Replay Vision monitors below. |
| `signals-scout-experiments`, `signals-scout-feature-flags`, `signals-scout-surveys` | No active experiments, feature flags, or surveys were found. |
| `signals-scout-revenue-analytics` | No payment integration or revenue-data surface was found. |
| `signals-scout-web-vitals` | No web-vitals-specific instrumentation was found. |
| `signals-scout-anomaly-detection`, `signals-scout-observability-gaps`, `signals-scout-insight-alerts` | Not selected to keep the troop focused; general, health, product, and web coverage were stronger matches. |
| `signals-scout-inbox-validation` | Fresh setup with no resolved Self-driving reports to validate yet. |
| `signals-scout-replay-vision` | Left off by default; the two monitors are new and have no accumulated observations yet. |
| `signals-scout-mcp-tool-calls`, `signals-scout-skills-store`, `signals-scout-tasks` | No evidence these internal workflow surfaces are used by this project. |

**Verified budget:** 100 runs/day; 4 used today and 96 remaining. The current announcement says scouts are in early access and teams can contact `team-self-driving@posthog.com` to request more daily runs.

## Custom scouts

No custom scout was created: the custom-scout picker was cancelled, so the built-in troop remains unchanged.

Two candidates were considered and declined:

- **Account signup completion:** would watch whether the sign-up flow continues to produce completed accounts while sign-up activity is steady.
- **Subscription engagement:** would watch whether people viewing the app continue to open subscription details while main-app visits are steady.

Both are domain-specific candidates beyond the generic built-in troop; neither was created without approval. If a future custom scout proves noisy, set `emit: false` on its scout config in PostHog to leave it running in dry-run mode.

## Replay Vision scanners

A Replay Vision scanner is an LLM that watches individual session recordings on a schedule and pushes eligible observations to the Self-driving inbox. These are the only components in this setup that spend Replay Vision quota. Findings arrive at half weight and require independent corroboration before promotion into a report.

| Brief | Scanner | Action | Query scope | Sampling | Estimate |
|---|---|---|---|---:|---:|
| Breakage monitor | **Account flow breakage** | Updated an earlier-run scanner | Recordings whose URL contains `/sign-up`, the account-completion flow where people create accounts and verify access | 0.5 | 0 monthly observations / 0 monthly credits (based on the recent estimate) |
| Frustration monitor | **Subscription flow frustration** | Updated an earlier-run scanner | Recordings containing `$rageclick` only, covering visible struggle across account and subscription tasks | 1.0 | 0 monthly observations / 0 monthly credits (based on the recent estimate) |

Both scanners are enabled and emit Self-driving findings. The organization has 2,485 Replay Vision credits remaining out of 2,500 for the current period, is not exhausted, and neither revised scanner has a projected monthly credit cost from the current estimate.

## Files modified or created

- Created `posthog-self-driving-report.md`.
- Installed local scanner workflow references under `.claude/skills/replay-vision-scanners-core/`, `.claude/skills/replay-vision-scanner-broken-experiences/`, and `.claude/skills/replay-vision-scanner-user-frustration/`.
- No application source files were modified.

## Follow-ups

- [ ] Connect an inbound email, inbox, or Slack channel for PostHog Support so the enabled ticket responder can receive support tickets.
- [ ] Confirm native Session Replay setup for the Expo app if mobile recordings are expected; the server-side replay product is enabled, but this setup did not validate native replay capture.

## What happens next

The scout coordinator picks up fresh configurations within about 30 minutes. Runs draw from the project’s daily budget, reports cluster in the [Self-driving inbox](https://us.posthog.com/project/588279/inbox), and immediately actionable findings can begin coding tasks.
