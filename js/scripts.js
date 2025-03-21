// Wait for the DOM to fully load before running the script
document.addEventListener('DOMContentLoaded', () => {
  // Navbar burger functionality
  const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
  if ($navbarBurgers.length > 0) {
    $navbarBurgers.forEach(el => {
      el.addEventListener('click', () => {
        const target = el.dataset.target;
        const $target = document.getElementById(target);
        el.classList.toggle('is-active');
        $target.classList.toggle('is-active');
      });
    });
  }

  // Dark mode toggle
  const toggleButton = document.getElementById('darkModeToggle');
  const body = document.body;
  if (localStorage.getItem('darkMode') === 'enabled') {
    body.classList.add('dark-mode');
    toggleButton.textContent = 'Light Mode';
  } else {
    toggleButton.textContent = 'Dark Mode';
  }
  toggleButton.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
      localStorage.setItem('darkMode', 'enabled');
      toggleButton.textContent = 'Light Mode';
    } else {
      localStorage.setItem('darkMode', 'disabled');
      toggleButton.textContent = 'Dark Mode';
    }
  });

  // Back-to-top button
  const backToTopButton = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
      backToTopButton.style.display = 'block';
    } else {
      backToTopButton.style.display = 'none';
    }
  });
  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Terminal functionality
  const terminal = document.getElementById('terminal');
  const terminalOutput = document.getElementById('terminal-output');
  const terminalButtons = document.getElementById('terminal-buttons');
  const terminalInput = document.getElementById('terminal-mobile-input');
  let isTyping = false;
  let currentInput = ''; // Store the user's typed input

  // Array of placeholder quotes
  const quotes = [
    'Placeholder quote 1: Something inspiring.',
    'Placeholder quote 2: A witty remark.',
    'Placeholder quote 3: A thoughtful saying.',
    'Placeholder quote 4: Another cool quote.'
  ];

  // Function to get a random quote
  function getRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  }

  // Define commands and their responses
  const commands = {
    'whoami': { command: 'whoami', response: 'Jane Doe, a creative coder and tech enthusiast.' },
    'projects': { command: 'projects', response: 'Check out my work: Project X, Project Y, Project Z.' },
    'contact': { command: 'contact', response: 'Email me at jane@example.com or find me on GitHub.' },
    'help': { command: 'help', response: 'Available commands: whoami, projects, contact, help, skills, about, quote, clear' },
    'skills': { command: 'skills', response: 'I’m skilled in coding, digital art, and storytelling.' },
    'about': { command: 'about', response: 'I’m a creative who loves blending art, code, and stories.' },
    'quote': { command: 'quote', response: getRandomQuote },
    'clear': { command: 'clear', response: null } // Special command with no response
  };

  // Function to type text character by character
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

  // Handle command execution
  function runCommand(command) {
    if (isTyping) return;
    const commandObj = commands[command.toLowerCase()];
    if (!commandObj) {
      isTyping = true;
      terminalOutput.textContent += '\n';
      typeText(`Command not found: ${command}`, terminalOutput, 50, () => {
        terminalOutput.textContent += '\n$ _';
        isTyping = false;
      });
      return;
    }

    // Special case for 'clear' command
    if (command.toLowerCase() === 'clear') {
      terminalOutput.textContent = '$ _';
      currentInput = ''; // Reset current input
      if (terminalInput) terminalInput.value = ''; // Clear mobile input field
      isTyping = false;
      return;
    }

    // Handle other commands
    isTyping = true;
    terminalOutput.textContent += '\n';
    typeText(commandObj.command, terminalOutput, 10, () => {
      terminalOutput.textContent += '\n';
      const response = typeof commandObj.response === 'function' ? commandObj.response() : commandObj.response;
      typeText(response, terminalOutput, 50, () => {
        terminalOutput.textContent += '\n$ _';
        isTyping = false;
      });
    });
  }

  // Terminal interaction
  if (terminal) {
    // Handle both click and touchstart for activation
    terminal.addEventListener('click', () => {
      if (terminalInput) {
        terminalInput.focus(); // Focus the input field on mobile
      } else {
        terminal.focus(); // Focus the terminal on desktop
      }
    });
    terminal.addEventListener('touchstart', (e) => {
      e.preventDefault(); // Prevent scrolling or other default behaviors
      if (terminalInput) {
        terminalInput.focus();
      } else {
        terminal.focus();
      }
    });

    // Handle desktop typing input (direct into terminal)
    terminal.addEventListener('keydown', (e) => {
      if (isTyping) return; // Ignore input while typing response
      if (terminalInput && document.activeElement === terminalInput) return; // Ignore if mobile input is focused
      e.preventDefault(); // Prevent default key behavior (e.g., scrolling)

      if (e.key === 'Enter') {
        // Process the command when Enter is pressed
        if (currentInput.trim() !== '') {
          runCommand(currentInput.trim());
          currentInput = ''; // Reset input after command
          terminalOutput.textContent = terminalOutput.textContent.replace(/\$ _.*$/, '$ _');
        }
      } else if (e.key === 'Backspace') {
        // Handle backspace to delete characters
        currentInput = currentInput.slice(0, -1);
        terminalOutput.textContent = terminalOutput.textContent.replace(/\$ _.*$/, '$ _' + currentInput);
      } else if (e.key.length === 1) {
        // Append printable characters to the input
        currentInput += e.key;
        terminalOutput.textContent = terminalOutput.textContent.replace(/\$ _.*$/, '$ _' + currentInput);
      }
    });

    // Handle mobile input field
    if (terminalInput) {
      terminalInput.addEventListener('input', (e) => {
        currentInput = e.target.value; // Update currentInput as user types
        terminalOutput.textContent = terminalOutput.textContent.replace(/\$ _.*$/, '$ _' + currentInput);
      });

      terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault(); // Prevent default Enter behavior (e.g., form submission)
          if (currentInput.trim() !== '') {
            runCommand(currentInput.trim());
            currentInput = ''; // Reset input after command
            terminalInput.value = ''; // Clear the input field
            terminalOutput.textContent = terminalOutput.textContent.replace(/\$ _.*$/, '$ _');
          }
        }
      });
    }

    // Handle mobile button clicks (for now, keeping these as-is)
    if (terminalButtons) {
      terminalButtons.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (button) {
          const key = button.dataset.key;
          if (key) {
            const command = { 'W': 'whoami', 'P': 'projects', 'C': 'contact' }[key];
            if (command) {
              runCommand(command);
            }
          }
        }
      });
      terminalButtons.addEventListener('touchstart', (e) => {
        const button = e.target.closest('button');
        if (button) {
          const key = button.dataset.key;
          if (key) {
            e.preventDefault();
            const command = { 'W': 'whoami', 'P': 'projects', 'C': 'contact' }[key];
            if (command) {
              runCommand(command);
            }
          }
        }
      });
    }
  }
});