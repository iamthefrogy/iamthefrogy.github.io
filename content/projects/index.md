+++
date = '2026-08-23T10:00:00Z'
draft = false
title = 'Projects'
type = 'projects'
description = 'Dashboards, checklists, open-source tools and interactive guides I have built. One place, click through.'
aliases = ['/github/', '/checklists/', '/checklists/web-application-pentest-checklist/', '/checklists/network-pentest-checklist/', '/checklists/red-team-checklist/']

# ---------------------------------------------------------------------------
# Add a card: copy one [[sections.cards]] block and edit.
#   title        - card name
#   description  - one line
#   url          - where it goes
#   icon         - FontAwesome class (fa-solid by default, set icon_brand = true for fa-brands)
#   external     - true = opens in new tab
#   repo         - optional GitHub source link (shows "Source" button)
#   tags         - optional small pills
# ---------------------------------------------------------------------------

[[sections]]
id = 'dashboards'
title = 'Live Dashboards & Frameworks'
subtitle = 'Interactive, data-backed views I maintain for threat intel, detection and defence planning.'

  [[sections.cards]]
  title = 'Threat Actor DB'
  description = 'Unified dashboard of APT and threat-actor groups: state sponsors, victims, sectors, timelines and searchable detail per actor.'
  url = '/threat-actor-db/'
  icon = 'fa-user-secret'
  tags = ['CTI', 'APT', 'Dashboard']

  [[sections.cards]]
  title = 'MITRE ATT&CK Analytic Observatory'
  description = 'Coverage and gap assessment, CTI-to-detection mapper, detection-engineering workbench and purple-team board on ATT&CK Enterprise.'
  url = 'https://mitre.chintangurjar.com/'
  external = true
  repo = 'https://github.com/iamthefrogy/mitre'
  icon = 'fa-crosshairs'
  tags = ['MITRE ATT&CK', 'Detection Eng', 'Purple Team']

  [[sections.cards]]
  title = 'Defense-in-Depth 2026'
  description = 'Interactive layered defence framework for the zero-trust era. Click each ring to see technologies, pillars and aligned standards.'
  url = '/defense.html'
  icon = 'fa-layer-group'
  tags = ['Architecture', 'Zero Trust', 'Framework']

[[sections]]
id = 'checklists'
title = 'Checklists & Test-Case Libraries'
subtitle = 'Ready-to-use test cases and checklists for web, network, red team and token testing.'

  [[sections.cards]]
  title = 'Buglist - Web App Security Checklist'
  description = '279+ reusable web, API and network test cases distilled from real HackerOne reports. Filter by category and tick as you test.'
  url = 'https://buglist.chintangurjar.com/'
  external = true
  repo = 'https://github.com/iamthefrogy/buglist'
  icon = 'fa-bug'
  tags = ['Web App', 'API', 'Bug Bounty']

  [[sections.cards]]
  title = 'RedOps - Red Team Checklist'
  description = 'Red-team test-case atlas rebuilt from real Darknet Diaries incidents, each step mapped to MITRE ATT&CK.'
  url = 'https://redops.chintangurjar.com/'
  external = true
  repo = 'https://github.com/iamthefrogy/redops'
  icon = 'fa-skull-crossbones'
  tags = ['Red Team', 'ATT&CK', 'Adversary Emulation']

  [[sections.cards]]
  title = 'Network Pentest Checklist'
  description = 'Step-by-step internal and external network pentest checklist, maintained as a Google Sheet you can copy.'
  url = 'https://docs.google.com/spreadsheets/d/1lIwAqXp5iT9U3V5QyC8g6II8NgKWyJx9/edit?usp=sharing&rtpof=true&sd=true'
  external = true
  icon = 'fa-network-wired'
  tags = ['Network', 'Pentest', 'Google Sheet']

  [[sections.cards]]
  title = 'JWT Pentest Checklist'
  description = 'One-page PDF checklist for testing JSON Web Token implementations: signature, claims, algorithm and key handling.'
  url = '/files/jwt-pentest.pdf'
  external = true
  icon = 'fa-key'
  tags = ['JWT', 'Auth', 'PDF']

[[sections]]
id = 'github'
title = 'Open-Source Tools'
subtitle = 'Tools I build and maintain on GitHub. Obsolete ones (e.g. Frogy2.0) are left out; FrogScope replaces it.'

  [[sections.cards]]
  title = 'FrogScope'
  description = 'External attack-surface and exposure management in one Docker container. Correlates hosts, ports, certs and DNS, ranks findings in plain English and diffs against the last scan. Successor of Frogy2.0.'
  url = 'https://github.com/iamthefrogy/frogscope'
  external = true
  icon = 'fa-magnifying-glass'
  tags = ['EASM', 'Recon', 'Docker']

  [[sections.cards]]
  title = 'BountyHound'
  description = 'Auto-curated weekly (Monday) digest of new and trending bug-bounty GitHub repositories.'
  url = 'https://github.com/iamthefrogy/BountyHound'
  external = true
  icon = 'fa-dog'
  tags = ['Bug Bounty', 'Automation']

  [[sections.cards]]
  title = 'CyberWatchdog'
  description = 'Auto-curated weekly (Thursday) digest of new and trending cybersecurity GitHub repositories.'
  url = 'https://github.com/iamthefrogy/CyberWatchdog'
  external = true
  icon = 'fa-shield-dog'
  tags = ['Cybersecurity', 'Automation']

  [[sections.cards]]
  title = 'LoginLocator'
  description = 'Finds login portals across a list of web applications for quick authentication-surface triage.'
  url = 'https://github.com/iamthefrogy/LoginLocator'
  external = true
  icon = 'fa-right-to-bracket'
  tags = ['Recon', 'Auth']

  [[sections.cards]]
  title = 'Repo Hunter'
  description = 'Clone or update many GitHub repositories of your choice in one go. Handy for keeping a local tool arsenal fresh.'
  url = 'https://github.com/iamthefrogy/repo_hunter'
  external = true
  icon = 'fa-code-branch'
  tags = ['GitHub', 'Utility']

  [[sections.cards]]
  title = 'Darknet Diaries Transcript Downloader'
  description = 'Pulls every Darknet Diaries podcast transcript for offline reading and analysis.'
  url = 'https://github.com/iamthefrogy/DarknetDiariesTranscriptDownloader'
  external = true
  icon = 'fa-podcast'
  tags = ['OSINT', 'Utility']

  [[sections.cards]]
  title = 'All Repositories'
  description = 'Browse everything on my GitHub profile, including the source behind the dashboards above.'
  url = 'https://github.com/iamthefrogy'
  external = true
  icon = 'fa-github'
  icon_brand = true
  tags = ['GitHub']

[[sections]]
id = 'thinking'
title = 'Thinking & Career Toolkits'
subtitle = 'Interactive single-page guides on how to think and how to choose a path.'

  [[sections.cards]]
  title = "Critical Thinker's Arsenal"
  description = 'Daily mental toolkit: power questions to define the problem, investigate, challenge assumptions and decide.'
  url = '/ct.html'
  icon = 'fa-brain'
  tags = ['Critical Thinking']

  [[sections.cards]]
  title = '360 Circle of Control'
  description = 'Covey-inspired map of what you control, can influence, and must let go across personal, social, work, health, digital and money.'
  url = '/circle.html'
  icon = 'fa-circle-dot'
  tags = ['Mindset']

  [[sections.cards]]
  title = 'PCM Career Guide - India 2026'
  description = 'Interactive explorer of 18 career paths after Class-12 PCM with AI-resistance, salary and India-vs-global opportunity scores.'
  url = '/careerops.html'
  icon = 'fa-graduation-cap'
  tags = ['Career', 'India']

[[sections]]
id = 'beyond'
title = 'Beyond Security'
subtitle = 'Side projects from the sky, the court and the kitchen.'

  [[sections.cards]]
  title = 'Paragliding Flight-Day Runbook'
  description = 'From go/no-go weather check to landing and debrief: a complete paragliding flight-day checklist and reference.'
  url = '/paragliding.html'
  icon = 'fa-wind'
  tags = ['Paragliding']

  [[sections.cards]]
  title = 'Read the Sky'
  description = 'Plain-English decoder for UK drone airspace codes shown in apps like Drone Assist, so you never misread a restriction.'
  url = '/drone.html'
  icon = 'fa-plane-up'
  tags = ['Drone', 'UK']

  [[sections.cards]]
  title = 'Badminton Flow Manager'
  description = 'Court rotation, skill-balanced pairing and leaderboard app for group badminton sessions.'
  url = '/bady.html'
  icon = 'fa-table-tennis-paddle-ball'
  tags = ['Badminton', 'App']

  [[sections.cards]]
  title = 'Badminton Restringing Guide'
  description = 'Tension, string type, thickness, weight and balance explained simply, with an interactive tuner to build your own setup.'
  url = '/string-guide.html'
  icon = 'fa-wrench'
  tags = ['Badminton', 'Guide']

  [[sections.cards]]
  title = 'Menu Masi'
  description = 'Family meal planner: weekly menu, grocery list, dish library and export.'
  url = 'https://menumasi.chintangurjar.com/'
  external = true
  repo = 'https://github.com/iamthefrogy/menumasi'
  icon = 'fa-utensils'
  tags = ['Food', 'App']
+++
