+++
date = '2026-09-28T00:00:00Z'
draft = false
title = 'Weekly Threat Intelligence Briefing'
type = 'threat-intel'
description = 'Weekly roundup of notable threat-intel developments: exploited CVEs, active campaigns and threat-actor activity. New card every week.'

### ---------------------------------------------------------------------------
### ADD NEW BRIEFING. CAVEMAN STEPS.
###
###  1. Put .html in static/threat-intel/   <- STATIC. NOT public/.
###     public/ = Hugo output. deploy.sh wipe it every run. File there = gone.
###
###  2. Rename file. No space, no bracket. Pattern = start-end date:
###       mv "static/threat-intel/<long name>.html" static/threat-intel/2026-10-04-2026-10-18.html
###
###  2b. Kill localhost links. Browser "Save Page As" bake in http://localhost:8010/...
###      Hugo no fix links. Live site = broken "Full details". Check:
###        grep -c localhost static/threat-intel/<file>.html      (want 0)
###      Not 0? Strip prefix, keep only #anchor (copy exact prefix from grep):
###        sed -i '' 's#http://localhost:8010/reports/file/<digest name>.html\##\##g' static/threat-intel/<file>.html
###
###  3. Copy one [[weeks]] block at bottom (above closing +++). Edit 4 fields:
###       title   = text on card, e.g. '04 - 18 Oct 2026'
###       date    = END date, 'YYYY-MM-DD'. Only for sort (newest first).
###       url     = '/threat-intel/<EXACT file name from step 2>'
###                 Wrong name = 404. Case matter. No 'static/' in url.
###       summary = one line (optional). Grab from file:
###                 grep -o 'og:description" content="[^"]*' static/threat-intel/<file>.html
###                 Single quote ' inside summary break TOML. Use ’ or remove.
###
###  4. Check local:  hugo server   -> open http://localhost:1313/threat-intel/
###     Card show? Click "Read briefing". Briefing open? Good. Ctrl+C stop.
###
###  5. Ship:  ./deploy.sh "add threat intel 04-18 Oct"
###     Wait 1-2 min. Check https://chintangurjar.com/threat-intel/
###
###  Note: top 'date' of THIS file (front matter) must not be future,
###  else Hugo drop whole page. Week dates no matter for that.
### ---------------------------------------------------------------------------

[[weeks]]
title = '26 Sep - 3 Oct 2026'
date = '2026-10-03'
url = '/threat-intel/2026-09-21-2026-09-28.html'

[[weeks]]
title = '04 - 18 Oct 2026'
date = '2026-10-18'
url = '/threat-intel/2026-10-04-2026-10-18.html'

+++
