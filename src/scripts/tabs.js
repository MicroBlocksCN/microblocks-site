/**
 * Scripts for Tabs Blocks
 * 
 * Assumes there is a 'tabs__contents-block' for each 'tabs__button',
 * creates both an array for the content blocks and the buttons
 * and relates them together based on the index position
 */

let tabsInit = function() {

  let tabsBlocks = document.querySelectorAll('.tabs');

  tabsBlocks.forEach( (_theBlock) => {

    let tabsButtons = _theBlock.querySelectorAll('.tabs__button');
    let tabsContents = _theBlock.querySelectorAll('.tabs__tab-content');


    let showTab = (tab) => {

      // Show the Block
      tabsContents.forEach( (_theContent, i) => {
        if (i == tab) {
          _theContent.classList.add('tabs__tab-content--visible');
          _theContent.removeAttribute('hidden');
        } else {
          _theContent.classList.remove('tabs__tab-content--visible');
          _theContent.setAttribute('hidden', '');
        }
      });

      // Activate the Tab
      tabsButtons.forEach( (_theButton, i) => {
        if (i == tab) {
          _theButton.classList.add('tabs__button--active');
          _theButton.setAttribute('aria-selected', 'true');
        } else {
          _theButton.classList.remove('tabs__button--active');
          _theButton.setAttribute('aria-selected', 'false');
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
