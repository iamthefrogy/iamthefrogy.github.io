+++
date = '2025-02-20T11:42:41Z'
draft = false
title = '(ASM) Free/Open-Source External ASM Toolkit'
+++

## Introduction

In today’s security landscape, **Attack Surface Management (ASM)** is a cornerstone of proactive defense. Monitoring internet-facing assets, uncovering shadow IT, and identifying vulnerable endpoints before attackers do can mean the difference between a resilient organization and a breach-in-the-making. Yet, many ASM tools remain **proprietary**, **expensive**, or too **complex** for smaller security teams, researchers, or hobbyists to adopt effectively.  

This is why I created **Frogy**—an open-source, Bash-based ASM tool you can run with minimal configuration. Before diving into how it works, let’s explore the motivations and driving forces behind its creation.

---

## The Challenge: Attack Surface Complexity

Most organizations today have:

- **Multiple domains and subdomains** hosted across different providers.  
- **Rapidly expanding infrastructures**, including microservices, cloud platforms, and third-party integrations.  
- **Limited internal visibility**—Shadow IT and untracked systems can slip under the radar.

Identifying all these assets, monitoring them for changes or exposures, and sorting out which ones are actually “live” can be a **daunting** process. Traditional ASM platforms exist but often come with:

1. **High licensing costs**—difficult for small or underfunded teams.  
2. **Steep learning curves**—enterprise-class platforms take time and specialized expertise to manage.  
3. **Vendor lock-in**—data remains siloed in closed systems, limiting opportunities for custom integrations.

For penetration testers, bug bounty hunters, or **lean security teams**, these obstacles may discourage systematic attack surface analysis—leading to missed vulnerabilities.

---

## The Vision: Democratizing ASM

With Frogy, the **goal** is to **simplify** and **democratize** ASM:

1. **Open Source & Transparent**  
   - Anyone can inspect the code, audit the logic, and contribute enhancements.  
   - No vendor lock-in; results are in your own environment, in a format you can customize.

2. **Easy to Run**  
   - It’s just a Bash script—no complicated setup or specialized hardware needed.  
   - Designed to work on popular Linux distributions, installing everything automatically.

3. **Cost-Effective**  
   - Built on top of widely used community tools (e.g., Subfinder, Naabu, Httpx).  
   - Zero recurring licenses—ideal for educational use, bug bounty programs, and smaller consultancies.

4. **End-to-End Workflow**  
   - From subdomain discovery to port scanning to HTTP probing, all in one go.  
   - Outputs a consolidated HTML report, with no manual merging or guesswork required.

In short, **Frogy** aims to provide a complete ASM snapshot **without** the usual friction and expense.

---

## Bridging the Gap Between Tools and Actionable Insights

It’s no secret that the security community already has a variety of excellent recon tools—like **ProjectDiscovery**’s suite (Subfinder, DNSX, Naabu, Httpx) and **Tomnomnom**’s Assetfinder. But each tool often requires separate commands and outputs. **Newcomers** can quickly get lost in the pipeline:  

- “Which tools do I run first?”  
- “How do I merge results?”  
- “How do I prioritize subdomains or ports?”  
- “How do I visualize this data?”

**Frogy** bridges these gaps by orchestrating each tool in a logical sequence, then outputting an **HTML-based** dashboard that’s easy to **parse** and **navigate**. It doesn’t just show raw data; it presents intuitive bar charts, priority buckets (P0–P4), and a searchable table so you can quickly find high-risk assets.

---

## A Tool for Teams and Individuals Alike

Because **Frogy** is open source and lightweight, it’s ideal for:

- **Bug Bounty Hunters**: Quickly discover a target’s external attack surface before diving deeper.  
- **Penetration Testers**: Add a consistent reconnaissance workflow to your engagements, ensuring no domain or subdomain goes undiscovered.  
- **Security Engineers / DevOps**: Integrate routine checks into CI/CD or cron jobs, monitoring domain expansions or new hosts.  
- **Students & Researchers**: Learn recon fundamentals without fighting steep licensing or complicated product ecosystems.

---

## GitHub Link
https://github.com/iamthefrogy/frogy2.0

## Core Logic

Below is the working process of this tool.

<center><img src="/images/frogyasm.png" width="900"/></center></br>

## How Does it Run?

Below is how you provide user input and run it. Post completion, it will generate all report files into output/company name folder. There will be report.html file.

**The content of report.html file will not be visible until you create a web server and then load report.html**

<center><img src="/images/asm2frogy.png" width="1200"/></center></br>

<center><img src="/images/asm1frogy.png" width="1200"/></center></br>
