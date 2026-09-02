+++
date = '2026-09-02T22:19:42+01:00'
draft = false
title = '(EDR) Endpoint Security Virtualisation PoV'
+++

# How Bad Is It Really? A Field Guide to Endpoint Security Severity

**Summary:** Endpoint security findings get mis-rated in both directions - a scary-sounding privilege label gets stamped Critical with no real capability gain, while a "contained" sandbox escape gets stamped Low even though a signed driver or session token walked out first. This guide gives a repeatable six-question framework (starting position, capability gained, boundary crossed, containment, scope, blast radius) and applies it to 22 concrete endpoint scenarios spanning isolation/containment, privilege boundaries, data and trust exfiltration, telemetry integrity, update/supply-chain risk, and physical/social attack paths. The goal is the reason§ing habit, not the 22 memorized answers.

**What this is:** 22 scenario-based questions for assessing endpoint security findings. Each scenario starts with a defensive situation and asks the same practical questions: how bad is it, what capability changed, which boundary moved, and what severity follows? This is a generic technical guide for impact analysis, not an exploitation walkthrough.

**How to use it:** For each scenario, pause after the setup and form your own verdict. Then compare it with the model reasoning. The goal is not to memorize 22 answers; it is to internalize a method that still works when the next scenario looks slightly different.

## THE FRAMEWORK - how to reason through severity

<center><img src="/images/edr-article-images/framework_generic.svg" alt="The endpoint severity reasoning framework" width="900"/></center></br>

Whenever you assess a scenario, walk through these six questions in order:

1. **Starting position** - where does the attacker begin? (Unauthenticated/remote, local user, local admin, inside an isolated guest environment, physical access.) This anchors everything.
2. **Gained vs already had** - what NEW capability did they get? *The delta is the severity.* If they gained nothing new, it's not critical no matter how scary it sounds.
3. **Trust boundary crossed** - guest→host? user→kernel? one machine→many? data→code? A crossed boundary is the story of the finding.
4. **Contained?** - does the damage stay trapped in a disposable box, or does it persist / spread / exfiltrate?
5. **In scope?** - does the control actually *promise* to defend against this attacker? If not, it's a documented limitation, not a vulnerability (but still flag residual risk).
6. **Blast radius** - one user, one machine, the whole fleet, or other organisations entirely? This is the severity multiplier.

**The verdict sentence**:
> *"Attacker starts at [X], gains [Y], crossing [boundary Z]. Damage is/isn't contained, is/isn't in scope, blast radius [N]. I'd rate this [severity] because of [the delta and blast radius] - not just because it sounds alarming."*

### The two mental traps every one of these scenarios is built on

**Trap A - "Sounds scary" ≠ severe.** If the attacker gained no *new capability*, severity is low even if the label ("SYSTEM", "kernel") sounds terrifying.

**Trap B - "Contained code" ≠ contained damage.** The isolation stops the *code* crossing the wall. It does **not** automatically stop *data, secrets, or trust* crossing it. Stolen tokens, exfiltrated files, and signed drivers can all escape the box even when the code can't.

<center><img src="/images/edr-article-images/containment_model_generic.svg" alt="Code containment versus impact containment" width="900"/></center></br>

Always split one scary question into two calm ones: *"Can the CODE break out?"* and *"Can the IMPACT break out?"* They have different answers.

### The privilege ladder - where real boundaries actually are

<center><img src="/images/edr-article-images/privilege_ladder_generic.svg" alt="The privilege ladder" width="900"/></center></br>

Severity comes from crossing a **real** boundary (initial access, user→admin, SYSTEM→kernel). Moving between rungs that share a boundary (admin→SYSTEM on a box you already admin) is barely a gain. Use this ladder to separate a label change from a real capability change.

# THE SCENARIOS

Grouped by theme. Each has: the setup, the core question, the reasoning path, the severity verdict, and the trap to avoid.

## GROUP 1 - Isolation & containment (the guest/host boundary)

### Scenario 1 - Full compromise inside the guest, no breakout
**Setup:** Attacker corrupts the guest-environment drivers, gets admin *inside the isolated task environment*. There is no breakout to the host. How bad is it?

<center><img src="/images/edr-article-images/scenario-01-contained-impact.svg" alt="Scenario 1 impact map" width="700"/></center></br>

**Core question:** Do you understand that "no code breakout" is only half the answer? Do you reach for Trap B?

**Reasoning:** Inside the box the attacker owns everything, but the code is trapped and dies when the isolated environment is torn down. So the naive answer is "low - it's contained, that's the whole point of the design." But then ask the second question: *what did they gain or take while inside?* If those drivers are **trusted OS-vendor-signed drivers**, the attacker can exfiltrate them and reuse that signed, trusted code as a **BYOVD (Bring Your Own Vulnerable Driver)** attack against unrelated machines - no network path to this host required. Also: whatever *ran* in that box (the sensitive document, the browsing session, typed credentials, pasted secrets) was fully visible to the attacker and can be exfiltrated over the network before teardown.

**Verdict:** Containment of *code* = works as designed (low, in scope). But **impact escape via signed-driver theft and data/secret exfiltration is High**, because the blast radius extends beyond this machine to any machine, regardless of connectivity. The severity lives in the *portability of trust*, not the breakout.

**Trap avoided:** don't stop at "it's contained." Contained code, escaped impact.

### Scenario 2 - Clipboard / file-transfer bridge between guest and host
**Setup:** The isolated web session lets the user copy text and drag files out to the host (a usability feature). Attacker controls content inside the guest. Severity?

<center><img src="/images/edr-article-images/scenario-02-bridge.svg" alt="Scenario 2 bridge map" width="700"/></center></br>

**Core question:** Do you spot that *usability bridges are the real attack surface* of an isolation control - not the hypervisor itself?

**Reasoning:** The hypervisor wall is strong, but every deliberate hole through it (clipboard, drag-and-drop, printing, USB redirection) is a potential channel for the guest to influence the host. If a malicious file dragged out isn't re-scanned, or a clipboard payload can trigger something on the host, the attacker has a *supported* path across the boundary without ever needing a hypervisor exploit.

**Verdict:** High if a bridge lets attacker-controlled data reach a host sink unchecked - because it defeats the core promise cheaply. This is exactly where a pentester should focus. In scope if the control promises host protection. Severity depends on what the host does with the transferred data.

**Trap avoided:** don't assume the boundary is only the hypervisor. The *bridges* are the boundary too.

### Scenario 3 - The isolation decision is bypassed (risky task runs un-isolated)
**Setup:** The control decides what to isolate based on the executable's filename. Attacker renames the browser/RDP client. Now the risky task runs *directly on the host*, never entering an isolated environment. Severity?

<center><img src="/images/edr-article-images/scenario-03-decision-bypass.svg" alt="Scenario 3 decision bypass map" width="700"/></center></br>

**Core question:** Do you understand that *bypassing the decision to isolate* is easier and just as damaging as escaping the box?

**Reasoning:** No breakout needed - the malware never got put in the box in the first place. A filename-based check is trivially defeated. The entire protection is silently voided while the dashboard still looks green.

**Verdict:** High. The control's central guarantee is nullified. Whether it's fully in scope depends on the attacker model (does it require local ability to run a renamed binary?), but the *design weakness* - trusting a filename - is a legitimate, important finding regardless. The fix is identity that can't be spoofed (signature/hash/path), not a name.

**Trap avoided:** don't only think about escaping isolation; think about *avoiding* it.

### Scenario 4 - Guest environment used purely as a resource/pivot (no breakout)
**Setup:** Attacker owns the guest, can't break out, but uses it to mine crypto (host memory/CPU) and to scan the internal network the guest can reach. Severity?

<center><img src="/images/edr-article-images/scenario-04-network-pivot.svg" alt="Scenario 4 network pivot map" width="700"/></center></br>

**Core question:** Can you separate *nuisance* impact from *pivot* impact?

**Reasoning:** Resource abuse (mining, memory pressure) is a genuine but low-severity availability nuisance. The more interesting question: **what can the guest's network position reach?** If the isolated environment is placed on a network segment with line-of-sight to internal services, the contained box becomes an internal *foothold* for reconnaissance and lateral attempts - the containment failed to contain *network reach*.

**Verdict:** Resource abuse = Low. But if the guest has meaningful internal network reach, the pivot potential raises it to Medium/High depending on what's reachable. Ask: "what's on the network the guest can see?"

**Trap avoided:** "trapped in a box" doesn't mean "trapped from the network."

### Scenario 5 - Disposable environment teardown fails / persistence across sessions
**Setup:** Attacker finds that something they place inside a "disposable" isolated environment actually survives teardown and is present in the *next* isolated environment the user spins up. Severity?

<center><img src="/images/edr-article-images/scenario-05-persistence.svg" alt="Scenario 5 persistence map" width="700"/></center></br>

**Core question:** Do you understand that the disposability *is* the security control? If it fails, the whole model weakens.

**Reasoning:** The entire value proposition is "malware dies when the task ends - no patient zero." If state persists across supposedly-fresh instances, the attacker gains **persistence** inside the protected zone, which the design explicitly promised to prevent. Now a one-time drive-by can watch every future browsing/document session.

**Verdict:** High. It breaks the explicit disposability promise. In scope, and directly undermines the core defence. Persistence is always a severity escalator.

**Trap avoided:** don't treat teardown as a background detail - it's the load-bearing control.

## GROUP 2 - Privilege boundaries (the "sounds scary" traps)

### Scenario 6 - Local admin escalates to SYSTEM
**Setup:** Attacker already has local admin. A report says they escalated to SYSTEM and rates it Critical. Reality?

<center><img src="/images/edr-article-images/scenario-06-admin-system.svg" alt="Scenario 6 admin to SYSTEM map" width="700"/></center></br>

**Core question:** Trap A. Do you know admin→SYSTEM is barely a boundary on a machine you already own?

**Reasoning:** A local administrator can already install drivers, change most config, read most data, and *become* SYSTEM through numerous legitimate mechanisms anyway. The jump grants almost no new capability on that machine. The "Critical" rating is wrong - it's reacting to the scary word "SYSTEM," not to a real capability delta.

**Verdict:** Low (on that machine). The severity would only rise if SYSTEM unlocked something admin genuinely couldn't reach - e.g. tampering with a security agent that specifically resists admin but not SYSTEM, or reaching another user's isolated data. Always ask "what can SYSTEM do here that admin couldn't?"

**Trap avoided:** scary label ≠ severity. Measure the *delta*.

### Scenario 7 - Local admin can disable the security agent
**Setup:** A local admin clicks "Disable" (or kills the agent's service) and turns off endpoint protection. A report rates it Critical. Reality?

<center><img src="/images/edr-article-images/scenario-07-admin-disable.svg" alt="Scenario 7 admin disable map" width="700"/></center></br>

**Core question:** Attacker-model scoping. Is a malicious local admin *in scope*?

**Reasoning:** Many endpoint-isolation controls explicitly place the malicious local administrator *out of scope* - they defend the OS from external/content threats, not from the machine's own admin. If that's the stated model, "admin can disable it" is a documented limitation, not a vulnerability. BUT: customers often *assume* tamper-resistance, so the residual risk is worth surfacing loudly even if it's "out of scope."

**Verdict:** Depends entirely on the stated attacker model. If admin is out of scope → informational/low as a *bug*, but flag the expectation gap. If the control *claims* tamper-resistance against admin → then it's a real High finding. The mature answer names both cases.

**Trap avoided:** don't reflexively rate it Critical; anchor to what the control *promised*.

### Scenario 8 - Standard user escalates to local admin
**Setup:** A normal, unprivileged user finds a way to become local admin. Severity?

<center><img src="/images/edr-article-images/scenario-08-user-admin.svg" alt="Scenario 8 user to admin map" width="700"/></center></br>

**Core question:** Do you recognise this crosses a *real* boundary (unlike Scenario 6)?

**Reasoning:** This is the opposite of the trick. User→admin is a genuine, meaningful privilege boundary - the attacker gains software installation, config control, access to other data, and the ability to weaken defences. Real capability delta, real boundary crossed.

**Verdict:** High. Genuine local privilege escalation. Almost always in scope and always significant on an endpoint. Contrast this explicitly with Scenario 6: the important distinction is *which* jumps create meaningful new capability.

**Trap avoided:** don't over-correct and dismiss all EoP as "trick questions." This one is real.

### Scenario 9 - SYSTEM escalates to kernel/driver level
**Setup:** Attacker with SYSTEM loads malicious code into the kernel via a driver. Severity?

<center><img src="/images/edr-article-images/scenario-09-system-kernel.svg" alt="Scenario 9 SYSTEM to kernel map" width="700"/></center></br>

**Core question:** Do you know SYSTEM→kernel *is* a real boundary (unlike admin→SYSTEM)?

**Reasoning:** Kernel/driver level sits *below* the OS's own defences. Code there can hide from and disable security tooling, tamper with the OS itself, and is far harder to detect or remove. Unlike admin→SYSTEM, this genuinely unlocks new capability - stealth and control the user-mode SYSTEM account doesn't have.

**Verdict:** High. Real boundary, real new capability (stealth, defence evasion, persistence). Note the nuance: on modern Windows, loading unsigned kernel code is itself gated - which is exactly why *signed* drivers (Scenario 1) are so prized.

**Trap avoided:** don't lump this with the admin→SYSTEM trick. Different boundary, different answer.

## GROUP 3 - Data, secrets & trust escaping the box

### Scenario 10 - Session cookie / token theft from inside an isolated web session
**Setup:** Malware runs in an isolated web session (contained). Before teardown it steals the user's authenticated session cookies for their cloud email/SaaS and exfiltrates them. Severity?

<center><img src="/images/edr-article-images/scenario-10-token-theft.svg" alt="Scenario 10 token theft map" width="700"/></center></br>

**Core question:** Trap B again, and awareness of the modern shift from password theft to *token* theft.

**Reasoning:** The code is contained and dies - but the **cookie already left the building**. A stolen session token lets the attacker log in *as the user from their own machine*, often bypassing MFA entirely (the token represents an already-authenticated session). The isolation contained the malware but not the *consequence*.

**Verdict:** High. The user's cloud accounts are compromised off-box, MFA notwithstanding. Blast radius extends to every SaaS the token covers. This is one of the most important real-world endpoint risks in 2026 and a great one to raise proactively.

**Trap avoided:** "malware was contained and destroyed" is cold comfort if it exfiltrated a live token first.

### Scenario 11 - Credentials typed *into* an isolated privileged session
**Setup:** An admin uses an isolated RDP/SSH session (the isolation is meant to protect the credential from a compromised host). But the attacker has compromised *inside* the isolated session itself. Severity?

<center><img src="/images/edr-article-images/scenario-11-privileged-session.svg" alt="Scenario 11 privileged session map" width="700"/></center></br>

**Core question:** Do you understand the isolation's *direction* - it protects the session from the host, not necessarily from a threat that's already inside the session?

**Reasoning:** Privileged-access controls may isolate the session so a keylogger on the (possibly compromised) host can't see the admin's credentials. That's a real, valuable protection. But if the threat is *inside* the isolated session, or the content loaded into it is malicious, the credential and everything the session touches (often high-value: domain admin, jump hosts) is exposed.

**Verdict:** High/Critical if the isolated privileged session itself can be compromised, because these sessions guard the *keys to the kingdom*. Clarify the direction of the isolation because that determines what the control actually protects and from whom.

**Trap avoided:** don't assume "isolated = safe in all directions." Isolation has a direction.

### Scenario 12 - Signed driver/binary exfiltration for reuse elsewhere
**Setup:** Attacker extracts a legitimately-signed driver or binary from the machine and reuses it (or a known-vulnerable signed driver) on *other* organisations' machines entirely. Severity?

<center><img src="/images/edr-article-images/scenario-12-signed-artifact.svg" alt="Scenario 12 signed artifact map" width="700"/></center></br>

**Core question:** Do you grasp that *signed trust is portable* and the blast radius jumps to "anyone, anywhere"?

**Reasoning:** A signature is a trust anchor that travels with the file. A validly-signed but vulnerable driver is a reusable weapon (BYOVD) - the attacker drops it on any target to get kernel-level capability, because the OS trusts the signature. The originating machine's isolation is irrelevant; the *artifact* is the payload.

**Verdict:** High as a class of issue - blast radius is unbounded (unrelated machines/orgs, no connectivity needed). Frame it as: "the finding isn't the local compromise, it's that a portable trust artifact left the building."

**Trap avoided:** stop measuring severity by *this* machine when the stolen thing works on *every* machine.

### Scenario 13 - Sensitive data visible inside the box during processing
**Setup:** A confidential document is opened inside the isolated environment (safe from host malware). Attacker controls code inside that same isolated environment. Severity?

<center><img src="/images/edr-article-images/scenario-13-data-in-use.svg" alt="Scenario 13 data-in-use map" width="700"/></center></br>

**Core question:** Same as 10/12 - containment of code, not of data-in-use.

**Reasoning:** The isolation protects the *host* from the *document* (if the doc is malicious). It does not protect the *document* from a threat *inside* the box. If the attacker is in the box with the open document, they can read and exfiltrate its contents before teardown.

**Verdict:** Severity scales with data sensitivity - could be High/Critical for regulated or high-value data (IP, PII, secrets). In scope depends on whether the control claims to protect data confidentiality *within* the box or only host integrity.

**Trap avoided:** ask "which asset is the isolation protecting - the host, or the data?" They can differ.

## GROUP 4 - Detection, telemetry & trust in reporting

### Scenario 14 - Attacker forges or floods the security telemetry/logs
**Setup:** Attacker (contained in a box, or with local access) can submit fake log/telemetry entries to the management console - forging "all healthy" events, or flooding logs to bury real ones. Severity?

<center><img src="/images/edr-article-images/scenario-14-telemetry-forgery.svg" alt="Scenario 14 telemetry forgery map" width="700"/></center></br>

**Core question:** Do you value *integrity of detection* as a security property in its own right?

**Reasoning:** If defenders can't trust the dashboard, they lose visibility. Forged "healthy" status hides an active compromise; log flooding buries the needle. Individually these look low, but **combined with an actual compromise they become a severity multiplier** - the attacker operates while defenders are blind and reassured.

**Verdict:** Medium alone; High in combination with any real compromise, because it defeats detection and response. Great example of *chaining*: two "boring" issues (weak log auth + no rate limiting) compound into "invisible attacker."

**Trap avoided:** don't dismiss telemetry integrity as "just logs." Blind defenders is a real impact.

### Scenario 15 - Attacker disables telemetry silently (agent still "green")
**Setup:** Attacker stops the endpoint from *sending* telemetry, but the console still shows the device as connected/healthy (last-known-good). Severity?

<center><img src="/images/edr-article-images/scenario-15-silent-telemetry.svg" alt="Scenario 15 silent telemetry map" width="700"/></center></br>

**Core question:** Do you distinguish "no alerts" from "no problems"?

**Reasoning:** Absence of telemetry should itself be an alert. If a silenced agent looks identical to a healthy one, the attacker has bought unlimited dwell time. The detection gap *is* the finding.

**Verdict:** High as a detection/monitoring gap, especially combined with a live intrusion. The fix is heartbeat/dead-man's-switch alerting on *missing* telemetry.

**Trap avoided:** "no alerts" is not "all good" - silence can be the attack.

### Scenario 16 - Isolation works, but nothing is logged about what happened inside
**Setup:** Malware detonates in the isolated environment, is contained and destroyed - but no forensic record of what it did/tried is captured. Severity?

<center><img src="/images/edr-article-images/scenario-16-no-forensics.svg" alt="Scenario 16 no-forensics map" width="700"/></center></br>

**Core question:** Do you value post-incident visibility, not just prevention?

**Reasoning:** Prevention worked, which is good. But if defenders can't see *what was attempted* (was it targeted? what did it try to reach? did it exfiltrate a token first - see Scenario 10?), they can't assess whether containment was actually complete or whether something escaped before teardown.

**Verdict:** Medium - a visibility/forensics gap rather than a breach. Worth raising because "contained" claims need evidence, and some "contained" incidents exfiltrated data first.

**Trap avoided:** don't treat prevention as the end of the story - response needs data too.

## GROUP 5 - Update, supply chain & configuration

### Scenario 17 - Attacker forces a downgrade to an older, vulnerable agent version
**Setup:** Attacker can make the endpoint "update" to an *older* version of the security agent that has known vulnerabilities. Severity?

<center><img src="/images/edr-article-images/scenario-17-downgrade.svg" alt="Scenario 17 downgrade map" width="700"/></center></br>

**Core question:** Do you know rollback/downgrade defeats patching entirely?

**Reasoning:** All the patches in the world don't help if an attacker can revert to a vulnerable build. Downgrade attacks re-open every fixed hole at will. The trust is in the update mechanism's *anti-rollback* protection.

**Verdict:** High. It nullifies the entire patch program and re-enables known-exploitable bugs on demand. In scope for any platform with an update channel.

**Trap avoided:** don't assume "it can update" is purely good - updating *down* is an attack.

### Scenario 18 - Update channel isn't integrity-checked (malicious update)
**Setup:** The agent fetches updates over a channel where an attacker (MITM, or a compromised mirror) can substitute a malicious package that the agent installs. Severity?

<center><img src="/images/edr-article-images/scenario-18-malicious-update.svg" alt="Scenario 18 malicious update map" width="700"/></center></br>

**Core question:** Do you recognise a security agent's update path as a *privileged code-execution channel*?

**Reasoning:** A security agent typically runs with high privilege, so its update mechanism is a direct path to privileged code execution across *every* endpoint that updates. If packages aren't signed and verified, a poisoned update is fleet-wide compromise via the very tool meant to protect.

**Verdict:** Critical if exploitable - blast radius is the entire fleet, via a trusted, privileged channel. This is one of the highest-impact endpoint findings possible.

**Trap avoided:** don't think one machine - think "every machine that pulls this update."

### Scenario 19 - A default/weak configuration ships protection-off
**Setup:** The platform is powerful, but its *default* config leaves a key protection disabled, and most customers never change defaults. Severity?

<center><img src="/images/edr-article-images/scenario-19-weak-default.svg" alt="Scenario 19 weak default map" width="700"/></center></br>

**Core question:** Do you weight *real-world deployed state* over theoretical capability?

**Reasoning:** Security that's off by default is security most people don't have. "It can be configured securely" is little comfort if the shipped default is weak and defaults are sticky. The severity is about the *deployed reality*, not the datasheet.

**Verdict:** Medium–High depending on which protection and how many customers are exposed. Frame it as "secure by default vs secure if configured" - a governance point that impresses.

**Trap avoided:** don't rate the platform's *potential*; rate what's actually running at customers.

## GROUP 6 - Physical, local & misc endpoint angles

### Scenario 20 - Attacker with physical access / evil-maid
**Setup:** Attacker has brief physical access to a powered-off, isolation-protected laptop. Severity?

<center><img src="/images/edr-article-images/scenario-20-physical.svg" alt="Scenario 20 physical access map" width="700"/></center></br>

**Core question:** Do you know where endpoint software protection ends and physical/firmware threats begin?

**Reasoning:** Most endpoint-isolation software assumes a running OS and doesn't defend a powered-off device against firmware/bootloader tampering, drive removal, or DMA attacks - unless paired with full-disk encryption and firmware protections. Physical access is often explicitly *out of scope* for the software layer, but the residual risk is real.

**Verdict:** Depends on the model and on whether FDE/firmware protections are present. Often out of scope for the software control itself, but you should name the mitigations (disk encryption, secure boot, firmware protection) that *do* cover it. Shows breadth.

**Trap avoided:** don't claim software isolation protects a powered-off laptop - know the boundary.

### Scenario 21 - Isolation covers the browser, but not another entry vector
**Setup:** The control isolates browser and email attachments effectively. Attacker delivers their payload via a USB stick / a chat file / a channel the control doesn't isolate. Severity?

<center><img src="/images/edr-article-images/scenario-21-uncovered-vector.svg" alt="Scenario 21 uncovered vector map" width="700"/></center></br>

**Core question:** Can you find *coverage gaps* - the un-isolated path - rather than attacking the strong path?

**Reasoning:** A good pentester attacks where the isolation *isn't*. If only some vectors are isolated, attackers simply use the others. The strong control is irrelevant if there's an unguarded door beside it.

**Verdict:** High if a common delivery vector is entirely outside the isolation, because it defeats the protection by going around it. This is core pentester thinking: map *all* the entry paths, then attack the unprotected one.

**Trap avoided:** don't only test the isolated path - enumerate what *isn't* covered.

### Scenario 22 - Social engineering the user out of the protection
**Setup:** The control would isolate a risky action, but the attacker convinces the user to click "always allow / trust this / open outside protected mode." Severity?

<center><img src="/images/edr-article-images/scenario-22-user-optout.svg" alt="Scenario 22 user opt-out map" width="700"/></center></br>

**Core question:** Do you account for the human as part of the attack surface, and for "secure but bypassable-by-consent" designs?

**Reasoning:** If the control lets a user *consent their way out* of protection with a click, attackers will just ask them to. Whether this is "in scope" is debatable (user was tricked), but a design that makes opting out too easy is a legitimate weakness - the more dangerous the opt-out, the more friction/justification it should require.

**Verdict:** Medium - a design/UX-security finding. Frame it as: protections that can be trivially waived by an untrained user under social-engineering pressure erode their own value. Recommend making dangerous opt-outs harder and rarer.

**Trap avoided:** don't ignore the human path just because it's "not technical" - it's often the easiest bypass.

# QUICK-REFERENCE SEVERITY TABLE

| # | Scenario (one-liner) | Likely verdict | The key insight |
|---|---|---|---|
| 1 | Own the guest, no breakout, but steal signed drivers | High (impact escapes) | Contained code ≠ contained impact |
| 2 | Clipboard/file bridge guest→host | High | Bridges are the boundary too |
| 3 | Rename exe to dodge isolation | High | Bypassing the decision ≈ escaping |
| 4 | Guest as crypto-miner / network pivot | Low→High | Trapped ≠ trapped from network |
| 5 | Isolated-environment teardown fails, state persists | High | Disposability is the control |
| 6 | Admin→SYSTEM on own machine | **Low (trick)** | Scary label ≠ real delta |
| 7 | Admin disables the agent | Depends on model | Anchor to what's promised |
| 8 | User→admin | High | A *real* boundary (contrast #6) |
| 9 | SYSTEM→kernel via driver | High | Real boundary; below the OS |
| 10 | Steal session token from isolated web session | High | Token theft bypasses MFA |
| 11 | Compromise inside isolated privileged session | High/Critical | Guards the keys to the kingdom |
| 12 | Exfiltrate signed driver for BYOVD elsewhere | High | Portable trust = unbounded blast radius |
| 13 | Read sensitive doc from inside the box | High/Critical (data-dependent) | Isolation direction: host vs data |
| 14 | Forge / flood telemetry | Med→High (chained) | Blind defenders is real impact |
| 15 | Silently disable telemetry, stays "green" | High | "No alerts" ≠ "no problems" |
| 16 | Contained, but no forensic record | Medium | Prevention isn't the whole story |
| 17 | Force downgrade to vulnerable version | High | Rollback defeats patching |
| 18 | Malicious update (no integrity check) | Critical | Privileged, fleet-wide channel |
| 19 | Insecure default config | Med→High | Rate deployed reality, not potential |
| 20 | Physical / evil-maid | Depends (often out of scope) | Know where software protection ends |
| 21 | Un-isolated delivery vector | High | Attack where isolation isn't |
| 22 | Social-engineer the opt-out | Medium | Human is part of the attack surface |

# THE FIVE PRINCIPLES BEHIND EVERY ANSWER

If you internalize nothing else, internalize these - they generate the right answer to scenarios you've never seen:

1. **Measure the delta, not the label.** Severity = what the attacker *gained*, not how scary the words sound. (admin→SYSTEM = low; user→admin = high.)
2. **Separate code containment from impact containment.** The box traps code. Data, tokens, secrets, and signed artifacts can still walk out. Always ask "what did they take/learn while inside?"
3. **Trust is portable; blast radius is the multiplier.** A signed driver or a valid token works off-box. When the stolen thing works everywhere, severity stops being about this one machine.
4. **Anchor to the attacker model, then flag the gap.** "Out of scope" is a valid verdict - but if customers reasonably expect protection the model doesn't give, surface that residual risk loudly.
5. **Attack where the control isn't.** The strongest isolation is irrelevant next to an un-isolated vector, a weak default, a downgrade path, or a one-click opt-out. Enumerate the whole surface, then hit the soft part.

Use these scenarios as reusable severity drills. The consistent habit is to name the attacker start point, the gained capability, the crossed boundary, containment outcome, scope, and blast radius before assigning a rating.
