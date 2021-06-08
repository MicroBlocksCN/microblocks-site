/**
 * Scripts for Accordions
 */

let accordionInit = function() {

  let accordions = document.querySelectorAll('.accordion');


  let openAccordion = (accordion) => {
    let content = accordion.querySelector('.accordion__content');
    accordion.classList.add('accordion--active');

    // not fine!
    accordion.setAttribute('aria-expanded', 'true');
    content.style.maxHeight = content.scrollHeight + 'px';
  };


  let closeAccordion = (accordion) => {
    let content = accordion.querySelector('.accordion__content');
    accordion.classList.remove('accordion--active');
    accordion.setAttribute('aria-expanded', 'false');
    content.style.maxHeight = null;
  }


  accordions.forEach( (_theAccordion) => {

    let accordionHeader = _theAccordion.querySelector('.accordion__header');
    let accordionContent = _theAccordion.querySelector('.accordion__content');

    accordionHeader.addEventListener('click', () => {
      
      if (accordionContent.style.maxHeight) {
        closeAccordion(_theAccordion);
      } else {
        accordions.forEach((accordion) => closeAccordion(accordion));
        openAccordion(_theAccordion);
      }

      // let content = _theAccordion.querySelector('.accordion__content');
      // let contentHeight = content.scrollHeight + 'px';
      // content.style.maxHeight = contentHeight;
    });

  });
}
