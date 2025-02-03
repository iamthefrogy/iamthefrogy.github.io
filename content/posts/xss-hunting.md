+++
date = '2025-02-03T04:46:47Z'
draft = false
title = '(Bug-Bounty) Master XSS Hunting Methodology'
+++

Below is a straightforward, step-by-step approach to uncovering Cross-Site Scripting (XSS) vulnerabilities. The focus here is on the methodology rather than specific payload examples.

<center><img src="/images/xss_hunting.png" width="1300"/></center></br>

---

## 1. Identify Where User Input Can Appear

1. Look for any field, query parameter, or user-controllable data source.
2. Observe if the input is shown back on the page, either directly or indirectly.
3. Note whether the input appears inside HTML, in script code, or within attributes.

---

## 2. Classify the Reflection Context

1. **Raw HTML Context:** Check if the input is inserted as normal text or within tags.  
2. **HTML Attribute Context:** Examine if the input is used inside attributes (e.g., `href`, `src`).  
3. **JavaScript Context:** Determine if the input lands inside script blocks or inline event handlers.  
4. **Client-Side Templating:** If frameworks like Angular, React, or Vue are present, see if user input is being processed through a template.  
5. **Callback Functions:** Look for parameters that might be used inside a JavaScript function call.

Understanding exactly where and how input is reflected dictates the techniques you use next.

---

## 3. Develop a Strategy for Injection

1. **Analyze Existing Filters:** Identify what filtering or sanitization the application applies.  
2. **Consider Encoding Methods:** Explore character encodings, escaping, and other ways to bypass basic filters.  
3. **Try Breaking Out of Context:** If the input is within a tag or string, see if you can close it and create new syntax.  
4. **Review Browser-Specific Behaviors:** Check if older or less common browsers might handle content differently.

---

## 4. Move Beyond Initial Attempts

If simple methods are blocked:

1. **DOM XSS Inspections:** Search for dangerous functions that write directly to the page (e.g., `document.write`, `eval`, or framework-specific rendering).  
2. **Event Handlers and Alternate Attributes:** Look at mouse, keyboard, and load events. Some contexts may be overlooked by simple filters.  
3. **Template Injection Techniques:** Examine how data is inserted if a JavaScript framework is in use. Attempt to break or exploit the template system.  
4. **Chained Attacks:** Combine smaller vulnerabilities (like parameter pollution or path traversal) to position your input in a place where it can achieve full script execution.

---

## 5. Check for Stored (Persistent) XSS

1. **Submit Data That Persists:** Enter data through forms, profile updates, or any input fields that might be saved.  
2. **Revisit or Load Another Page:** See if that stored data is later rendered in a way that allows for script execution.  
3. **Monitor Sanitization or Escaping Measures:** Determine if the application attempts to neutralize certain strings or patterns.

---

## 6. Adjust and Refine

1. **Experiment With Different Contexts:** If one approach is blocked, try injecting the same data into another part of the application.  
2. **Stay Aware of Advanced Protections:** If Content Security Policy (CSP) or a Web Application Firewall (WAF) is present, plan alternative bypasses.  
3. **Leverage Multiple Methods:** Sometimes a combination of partial injections and encodings is needed for success.

---

## 7. Verify and Document

1. **Confirm Execution:** Establish a clear indication that the script runs—this may be a console log or other benign proof of execution.  
2. **Document Findings Clearly:** Provide details on where the vulnerability occurs and why it is exploitable.  
3. **Suggest Remediation:** Propose solutions (e.g., output encoding, content security policies, strict input validation).

---

## Conclusion

By methodically checking reflection points, analyzing the context, and adjusting your approach when blocked, you can systematically uncover XSS vulnerabilities. Stay persistent, pay attention to where and how user input appears, and tailor your technique to the specific context at hand.
