/**
 * Scripts for Accordions
 */

let accordionInit = function() {

  let accordions = document.querySelectorAll('.accordion');


  let openAccordion = (accordion) => {
    let content = accordion.querySelector('.accordion__content');
    accordion.classList.add('accordion--active');
    content.style.maxHeight = content.scrollHeight + 'px';
  };


  let closeAccordion = (accordion) => {
    let content = accordion.querySelector('.accordion__content');
    accordion.classList.remove('accordion--active');
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
  tabs();
  accordionInit();

};

if (document.addEventListener) document.addEventListener("DOMContentLoaded", autorun, false);
else if (document.attachEvent) document.attachEvent("onreadystatechange", autorun);
else window.onload = autorun;

/**
 * Scripts for Tabs Blocks
 * 
 * Assumes there is a 'tabs__contents-block' for each 'tabs__button',
 * creates both an array for the content blocks and the buttons
 * and relates them together based on the index position
 */

let tabs = function() {

  let tabsBlocks = document.querySelectorAll('.tabs');

  tabsBlocks.forEach( (_theBlock) => {

    let tabsButtons = _theBlock.querySelectorAll('.tabs__button');
    let tabsContents = _theBlock.querySelectorAll('.tabs__tab-content');


    let showTab = (tab) => {

      // Show the Block
      tabsContents.forEach( (_theContent, i) => {
        if (i == tab) {
          _theContent.classList.add('tabs__tab-content--visible');
        } else {
          _theContent.classList.remove('tabs__tab-content--visible');
        }
      });

      // Activate the Tab
      tabsButtons.forEach( (_theButton, i) => {
        if (i == tab) {
          _theButton.classList.add('tabs__button--active');
        } else {
          _theButton.classList.remove('tabs__button--active');
        }
      });
    };


    // Assign event listener to each button
    tabsButtons.forEach( (_theButton, i) => {
      
      _theButton.addEventListener('click', () => {
        let tabIndex = i;
        showTab(tabIndex);
      });

    });


    // Init State
    showTab(0);

  });
}
