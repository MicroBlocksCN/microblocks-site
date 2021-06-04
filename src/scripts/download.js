/*
 * Scripts for downloads and releases page
 */
function formatDate (dateString) {
    var splitDate = dateString.split('/');
    return splitDate[0] +
        ' ' +
        [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ][parseInt(splitDate[1]) - 1] +
        ' ' +
        splitDate[2]
};

function currentSystem() {
    // Let's detect the host system
    var system;
    if (window.navigator.userAgent.indexOf('Windows')!= -1) {
        system ='Windows';
    } else if (window.navigator.userAgent.indexOf('Mac') != -1) {
        system ='Mac OS';
    } else if (window.navigator.userAgent.indexOf('Linux') != -1) {
        if (window.navigator.userAgent.indexOf('arm') != -1) {
            system = 'Raspberry Pi (Raspbian)';
        } else if (window.navigator.userAgent.indexOf('64') != -1) {
            system = 'Linux (64 bit)';
        } else {
            system = 'Linux (32 bit)';
        }
    } else if (window.navigator.userAgent.indexOf('CrOS') != -1) {
        system ='Chrome OS';
    }
    return system;
};

function fetchVersionAndDate (action) {
    var req = new XMLHttpRequest();
    // Let's fetch the latest version and release date
    req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            action.call(
                this,
                this.responseText.split('\n')[0], // version
                this.responseText.split('\n')[1]  // date
            );
        }
    };
    req.open('GET', '/downloads/latest/VERSION.txt');
    req.send();
};

function populateVersionAndDate () {
    fetchVersionAndDate(
        (version, date) => {
            document.querySelector('.version').innerText = version;
            document.querySelector('.date').innerText = formatDate(date);
        }
    );
};

function populateDownloadPage () {
    var system = currentSystem(),
        baseURL = 'https://microblocks.fun/downloads/latest/packages/',
        filenames = {
            'Windows': 'microBlocks%20setup.exe',
            'Mac OS': 'MicroBlocks.app.zip',
            'Raspberry Pi (Raspbian)': 'ublocks-armhf.deb',
            'Linux (64 bit)': 'ublocks-amd64.deb',
            'Linux (32 bit)': 'ublocks-i386.deb'
        };

    if (!system) {
        document.location.href = 'release';
    }

    if (system !== 'Chrome OS') {
        document.querySelector('.page-download__hero__action a.btn').href = baseURL + filenames[system];
    } else {
        document.querySelector('.page-download__hero__action a.btn').href = 'https://chrome.google.com/webstore/detail/microblocks/cbmcbhgijipgdmlnieolilhghfmnngbb?authuser=0'
    }

    document.querySelector('.page-download__hero__action .section-title').innerText = system;

    populateVersionAndDate();
};
