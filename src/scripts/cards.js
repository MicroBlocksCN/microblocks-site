function cardHtml (descriptor) {
    return `<a class="activity-card" href="#" download>
    <div class="activity-card__picture">
        <img src="assets/img/pictures/${descriptor.pictureFile}"
            alt="${descriptor.altText}">
    </div>
    <div class="activity-card__info">
        <div class="activity-card__text-wrapper">
            <h3 class="activity-card__title">
                ${descriptor.title}
            </h3>
            <div class="activity-card__requirement">
                ${descriptor.reqs}
            </div>
        </div>
        <div class="activity-card__tags-wrapper">
            ${descriptor.boards.map(
                board =>
                '<div class="activity-card__tag ' +
                'activity-card__tag--board" href="#">' +
                board +
                '</div>'
            )}
            <div class="activity-card__tag activity-card__tag--level" href="#">
                ${["beginner","intermediate","advanced"][descriptor.level]}
            </div>
        </div>
    </div>
</a>`;
};

function matchesFilter (descriptor, filter) {
    return (filter.board === undefined ||
        (descriptor.boards !== undefined) &&
        (descriptor.boards.includes(filter.board))) ||
        Object.keys(filter).find(key =>
            filter[key] !== descriptor[key]
        ) === undefined;
};

function renderCards (descriptors, filter, element) {
    var html = '';
    cardDescriptors.filter(descriptor =>
        { return matchesFilter(descriptor, filter); }
    ).forEach(descriptor => {
        html += cardHtml(descriptor);
    });
    element.innerHTML = html;
};

function readCards (action) {
    var req = new XMLHttpRequest();
    req.open('GET', 'cards.json', false);
    req.onreadystatechange = function () {
        if (req.readyState === 4) {
            if (req.status === 200 || req.status == 0) {
                cardDescriptors = JSON.parse(req.responseText);
                action.call(this, cardDescriptors);
            }
        }
    };
    req.send(null);
}

