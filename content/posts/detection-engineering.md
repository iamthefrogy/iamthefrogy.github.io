+++
date = '2025-08-28T03:10:29+01:00'
draft = false
title = '(SIEM) Advanced Detection Engineering'
+++

## Introduction
I was going through the SANS material on detection engineering from multiple of their courses and I wanted to make a practical ready notes for the same. This is the output of my reading and implementing some of them into my home personal lab as well as my past companies.

The summary of entire process is:

**OPEN IMAGE IN A NEW TAB AND IT WILL BE THE HIGH RESOLUTION IMAGE**

<center><img src="/images/advanced-detection-engineering.png" width="1300"/></center></br>



## Phase 1 - SIEM Architecture

- **Problem statement:** Detection capability lags risk tolerance; people and process, not tools, are the core gap. Multiple studies and course narrative reinforce this.
- **Tactical vs compliance SIEM:** Compliance unlocks budget but bloats data; tactical SIEM is lean, tuned, evolving, and focused on detection value.
- **Goal of SIEM:** Near-real-time + historical analysis across diverse event/context sources for threat detection, compliance, and incident management.
- **Plan first:** Decide data-gathering strategy (input-driven, output-driven, hybrid), know expected EPS/peaks, and size storage (hot vs warm).
- **Pipeline components:** Collection → Aggregation/Parsing/Enrichment → (Broker) → Storage/Search → Alerting.
- **Common pitfalls:** No roadmap; over-collection without analysis; under-resourced teams; no use-cases.

---

### State of the SIEM & Industry Signals
- Capability gaps persist across industries; skepticism is healthy, but patterns are consistent.
- People and processes score worst in maturity assessments.

**Key takeaway:** Hire + grow staff; collect the right data; adopt tools that support analyst workflow. (MITRE “11 Strategies”).

**Aporoach:**  
People/Process deficits → need hiring & training + repeatable processes → enables tactical (not just compliant) SIEM that maintains detection fidelity.

---

### Compliance vs. Tactical SIEM
- **Compliance SIEM:** Often bloated & slow; ambiguous mandates drive “log-everything” hoarding.
- **Tactical SIEM:** Focus on normal vs adverse baselines, current TTPs, and continuous tuning; may ingest less but deliver more detection value.

**Example of Needs:**
- Financial services: Tight retention mandates → use hybrid collection with hot/warm tiers.
- SaaS/Tech: Rapid TTP change → frequent enrichment updates & scripted custom telemetry (e.g., API pulls).

---

### SIEM Planning & Data Strategy
- **Input-driven:** Collect everything; pro = complete history; cons = cost, noise.  
- **Output-driven:** Collect only what’s needed; pro = cheap/fast; con = miss unknowns.  
- **Hybrid:** Start broad, trim high-volume low-value events; often removes 80–90% of noise; boosts performance & lowers cost.

**Sizing ingestion:**  
- EPD = Events Per Day → the total number of log events you collect in a 24-hour period.
- EPS = Events Per Second → the rate at which events are coming in per second.
- Conversion: divide EPD by 86,400 (the number of seconds in a day) to get the average EPS.
- Padding (2–3×): because traffic isn’t constant it spikes during business hours, logons, patch cycles, etc. You need headroom so the system doesn’t drop logs during peaks.
- Why not vendor EPS tables? → Generic estimates vary wildly and rarely match your environment. It’s better to run a proof-of-concept (POC) or script your own counts from real logs.

**Storage planning:**  
POC yields best accuracy; else use padded constants (~300B/firewall, ~700B/Windows event). Tier hot vs warm (aim ≥7–30 days hot).

**Approach:**  
Data strategy ↔ EPS/Storage ↔ Broker need (burst handling) ↔ Alert fidelity (less noise → better rules).

---

### Collection Options
- **Agents:** Parsing, buffering, rate-limits, encryption, priority routing, FIM, registry monitoring, NetFlow, WEF, cloud APIs. Performance varies—test.  
- **Agentless:** Central pulls; overhead mainly auth/API; with proper config, impact is minimal.  
- **Syslog/API/Scripts:** Scripts crucial for cloud/3rd-party + custom telemetry (e.g., nightly baselines, hashes). Non-traditional outputs (CSV lists, hashes) become logs once timestamped & named at collection.

---

### Aggregation, Parsing & Enrichment
- **Aggregator role:** Input → Filter/Enrich → Output pipeline; drop, modify, augment as needed.  
---

### Brokers, Storage, Search, Alerting
- **Broker (Redis/RabbitMQ/Kafka):** Buffers bursts, survives backend outages, smooths pipelines; Kafka for 10M+ EPS at scale; RabbitMQ = easy mgmt UI.  
- **Storage/tiers:** Hot = SSD/SAS; Warm = SATA/tape; some SIEMs can promote warm→hot temporarily for investigations.  
- **Alerting patterns:** SIEM native alerting, or Graylog, ElastAlert, Kibana Alerting, Watcher (polling ES; varying UX/robustness).

---

### Pitfalls & Anti-patterns
- No plan/use-cases  
- Collect-all first then stall  
- Too few people  
- No continuous care & feeding  

**Remedy:** Staged rollout with use-cases per source.

---

### Summary

| Dimension | Context |
|-----------|------------------------|
| CONTEXT | SIEM slow, noisy, and dropping events during peaks; investigations stalled. |
| ROLE | Led SIEM re-architecture; owned data strategy, pipeline design, and alerting framework. |
| PROCESS | Assessed sources → hybrid strategy → measured EPS/peaks → broker → tuned Logstash parsers → hot/warm retention → staged rollouts. |
| DECISION RATIONALE | Hybrid preserves context but cuts noise; broker for resilience; hot storage aligned to MTTD. |
| TOOLS / TECH | Logstash, Kafka/RabbitMQ, Elasticsearch, Graylog/ElastAlert/Kibana Alerting, custom scripts. |
| RISKS & MITIGATION | Peak EPS overload → broker & rate limits; agent overhead → phased rollout; false positives → allow-lists. |
| CHALLENGES | Stakeholder push to “log everything”; compliance ambiguity; parser fragility. Solved with governance & rubydebug test harness. |
| RESULT / EFFECTIVENESS | Search latency ↓; alert precision ↑; zero loss during peaks; faster investigations. |
| KPIs | EPS headroom; % noise trimmed; FP rate; MTTD; investigation cycle time. |
| IMPACT BEYOND METRICS | Analyst satisfaction ↑; shared mental model; tuning culture. |
| STAKEHOLDERS | SecOps, IT Ops, Compliance, App owners. |
| SCALABILITY / REUSE | Reusable per source: collect → enrich → alert. |
| LESSONS LEARNED | Start with use-cases; measure before buying; codify parsers. |
| COLLABORATION | Weekly triage with SecOps; data contracts with app teams. |

---

## Phase 2 - Service Profiling
- **Use what you already run:** DNS/HTTP/SMTP/TLS logs are everywhere; turn them into continuous monitoring pipelines.
- **Collect, enrich, detect:** Choose a collection method (agent, network extraction, endpoint, or hybrid) → normalize → enrich (GeoIP/ASN, Top-1M, TI) → alert on protocol-specific behaviors.
- **Mindset:** “Filter hard, focus fast.” Top-1M and ASN filters slash noise (~90% DNS reduction in example), then spend CPU on the suspicious long-tail.
- **SIEM ≠ mail gateway:** Let purpose-built controls block; use SIEM to find what they miss (fuzzy look-alikes, spikes, abuse of “authorized” paths).

**Approach:**  
Collection choice → field consistency → shared dashboards & rules → enrichment (Top-1M, ASN, DNS lookups) → sharp filters → protocol-aware detections (SMTP fuzz, DNS NXDOMAIN/tunnels, HTTP methods/UAs, TLS quirks).

---

### Collection Strategies (what, why, trade-offs)

- **Traditional (agents/syslog):** Simple, no mirror needed; but many endpoints, per-app settings, inconsistent fields.
- **Network Extraction (Zeek ecurity Onion):** “Drop-and-go” breadth (DNS/HTTP/HTTPS/…); consistent logs; needs taps/SPAN and careful placement to avoid duplicates.
- **Endpoint-generated net logs:** Scales off-network/cloud; can add user/process context.
- **Other sources (NGFW, APIs):** Viable when constrained, but quality/fields vary.

**Retention reality:** Service logs are huge; many detects work with 1–3 days (pilot to prove value).

**Example:**
- SaaS/Tech: Zeek/SO near egress + endpoint net logs for roaming devices.  
- Finance/Healthcare: Post-filter SMTP and key DNS/HTTP hot for 1–7 days + warm archive; watch duplicates in hybrid designs.

---

### Enrichment That Moves the Needle

- **Forward/Reverse DNS lookups:** Fill gaps (IP↔name). Use for filtering/context; mind staleness & latency.
- **GeoIP + ASN (e.g., Microsoft ASN 8075):** Filter whole providers in one stroke instead of millions of IPs.
- **Cisco Umbrella Top-1M:** Tag popular domains to down-rank noise; example ~90% DNS reduction.
- **SIEM translation / in-memory lookups:** Query existing indices (e.g., DNS) during ingestion & analysis.
- **Threat intel feeds:** Open/commercial; wire into Zeek/Suricata/MISP/OTX; measure hits and FPs—don’t “set and forget.”

---

### Protocol-Focused Detections

#### SMTP (attack ingress, insider abuse)
- Fuzzy phishing for look-alike corp domains.  
- Enforce allow-lists of SMTP egress hosts.  
- Baseline mails/hour per authorized system; alert on spikes.  

#### DNS (early, rich signal)
- NXDOMAIN spikes per host: Detect DGA, recon, misconfig.  
- DNS tunneling: Block direct 53 egress except resolvers; watch for recursion tunnels.  
- “New domain” + “direct IP” monitoring: Review dashboard daily.  

#### HTTP/HTTPS (most abused)
- Field-length heuristics: URLs > ~250 chars, long querystrings.  
- Naked IP requests: Flag HTTP(S) hosts by IP.  
- Method anomalies: Bursty/uncommon verbs, scanners.  
- UA allow-list: Whitelist enterprise UAs.  

**Scenario tie-back:** Catches vuln scans, SQLi, infected workstation traffic.

---

### Summary

| Dimension | Context |
|-----------|------------------------|
| CONTEXT  | Needed actionable detections from common services without exploding cost/noise. |
| ROLE | Led service-log program: collection, normalization, enrichment, detections. |
| PROCESS | Deployed Zeek/SO + agents → avoided duplication → added DNS/ASN/Top-1M/TI → SMTP/DNS/HTTP rules. |
| DECISION RATIONALE | Network extraction for breadth; post-filter SMTP; Top-1M/ASN to cut noise; 24–72h retention pilot. |
| TOOLS / TECH | Zeek/SO, MISP/OTX, GeoIP/ASN, SIEM translation, ElastAlert. |
| RISKS & MITIGATION | Duplicates → sensor design; TI FPs → measure; recursion tunnels → monitors. |
| CHALLENGES | Volume/retention → short hot pilot; inconsistent fields → normalize; stakeholders → quick wins. |
| RESULT / EFFECTIVENESS | Workload ↓; TTD ↓; caught phishing/tunnels/scans. |
| KPIs | % noise trimmed; NXDOMAIN outliers; first-seen reviews; SMTP spikes; TI FP rate. |
| IMPACT BEYOND METRICS | Reusable patterns; shared fields; faster investigations. |
| SCALABILITY / REUSE | Collect → enrich → detect repeatable across sites. |
| LESSONS LEARNED | Post-filter first; no duplicates; measure TI value. |
| COLLABORATION | With NetOps, Messaging, Endpoint teams. |

---

## Phase 3 - Endpoint Analytics
- Windows logging (EVT vs EVTX), ETW, audit policy, PowerShell logging, Sysmon, and Sysmon-Modular.
- Linux logging (syslog/rsyslog, facilities & severities, config examples).
- Endpoint collection strategies (agents vs agentless, WEF, Beats/NXLog).
- Events of interest & a full Windows-only detection scenario.
- Host-based firewall monitoring (Windows Firewall, iptables).
- Login monitoring (spikes, password spray detection).
- OS protections for detection (EMET, grsecurity).
- Container logging (daemon logs, drivers, sidecars, bind mounts, app-level).

---

### Core Concepts & Definitions

- **EVT vs EVTX:** EVT = fixed fields; EVTX = XML-backed EventData/UserData with far more fields & filtering.
- **ETW/ETL:** Kernel-level tracing; deep but noisy; often off by default.
- **Sysmon:** Logs process creation, hashes, network connections, registry, WMI. Use XML configs; Sysmon-Modular adds ATT&CK tags.
- **Linux logging:** Syslog family (syslog/rsyslog/syslog-ng). Facilities (0–23), severities (0–7).
- **Tactical SIEM mindset:** Plant multiple tripwires with native OS logs.

---

### Windows Logging — What to Enable & Why

- **Advanced Audit Policy:** Use subcategories; enforce with “Force audit policy subcategory settings.”
- **High-value subcategories:**
  - Process Creation (4688 + command line).
  - Logon/Logoff (success & failure).
  - Object Access (with ACLs).
  - Policy Change & Filtering Platform.
- **PowerShell:** Create custom channels/events; can trigger tasks.
- **Sysmon config tips:**
  - Hash all, include proc create.
  - Exclude noisy parents.
  - Log network connects except chatty apps.
  - Use Sysmon-Modular.

---

### Linux Logging Essentials

- **Facilities/Severities:** Map importance (0=Emerg…7=Debug).  
- **rsyslog rules:**  
  - `=warning` for exact severity.  
  - `.!info` for inversion.  
  - `-` prefix to batch file writes.

---

### Endpoint Collection Strategies

- **Agents recommended:** Even WEF/syslog act as agents. Beats/NXLog add filtering & easier management.  
- **WEF:** Collector setup, push/pull via GPO, Windows-first destination.  

---

### Events of Interest (High-Signal)

- **Scenario proof:** Windows-only chain can catch full attack lifecycle.
- **Examples:**
  - 4688 unusual parent (Office → cmd.exe/powershell.exe).
  - Firewall disabled/changed.
  - New service initiation.
  - Lateral logon bursts / abnormal hours.

---

### Host-Based Firewall Monitoring

- **Windows Firewall:**
  - Forward selective Security-channel events (drops, changes).
  - Keep full pfirewall.log locally for IR.
- **Linux iptables:** Add logging chain with rate-limit, then DROP.

---

### Login Monitoring

- **Local brute/spray:** Failures by source IP.  
- **Distributed spray:** Track failed-login spikes globally.  
- **Profiles:** Accounts on too many systems, impossible failures.  

---

### OS Protections as Detectors

- **Windows EMET:** Pin browser home page → instant alert on MITM.  
- **Linux grsecurity:** Adds protections & logs, but trade-offs in supportability.  

---

### Container Logging Playbook

- **Collect:** Platform/daemon, Host OS, App logs.  
- **Patterns:**
  - Bind/volume mounts → host agent.  
  - Sidecar agent → shared volume.  
  - App-level remote logging.  
  - Daemon log drivers (json-file, awslogs).  
- **Kubernetes/EKS:** Enable control-plane logs to CloudWatch → SIEM.

---

### Summary

| Topic | Context |
|-------|--------------|
| CONTEXT | Needed faster, cheaper endpoint detection. |
| ROLE | Led endpoint SIEM detections; audit/Sysmon baselines; pipelines. |
| PROCESS | Enable audits/Sysmon → collect → normalize → rules → iterate. |
| DECISION RATIONALE | Built-ins first, extend wysmon; selective SIEM ingest. |
| TOOLS | Win Audit, WEF, Sysmon-Modular, rsyslog, iptables, SOF-ELK, ElastAlert, CloudWatch. |
| RISKS | Volume/noise → filters; blindspots → Sysmon; containers → volumes/sidecars. |
| CHALLENGES | Audit policy conflicts; firewall ownership; container logging. |
| RESULT | MTTD ↓ to minutes; firewall efficacy proven; IR trails ready. |
| KPIs | Time-to-first-alert; % first-seen services; login detection rate. |
| IMPACT | Better analyst intuition; faster IR; stronger trust. |
| STAKEHOLDERS | IT, SecOps, Cloud, Leadership. |
| SCALABILITY | Sysmon-Modular; first-seen patterns; container templates. |
| LESSONS | Subtle > silver bullets; full logs nearby; start simple. |

---

## Phase 4 - Baselining & User Behavior Monitoring

- **Goal:** Detect unknowns by knowing normal first; maintain organizational awareness; treat SIEM as an enabler for context, automation, and actions.
- **Two pillars:**  
  1. Asset visibility (devices & users) via active + passive discovery.  
  2. Baselines (point-in-time & continuous) to flag change fast.
- **Pragmatism:** Full NAC is ideal but hard. Combine DHCP/OUI, AD, Zeek, NetFlow, firewall, CAM tables to classify most assets; investigate residue.

**Approach:** Inventory → Active+Passive → Master inventory (+ importance) → Tactical baselines → Change detection → User monitoring → Cloud/service add-ons.

---

### Getting to Know Yourself (why baselines matter)
- Baselining = known good: software, network connections, configs.  
- Compare snapshots to detect drift/anomaly.  
- **Change detection:** any deviation = investigative needle.

### Active Device Discovery
- Strengths: rich detail; authenticated scans = “authorized” signal.  
- Weakness: slow; blind to non-responders.  
- **Nmap/vuln scans:** Complement passive, not replace.

### Passive Device Discovery
- **Sources:** AD, DHCP, DNS, firewall, NetFlow, Zeek, IDS, CAM.  
- **Zeek software.log:** lightweight device/software ID.  
- **DHCP+OUI:** tag vendor; invalid/randomized OUIs = suspect.  
- **AD correlation:** hostname in AD → provisional AUTH (reduces follow-ups 10×).  
- **Poor man’s NAC:** DNS/firewall detects defaults (public NTP, direct OS updates).  

### Building a Master Inventory
- Merge active + passive sources.  
- Grade importance (Critical–Low) to prioritize alerts.

### Software & Scripting Monitoring
- **Tells:** long CLIs, base64, deny/allow lists, PowerShell run by non-powershell.exe hosts.

### Traffic Monitoring
- **Connection monitoring:** enumerate NetFlow IPs, subtract known inventory, escalate residue.  
- Use firewall policy IDs for context.

### User Monitoring
- **Signals:** excessive logins/failures, too many systems per user, anomalous service-account use.  
- Outcome: UEBA-lite program (simple stats + baselines).

---

### Tactical Baselining — Quick Start

- Pick scope: start with critical hosts + egress chokepoints.  
- Capture: process lists, autoruns, services, local admins, ports, tasks.  
- Schedule: daily/weekly diffs → “changed since last good.”  
- Alert: first-seen values (services, binaries, destinations).

---

### Summary

| Dimension | Context |
|-----------|--------------|
| CONTEXT | Unknown attacks & shadow assets; NAC absent. |
| ROLE | Led inventory & baselining; designed log-based NAC-lite; built user monitoring. |
| PROCESS | Combine DHCP/OUI, AD, Zeek, DNS, NetFlow, CAM → master inventory + baselines. |
| DECISION RATIONALE | NAC heavy; logs free; elimination round shrinks unknowns. |
| TOOLS/TECH | Nmap, Zeek, DHCP/AD, NetFlow, firewall, SIEM enrich, CAM. |
| RISKS | False auth signals → cross-source; invalid OUIs → investigate; vendor defaults → allow-list. |
| CHALLENGES | Volume + inconsistency; solved via tags & schema. |
| RESULT | Unknowns ↓ ~80%; faster IR; prioritized alerts. |
| KPIs | % auto-classified devices; # first-seen triaged; MTTR for spikes. |
| IMPACT | Shared “normal” model; reusable discovery playbooks. |
| STAKEHOLDERS | Network, Identity, Helpdesk, SecOps. |
| SCALABILITY | Same framework works in cloud/VPC. |
| LESSONS | Don’t wait for NAC; use defaults; maintain baselines.

## Phase 5 - Tactical SIEM & Post-Mortem Analysis

- **Center the alerts:** Move from siloed consoles to a SIEM that correlates, enriches, prioritizes, and shares across teams.  
- **Author portable detections:** Write once (Sigma), convert to your SIEM; use Uncoder.io for quick conversions.  
- **Make IDS great again:** Integrate NIDS/NIPS/HIDS/HIPS; prefer rich JSON/binary outputs (Suricata EVE, Snort unified2→u2json/Barnyard2).  
- **Analyze better, not louder:** Use alert engines (thresholds, spikes, droughts, first-seen); keep volumes humane.  
- **Reverse analysis:** Safely reproduce attacks (VMs/Cuckoo), diff against baseline, harvest new events of interest.  
- **Tripwires that bite:** Honeypots, HALO honeytokens, host-firewall traps = early, low-FP detection.  
- **Post-mortem wins:** Hunt beacons in old logs (RITA, Flare, persistent.pl); expect IoT noise.  

---

### Centralized Alerting vs Product Silos

- **Pain:** Product consoles lack context; hand-offs slow; permissions messy.  
- **SIEM fix:** One pane with safe analyst access.  
- **Design:** Create purpose fields (e.g., `ips` array) for fast, complete searches.  
- **Change monitoring:** Alert on allow/deny ratio shifts after firewall changes.  

---

### Alerting Engines & Rule Patterns

**Patterns:**  
- Match/deny-list + allow-list exceptions.  
- Frequency: X in Y minutes.  
- Statistical drift: spikes/drops.  
- First-seen / new value.  
- Aggregations & caps.  

**Where to run:**  
- Aggregator (Logstash) for simple routes.  
- Dedicated engines (ElastAlert) for richer logic/actions.  

**Examples:**  
- Logstash route → email/PagerDuty/ES.  
- ElastAlert: alert on RDP powering on a decommissioned VM.  

---

### Sigma, MITRE & Sharing Detections

- **Sigma:** Generic YAML analytics → convert via `sigmac`.  
- **Pipeline:** MISP → convert → dry-run → human assess → prod.  
- **Uncoder.io:** Quick web conversions across SIEM/EDR/NDR.  

---

### IDS/NIPS/HIDS/HIPS — Log Collection That Helps

- **Context:** IPS = “blocked”; IDS = “saw suspicious.”  
- **Snort:** Prefer unified2 → Barnyard2/u2json; avoid plain syslog.  
- **Suricata:** Enable EVE JSON; split outputs (alert.json, dns.json, http.json).  
- **Wazuh (HIDS):** JSON logs align with NIDS fields.  
- **Commercial:** Many expose APIs/DB; watch odd field types.  

---

### Reverse Analysis — Pragmatic Method

- **Method:** Baseline → replay attack → diff logs → extract EOIs.  
- **Tools:** VM snapshots, Cuckoo Sandbox, guest log forwarding.  
- **Case:** Unknown exe runs `certutil` CA add → author Sigma for CA installs.  

---

### Tripwire Detection — Early Catches

- **Honeypots:** Low-interaction; any contact = alert.  
- **Host-FW traps:** Locked-down VM; inbound hit = suspicious.  
- **HALO honeytokens:** Seed fake creds/emails; any use = malicious.  

---

### Post-Mortem Analytics & Beacon Hunting

- **Why:** “Teach old logs new tricks.”  
- **Tools:**  
  - RITA (Zeek) → beaconing/scans.  
  - persistent.pl (Squid) → long-haul connections.  
  - Flare → periodicity/dominance.  
- **Performance:** Run heavy jobs off-cluster.  

---

### Events of Interest — Quick Wins

- **Windows:** 4688 suspicious parents/CLIs, 7045 service creation, 4698 tasks, 1102/104 logs cleared, 4624/4625 logons.  
- **Network/IDS:** Internal scans to honeypots; Suricata anomalies; consider IPS vs IDS context.  

---

### Summary

| Dimension | Context|
|-----------|--------------|
| CONTEXT | Needed scalable, low-FP detections; SIEM centralization. |
| ROLE | Led alert strategy; built Sigma pipeline; integrated IDS/HIDS; deployed tripwires. |
| PROCESS | Correlate in SIEM → Sigma → alert engine → reverse-analysis loop → tripwires → post-mortem. |
| DECISION | Portable rules, rich IDS logs, traps, math for beacons. |
| TOOLS | Sigma, Uncoder, ElastAlert, Logstash, Suricata EVE, Snort u2json, Wazuh, Cuckoo, RITA, Flare. |
| RISKS | Alert floods → aggregation; tripwire drift → central mgmt; post-mortem load → dedicated VM. |
| CHALLENGES | Vendor field mismatch; IoT false beacons; odd APIs. |
| RESULT | Faster triage; more recon/C2 caught; shared access w/out risk. |
| KPIs | % aggregated; alerts/incident; first-seen catches; beacon hits; FP rate. |
| IMPACT | Shift to portable analytics; reusable playbooks. |
| STAKEHOLDERS | NetSec, Endpoint, IR, app teams. |
| SCALABILITY | Sigma + field-maps; tripwire templates; scheduled beacon scans. |
| LESSONS | Baseline first; aggregate; run heavy off-cluster. |
| COLLABORATION | Detection Eng + SOC + platform teams. |
