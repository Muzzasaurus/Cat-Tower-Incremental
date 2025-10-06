const JOBS_CONTAINER = document.getElementById('jobsContainer');
var jobs = [];

class Job1 extends Job {
    updateEffect() {
        super.updateEffect();
        this.currentEffect = this.baseEffect.multiply(game.jobLevelEffect).multiply(jobUpgrades.find(x => x.id == 'basicMoney').effectValue);
        this.displayEffect = this.currentEffect;
    }
    jobEffect() {
        super.jobEffect();
        game.money = game.money.plus(this.currentEffect.multiply(this.effectTriggers));
        this.effectTriggers = new Decimal(0);
    }
}

class Job2 extends Job {
    constructor(id, title, baseTime, xpMult, baseEffect, displayEffectString) {
        super(id, title, baseTime, xpMult, baseEffect, displayEffectString);
        this.timesActivated = new Decimal(0);
        this.divideValue = new Decimal(1);
    }
    updateEffect() {
        super.updateEffect();
        this.currentEffect = this.baseEffect.multiply(game.jobLevelEffect);
        //this.divideValue = new Decimal(1).multiply(this.timesActivated.multiply(game.jobLevelEffect).dividedBy(100).plus(1));
        this.divideValue = new Decimal(1).multiply(Decimal.pow(this.timesActivated, 0.5).multiply(game.jobLevelEffect).dividedBy(20).plus(1));
        this.displayEffect = this.divideValue;
    }
    jobEffect() {
        super.jobEffect();
        this.timesActivated = this.timesActivated.plus(1);
        this.effectTriggers = new Decimal(0);
    }
}

//Money job
let job1 = new Job1('jobMoney', 'Job 1', 2, 1, 1, '+$@');
jobs.push(job1);

//job1 time job
let job2 = new Job2('jobTime', 'Job 2', 10, 1, 1, '/@');
jobs.push(job2);

//Create job HTML
for (let i = 0; i < jobs.length; i++) {
    let displayString = jobs[i].displayEffectString.replace('@', formatNum(jobs[i].displayEffect))

    const job = document.createElement('div');
    job.setAttribute('class', 'jobContainer');
    job.innerHTML =
    `<h2>${jobs[i].title}</h2>
    <h3 class="jobIncomeDisplay">Currently: ${displayString}</h3>
    <div class="singleJobProgressContainer" jobId="1">
        <div class="singleJobProgress">
            <h2 class="jobTimer">${formatTimeS(jobs[i].timeRemaining)}</h2>
        </div>
    </div>`
    //Add job start listeners
    job.getElementsByClassName('jobTimer')[0].addEventListener('click', jobs[i].beginJob.bind(jobs[i]));
    JOBS_CONTAINER.append(job);
}

function updateJobTimes() {
    for (let i = 0; i < jobs.length; i++) {
        jobs[i].updateTime();
    }
}