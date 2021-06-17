/*
 * Scripts for modal windows
 */

function roszaInit() {

    let logo = document.querySelector('.header__logo'),
        rosza = document.querySelector('.header__rosza'),
        hovering = false,
        timeout;

    logo.addEventListener('mouseenter', function() {
        hovering = true;
        timeout = setTimeout(function() {
            if (hovering) {
                rosza.style.visibility = 'visible';
                rosza.style.opacity = '1';
            }
        }, 2000);
    });

    logo.addEventListener('mouseleave', function() {
        hovering = false;
        rosza.style.opacity = '0';
        clearTimeout(timeout);
        setTimeout(function() {
            rosza.style.visibility = 'hidden';            
        }, 300); // CSS animation timing
    })
};
