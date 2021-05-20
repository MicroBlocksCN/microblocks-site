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
