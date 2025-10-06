function addNavListeners() {
    const navButtons = document.querySelectorAll('#navTab button');
    navButtons.forEach(button => {
        button.addEventListener('click', toggleTab);
    })
}

function toggleTab(event) {
    const elem = document.getElementById(`${event.target.getAttribute('tabValue')}`);
    if (elem.style.display != 'none') {
        elem.style.display = 'none';
    } else {
        elem.style.display = 'flex';
    }
    updateView();
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
            body.style.gridTemplateColumns = '1fr 1fr 10rem';
            break;
        case 3:
            body.style.gridTemplateColumns = '1fr 1fr 1fr 10rem';
            break;
    }
}

function updateJobLevel() {
    document.getElementById('jobProgress').style.background = `linear-gradient(90deg, var(--job-progress-bar) ${game.jobXP.dividedBy(game.jobXPTarget).multiply(100)}%, rgba(0, 0, 0, 0) 0%)`;
    document.getElementById('jobLevelDisplay').innerHTML = `Job Level ${game.jobLevel}`;
    document.getElementById('jobXPDisplay').innerHTML = `${formatNum(game.jobXP)}/${formatNum(game.jobXPTarget)}`;
    document.getElementById('jobEffectDisplay').innerHTML = `Job Effect: x${formatNum(game.jobLevelEffect)}`;
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
    return Math.round(time*100)/100;
}

function formatNum(num) {
    //return num.multiply(100).round().dividedBy(100);
    return num.toFixed(2);
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
        upgrades[i].getElementsByClassName('upgradePriceDisplay')[0].innerHTML = `${formatNum(jobUpgrades[i].currentPrice)}`;
        if (game.money.greaterThanOrEqualTo(jobUpgrades[i].currentPrice)) {
            upgrades[i].getElementsByClassName('upgradePriceDisplay')[0].style.color = 'var(--can-buy)';
        } else {
            upgrades[i].getElementsByClassName('upgradePriceDisplay')[0].style.color = 'var(--cannot-buy';
        }
    }
}