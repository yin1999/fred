const dropdownButtons = document.querySelectorAll('.dropdown');

function toggleDropdown(button) {
  const isExpanded = button.getAttribute('aria-expanded') === 'true';
  const dropdown = document.getElementById(button.getAttribute('aria-controls'));

  button.setAttribute('aria-expanded', !isExpanded);
  dropdown.toggleAttribute('hidden');
}

dropdownButtons.forEach(button => {
  button.addEventListener('click', () => {
    toggleDropdown(button);
  });
});

document.addEventListener('click', (event) => {
  dropdownButtons.forEach(button => {
    const dropdown = document.getElementById(button.getAttribute('aria-controls'));

    if (!button.contains(event.target) && !dropdown.contains(event.target)) {
      if (button.getAttribute('aria-expanded') === 'true') {
        toggleDropdown(button);
      }
    }
  });
});
