class Upgrade {
    constructor(id, name, description, basePrice, priceExponent, levelBonusMilestone, levelBonusEffect, upgradeLimit, upgradeEffect, icon, baseEffect, upgradeLevel = 0, currentPrice = 0) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.basePrice = new Decimal(basePrice);
        if (currentPrice == 0) {
            this.currentPrice = this.basePrice;
        } else {
            this.currentPrice = new Decimal(currentPrice);
        }
        this.priceExponent = new Decimal(priceExponent);
        this.upgradeLevel = new Decimal(upgradeLevel);
        this.upgradeLimit = new Decimal(upgradeLimit);
        this.levelBonusMilestone = levelBonusMilestone;
        this.levelBonusEffect = levelBonusEffect;
        this.effectValue = new Decimal(baseEffect);
        this.upgradeEffect = new Decimal(upgradeEffect);
        this.icon = icon;
    }
    buyUpgrade() {
        if (this.upgradeLevel.greaterThanOrEqualTo(this.upgradeLimit) && this.upgradeLimit.notEquals(0)) return;
        if (game.money.greaterThanOrEqualTo(this.currentPrice)) {
            game.money = game.money.minus(this.currentPrice);
            this.upgradeLevel = this.upgradeLevel.plus(1);
            this.currentPrice = Decimal.pow(this.priceExponent, this.upgradeLevel).multiply(this.basePrice);
        }
    }
    buyMaxUpgrades() {
        if (game.money.greaterThanOrEqualTo(this.currentPrice)) {
            let upgradesToBuy = findMaxUpgrades(this.basePrice, this.priceExponent, this.upgradeLevel, game.money, true);
            if (upgradesToBuy.greaterThanOrEqualTo(this.upgradeLimit.minus(this.upgradeLevel)) && this.upgradeLimit.notEquals(0)) {
                upgradesToBuy = this.upgradeLimit.minus(this.upgradeLevel);
            }
            let moneyToSpend = findBulkCost(this.basePrice, this.priceExponent, this.upgradeLevel, upgradesToBuy);
            game.money = game.money.minus(moneyToSpend);
            this.upgradeLevel = this.upgradeLevel.plus(upgradesToBuy);
            this.currentPrice = Decimal.pow(this.priceExponent, this.upgradeLevel).multiply(this.basePrice);
        }
    }
}

class Job {
    constructor(id, title, baseTime, xpMult, baseEffect, displayEffectString, unlockLevel, timeRemaining = -1, active = false, unlocked = false, autoWork = false, timesActivated = 0, currentTime = -1) {
        this.id = id;
        this.title = title;
        this.baseTime = new Decimal(baseTime);
        if (currentTime == -1) {
            this.currentTime = this.baseTime;
        } else {
            this.currentTime = new Decimal(currentTime);
        }
        if (timeRemaining == -1) {
            this.timeRemaining = this.baseTime;
        } else {
            this.timeRemaining = new Decimal(timeRemaining);
        }
        this.active = active;
        this.xpMult = xpMult;
        this.baseEffect = new Decimal(baseEffect);
        this.currentEffect = this.baseEffect;
        this.displayEffect = this.currentEffect;
        this.effectTriggers = new Decimal(0);
        this.displayEffectString = displayEffectString;
        this.unlockLevel = new Decimal(unlockLevel);
        this.unlocked = unlocked;
        this.autoWork = autoWork;
        this.timesActivated = new Decimal(timesActivated);
    }
    updateEffect() {
        this.currentTime = this.baseTime.dividedBy(jobs.find(x => x.id == 'jobTime').currentEffect);
    }
    beginJob() {
        if ((!this.active) && (this.unlocked)) {
            this.timeRemaining = this.baseTime;
            this.active = true;
        }
    }
    updateTime() {
        if (this.active) {
            if (this.autoWork) {
                this.timeRemaining = this.timeRemaining.minus(new Decimal(deltaTime).dividedBy(1000));
                if (this.timeRemaining.lessThanOrEqualTo(0)) {
                    this.effectTriggers = this.effectTriggers.plus((this.timeRemaining).abs().dividedBy(this.currentTime).floor()).plus(1);
                    //Figure out the issue with this line
                    this.timeRemaining = this.currentTime.minus(this.timeRemaining.abs().dividedBy(this.currentTime));
                    //This shouldn't be needed but the game currently doesn't work without it
                    if (this.timeRemaining.lessThan(0)) {
                        this.timeRemaining = new Decimal(0);
                    }
                    this.jobEffect();
                }
            } else {
                //subtract time
                this.timeRemaining = this.timeRemaining.minus(new Decimal(deltaTime).dividedBy(1000));
                //check if time is less than 0
                if (this.timeRemaining.lessThanOrEqualTo(0)) {
                    this.active = false;
                    this.timeRemaining = this.currentTime;
                    this.effectTriggers = this.effectTriggers.plus(1);
                    this.jobEffect();
                }
            }
        }
        if (this.timeRemaining.greaterThanOrEqualTo(this.currentTime)) {
            this.timeRemaining = this.currentTime;
        }
    }
    jobEffect() {
        addJobXP(game.jobXPGain.multiply(this.xpMult).multiply(this.effectTriggers));
    }
}