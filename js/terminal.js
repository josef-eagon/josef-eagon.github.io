// js/terminal.js
document.addEventListener('DOMContentLoaded', () => {
    const terminal = document.getElementById('terminal');
    if (!terminal) return; // Exit if no terminal element is found
  
    const terminalOutput = terminal.querySelector('#terminal-output');
    const terminalInput = terminal.querySelector('#terminal-mobile-input');
    let isTyping = false;
    let currentInput = '';
  
    // Initialize the terminal prompt
    if (terminalOutput) {
      terminalOutput.textContent = '$ ';
      terminalOutput.innerHTML += '<span class="terminal-cursor"></span>';
    }
  
    // Define the commands (originally from scripts.js)
    const commands = {
      'whoami': { command: 'whoami', response: 'Josef. I’m just a guy who does stuff.' },
      'projects': { command: 'projects', response: 'Check out my work: I do lots of stuff.' },
      'contact': { command: 'contact', response: 'Email me at josef.eagon@proton.me or find me on GitHub.' },
      'help': { command: 'help', response: 'Available commands: whoami, projects, contact, help, skills, about, quote, clear' },
      'skills': { command: 'skills', response: 'I’m skilled in coding, digital art, and storytelling.' },
      'about': { command: 'about', response: 'I’m a creative who loves blending art, code, and stories.' },
      'quote': { command: 'quote', response: getRandomQuote }, // Assuming getRandomQuote is defined elsewhere
      'clear': { command: 'clear', response: null }
    };
  
    // Utility function to detect mobile devices
    function isMobileDevice() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
  
    // Typing animation function
    function typeText(text, element, delay, callback) {
      let i = 0;
      function type() {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
          setTimeout(type, delay);
        } else {
          callback();
        }
      }
      type();
    }
  
    // Command execution function
    function runCommand(command) {
      if (isTyping) return;
      const commandObj = commands[command.toLowerCase()];
      if (!commandObj) {
        isTyping = true;
        terminalOutput.textContent += '\n';
        typeText(`Command not found: ${command}`, terminalOutput, 50, () => {
          terminalOutput.textContent += '\n$ ';
          terminalOutput.innerHTML += '<span class="terminal-cursor"></span>';
          isTyping = false;
        });
        return;
      }
  
      if (command.toLowerCase() === 'clear') {
        terminalOutput.textContent = '$ ';
        terminalOutput.innerHTML += '<span class="terminal-cursor"></span>';
        currentInput = '';
        if (terminalInput) terminalInput.value = '';
        terminalOutput.scrollTop = 0;
        isTyping = false;
        return;
      }
  
      isTyping = true;
      terminalOutput.textContent += '\n';
      typeText(commandObj.command, terminalOutput, 10, () => {
        terminalOutput.textContent += '\n';
        const response = typeof commandObj.response === 'function' ? commandObj.response() : commandObj.response;
        if (typeof response === 'string') {
          typeText(response, terminalOutput, 50, () => {
            terminalOutput.textContent += '\n$ ';
            terminalOutput.innerHTML += '<span class="terminal-cursor"></span>';
            isTyping = false;
          });
        } else {
          terminalOutput.textContent += '\n$ ';
          terminalOutput.innerHTML += '<span class="terminal-cursor"></span>';
          isTyping = false;
        }
      });
    }
  
    // Set up event listeners
    terminal.addEventListener('click', () => {
      if (terminalInput && isMobileDevice()) {
        terminalInput.focus();
      } else {
        terminal.focus();
        terminal.classList.add('focused');
      }
    });
  
    terminal.addEventListener('touchstart', (e) => {
      if (terminalInput && isMobileDevice()) {
        terminalInput.focus();
      } else {
        terminal.focus();
        terminal.classList.add('focused');
      }
    });
  
    terminal.addEventListener('blur', () => {
      if (!terminalInput || document.activeElement !== terminalInput) {
        terminal.classList.remove('focused');
      }
    });
  
    terminal.addEventListener('keydown', (e) => {
      if (isTyping) return;
      if (terminalInput && document.activeElement === terminalInput) return;
      e.preventDefault();
  
      if (e.key === 'Enter') {
        if (currentInput.trim() !== '') {
          runCommand(currentInput.trim());
          currentInput = '';
          terminalOutput.textContent = terminalOutput.textContent.replace(/\$ .*$/, '$ ');
        }
      } else if (e.key === 'Backspace') {
        currentInput = currentInput.slice(0, -1);
        terminalOutput.textContent = terminalOutput.textContent.replace(/\$ .*$/, '$ ' + currentInput);
        terminalOutput.innerHTML += '<span class="terminal-cursor"></span>';
      } else if (e.key.length === 1) {
        currentInput += e.key;
        terminalOutput.textContent = terminalOutput.textContent.replace(/\$ .*$/, '$ ' + currentInput);
        terminalOutput.innerHTML += '<span class="terminal-cursor"></span>';
      }
    });
  
    if (terminalInput) {
      terminalInput.addEventListener('input', (e) => {
        currentInput = e.target.value;
        terminalOutput.textContent = terminalOutput.textContent.replace(/\$ .*$/, '$ ' + currentInput);
      });
  
      terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (currentInput.trim() !== '') {
            runCommand(currentInput.trim());
            currentInput = '';
            terminalInput.value = '';
            terminalOutput.textContent = terminalOutput.textContent.replace(/\$ .*$/, '$ ');
          }
        }
      });
  
      terminalInput.addEventListener('focus', () => {
        terminal.classList.remove('focused');
      });
    }
  });