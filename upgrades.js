const UPGRADE_CONTAINER = document.getElementById('jobUpgradesContainer');
var jobUpgrades = [];

//Helpful functions
function findMaxUpgrades(basePrice, growthExponent, upgradesOwned, currencyOwned, spendCurrency) {
    let maxUp = 0;
    if ((growthExponent.notEquals(1)) && (spendCurrency)) {
        maxUp = currencyOwned.multiply(growthExponent.minus(1)).dividedBy(basePrice.multiply(Decimal.pow(growthExponent,upgradesOwned))).plus(1).log10().dividedBy(growthExponent.log10()).floor();
    } else if ((!spendCurrency) && (currencyOwned.greaterThan(0))) {
        maxUp = currencyOwned.dividedBy(basePrice).log10().dividedBy(growthExponent.log10().plus(1)).floor().minus(upgradesOwned);
    } else {
        maxUp = currencyOwned.dividedBy(basePrice).floor();
    }
    return maxUp;
}

function findBulkCost(basePrice, growthExponent, upgradesOwned, numToBuy) {
    let bulkCost = 0;
    if (growthExponent.notEquals(1)) {
        bulkCost = basePrice.multiply(Decimal.pow(growthExponent, upgradesOwned).multiply(Decimal.pow(growthExponent, numToBuy).minus(1))).dividedBy(growthExponent.minus(1));
    } else {
        bulkCost = basePrice.multiply(numToBuy);
    }
    return bulkCost;
}

class Upgrade1 extends Upgrade {
    buyUpgrade() {
        super.buyUpgrade();
        this.calculateEffect();
    }
    buyMaxUpgrades() {
        super.buyMaxUpgrades();
        this.calculateEffect();
    }
    calculateEffect() {
        if (this.upgradeLevel.notEquals(0)) {
            this.effectValue = this.upgradeLevel.multiply(this.upgradeEffect).plus(1).multiply(Decimal.pow(this.levelBonusEffect, Decimal.floor(this.upgradeLevel.dividedBy(this.levelBonusMilestone))));
        } else {
            this.effectValue = this.upgradeLevel.multiply(this.upgradeEffect).plus(1);
        }
    }
}

class Upgrade2 extends Upgrade {
    buyUpgrade() {
        super.buyUpgrade();
        this.calculateEffect();
    }
    buyMaxUpgrades() {
        super.buyMaxUpgrades();
        this.calculateEffect();
    }
    calculateEffect() {
        if (this.upgradeLevel.notEquals(0)) {
            this.effectValue = this.upgradeLevel.multiply(this.upgradeEffect).multiply(Decimal.pow(this.levelBonusEffect, Decimal.floor(this.upgradeLevel.dividedBy(this.levelBonusMilestone))));
        } else {
            this.effectValue = this.upgradeLevel.multiply(this.upgradeEffect)
        }
        for (let i = 0; i < jobs.length; i++) {
            if (this.effectValue.greaterThanOrEqualTo(i+1)) {
                jobs[i].autoWork = true;
            } else {
                jobs[i].autoWork = false;
            }
        }
    }
}

//Income upgrade
let upgrade1 = new Upgrade1('basicMoney', 'Basic Job Income', 'Increases money earned by <b>+50%</b> per level.<br>This effect is <b>doubled</b> every <b>20</b> levels.<br><b>Currently x@</b>', 5, 1.2, 20, 2, 0, 0.5, 'Assets/Images/GCIUpgradeBase.png', 1);
jobUpgrades.push(upgrade1);

//XP upgrade
let upgrade2 = new Upgrade1('basicXP', 'Basic XP', 'Increases job XP earned by <b>+25%</b> per level.<br>This effect is <b>doubled</b> every <b>20</b> levels.<br><b>Currently x@</b>', 50, 1.2, 20, 2, 0, 0.25, 'Assets/Images/GCIUpgradeBase.png', 1);
jobUpgrades.push(upgrade2);

//Job time upgrade
let upgrade3 = new Upgrade1('basicTime', 'Job Time', 'Divides job durations by <b>/1.05</b> per level.<br><b>Currently /@</b>', 100, 1.4, 0, 1, 100, 0.05, 'Assets/Images/GCIUpgradeBase.png', 1);
jobUpgrades.push(upgrade3);

//Auto work upgrade
let upgrade4 = new Upgrade2('jobAuto', 'Job Automation', 'Automatically works jobs for you<br><b>Currently @</b>', 500, 9, 0, 1, 4, 1, 'Assets/Images/GCIUpgradeBase.png', 0);
jobUpgrades.push(upgrade4);


//Create upgrade HTML
for (let i = 0; i < jobUpgrades.length; i++) {
    let displayString = jobUpgrades[i].description.replace('@', formatNum(jobUpgrades[i].effectValue));
    let levelString = '';
    if (jobUpgrades[i].upgradeLimit.equals(0)) {
        levelString = `${jobUpgrades[i].upgradeLevel}`;
    } else {
        levelString = `${jobUpgrades[i].upgradeLevel}/${jobUpgrades[i].upgradeLimit}`;
    }
    const upgrade = document.createElement('div');
    upgrade.setAttribute('class', 'jobUpgradeContainer');
    upgrade.innerHTML =
    `<h3>${jobUpgrades[i].name}<span style="font-weight: 500; font-size: 1rem;"> - ${levelString}</span></h3>
    <p style="text-align: center;">${displayString}</p>
    <img class="upgradeImage" draggable="false" src="${jobUpgrades[i].icon}">
    <h2 class="upgradePriceDisplay">$${jobUpgrades[i].currentPrice}</h2>
    <div class="jobUpgradeButtons">
        <button class="upgradeButton">Buy</button>
        <button class="upgradeButton">Buy Max</button>
    </div>`
    //Add Buy button listeners
    jobUpgrades[i].buyHandler = jobUpgrades[i].buyUpgrade.bind(jobUpgrades[i]);
    jobUpgrades[i].buyButton = upgrade.getElementsByClassName('upgradeButton')[0];
    jobUpgrades[i].buyMaxHandler = jobUpgrades[i].buyMaxUpgrades.bind(jobUpgrades[i]);
    jobUpgrades[i].buyMaxButton = upgrade.getElementsByClassName('upgradeButton')[1];

    upgrade.getElementsByClassName('upgradeButton')[0].addEventListener('click', jobUpgrades[i].buyHandler);
    upgrade.getElementsByClassName('upgradeButton')[1].addEventListener('click', jobUpgrades[i].buyMaxHandler);
    UPGRADE_CONTAINER.append(upgrade);
}