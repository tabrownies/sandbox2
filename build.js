// for simplicity date is a number 0-47 for each month and the week of each month
let amountInSavings = 5000;
let amountInEmergency = 350;

let amountTowardsEmergency = 50;
let amountTowardsSavings = 300;
let monthlyMin = 400;

let emergencyGoal = 1000;
let savingsGoal = 10000;

let desiredFun = 100;

let today = 12;

savingsDeficit = 0;

class OneTimeExpense {
    constructor(title, amount, date) {
        this.title = title;
        this.amount = amount;
        this.date = date;
    }
}

class RegularExpense {
    constructor(title, amount, frequency, start = 0) {
        this.title = title;
        this.amount = amount;
        this.frequency = frequency;
        this.start = start;
    }
}

class OneTimeIncome {
    constructor(title, amount, date) {
        this.title = title;
        this.amount = amount;
        this.date = date;
    }
}

class RegularIncome {
    constructor(title, amount, frequency, start = 0) {
        this.title = title;
        this.amount = amount;
        this.frequency = frequency;
        this.start = start;
    }
}


let expenses = [];
let incomes = [];

// expenses.push(new OneTimeExpense('date', 30, 0));
// expenses.push

// prep fake planned expenses
expenses.push(new OneTimeExpense('car', 5000, 20));
expenses.push(new RegularExpense('Tuition', 4000, 'yearly', 0, 11));
expenses.push(new RegularExpense('Tuition', 4000, 'yearly', 0, 31));

expenses.push(new RegularExpense('rent', 400, 'monthly'));
expenses.push(new RegularExpense('car payment', 300, 'monthly', 20));

incomes.push(new OneTimeIncome('Summer Sales', 30000, 28));
incomes.push(new RegularIncome('TA job', 200, 'weekly'));
incomes.push(new RegularIncome('Parents Money', 100, 'monthly', 2));
incomes.push(new RegularIncome('Lottery', 100, 'yearly', 4))

// unplanned test expenses

let expenseBins = [];
let incomeBins = [];
let moneyLeftBin = []
let weeklyStats = [];

class WeekVars {
    constructor(budget = 0, fun = 0, savings = 0, emergency = 0, savingsDeficit = 0, emergencyDeficit = 0) {
        this.budget = budget;
        this.fun = fun;
        this.savings = savings;
        this.emergency = emergency;
        this.savingsDeficit = savingsDeficit;
        this.emergencyDeficit = emergencyDeficit;
    }
}

for (let i = 0; i < 48; ++i) {
    expenseBins.push(0);
    incomeBins.push(0);
    moneyLeftBin.push(0);
    weeklyStats.push(new WeekVars());
}

for (let i = 0; i < incomes.length; i++) {
    if (incomes[i]['date'] != null) {
        // this is a one time income
        incomeBins[incomes[i].date] += incomes[i].amount;
    } else {
        switch (incomes[i].frequency) {
            case 'weekly':
                for (let j = incomes[i].start; j < 48; j++) {
                    incomeBins[j] += incomes[i].amount;
                }
                break;
            case 'monthly':
                for (let j = incomes[i].start; j < 48; j += 4) {
                    incomeBins[j] += incomes[i].amount
                }
                break;
            case 'yearly':
                for (let j = incomes[i].start; j < 48; j += 48) {
                    incomeBins[j] += incomes[i].amount
                }
                break;
        }
    }
}


for (let i = 0; i < expenses.length; i++) {
    if (expenses[i]['date'] != null) {
        // this is a one time income
        expenseBins[expenses[i].date] += expenses[i].amount;
    } else {
        switch (expenses[i].frequency) {
            case 'weekly':
                for (let j = expenses[i].start; j < 48; j++) {
                    expenseBins[j] += expenses[i].amount;
                }
                break;
            case 'monthly':
                for (let j = expenses[i].start; j < 48; j += 4) {
                    expenseBins[j] += expenses[i].amount
                }
                break;
            case 'yearly':
                for (let j = expenses[i].start; j < 48; j += 48) {
                    expenseBins[j] += expenses[i].amount
                }
                break;
        }
    }
}



funAmount = 0;

// deep copy expense bins
let incomeBinsAdjusted = incomeBins.map(value => value);

// take out mandatory expenses
for (let i = 0; i < incomeBinsAdjusted.length; ++i) {
    incomeBinsAdjusted[i] -= monthlyMin / 4;
    weeklyStats[i].budget = monthlyMin / 4;
}

// calculate the amount that needs to be spent each month for the future expenses
for (let j = 0; j < expenseBins.length; j++) {
    for (let k = 0; k < j; k++) {
        incomeBinsAdjusted[k] -= expenseBins[j] / (j + 1);
    }
}

weeklyStats[0].emergency = amountInEmergency
weeklyStats[0].savings = amountInSavings

// compensate with savings, replenish savings, and then take out for rainy day and savings
for (let i = 0; i < incomeBinsAdjusted.length; ++i) {
    if (incomeBinsAdjusted[i] < 0) {
        // pull from savings
        amountInSavings += incomeBinsAdjusted[i]; // this is negative
        savingsDeficit -= incomeBinsAdjusted[i];
        // console.log(incomeBinsAdjusted[i]);
        incomeBinsAdjusted[i] = 0;
    }
    // don't pull from savings
    else {
        // fix the deficit
        if (incomeBinsAdjusted[i] < savingsDeficit) {
            // if there is less left than the deficit add all back to the amount in savings and reduce the deficit
            amountInSavings += incomeBinsAdjusted[i];
            savingsDeficit -= incomeBinsAdjusted[i];
            incomeBinsAdjusted[i] = 0;
        } else {
            // completely reduce the savings deficit
            incomeBinsAdjusted[i] -= savingsDeficit;
            amountInSavings += savingsDeficit;
            savingsDeficit = 0;
        }

        // move money towards emergency
        if (incomeBinsAdjusted[i] > amountTowardsEmergency) {
            // if there is more money left than emergency, put the full amount towards emergency
            amountInEmergency += amountTowardsEmergency;
            incomeBinsAdjusted[i] -= amountTowardsEmergency;
        } else {
            // if there is less
            amountInEmergency += incomeBinsAdjusted[i];
            incomeBinsAdjusted[i] = 0;
        }

        // move money towards fun if needed
        if (funAmount < desiredFun) {
            // we need to move money into fun
            amountToMove = desiredFun - funAmount //the amount I want to move
            if (amountToMove < incomeBinsAdjusted[i]) {
                // there's more left than it needed to 'have fun'
                funAmount += amountToMove;
                incomeBinsAdjusted[i] -= amountToMove;

            } else {
                // use all the rest of the money for fun
                funAmount += incomeBinsAdjusted[i];
                incomeBinsAdjusted[i] = 0;
            }
        }

        // put the rest to savings
        amountInSavings += incomeBinsAdjusted[i];
        incomeBinsAdjusted[i] = 0

        // pull from savings if above goal for fun and rainy day
        // if (amountInSavings > savingsGoal) {
        //     let excessSavings = amountInSavings - savingsGoal; // the extra money in savings that will be put to other uses

        //     // if there isn't enough in fun
        //     if (funAmount < desiredFun) {
        //         // we need to move money into fun
        //         amountToMove = desiredFun - funAmount //the amount I want to move
        //         if (amountToMove < excessSavings) {
        //             // there's more left than it needed to 'have fun'
        //             funAmount += amountToMove;
        //             amountInSavings -= amountToMove;
        //             excessSavings -= amountToMove
        //         } else {
        //             // use all the rest of the money for fun
        //             funAmount += excessSavings;
        //             amountInSavings - excessSavings;
        //             excessSavings = 0;
        //         }
        //     }

        //     // move money towards emergency
        //     if (excessSavings > amountTowardsEmergency) {
        //         // if there is more money left than emergency, put the full amount towards emergency
        //         amountInEmergency += amountTowardsEmergency;
        //         excessSavings -= amountTowardsEmergency;
        //         amountInSavings -= amountInEmergency;
        //     } else {
        //         // if there is less
        //         amountInEmergency += excessSavings;
        //         amountInSavings-=excessSavings;
        //         excessSavings = 0;
        //     }
        // }

    }
    console.log(amountInSavings);
}

for (let i = 0; i < incomeBinsAdjusted.length; ++i) {
    // console.log(incomeBins[i], expenseBins[i],incomeBinsAdjusted[i]);
}




// console.log(expenseBins)
// console.log(incomeBinsAdjusted);