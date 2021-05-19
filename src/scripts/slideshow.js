function slideshowInit(){

    var slides = document.querySelectorAll('.slideshow__img');
    var paginationWrapper;
    var paginationDots;
    var currentSlide;
    var slideInterval;
    // var controlPrev = document.querySelector('.slideshow__controls__prev');
    // var controlNext = document.querySelector('.slideshow__controls__next');


    // Add Dots

    function createPagination() {

        // Declare a let variable because it is block-scoped inside the iteration
        // Instead, a var variable has a higher level scope working in the top level function

        // Create Dots

        for ( let i = 0; i < slides.length; i++ ) {
            let dot = document.createElement('div');
            dot.classList.add('slideshow__paginator__dot');
            paginationWrapper.appendChild(dot);
        }

        paginationDots = document.querySelectorAll('.slideshow__paginator__dot');

        // Add functionality

        for ( let i = 0; i < slides.length; i++ ) {

            paginationDots[i].addEventListener('click', function() {
                restartSlideshow();
                goToSlide(i);
            });
        }
    }


    // Basic Functionality

    /* function prevSlide(){
        goToSlide(currentSlide-1);
    } */

    function nextSlide(){
        goToSlide(currentSlide+1);
    }

    function goToSlide(n){
        slides[currentSlide].className = 'slideshow__img';
        paginationDots[currentSlide].className = 'slideshow__paginator__dot';

        currentSlide = (n+slides.length)%slides.length;
        slides[currentSlide].className = 'slideshow__img slideshow__img--active';
        paginationDots[currentSlide].className = 'slideshow__paginator__dot slideshow__paginator__dot--active';
    }


    // Controls

    function restartSlideshow(){
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide,4000);
    }

    /* controlPrev.onclick = function(){
        restartSlideshow();
        prevSlide();
    }

    controlNext.onclick = function(){
        restartSlideshow();
        nextSlide();
    } */


    // On init

    if (slides.length > 0) {

        paginationWrapper = document.querySelector('.slideshow__paginator');
        currentSlide = 0;

        createPagination();

        slides[0].className = 'slideshow__img slideshow__img--active';
        paginationDots[0].className = 'slideshow__paginator__dot slideshow__paginator__dot--active';

        slideInterval = setInterval(nextSlide, 4000);
    }
}
