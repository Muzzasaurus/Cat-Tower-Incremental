const jobTimes = [2];
const FPS = 25;
const BASE_JOB_XP_TARGET = new Decimal(100);
var lastUpdate = Date.now();
var deltaTime = 0;

const game = {
    money: new Decimal(0),
    jobLevel: new Decimal(0),
    jobXP: new Decimal(0),
    jobXPGain: new Decimal(1),
    jobXPTarget: BASE_JOB_XP_TARGET,
    jobLevelExponent: new Decimal(1.35),
    jobLevelEffect: new Decimal(1),
    jobEffectExponent: new Decimal(1.2),
    jobTimeRemaining: jobTimes.slice(0),
    jobActive: new Array(jobTimes.length),
    jobTriggers: new Array(jobTimes.length),
    job1Income: new Decimal(1),
    job1BaseIncome: new Decimal(25)
};

for (let i = 0; i < game.jobTimes; i++) {
    game.jobActive = false;
    game.jobTriggers = 0;
}

function incrementJobTimers() {
    for (let i = 0; i < game.jobTimeRemaining.length; i++) {
        //check if job is active
        if (game.jobActive[i]) {
            //subtract time
            game.jobTimeRemaining[i] -= deltaTime/1000;
            //check if time is less than 0
            if (game.jobTimeRemaining[i] <= 0) {
                game.jobActive[i] = false;
                game.jobTimeRemaining[i] = jobTimes[i];
                game.jobTriggers[i] = 1;
                addJobXP(game.jobXPGain);
            }
        }
    }
}

function jobFunctions() {
    for (let i = 0; i < game.jobTriggers; i++) {
        switch (i) {
            //Job 1
            case 0:
                game.money = game.money.plus(game.job1Income.multiply(game.jobTriggers[i]));
                game.jobTriggers[i] = 0;
                break;
        }
    }
}

function updateJobEffects() {
    game.job1Income = game.job1BaseIncome.multiply(game.jobLevelEffect).multiply(jobUpgrades.find(x => x.id == 'basicMoney').effectValue);
}

function addJobXP(xp) {
    game.jobXP = game.jobXP.plus(xp);
    while (game.jobXP.greaterThanOrEqualTo(game.jobXPTarget)) {
        game.jobLevel = game.jobLevel.plus(1);
        game.jobXP = game.jobXP.minus(game.jobXPTarget);
        game.jobXPTarget = Decimal.pow(game.jobLevelExponent, game.jobLevel).multiply(BASE_JOB_XP_TARGET);
        game.jobLevelEffect = Decimal.pow(game.jobEffectExponent, game.jobLevel);
    }
}

function beginJob(event) {
    const job = event.target.parentElement.parentElement.getAttribute('jobId');
    game.jobActive[job-1] = true;
}

function mainLoop() {
    var now = Date.now();
    deltaTime = now - lastUpdate;
    lastUpdate = now;
    //Logic
    incrementJobTimers();
    updateJobEffects();
    jobFunctions();
    //Visual
    updateJobNumbers();
    updateJobBars();
    updateJobLevel();
    updateGoalProgress();
    updateUpgrades();
}

addNavListeners();
addJobListeners();
setInterval(mainLoop, 1/FPS);