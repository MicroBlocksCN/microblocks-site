//
// Scripts for header functions
//

var menuToggle = function() {

  let toggleButton = document.querySelector('.menu-toggle');
  let menu = document.querySelector('.menu');
  var shown = false;

  toggleButton.addEventListener('click', function(e) {
    
    e.preventDefault();

    if (shown == true) {
      menu.setAttribute('aria-expanded', 'false');
      shown = false;
    } else {
      menu.setAttribute('aria-expanded', 'true');
      shown = true;
    }

    toggleButton.classList.toggle('menu-toggle--is-visible');
    menu.classList.toggle('menu--is-visible');
    
  });

}
