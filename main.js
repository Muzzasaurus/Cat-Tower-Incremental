const jobTimes = [2];
const FPS = 25;
const BASE_JOB_XP_TARGET = new Decimal(25);
var lastUpdate = Date.now();
var deltaTime = 0;

const game = {
    money: new Decimal(0),
    jobLevel: new Decimal(0),
    jobXP: new Decimal(0),
    jobXPBaseGain: new Decimal(1),
    jobXPGain: new Decimal(1),
    jobXPTarget: BASE_JOB_XP_TARGET,
    jobLevelExponent: new Decimal(1.4),
    jobLevelEffect: new Decimal(1),
    jobEffectExponent: new Decimal(1.1)
};

for (let i = 0; i < game.jobTimes; i++) {
    game.jobActive = false;
    game.jobTriggers = 0;
}

function updateXPGain() {
    game.jobXPGain = game.jobXPBaseGain.multiply(jobs.find(x => x.id == 'jobXP').currentEffect).multiply(jobUpgrades.find(x => x.id == 'basicXP').effectValue);
}

//function findMaxUpgrades(basePrice, growthExponent, upgradesOwned, currencyOwned, spendCurrency)
//function findBulkCost(basePrice, growthExponent, upgradesOwned, numToBuy)
function addJobXP(xp) {
    game.jobXP = game.jobXP.plus(xp);
    if (game.jobXP.greaterThanOrEqualTo(game.jobXPTarget)) {
        let levels = findMaxUpgrades(BASE_JOB_XP_TARGET, game.jobLevelExponent, game.jobLevel, game.jobXP, true);
        let cost = findBulkCost(BASE_JOB_XP_TARGET, game.jobLevelExponent, game.jobLevel, levels);
        game.jobLevel = game.jobLevel.plus(levels);
        game.jobXP = game.jobXP.minus(cost);
        game.jobXPTarget = Decimal.pow(game.jobLevelExponent, game.jobLevel).multiply(BASE_JOB_XP_TARGET);
        game.jobLevelEffect = Decimal.pow(game.jobEffectExponent, game.jobLevel);
    }
}

/*function addJobXP(xp) {
    game.jobXP = game.jobXP.plus(xp);
    while (game.jobXP.greaterThanOrEqualTo(game.jobXPTarget)) {
        game.jobLevel = game.jobLevel.plus(1);
        game.jobXP = game.jobXP.minus(game.jobXPTarget);
        game.jobXPTarget = Decimal.pow(game.jobLevelExponent, game.jobLevel).multiply(BASE_JOB_XP_TARGET);
        game.jobLevelEffect = Decimal.pow(game.jobEffectExponent, game.jobLevel);
    }
}*/

//Saving/Loading
function save() {
    const saveData = {
        game: game,
        jobs: jobs,
        jobUpgrades: jobUpgrades
    };
	localStorage.setItem("saveData", JSON.stringify(saveData));
}

function load() {
	if (localStorage.saveData) saveData = JSON.parse(localStorage.getItem("saveData"));
    game.money = new Decimal(saveData.game.money);
    game.jobLevel = new Decimal(saveData.game.jobLevel);
    game.jobXP = new Decimal(saveData.game.jobXP);
    game.jobXPBaseGain = new Decimal(saveData.game.jobXPBaseGain);
    game.jobXPGain = new Decimal(saveData.game.jobXPGain);
    game.jobXPTarget = new Decimal(saveData.game.jobXPTarget);
    game.jobLevelExponent = new Decimal(saveData.game.jobLevelExponent);
    game.jobLevelEffect = new Decimal(saveData.game.jobLevelEffect);
    game.jobEffectExponent = new Decimal(saveData.game.jobEffectExponent);
    let tempJobs = [];
    let job = {};
    for (let i = 0; i < jobs.length; i++) {
        switch (saveData.jobs[i].id) {
            case 'jobMoney':
                job = Object.assign(new Job1(saveData.jobs[i].id, saveData.jobs[i].title, saveData.jobs[i].baseTime, saveData.jobs[i].xpMult, saveData.jobs[i].baseEffect, saveData.jobs[i].displayEffectString, saveData.jobs[i].unlockLevel, saveData.jobs[i].timeRemaining, saveData.jobs[i].active, saveData.jobs[i].unlocked, saveData.jobs[i].autoWork, saveData.jobs[i].timesActivated, saveData.jobs[i].currentTime));
                tempJobs.push(job);
                break;
            case 'jobBoost':
                job = Object.assign(new Job4(saveData.jobs[i].id, saveData.jobs[i].title, saveData.jobs[i].baseTime, saveData.jobs[i].xpMult, saveData.jobs[i].baseEffect, saveData.jobs[i].displayEffectString, saveData.jobs[i].unlockLevel, saveData.jobs[i].timeRemaining, saveData.jobs[i].active, saveData.jobs[i].unlocked, saveData.jobs[i].autoWork, saveData.jobs[i].timesActivated, saveData.jobs[i].currentTime));
                tempJobs.push(job);
                break;
            case 'jobXP':
                job = Object.assign(new Job3(saveData.jobs[i].id, saveData.jobs[i].title, saveData.jobs[i].baseTime, saveData.jobs[i].xpMult, saveData.jobs[i].baseEffect, saveData.jobs[i].displayEffectString, saveData.jobs[i].unlockLevel, saveData.jobs[i].timeRemaining, saveData.jobs[i].active, saveData.jobs[i].unlocked, saveData.jobs[i].autoWork, saveData.jobs[i].timesActivated, saveData.jobs[i].currentTime));
                tempJobs.push(job);
                break;
            case 'jobTime':
                job = Object.assign(new Job2(saveData.jobs[i].id, saveData.jobs[i].title, saveData.jobs[i].baseTime, saveData.jobs[i].xpMult, saveData.jobs[i].baseEffect, saveData.jobs[i].displayEffectString, saveData.jobs[i].unlockLevel, saveData.jobs[i].timeRemaining, saveData.jobs[i].active, saveData.jobs[i].unlocked, saveData.jobs[i].autoWork, saveData.jobs[i].timesActivated, saveData.jobs[i].currentTime));
                tempJobs.push(job);
                break;
        }
    }
    let tempUpgrades = [];
    let upgrade = {};
    for (let i = 0; i < jobUpgrades.length; i++) {
        switch (saveData.jobUpgrades[i].id) {
            case 'basicMoney':
            case 'basicXP':
                upgrade = Object.assign(new Upgrade1(saveData.jobUpgrades[i].id, saveData.jobUpgrades[i].name, saveData.jobUpgrades[i].description, saveData.jobUpgrades[i].basePrice, saveData.jobUpgrades[i].priceExponent, saveData.jobUpgrades[i].levelBonusMilestone, saveData.jobUpgrades[i].levelBonusEffect, saveData.jobUpgrades[i].upgradeLimit, saveData.jobUpgrades[i].upgradeEffect, saveData.jobUpgrades[i].icon, saveData.jobUpgrades[i].baseEffect, saveData.jobUpgrades[i].upgradeLevel, saveData.jobUpgrades[i].currentPrice));
                tempUpgrades.push(upgrade);
                break;
            case 'jobAuto':
                upgrade = Object.assign(new Upgrade2(saveData.jobUpgrades[i].id, saveData.jobUpgrades[i].name, saveData.jobUpgrades[i].description, saveData.jobUpgrades[i].basePrice, saveData.jobUpgrades[i].priceExponent, saveData.jobUpgrades[i].levelBonusMilestone, saveData.jobUpgrades[i].levelBonusEffect, saveData.jobUpgrades[i].upgradeLimit, saveData.jobUpgrades[i].upgradeEffect, saveData.jobUpgrades[i].icon, saveData.jobUpgrades[i].baseEffect, saveData.jobUpgrades[i].upgradeLevel, saveData.jobUpgrades[i].currentPrice));
                tempUpgrades.push(upgrade);
                break;
        }
    }
    for (let i = 0; i < jobs.length; i++) {
        jobs[i].button.removeEventListener('click', jobs[i].handler);
        tempJobs[i].button = jobs[i].button;
        tempJobs[i].handler = jobs[i].beginJob.bind(tempJobs[i]);
        tempJobs[i].button.addEventListener('click', tempJobs[i].handler);
        tempJobs[i].updateEffect();
    }
    jobs = tempJobs;
    for (let i = 0; i < jobUpgrades.length; i++) {
        jobUpgrades[i].buyButton.removeEventListener('click', jobUpgrades[i].buyHandler);
        jobUpgrades[i].buyMaxButton.removeEventListener('click', jobUpgrades[i].buyMaxHandler);

        tempUpgrades[i].buyHandler = tempUpgrades[i].buyUpgrade.bind(tempUpgrades[i]);
        tempUpgrades[i].buyButton = jobUpgrades[i].buyButton;
        tempUpgrades[i].buyMaxHandler = tempUpgrades[i].buyMaxUpgrades.bind(tempUpgrades[i]);
        tempUpgrades[i].buyMaxButton = jobUpgrades[i].buyMaxButton;

        tempUpgrades[i].buyButton.addEventListener('click', tempUpgrades[i].buyHandler);
        tempUpgrades[i].buyMaxButton.addEventListener('click', tempUpgrades[i].buyMaxHandler);
        tempUpgrades[i].calculateEffect();
    }
    jobUpgrades = tempUpgrades;
}

function mainLoop() {
    var now = Date.now();
    deltaTime = now - lastUpdate;
    lastUpdate = now;
    //Logic
    updateJobTimes();
    autoWorkJobs();
    updateXPGain();
    //Visual
    updateJobNumbers();
    updateJobBars();
    updateJobLevel();
    updateGoalProgress();
    updateUpgrades();
}

//Initial setup
for (let i = 0; i < jobs.length; i++) {
    jobs[i].updateEffect();
}
addNavListeners();
setInterval(mainLoop, 1/FPS);