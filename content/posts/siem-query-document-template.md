+++
date = '2025-01-12T01:08:17Z'
draft = false
title = '(SIEM) SIEM Query Knowledgebase Document Template'
+++

## 1. Title
- **Title:** [Query Title]

## 2. Author
- **Author:** [Author Name]
- **Date Created:** [Creation Date]
- **Last Modified:** [Last Modification Date]

## 3. Frequency to Run
- **Frequency:** [Run Frequency]

## 4. Log Sources
- **Log Sources:**
  - [Source 1]
  - [Source 2]
  - ...

## 5. Alert Severity
- **Severity:** [Severity Level (P1-P4)]

## 6. Escalation Path
- **Escalation:** [Level of Analyst (L1-L3)]

## 7. Scope
- **Scope:** [Description of Scope]

## 8. Query Description
- **Description:** [Detailed Description of the Query]

## 9. MITRE ATT&CK Mapping
- **TTPs:**
  - [Tactic, Technique, Procedure]
  - ...

## 10. Detection Methodology
- **Methodology:** [Description of Detection Method]

## 11. Query Lifecycle Management
- **Review Frequency:** [Review Frequency]
- **Responsible Party:** [Person/Team Responsible]

## 12. Testing and Validation
- **Test Cases:**
  - [Test Case 1]
  - [Test Case 2]
  - ...

## 13. References
- **References:**
  - [Reference 1]
  - [Reference 2]
  - ...

## 14. Compliance Considerations
- **Compliance:** [Compliance Standards]

## 15. Query Code
[Query Code Here]

## Example SIEM Query: Detecting Unauthorized Access Attempts

### 1. Title
- **Title:** Detect Multiple Failed Login Attempts

### 2. Author
- **Author:** John Doe
- **Date Created:** 2023-10-01
- **Last Modified:** 2023-10-15

### 3. Frequency to Run
- **Frequency:** Every 5 minutes

### 4. Log Sources
- **Log Sources:**
  - Windows Event Logs
  - Network Device Logs

### 5. Alert Severity
- **Severity:** P2

### 6. Escalation Path
- **Escalation:** L2 Analyst

### 7. Scope
- **Scope:** All organizational Windows servers

### 8. Query Description
- **Description:** This query detects multiple failed login attempts from the same IP address within a 10-minute window, indicating potential brute-force attacks.

### 9. MITRE ATT&CK Mapping
- **TTPs:**
  - T1110: Brute Force
  - T1078: Valid Accounts

### 10. Detection Methodology
- **Methodology:** Anomaly-based detection by monitoring failed login attempts over time.

### 11. Query Lifecycle Management
- **Review Frequency:** Quarterly
- **Responsible Party:** Security Operations Team

### 12. Testing and Validation
- **Test Cases:**
  - Simulate multiple failed logins from a single IP
  - Test with known good login attempts

### 13. References
- **References:**
  - MITRE ATT&CK Framework
  - NIST 800-53

### 14. Compliance Considerations
- **Compliance:** Aligns with GDPR and PCI-DSS requirements

### 15. Query Code
```spl
index=security
| where EventID=4625
| stats count by src_ip, dest_ip
| where count > 10
| table src_ip, dest_ip, count
