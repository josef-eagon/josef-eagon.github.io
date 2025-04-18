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
  const terminalInput = document.getElementById('terminal-mobile-input');
  let isTyping = false;
  let currentInput = ''; // Store the user's typed input

  // Add initial cursor on page load
  if (terminalOutput) {
    terminalOutput.textContent = '$ ';
    terminalOutput.innerHTML += '<span class="terminal-cursor"></span>';
  }

  // Array of quotes
  const quotes = [
    'Maybe you can swim better with a belly full of fish.',
    'Never trust a pig farmer with a handwritten sign.',
    'I think I am funny, but I am not as funny as I think I am.',
    'You mean to tell me anyone can just make a website?',
    'My grandfather used to tell me my hair is curly because my skull is so thick it had to drill its way out.',
    'At my core, I am just a silly little guy.',
    'Poetry is a way to make words sing for you.',
    'There is magic in the air today. Can you feel it?',
    'Shakespeare has been called annoyingly quotable.',
    'Some people don’t know which questions to ask, or they ask them in the wrong order.',
    'Earth is a 10/10 planet.',
    'Anyone can create art, but not everyone will understand the art they create.',
    'The lesson of Icarus is to make better wings.',
    'You are really only confined by the box you build around yourself.',
    'I just say stuff sometimes.',
    'Fables are not fairy tales.',
    'The gods gave us fire and we made rocks talk.',
    'I know a thing or two about being OK.',
    'If I can make you think, I have succeeded.',
    'Nothing cradles you quite like moonlight.',
    'Every once in a while, the improbable thing does actually happen.',
    'Coincidence and probability have an uneven friendship.',
    'There is a lot of scheming in the animal kingdom.'

  ];

  // Function to get a random quote
  function getRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  }

  // Define commands and their responses
  const commands = {
    'whoami': { command: 'whoami', response: 'Josef. I’m just a guy who does stuff.' },
    'projects': { command: 'projects', response: 'Check out my work: I do lots of stuff.' },
    'contact': { command: 'contact', response: 'Email me at josef.eagon@proton.me or find me on X @TypicalHwiteGuy.' },
    'help': { command: 'help', response: 'Available commands: whoami, projects, contact, help, skills, about, quote, mysite, fables, clear' },
    'skills': { command: 'skills', response: 'I’m skilled in coding, digital art, and storytelling.' },
    'about': { command: 'about', response: 'I’m a creative who loves blending art, code, and stories.' },
    'quote': { command: 'quote', response: getRandomQuote },
    'mysite': { command: 'mysite', response: 'I built this website to prove to myself that I could. I bet you could too.'},
    'clear': { command: 'clear', response: null },
    'fables': { command: 'fables', response: 'Fables are not fairy tales. I write them down and make art for each one.' },
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
        terminalOutput.textContent += '\n$ ';
        terminalOutput.innerHTML += '<span class="terminal-cursor"></span>';
        isTyping = false;
      });
      return;
    }

    // Special case for 'clear' command
    if (command.toLowerCase() === 'clear') {
      terminalOutput.textContent = '$ ';
      terminalOutput.innerHTML += '<span class="terminal-cursor"></span>';
      currentInput = ''; // Reset current input
      if (terminalInput) terminalInput.value = ''; // Clear mobile input field
      terminalOutput.scrollTop = 0; // Scroll to top
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
        terminalOutput.textContent += '\n$ ';
        terminalOutput.innerHTML += '<span class="terminal-cursor"></span>';
        isTyping = false;
      });
    });
  }

  // Terminal interaction
  if (terminal) {
    // Function to detect mobile devices
    function isMobileDevice() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    // Handle both click and touchstart for activation
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

    // Remove focused class when terminal loses focus
    terminal.addEventListener('blur', () => {
      if (!terminalInput || document.activeElement !== terminalInput) {
        terminal.classList.remove('focused');
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
          terminalOutput.textContent = terminalOutput.textContent.replace(/\$ .*$/, '$ ');
        }
      } else if (e.key === 'Backspace') {
        // Handle backspace to delete characters
        currentInput = currentInput.slice(0, -1);
        terminalOutput.textContent = terminalOutput.textContent.replace(/\$ .*$/, '$ ' + currentInput);
        terminalOutput.innerHTML += '<span class="terminal-cursor"></span>';
      } else if (e.key.length === 1) {
        // Append printable characters to the input
        currentInput += e.key;
        terminalOutput.textContent = terminalOutput.textContent.replace(/\$ .*$/, '$ ' + currentInput);
        terminalOutput.innerHTML += '<span class="terminal-cursor"></span>';
      }
    });

    // Handle mobile input field
    if (terminalInput) {
      terminalInput.addEventListener('input', (e) => {
        currentInput = e.target.value; // Update currentInput as user types
        terminalOutput.textContent = terminalOutput.textContent.replace(/\$ .*$/, '$ ' + currentInput);
      });

      terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault(); // Prevent default Enter behavior (e.g., form submission)
          if (currentInput.trim() !== '') {
            runCommand(currentInput.trim());
            currentInput = ''; // Reset input after command
            terminalInput.value = ''; // Clear the input field
            terminalOutput.textContent = terminalOutput.textContent.replace(/\$ .*$/, '$ ');
          }
        }
      });

      // Ensure terminal loses focus class when mobile input is focused
      terminalInput.addEventListener('focus', () => {
        terminal.classList.remove('focused');
      });
    }
  }
});