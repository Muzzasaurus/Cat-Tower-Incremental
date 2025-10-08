const JOBS_CONTAINER = document.getElementById('jobsContainer');
var jobs = [];

class Job1 extends Job {
    updateEffect() {
        super.updateEffect();
        this.currentEffect = this.baseEffect.multiply(game.jobLevelEffect).multiply(jobUpgrades.find(x => x.id == 'basicMoney').effectValue).multiply(jobs.find(x => x.id == 'jobBoost').currentEffect);
        this.displayEffect = this.currentEffect;
    }
    jobEffect() {
        super.jobEffect();
        game.money = game.money.plus(this.currentEffect.multiply(this.effectTriggers));
        this.effectTriggers = new Decimal(0);
    }
}

class Job2 extends Job {
    updateEffect() {
        super.updateEffect();
        this.currentEffect = this.baseEffect.multiply(Decimal.pow(this.timesActivated.multiply(game.jobLevelEffect), 0.5).dividedBy(20).plus(1));
        this.displayEffect = this.currentEffect;
    }
    jobEffect() {
        super.jobEffect();
        this.timesActivated = this.timesActivated.plus(this.effectTriggers);
        this.effectTriggers = new Decimal(0);
    }
}

class Job3 extends Job {
    updateEffect() {
        super.updateEffect();
        this.currentEffect = this.baseEffect.multiply(Decimal.pow(this.timesActivated.multiply(game.jobLevelEffect), 0.7).dividedBy(80).plus(1));
        this.displayEffect = this.currentEffect;
    }
    jobEffect() {
        super.jobEffect();
        this.timesActivated = this.timesActivated.plus(this.effectTriggers);
        this.effectTriggers = new Decimal(0);
    }
}

class Job4 extends Job {
    updateEffect() {
        super.updateEffect();
        this.currentEffect = this.timesActivated.dividedBy(100).multiply(game.jobLevelEffect).plus(1);
        this.displayEffect = this.currentEffect;
    }
    jobEffect() {
        super.jobEffect();
        this.timesActivated = this.timesActivated.plus(this.effectTriggers);
        this.effectTriggers = new Decimal(0);
    }
}

//Money job
let job1 = new Job1('jobMoney', 'Job 1', 2, 1, 1, '+$@ per completion', 0);
jobs.push(job1);

//Money boost job
let job2 = new Job4('jobBoost', 'Job 2', 5, 1, 1, 'Currently multiplying money gain by x@', 1);
jobs.push(job2);

//XP job
let job3 = new Job3('jobXP', 'Job 3', 10, 1, 1, 'Currently multiplying XP by x@', 2);
jobs.push(job3);

//Time job
let job4 = new Job2('jobTime', 'Job 4', 15, 1, 1, 'Currently dividing job times by /@', 5);
jobs.push(job4);

//Create job HTML
for (let i = 0; i < jobs.length; i++) {
    let displayString = jobs[i].displayEffectString.replace('@', formatNum(jobs[i].displayEffect))

    const job = document.createElement('div');
    job.setAttribute('class', 'jobContainer');
    job.innerHTML =
    `<h2 class="jobTitle">${jobs[i].title}</h2>
    <h3 class="jobIncomeDisplay">Currently: ${displayString}</h3>
    <div class="singleJobProgressContainer" jobId="1">
        <div class="singleJobProgress">
            <h2 class="jobTimer">${formatTimeS(jobs[i].timeRemaining)}</h2>
        </div>
    </div>`
    //Add job start listeners
    jobs[i].handler = jobs[i].beginJob.bind(jobs[i]);
    jobs[i].button = job.getElementsByClassName('jobTimer')[0];
    job.getElementsByClassName('jobTimer')[0].addEventListener('click', jobs[i].handler);
    JOBS_CONTAINER.append(job);
}

function updateJobTimes() {
    for (let i = 0; i < jobs.length; i++) {
        jobs[i].updateTime();
    }
}

function autoWorkJobs() {
    for (let i = 0; i < jobs.length; i++) {
        if (jobs[i].autoWork) {
            jobs[i].beginJob();
        }
    }
}