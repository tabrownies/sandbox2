// for simplicity date is a number 0-47 for each month and the week of each month
let amountInSavings = 5000;
let amountInEmergency = 350;

let amountTowardsEmergency = 50;
let amountTowardsSavings = 300;
let monthlyMin = 400;

let emergencyGoal = 1000;

let desiredFun = 100;

let today = 12;



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
// expenses.push(new RegularExpense('Tuition', 4000, 'yearly', 0, 11));
// expenses.push(new RegularExpense('Tuition', 4000, 'yearly', 0, 31));

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

for (let i = 0; i < 48; ++i) {
    expenseBins.push(0);
    incomeBins.push(0);
    moneyLeftBin.push(0);
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

class WeekVars {
    constructor(savings, emergency, savingsDeficit = 0, emergencyDeficit = 0) {
        this.savings = savings;
        this.emergency = emergency;
        this.savingsDeficit = savingsDeficit;
        this.emergencyDeficit = emergencyDeficit;
    }
}

// copy expense bins
let incomeBinsAdjusted = incomeBins.map(value => value);

for (let i = 0; i < incomeBinsAdjusted.length; ++i) {
    incomeBinsAdjusted[i] -= monthlyMin/4;
}

for (let j = 0; j < expenseBins.length; j++) {
    for(let k = 0; k < j; k++){
        incomeBinsAdjusted[k]-=expenseBins[j]/(j+1);
    }
}

for (let i = 0; i < incomeBinsAdjusted.length; ++i) {
    console.log(incomeBins[i], expenseBins[i],incomeBinsAdjusted[i]);

}


// console.log(expenseBins)
// console.log(incomeBinsAdjusted);