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
  const terminalInput = document.getElementById('terminal-input');
  const terminalButtons = document.getElementById('terminal-buttons');
  let isTyping = false;

  // Define commands and their responses
  const commands = {
    'W': { command: 'whoami', response: 'Jane Doe, a creative coder and tech enthusiast.' },
    'P': { command: 'projects', response: 'Check out my work: Project X, Project Y, Project Z.' },
    'C': { command: 'contact', response: 'Email me at jane@example.com or find me on GitHub.' }
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
  function runCommand(key) {
    if (isTyping) return;
    const commandObj = commands[key];
    if (!commandObj) return;
    isTyping = true;
    terminalOutput.textContent = terminalOutput.textContent.replace('_', '');
    terminalOutput.textContent += '$ ';
    typeText(commandObj.command, terminalOutput, 10, () => {
      terminalOutput.textContent += '\n';
      typeText(commandObj.response, terminalOutput, 50, () => {
        terminalOutput.textContent += '\n$ _';
        isTyping = false;
      });
    });
  }

  // Make terminal focusable and handle key presses
  if (terminal) {
    // Focus the hidden input on click/tap
    terminal.addEventListener('click', () => {
      terminalInput.focus();
    });

    // Handle keypresses from the input
    terminalInput.addEventListener('keydown', (e) => {
      const key = e.key.toUpperCase();
      if (commands[key]) {
        e.preventDefault(); // Prevent typing in the input
        runCommand(key);
      }
    });

    // Handle mobile button clicks
    if (terminalButtons) {
      terminalButtons.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (button) {
          const key = button.dataset.key;
          if (commands[key]) {
            runCommand(key);
          }
        }
      });
    }
  }
});