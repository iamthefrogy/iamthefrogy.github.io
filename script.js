const BLACKLISTED_KEY_CODES = [ 38 ];
const COMMANDS = {
  help:
    'Supported commands: <span class="code">about</span>, <span class="code">experience</span>, <span class="code">education</span>, <span class="code">skills</span>, <span class="code">certifications</span>, <span class="code">contact</span>',
  about:
    "Cyber Security practitioner capable of strategizing, architecting, building and maturing cyber security initiatives. Passionate about analyzing cyber security risks and translating them to actionable countermeasures. 8 years+ of working experience in Cyber Security domain. University Masters degree in Cybersecurity and Forensics from University of Bedfordshire (UK).",
  skills:
    "Security Engineering | Threat and Vulnerability Management | Threat Hunting & Intelligence | Red teaming | Security Operation Analysis | Penetration Testing",
  education:
    "MSc. in Computer Security & Forensics<br> B.Tech in Computer Engineering",
  experience:'<span class="code">Total experience: 9 years</span><br>Security Engineering Manager - Tesco - United Kingdom - Present<br> Manager - KPMG New Zealand - New Zealand - 3 years 6 months<br>Security Consultant - NotSosecure - India - 8 months<br>Security Engineer - Zebpay - India - 6 months<br>Security Analyst (Enterprise Customer Service) - India - 1 year 9 months<br>Security Analyst - LetNurture - India - 1 year 6 months',
  certifications: 
    "OSCP - Offensive Security Certified Professional<br>CTIA - Cyber Threat Intelligence Analyst<br>CEH - Certified Ethical Hacker<br>CCFH - Certified Crowdstrike Falcon Hunter<br>CCFA - Certified CrowdStrike Falcon Administrator",
  contact:
    "You can contact me on any of following links:<br><a href='https://www.linkedin.com/in/chintangurjar/' class='success link'>Linkedin</a>, <a href="mailto:chintangurjar@outlook.com" class='success link'>Email</a>, <a href='https://twitter.com/iamthefrogy/' class='success link'>Twitter</a>"
};
let userInput, terminalOutput;

const app = () => {
  userInput = document.getElementById("userInput");
  terminalOutput = document.getElementById("terminalOutput");
  document.getElementById("dummyKeyboard").focus();
  console.log("Application loaded");
};

const execute = function executeCommand(input) {
  let output;
  input = input.toLowerCase();
  if (input.length === 0) {
    return;
  }
  output = `<div class="terminal-line"><span class="success">➜</span> <span class="directory">~</span> ${input}</div>`;
  if (!COMMANDS.hasOwnProperty(input)) {
    output += `<div class="terminal-line">no such command: ${input}</div>`;
    console.log("Oops! no such command");
  } else {
    output += COMMANDS[input];
  }

  terminalOutput.innerHTML = `${
    terminalOutput.innerHTML
  }<div class="terminal-line">${output}</div>`;
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
};

const key = function keyEvent(e) {
  const input = userInput.innerHTML;

  if (BLACKLISTED_KEY_CODES.includes(e.keyCode)) {
    return;
  }

  if (e.key === "Enter") {
    execute(input);
    userInput.innerHTML = "";
    return;
  }

  userInput.innerHTML = input + e.key;
};

const backspace = function backSpaceKeyEvent(e) {
  if (e.keyCode !== 8 && e.keyCode !== 46) {
    return;
  }
  userInput.innerHTML = userInput.innerHTML.slice(
    0,
    userInput.innerHTML.length - 1
  );
};

document.addEventListener("keydown", backspace);
document.addEventListener("keypress", key);
document.addEventListener("DOMContentLoaded", app);
