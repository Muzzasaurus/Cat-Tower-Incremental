function addNavListeners() {
    const navButtons = document.querySelectorAll('#navTab button');
    navButtons.forEach(button => {
        button.addEventListener('click', toggleTab);
    })
}

function toggleTab(event) {
    let attribute = event.target.getAttribute('tabValue');
    if (attribute !== null) {
        const elem = document.getElementById(attribute);
        if (elem.style.display != 'none') {
            elem.style.display = 'none';
        } else {
            elem.style.display = 'flex';
        }
        updateView();
    }
}

function addJobListeners() {
    const jobButtons = document.querySelectorAll('.jobTimer');
    jobButtons.forEach(button => {
        button.addEventListener('click', beginJob);
    })
}

function updateView() {
    let i = 0;
    const tabs = document.querySelectorAll('.mainTab');
    tabs.forEach(tab => {
        if (tab.style.display != 'none') {
            i += 1;
        }
    })
    const body = document.getElementsByTagName('body')[0];
    switch (i) {
        case 0:
            body.style.gridTemplateColumns = '1fr 10rem';
            break;
        case 1:
            body.style.gridTemplateColumns = '1fr 10rem';
            break;
        case 2:
            //body.style.gridTemplateColumns = '1fr 1fr 10rem';
            body.style.gridTemplateColumns = 'calc(100% / 2 - 10rem / 2) calc(100% / 2 - 10rem / 2) 10rem';
            break;
        case 3:
            //body.style.gridTemplateColumns = '1fr 1fr 1fr 10rem';
            body.style.gridTemplateColumns = 'calc(100% / 3 - 10rem / 3) calc(100% / 3 - 10rem / 3) calc(100% / 3 - 10rem / 3) 10rem';
            break;
    }
}

function updateJobLevel() {
    document.getElementById('jobProgress').style.background = `linear-gradient(90deg, var(--job-progress-bar) ${game.jobXP.dividedBy(game.jobXPTarget).multiply(100)}%, rgba(0, 0, 0, 0) 0%)`;
    document.getElementById('jobLevelDisplay').innerHTML = `Job Level ${game.jobLevel}`;
    document.getElementById('jobXPDisplay').innerHTML = `${formatNum(game.jobXP)}/${formatNum(game.jobXPTarget)}`;
    document.getElementById('jobEffectDisplay').innerHTML = `Job level effect: x${formatNum(game.jobLevelEffect)} to money gain`;
    document.getElementById('jobXPGainDisplay').innerHTML = `Each job earns ${formatNum(game.jobXPGain)} job XP per completion`;
}

function updateJobBars() {
    const bars = document.querySelectorAll('.singleJobProgress');
    for (let i = 0; i < bars.length; i++) {
        bars[i].style.background = `linear-gradient(90deg, var(--job-progress-bar) ${100-jobs[i].timeRemaining/jobs[i].currentTime*100}%, rgba(0, 0, 0, 0) 0%)`;
    }
}

function updateGoalProgress() {
    document.getElementById('goalProgressBar').style.background = `linear-gradient(90deg, var(--goal-progress-bar) ${game.money.dividedBy(100).multiply(100)}%, rgba(0, 0, 0, 0) 0%)`;
}

function formatTimeS(time) {
    return time.toFixed(2);
}

function formatNum(num, decimals = 2) {
    //return num.multiply(100).round().dividedBy(100);
    //return num.toFixed(2);
    let str = num.toString();
    let fullstop = str.indexOf('.');
    let lettere = str.indexOf('e');
    let dec = '';
    let exp = '';
    if (num.lessThan(new Decimal('1e16'))) {
        if (fullstop != -1) {
            //Decimal is present
            dec = str.slice(fullstop);
            str = str.slice(0, fullstop);
            //Round decimals
            dec = Math.round(parseFloat(dec)*Math.pow(10, decimals)).toString();
            //Add back any zeros that are cut off from increasing the number's OOM
            if (dec.length < decimals) {
                dec = dec.padStart(decimals, '0');
            }
        }
        //Add commas
        let commas = Math.floor((str.length-1)/3);
        for (let i = 0; i < commas; i++) {
            str = str.slice(0, -4*i-3) + ',' + str.slice(-4*i-3);
        }
    } else {
        exp = str.slice(lettere);
        str = str.slice(0, lettere);
        if (fullstop != -1) {
            dec = str.slice(fullstop);
            str = str.slice(0, fullstop);
            //Round decimals
            dec = Math.round(parseFloat(dec)*Math.pow(10, decimals)).toString();
            //Add back any zeros that are cut off from increasing the number's OOM
            if (dec.length < decimals) {
                dec = dec.padStart(decimals, '0');
            }
        }
    }
    //Add formatted decimals back to number
    if ((dec != '') && (dec != '00')) {
        str += '.' + dec;
    }
    //Add e back to number
    if (exp != '') {
        str += exp;
    }
    return str;
}

function updateJobNumbers() {
    //Money display
    document.getElementById('moneyCount').innerHTML = `$${formatNum(game.money)}`;

    //Check if jobs are locked or unlocked
    for (let i = 0; i < jobs.length; i++) {
        if (game.jobLevel.greaterThanOrEqualTo(jobs[i].unlockLevel)) {
            jobs[i].unlocked = true;
        }
    }
    
    //Job timer number update
    const jobsTimers = document.getElementsByClassName('jobTimer');
    for (let i = 0; i < jobsTimers.length; i++) {
        if (jobs[i].unlocked) {
            jobsTimers[i].innerHTML = `${formatTimeS(jobs[i].timeRemaining)}s`;
        } else {
            jobsTimers[i].innerHTML = '∞'
        }
    }

    //Job description update
    const jobsIncomes = document.getElementsByClassName('jobIncomeDisplay');
    for (let i = 0; i < jobsIncomes.length; i++) {
        if (jobs[i].unlocked) {
            jobs[i].updateEffect();
            let displayString = jobs[i].displayEffectString.replace('@', formatNum(jobs[i].displayEffect));

            jobsIncomes[i].innerHTML = displayString;
        } else {
            jobsIncomes[i].innerHTML = `Unlock at level ${jobs[i].unlockLevel}`;
        }
    }

    //Job title update
    const jobsTitles = document.getElementsByClassName('jobTitle');
    for (let i = 0; i < jobsTitles.length; i++) {
        if (jobs[i].unlocked) {
            jobsTitles[i].innerHTML = jobs[i].title;
        } else {
            jobsTitles[i].innerHTML = 'LOCKED';
        }
    }
}

function updateUpgrades() {
    let upgrades = document.getElementsByClassName('jobUpgradeContainer');
    for (let i = 0; i < jobUpgrades.length; i++) {
        let displayString = jobUpgrades[i].description.replace('@', formatNum(jobUpgrades[i].effectValue));
        let levelString = '';
        if (jobUpgrades[i].upgradeLimit.equals(0)) {
            levelString = `${jobUpgrades[i].upgradeLevel}`;
        } else {
            levelString = `${jobUpgrades[i].upgradeLevel}/${jobUpgrades[i].upgradeLimit}`;
        }

        upgrades[i].getElementsByTagName('h3')[0].innerHTML = `${jobUpgrades[i].name}<span style="font-weight: 500; font-size: 1rem;"> - ${levelString}</span>`;
        upgrades[i].getElementsByTagName('p')[0].innerHTML = `${displayString}`;
        if (jobUpgrades[i].upgradeLevel.equals(jobUpgrades[i].upgradeLimit) && jobUpgrades[i].upgradeLimit.notEquals(0)) {
            upgrades[i].getElementsByClassName('upgradePriceDisplay')[0].innerHTML = `MAXED`;
            upgrades[i].getElementsByClassName('upgradePriceDisplay')[0].style.color = 'var(--maxed-upgrade)';
        } else {
            upgrades[i].getElementsByClassName('upgradePriceDisplay')[0].innerHTML = `${formatNum(jobUpgrades[i].currentPrice)}`;
            if (game.money.greaterThanOrEqualTo(jobUpgrades[i].currentPrice)) {
                upgrades[i].getElementsByClassName('upgradePriceDisplay')[0].style.color = 'var(--can-buy)';
            } else {
                upgrades[i].getElementsByClassName('upgradePriceDisplay')[0].style.color = 'var(--cannot-buy';
            }
        }
    }
}