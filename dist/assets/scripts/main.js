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

// ==============================================
// main.js - Scripts entry points
// ==============================================

function autorun(){

  console.log('Website is ready!');

  /* if (window.innerWidth > 767) {
    console.log("JS - Window > 767px");
  } else {
    console.log("JS - Window < 767px");
  } */

  menuToggle();

};

if (document.addEventListener) document.addEventListener("DOMContentLoaded", autorun, false);
else if (document.attachEvent) document.attachEvent("onreadystatechange", autorun);
else window.onload = autorun;
