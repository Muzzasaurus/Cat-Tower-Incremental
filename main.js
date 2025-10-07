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
    jobEffectExponent: new Decimal(1.1),
};

for (let i = 0; i < game.jobTimes; i++) {
    game.jobActive = false;
    game.jobTriggers = 0;
}

function updateXPGain() {
    game.jobXPGain = game.jobXPBaseGain.multiply(jobs.find(x => x.id == 'jobXP').currentEffect).multiply(jobUpgrades.find(x => x.id == 'basicXP').effectValue);
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