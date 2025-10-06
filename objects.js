class Upgrade {
    constructor(id, name, description, basePrice, priceExponent, levelBonusMilestone, levelBonusEffect, upgradeLimit, upgradeEffect, icon) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.basePrice = new Decimal(basePrice);
        this.currentPrice = this.basePrice;
        this.priceExponent = new Decimal(priceExponent);
        this.upgradeLevel = new Decimal(0);
        this.upgradeLimit = new Decimal(upgradeLimit);
        this.levelBonusMilestone = levelBonusMilestone;
        this.levelBonusEffect = levelBonusEffect;
        this.effectValue = new Decimal(1);
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
    constructor(id, title, baseTime, xpMult, baseEffect, displayEffectString) {
        this.id = id;
        this.title = title;
        this.baseTime = baseTime;
        this.currentTime = this.baseTime;
        this.timeRemaining = this.baseTime;
        this.active = false;
        this.xpMult = xpMult;
        this.baseEffect = new Decimal(baseEffect);
        this.currentEffect = this.baseEffect;
        this.displayEffect = this.currentEffect;
        this.effectTriggers = new Decimal(0);
        this.displayEffectString = displayEffectString;
    }
    updateEffect() {
        this.currentTime = this.baseTime / jobs[1].divideValue.toNumber();
    }
    beginJob() {
        if (!this.active) {
            this.timeRemaining = this.baseTime;
            this.active = true;
        }
    }
    updateTime() {
        if (this.active) {
            //subtract time
            this.timeRemaining -= deltaTime/1000;
            //check if time is less than 0
            if (this.timeRemaining <= 0) {
                this.active = false;
                this.timeRemaining = this.currentTime;
                this.effectTriggers = this.effectTriggers.plus(1);
                this.jobEffect();
            }
        }
        if (this.timeRemaining > this.currentTime) {
            this.timeRemaining = this.currentTime;
        }
    }
    jobEffect() {
        addJobXP(game.jobXPGain.multiply(this.xpMult));
    }
}