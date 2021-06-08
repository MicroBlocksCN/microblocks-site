/*
 * Scripts for modal windows
 */

function modalInit() {
    
    let modal = document.querySelector('.modal');

    if (modal) {

        // Add localStorage
        // - Needs date
        // - Needs name of message
        
        let modalClose = document.querySelector('.modal__close');

        modalClose.addEventListener('click', function(){
            modal.style.display = 'none';
        });        
    };
};
