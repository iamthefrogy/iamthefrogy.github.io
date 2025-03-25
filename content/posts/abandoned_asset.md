+++
date = '2025-03-25T12:55:31Z'
draft = false
title = '(ASM) Decision Tree to Identify Potential/Confirmed Abandoned/Unmaintained External Applications'
+++

Maintaining a clean and secure application inventory is critical for any organization. Over time, however, many web applications become outdated or downright abandoned. This post presents an **in-depth decision framework**—complete with a **GraphViz DOT diagram**—that you can use to systematically identify potentially unwanted or abandoned applications.

---

## Why Does This Matter?

- **Security Risks**: Unpatched or poorly maintained apps are prime targets for attackers.
- **Resource Management**: Abandoned systems waste hosting costs, domain fees, and other resources.
- **Compliance**: Many regulations require up-to-date, actively maintained environments.

---

## High-Level Criteria

We generally split “abandonment indicators” into *Potential* vs. *Confirmed*. A few examples:

1. **Domain Resolution**  
   - If the domain is parked or returns NXDOMAIN, that’s a strong sign no one is maintaining it.
2. **SSL Certificate Status**  
   - **Expired > 30 days?** Strong “Confirmed” signal.  
   - **No certificate for an HTTPS site?** Strong “Potential” signal.
3. **Home Page Content**  
   - Blank page, server default page, or persistent error → potential abandonment.
4. **Site Content & Links**  
   - Minimal content, lots of broken links, or no corporate branding → potential flag.
5. **Ownership / Updates**  
   - No known owner, or the last code update was many months/years ago → potential flag.
6. **Technology Stack**  
   - End‐of‐life frameworks (e.g., old Java versions, older Windows servers), unpatched known CVEs → strong “Confirmed” sign if combined with other factors.
7. **Traffic / Logs**  
   - Zero hits or usage for months → a big indicator that no one is using or maintaining it.

By **tallying these indicators**, you can decide whether an application is simply *Potentially Abandoned* (needs more investigation) or *Confirmed Abandoned* (safe to retire or require urgent remediation).

<center><img src="/images/abandoned_asset.png" width="1250"/></center></br>
