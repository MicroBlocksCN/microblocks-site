/*
 * Scripts for filtering and displaying learning cards
 */

var currentPage = 1,
    totalPages = 1,
    cardDescriptors,
    noHoverDevice = window.matchMedia('(hover: none)').matches;

function cardHtml (descriptor) {
    return `<div class="activity-card" href="${descriptor.url}">
    <div class="activity-card__picture">
        <img src="/assets/img/cards/${descriptor.pictureFile}"
            alt="${descriptor.altText}">
    </div>
    <div class="activity-card__info">
        <div class="activity-card__text-wrapper">
            <h3 class="activity-card__title">
                ${descriptor.title}
            </h3>
            ${descriptor.reqs ?
            `<div class="activity-card__requirement">${descriptor.reqs}</div>` :
            ''}
        </div>
        <div class="activity-card__tags-wrapper">
            ${descriptor.boards.map(
                board =>
                '<div class="activity-card__tag ' +
                'activity-card__tag--board">' +
                board +
                '</div>'
            ).join('')}
            <div class="activity-card__tag activity-card__tag--level">
                ${["beginner","intermediate","advanced"][descriptor.level]}
            </div>
        </div>
    </div>
    <div class="activity-card__downloads" ${ noHoverDevice ? `hidden="true"` : '' }>
        <h4 class="activity-card__downloads-title">Resources</h4>
        <div class="activity-card__downloads-links">
            <a class="btn btn--purple" href="${descriptor.url}" target="_blank">Download PDF</a>
            ${descriptor.videoUrl ?
                `<a class="btn btn--blue" href="${descriptor.videoUrl}" target="_blank">Watch Video</a>` :
                ''
            }
        </div>
    </div>
</div>`;
};

function matchesFilter (descriptor, filter) {
    return ((filter.board === "") ||
            (descriptor.boards.includes(filter.board))) &&
        ((filter.language === "") ||
            (descriptor.language === filter.language)) &&
        ((filter.level === "") ||
            (descriptor.level === parseInt(filter.level)));
};

function renderCards (filter, element) {
    var html = '',
        filteredCards = cardDescriptors.filter(
            descriptor => { return matchesFilter(descriptor, filter); });

    totalPages = Math.ceil(filteredCards.length / 12);
    updatePages(currentPage, totalPages);

    if (filteredCards.length === 0) {
        html = '<div class="page-learn__cards-list--no-result">' +
            '<span>{*_*}</span><span>No cards match this criteria</span>' +
            '</div>';
    } else {
        filteredCards.slice(
            (currentPage - 1) * 12,
            (currentPage - 1) * 12 + 12).forEach(
                descriptor => { html += cardHtml(descriptor); }
            );
    }
    element.innerHTML = html;
};

function readCards (action) {
    if (cardDescriptors) {
        action.call(this);
    } else {
        // Only request the JSON file the first time
        var req = new XMLHttpRequest();
        req.open(
            'GET',
            `cards.json?random=${Math.floor(Math.random()*99999)}`, // no cache
            false
        );
        req.onreadystatechange = function () {
            if (req.readyState === 4) {
                if (req.status === 200 || req.status == 0) {
                    cardDescriptors = JSON.parse(req.responseText);
                    populateFilterDropdowns();
                    action.call(this);
                }
            }
        };
        req.send(null);
    }
};

function updateCards (resettingPage) {
    if (resettingPage) { currentPage = 1; }
    readCards(() => {
        renderCards(
            Object.fromEntries(
                new FormData(
                    document.querySelector('form.page-learn__filters')
                )
            ),
            document.querySelector('.page-learn__cards-list')
        );
    });
    tappingOnCards();
};

function scrollToContent () {
    var contentPosition =
        document.querySelector('.page-learn__activity-cards').offsetTop;
    window.scroll({
        top: contentPosition - 56,
        left: 0,
        behavior: 'smooth'
      });
};

function nextPage () {
    if (currentPage < totalPages) {
        currentPage ++;
        updateCards();
    }
};

function previousPage () {
    if (currentPage > 1) {
        currentPage --;
        updateCards();
    }
};

function pageElementHtml (pageNum) {
    if (typeof pageNum === 'number') {
        return `<div class="pagination__item
            ${currentPage === pageNum ?  ' pagination__item--active' : ''}"
            onclick="currentPage = ${pageNum}; updateCards();
            scrollToContent();" role="button" tabindex="0"
            aria-label="Go to page ${pageNum}"
            ${currentPage === pageNum ? ' aria-current="true"' : ''}>
            ${pageNum}</div>`;
    } else {
        // pageNum is either "<" or ">"
        var disabled = (currentPage === 1 && pageNum === '<') ||
            (totalPages === 0 || currentPage === totalPages && pageNum === '>');
        // Yep, tomorrow I'll have a hard time understanding this code.
        // Nope, sorry. I'm not documenting this. I'll just rewrite it from
        // scratch if need be.
        return `<div class="pagination__item
            ${disabled ? ' pagination__item--disabled' : ''}"
            onclick="${['previous','next'][['<','>'].indexOf(pageNum)]}Page();
            scrollToContent();" role="button" tabindex="0"
            ${pageNum === '<' ? ' aria-label="Previous Page"' :
            ' aria-label="Next Page"' }
            ${disabled ? ' aria-disabled="true"' : ''}
            >&${['lt','gt'][['<','>'].indexOf(pageNum)]};</div>`
    }
};

function updatePages () {
    var html;
    if (totalPages < 2) {
        html = '';
    } else {
        html = pageElementHtml('<');
        for (var pageNum = 1; pageNum <= totalPages; pageNum ++) {
            html += pageElementHtml(pageNum);
        }
        html += pageElementHtml('>');
    }
    document.querySelector('.page-learn__pagination.pagination').innerHTML =
        html;
};

// Dropdown menu filling

function populateFilterDropdowns () {
    var langs = ['English'],
        boards = [];
    cardDescriptors.forEach(card => {
        if (!langs.includes(card.language)) {
            langs.push(card.language);
            document.querySelector('.page-learn__select#language').innerHTML +=
                `<option value="${card.language}">${card.language}</option>`;
        }
        card.boards.forEach(board => {
            if (!boards.includes(board)) {
                boards.push(board);
                document.querySelector('.page-learn__select#board').innerHTML +=
                `<option value="${board}">${board}</option>`;
            }
        });
    });
};

// Card interaction for small screens

function tappingOnCards () {    

    if (noHoverDevice) {

        var cards = document.querySelectorAll(".activity-card");
        
        cards.forEach(card => {
            card.addEventListener('click', () => {
                card.classList.add('activity-card--visible');
                card.querySelector('.activity-card__downloads').removeAttribute('hidden');

                document.addEventListener('click', (e) => {
                    var tappedInside = card.contains(e.target);
                    if (!tappedInside) {
                        card.classList.remove('activity-card--visible');
                        card.querySelector('.activity-card__downloads').setAttribute('hidden', 'true');
                    };

                    // remove this eventListener?
                });
            });
        });
    };
};
