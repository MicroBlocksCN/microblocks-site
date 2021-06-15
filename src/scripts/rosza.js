/*
 * Scripts for modal windows
 */

function roszaInit() {

    let logo = document.querySelector('.header__logo');
    let rosza = document.querySelector('.header__rosza');

    logo.addEventListener('mouseenter', function() {

        setTimeout(function() {
            rosza.style.visibility = 'visible';
            rosza.style.opacity = '1';
        }, 2000);
    });

    logo.addEventListener('mouseleave', function() {

        rosza.style.opacity = '0';
        setTimeout(function() {
            rosza.style.visibility = 'hidden';            
        }, 300); // CSS animation timing
    })
};
