/*
 * Scripts for modal windows
 */

function modalInit (title) {
    
    let modal = document.querySelector('.modal');

    if (modal) {
        if (localStorage.getItem('banner-closed') === title) {
            modal.remove();
        }
        document.querySelector('.modal__close').addEventListener(
            'click',
            () => {
                localStorage.setItem('banner-closed', title);
                modal.remove();
            }
        );        
    };
};
