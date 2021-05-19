//
// Scripts for header functions
//

var menuToggle = function() {

  var toggleButton = document.querySelector('.menu-toggle');
  var menu = document.querySelector('.menu');

  toggleButton.addEventListener('click', function(e) {
    e.preventDefault();
    toggleButton.classList.toggle('active');
    menu.classList.toggle('menu--open');
  });

}
