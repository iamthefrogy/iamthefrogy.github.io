+++
date = '2025-11-19T06:37:07Z'
draft = false
title = '(CTI) Automotive industry threat landscape'
+++

Modern cars are not just machines that move you from A to B. They are packed with radios, sensors, SIM cards, Wi-Fi, Bluetooth, cloud backends, and mobile apps — effectively **computers on wheels that talk a lot**. That connectivity is great for drivers and fleet operators. It is also great targets for attackers.

Today I am going to cover the automotive IoT threat landscape: where attackers are getting in, what they are doing, and what both drivers and builders should be doing to reduce the blast radius.



## 1. From lab hacks to internet-scale attacks

If you look back a decade or so, “car hacking” mostly meant:

- A researcher in a lab with physical access  
- Serial cables or custom boards hanging off the OBD-II port  
- Long reverse-engineering sessions for a single impressive demo  

That era is not gone, but It is no longer the main thing.

Today:

- Cars are **always online**: LTE/5G, Wi-Fi, cloud APIs, mobile apps.  
- Vehicles can be probed from anywhere on the internet, just like any other IoT box.  
- Attackers can think in terms of **fleets**, not single cars.

A few cases that show this shift:

- **Telematics as a remote key**  
  A weakness in a major telematics platform (used in regions like the US, Canada, and Japan) made it possible to unlock, start, and track vehicles using only low-entropy personal info such as last name and postal/ZIP code. That is not “Hollywood hacking” — That is broken authentication. https://s3yfullah.medium.com/how-exposed-teslamate-instances-leak-sensitive-tesla-data-80bedd123166


- **Exposed self-hosted dashboards**  
  Hundreds of self-hosted vehicle telemetry dashboards were found exposed on the public internet, leaking:
  - GPS tracks  
  - Daily commute patterns  
  - Charging locations and times  
  - Often, the driver’s home address  
  No exploit was needed beyond “open a browser and look.”

- **Early OnStar work**  
  Earlier research (like the UCSD/UW OnStar work around 2010–2011) required complex chains and deep technical work. Compared to today’s “poke the API with guessed identifiers and weak auth,” it feels like a different era. https://www.autosec.org/pubs/cars-oakland2010.pdf

**Key point:** The connected car is now an **internet-reachable IoT node**. The main barrier is no longer physical proximity – It is whether the attacker can find an exposed interface.

## 2. Infotainment and telematics: the main entry points

If you are hunting for weak spots, infotainment and telematics systems are the obvious candidates:

- They handle **untrusted input**: Bluetooth, Wi-Fi, mobile data, USB, media files, phone integration.  
- They often sit between the outside world and **internal vehicle networks**.  
- They are full-featured software platforms and usually contain third-party stacks, open source, and vendor SDKs.

That combination makes them prime real estate for attackers.

### The shared-stack problem

One SDK, many vendors. That is the pattern.

Take a set of **Bluetooth vulnerabilities in a widely deployed stack** (for example, CVE-2024-45431):

- The same Bluetooth stack appeared in head units from multiple OEMs.  
- The resulting bugs allowed **one-click remote code execution over Bluetooth** in some configurations.  
- A flaw in one shared component instantly became **cross-brand exposure**.

Other examples:

- **Malicious media → CAN access**  
  Certain infotainment systems in the past allowed **malicious PNG files** to trigger code injection and eventually reach the CAN bus. What looks like “just playing a file” became “stepping into the vehicle’s internal networks.”

- **Vulnerability statistics**  
  Academic analysis of hundreds of connected-car CVEs from public databases showed:
  - Infotainment systems accounted for **a large fraction of known vulnerabilities**.  
  - Many issues traced back to a small set of semiconductor vendors and software stacks, showing how risk pools around a few components.

**Key point:** Infotainment and telematics systems are the **front door**. Once that door is open, attackers can often move deeper into the vehicle.

## 3. Internal network safety

Mechanical linkages used to be the final safety layer. With drive-by-wire, that last line of defense is more digital than physical.

Steering, braking, and acceleration are increasingly controlled by:

- Electronic control units (ECUs)  
- Messages flying over the **CAN bus** and related networks  

If an attacker gets a foothold on an internal vehicle network, they may be able to:

- Inject or spoof CAN messages  
- Interfere with ECUs that control safety-critical functions  
- Do all of this without obvious hardware tampering

Some well-known milestones in this story:

- **Telematics debug access (2025)**  
  Later work on telematics control units (TCUs) revealed that leftover debugging features could grant root access to a component connected to in-vehicle networks that influence steering and braking. This required physical access, but once obtained, the attacker effectively owned a powerful node inside the car’s nervous system.

**Key point:** Internal vehicle networks are often not as compartmentalized as they should be. A compromise in “non-safety” parts (like telematics or infotainment) can escalate into direct safety impact.


## 4. Metadata within car

It is easy to focus on “car gets stolen,” but from a threat actor’s perspective, the data spewing from a modern vehicle is often more attractive.

Typical data sets include:

- **Location history and real-time position**  
- **Driving patterns** (speed, timing, aggressive braking, frequent destinations)  
- **Behavioral routines** (home, work, gyms, schools, favorite shops)  
- **Personal and account information** (names, contacts, sometimes biometric indicators)

This can be used for:

- Targeted extortion and harassment  
- Corporate or state-sponsored intelligence gathering  
- Stalking and tracking of individuals  
- Building profiles on high-value targets or fleets

Real-world flavors:

- Leaky telematics platforms have exposed **years of GPS history and personal data** alongside remote control capabilities.  
- Exposed telemetry dashboards have shown **daily routines and home locations** for electric vehicle owners.  
- Bluetooth/infotainment flaws, when chained, can enable:
  - Extraction of contacts and call history  
  - Access to audio streams  
  - Collection of telemetry or positional data in some exploitation paths

  <center><img src="/images/automotive-threat-landscape.png" width="1050"/></center></br>



## 5. Patching helps but not on faster level

Security in the car world moves differently than security in the phone or laptop world.

Factors working against quick fixes:

- Vehicles are expected to last **a decade or more**.  
- Any change to critical systems can ripple through **safety certification** and regulatory requirements.  
- Supply chains are layered: OEM → Tier-1 → Tier-2 → silicon vendors → software vendors.  

So when a vulnerability hits:

- It may take time just to identify which models, years, and regions are affected.  
- Issuing and deploying a fix across millions of vehicles can take **months or years**.  
- Some vehicles will **never** receive the patch.

Examples:

- Infotainment bugs discovered around 2020 were still present in cars manufactured years later.  

## 6. Who’s attacking cars, and why?

Car hacking used to be mainly a researcher pastime. That is no longer the case. The ecosystem of attackers now includes:

### 6.1. Profit-driven cybercriminals

These actors:

- Go after **OEMs and suppliers** with ransomware and data theft.  
- Exploit backend flaws and remote control bugs to:
  - Steal vehicles  
  - Sell access or data  
  - Disrupt operations until a ransom is paid  

High-profile ransomware families and financially motivated groups have already hit automotive manufacturers and their supply chains, causing:

- Production shutdowns  
- Large data exfiltration events  
- Pressured negotiations over ransom payments

### 6.2. Nation-state and espionage-oriented groups

For these actors, the automotive world is:

- A rich **intelligence source** (movement data, logistics, fleet positioning).  
- Another layer of **critical infrastructure** to access or disrupt.  

They have shown interest in:

- Manufacturing networks and industrial control systems in automotive plants  
- Connected fleet infrastructure and backends  
- Long-term access for strategic positioning rather than quick cash

### 6.3. Ideology, activism, and clout

Some groups are not primarily driven by money or espionage, but by:

- Ideological goals  
- Activism against specific brands or industries  
- The desire for attention and headlines  

They may:

- Knock out IT and production systems of big car brands  
- Leak data for embarrassment rather than direct profit  
- Time attacks around events to maximize visibility

### 6.4. Local opportunists

At the small end:

- Car thieves exploit keyless entry weaknesses and remote unlock/start flaws.  
- Individuals with brief physical access leverage cheap tools to:
  - Clone keys  
  - Abuse diagnostic ports  
  - Take advantage of leftover debug features on TCUs or other modules  


## 7. What to do about it

Below are practical steps, split between:

1. **Drivers / owners / fleet operators**  
2. **Developers / OEMs / suppliers**

<center><img src="/images/automotive-threat-landscape2.png" width="450"/></center></br>


### 7.1. For drivers, owners, and fleet operators


#### Keep your vehicle ecosystem updated

- Apply updates for:
  - Infotainment and navigation systems  
  - Vehicle companion apps on phones/tablets  
- Periodically check:
  - Manufacturer portals  
  - Official communications  
  - Recall and security notices  

#### Treat your car accounts like banking accounts

- Use **unique, strong passwords** for:
  - Remote start / remote lock apps  
  - OEM web portals  
- Turn on **multi-factor authentication (MFA)** wherever possible.  
- Don’t recycle passwords between vehicle apps and other services.

#### Turn down the data tap

- Review privacy and data-sharing settings in:
  - Mobile apps  
  - In-car systems  
- Disable:
  - Location sharing you don’t actually need  
  - Voice assistants you never use  
  - Extra analytics features that are not essential  
- Don’t play media or plug in devices from sources you wouldn’t trust on a laptop.

#### Be picky about Bluetooth and USB

- Only pair devices you control.  
- Avoid unknown USB sticks or cables into the car.  
- Turn off Bluetooth when you are not using it — fewer attack paths, less noise.

#### Watch for odd behavior

Things to pay attention to:

- Doors unlocking or locking unexpectedly  
- Trips or commands in the app that you didn’t initiate  
- New or unfamiliar devices listed as paired in the infotainment system  

If you spot something strange:

- Grab evidence (screenshots, times, dates).  
- Raise it with your dealer or the manufacturer and mention **possible security issues**.

#### Don’t forget the phone

The phone or tablet that talks to your car is part of the attack surface.

- Keep it updated.  
- Use reputable security / endpoint protection software.  
- If the device no longer receives OS updates, strongly consider replacing it — an outdated phone is an easy way in.


### 7.2. For developers, OEMs, and suppliers

#### Design with security built-in, not bolted on

- Do **threat modeling** early, including:
  - Infotainment  
  - Telematics  
  - Backends and APIs  
- Adopt secure coding and code review practices.  
- Run regular penetration tests and red-team exercises, including OTA and backend components.

Treat telematics and infotainment as **hostile edge devices**, not just UX layers.

#### Instrument what you ship

- Collect:
  - Security-relevant logs  
  - Metrics on authentication failures and unusual behavior  
  - Traces through critical update and control paths  
- Build internal tooling to:
  - Spot abnormal patterns across fleets  
  - Correlate incidents with specific software versions or hardware platforms  

Visibility is what separates “we saw it and shut it down” from “we read about it in the news.”

#### Reduce exposure

- Avoid exposing telematics or management APIs directly to the open internet.  
- Use:
  - Strong authentication and authorization  
  - Rate limiting and anomaly detection  
  - Network segmentation and private endpoints  
- Keep administrative and debug interfaces behind **strict controls**, not left hanging out in production.

#### Segment internal vehicle networks properly

- Separate:
  - Infotainment / telematics domains  
  - Safety-critical control networks  
- Use:
  - Gateways and firewalls between networks  
  - Message-level authentication where possible  
  - Clear rules on which messages can cross boundaries  

Aim for architectures where compromising infotainment *does not* automatically mean access to brakes, steering, or powertrain.

#### Secure the update story

- Sign all updates and verify signatures on-device.  
- Use encrypted channels for delivery.  
- Design robust rollback mechanisms so that:
  - Users and dealers are not afraid of updates  
  - Field failures don’t cause permanent bricking or unsafe behavior  

The goal is to make **rolling out fixes** fast and safe enough that security updates are routine, not exceptional.

#### Take vulnerability disclosure seriously

- Publish a clear **vulnerability disclosure policy** and contact channels.  
- Respond quickly and transparently to researcher reports.  
- Track and incorporate feedback from:
  - Researchers  
  - Suppliers  
  - Partners  

A mature disclosure process shrinks the time window between “vulnerability exists” and “vulnerability mitigated.”

#### Tame the supply chain

- Require suppliers to follow recognized automotive security standards and processes.  
- Maintain a **software bill of materials (SBOM)** that includes:
  - SDKs (e.g., Bluetooth stacks, multimedia libraries)  
  - Open source components  
  - Firmware components from third-party vendors  
- Use supply-chain risk tooling and processes to:
  - Track which models use which components  
  - Quickly identify impact when a new CVE drops  
  - Plan and prioritize updates and recalls


## 8. References

  - https://samcurry.net/hacking-subaru
  - https://www.diva-portal.org/smash/get/diva2%3A1356203/FULLTEXT01.pdf
  - https://www.ioactive.com/wp-content/uploads/pdfs/IOActive_Remote_Car_Hacking.pdf
  - https://securelist.com/the-lazarus-group-deathnote-campaign/109490/Ωz
  - https://www.nccgroup.com/research-blog/technical-advisory-tesla-telematics-control-unit-adb-auth-bypass/
  - https://s3yfullah.medium.com/how-exposed-teslamate-instances-leak-sensitive-tesla-data-80bedd123166
