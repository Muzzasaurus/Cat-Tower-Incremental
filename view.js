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
    document.getElementById('jobProgress').style.background = `linear-gradient(90deg, var(--job-progress-bar) ${Decimal.min(100, game.jobXP.dividedBy(game.jobXPTarget).multiply(100))}%, rgba(0, 0, 0, 0) 0%)`;
    document.getElementById('jobLevelDisplay').innerHTML = `Job Level ${game.jobLevel}`;
    document.getElementById('jobXPDisplay').innerHTML = `${formatNum(game.jobXP)}/${formatNum(game.jobXPTarget)}`;
    document.getElementById('jobEffectDisplay').innerHTML = `Job level effect: x${formatNum(game.jobLevelEffect)} to money gain`;
    document.getElementById('jobXPGainDisplay').innerHTML = `Each job earns ${formatNum(game.jobXPGain)} job XP per completion`;
}

function updateJobBars() {
    const bars = document.querySelectorAll('.singleJobProgress');
    for (let i = 0; i < bars.length; i++) {
        bars[i].style.background = `linear-gradient(90deg, var(--job-progress-bar) ${Decimal.min(100, 100-jobs[i].timeRemaining/jobs[i].currentTime*100)}%, rgba(0, 0, 0, 0) 0%)`;
    }
}

function updateGoalProgress() {
    document.getElementById('goalProgressBar').style.background = `linear-gradient(90deg, var(--goal-progress-bar) ${Decimal.min(100, game.money.dividedBy(100).multiply(100))}%, rgba(0, 0, 0, 0) 0%)`;
}

function formatTimeS(time) {
    return time.toFixed(2);
}

const STANDARDLIMIT = new Decimal('1e3003');

function formatNum(num, decimals = 2) {
    //return num.multiply(100).round().dividedBy(100);
    //return num.toFixed(2);
    let str = num.toString();
    let fullstop = str.indexOf('.');
    let lettere = str.indexOf('e');
    let dec = '';
    let exp = '';
    let name = '';
    if (num.lessThan(new Decimal('9e15'))) {
        if (fullstop != -1) {
            //Decimal is present
            dec = str.slice(fullstop);
            str = str.slice(0, fullstop);
            //Round decimals
            dec = Math.round(parseFloat(dec)*Math.pow(10, decimals)).toString();
            //Add back any zeros that are cut off from increasing the number's OOM
            if (dec.length < decimals) {
                dec = dec.padStart(decimals, '0');
            //If decimal is .999, it will round up to 1, so increase int by 1 and remove decimal
            } else if (dec.length > decimals) {
                dec = '';
                str = (parseInt(str)+1).toString();
            }
        }
        if (num.lessThan(new Decimal('1e6'))) {
            //Add commas
            let commas = Math.floor((str.length-1)/3);
            for (let i = 0; i < commas; i++) {
                str = str.slice(0, -4*i-3) + ',' + str.slice(-4*i-3);
            }
        } else {
            if (settings.numberDisplay == STANDARD) {
                symbolNum = Math.floor((str.length-1)/3);
                name = getSymbol(symbolNum);
                numToDisplay = (str.length-1) % 3 + 1;
                if (numToDisplay == 1) {
                    dec = str.slice(numToDisplay, 3);
                } else {
                    dec = str.slice(numToDisplay, 4);
                }
                str = str.slice(0, (str.length-1) % 3 + 1);
            } else if (settings.numberDisplay == SCIENTIFIC) {
                exp = `e${str.length-1}`;
                dec = str.slice(1, 3);
                str = str.slice(0, 1);
            }
        }
    } else {
        exp = str.slice(lettere);
        str = str.slice(0, lettere);
        if (settings.numberDisplay == SCIENTIFIC || num.greaterThanOrEqualTo(STANDARDLIMIT)) {
            if (fullstop != -1) {
                dec = str.slice(fullstop);
                str = str.slice(0, fullstop);
                //Round decimals
                dec = Math.round(parseFloat(dec)*Math.pow(10, decimals)).toString();
                //Add back any zeros that are cut off from increasing the number's OOM
                if (dec.length < decimals) {
                    dec = dec.padStart(decimals, '0');
                } else if (dec.length > decimals) {
                    dec = '';
                    str = (parseInt(str)+1).toString();
                }
            }
        } else if (settings.numberDisplay == STANDARD) {
            expValue = parseFloat(exp.slice(1))
            symbolNum = Math.floor(expValue/3);
            name = getSymbol(symbolNum);

            rawNum = str.replace('.', '').padEnd(decimals+1, '0');
            numToDisplay = expValue % 3 + 1
            str = rawNum.slice(0, numToDisplay);
            if (numToDisplay == 1) {
                dec = rawNum.slice(numToDisplay, 3);
            } else {
                dec = rawNum.slice(numToDisplay, 4);
            }
            exp = '';
        }
    }
    //Add formatted decimals back to number
    if ((dec != '') && (dec != '0') && (dec != '00')) {
        str += `.${dec}`;
    }
    //Add name of number to end of number
    if (name != '') {
        str += ` ${name}`;
    }
    //Add e back to number
    if (exp != '') {
        str += exp;
    }
    return str;
}

const standardPreE33 = ["K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No"];
const standardUnits = ["", "U", "D", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No"];
const standardTens = ["", "Dc", "Vg", "Tg", "Qag", "Qig", "Sxg", "Spg", "Ocg", "Nog"];
const standardHundreds = ["", "Ct", "Dct", "Tct", "Qact", "Qict", "Sxct", "Spct", "Occt", "Noct"];
const standardMilestonePreEE33 = ["", "Mi", "Mc", "Na", "Pc", "Fm", "At", "Zp", "Yc", "Xn", "Ve"];
const standardMilestoneUnits = ["", "Me", "Du", "Tr", "Te", "Pe", "He", "Hp", "Ot", "En", "Ve"];
const standardMilestoneTens = ["", "E", "Is", "Trc", "Tec", "Pec", "Hec", "Hpc", "Otc", "Enc"];
const standardMilestoneHundreds = ["", "Ht", "Dh", "Trh", "Teh", "Peh", "Hxh", "Heh", "Oth", "Enh"];

function getSymbol(num) {
    num -= 1;
    if (num <= 9) {
        return standardPreE33[num];
    } else {
        let unit = num % 10;
        let tens = Math.floor(num/10) % 10;
        let hundreds = Math.floor(num/100) % 10;
        return standardUnits[unit] + standardTens[tens] + standardHundreds[hundreds];
    }
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
            levelString = `${formatNum(jobUpgrades[i].upgradeLevel)}`;
        } else {
            levelString = `${formatNum(jobUpgrades[i].upgradeLevel)}/${formatNum(jobUpgrades[i].upgradeLimit)}`;
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