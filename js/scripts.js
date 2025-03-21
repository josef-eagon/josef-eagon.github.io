// Wait for the DOM to fully load before running the script
document.addEventListener('DOMContentLoaded', () => {
  // Get all elements with the class 'navbar-burger'
  const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {
    // Add a click event on each of them
    $navbarBurgers.forEach(el => {
      el.addEventListener('click', () => {
        // Get the target from the 'data-target' attribute
        const target = el.dataset.target;
        const $target = document.getElementById(target);

        // Toggle the 'is-active' class on both the 'navbar-burger' and the 'navbar-menu'
        el.classList.toggle('is-active');
        $target.classList.toggle('is-active');
      });
    });
  }
});

// New dark mode code
const toggleButton = document.getElementById('darkModeToggle');
const body = document.body;

// Check if dark mode was previously enabled
if (localStorage.getItem('darkMode') === 'enabled') {
  body.classList.add('dark-mode');
}

// Toggle dark mode on click
toggleButton.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  // Save preference to localStorage
  if (body.classList.contains('dark-mode')) {
    localStorage.setItem('darkMode', 'enabled');
  } else {
    localStorage.setItem('darkMode', 'disabled');
  }
});

// Get the back-to-top button
const backToTopButton = document.getElementById('backToTop');

// Show or hide the back-to-top button based on scroll position
window.addEventListener('scroll', () => {
  if (window.scrollY > 200) {
    backToTopButton.style.display = 'block';
  } else {
    backToTopButton.style.display = 'none';
  }
});

// Scroll smoothly to the top when the back-to-top button is clicked
backToTopButton.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});