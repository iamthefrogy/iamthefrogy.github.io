const BLACKLISTED_KEY_CODES = [ 38 ];
const COMMANDS = {
  help:
    'Supported commands: <span class="code">about</span>, <span class="code">experience</span>, <span class="code">education</span>, <span class="code">skills</span>, <span class="code">acknowledges</span>, <span class="code">contact</span>',
  about:
    "Hello 👋<br>I'm Alan Abhilash. I’m a 18 yr old pentester and bug bounty hunter currently living in India.",
  skills:
    '<span class="code">Skill:</span> Ethical Hacking, Pen-Testing, Bug Hunting,..<br>',
  education:
    "MES HSS Vandanmedu, Idukki,Kerala, India<br> Plus Two , Computer Science",
  resume: "<a href='./resume.pdf' class='success link'>resume.pdf</a>",
  experience: "No Experience😥",
  acknowledges: 
    "<a href='https://bughunter.withgoogle.com/profile/12edf378-705d-4ef8-ae44-2fc5ab8bbb69' class='success link'>Google Honorable Mention</a> , <a href='https://www.nokia.com/responsible-disclosure/' class='success link'>Nokia HOF On December 2020</a> , <a href='https://access.redhat.com/articles/66234' class='success link'>RedHat HOF 2021</a>", 
  contact:
    "You can contact me on any of following links:<br><a href='https://t.me/alan_abhilash' class='success link'>Telegram</a>, <a href='https://www.instagram.com/mr.blackmarketer/' class='success link'>Instagram</a>, <a href='https://www.twitter.com/alan_abhilash/' class='success link'>Twitter</a>"
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
