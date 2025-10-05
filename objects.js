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