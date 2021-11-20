import { Injectable } from '@angular/core';

class WeekStat {
  constructor(public budget = 0, public fun = 0, public savings = 0, public emergency = 0, public savingsDeficit = 0, public emergencyDeficit = 0) {
  }
}

class OneTimeExpense {
  constructor(public title: string, public amount: number, public date: number) {
    this.title = title;
    this.amount = amount;
    this.date = date;
  }
}

class RegularExpense {
  constructor(public title: string, public amount: number, public frequency: string, public start = 0) {
    this.title = title;
    this.amount = amount;
    this.frequency = frequency;
    this.start = start;
  }
}

class OneTimeIncome {
  constructor(public title: string, public amount: number, public date: number) {
    this.title = title;
    this.amount = amount;
    this.date = date;
  }
}

class RegularIncome {
  constructor(public title: string, public amount: number, public frequency: string, public start = 0) {
    this.title = title;
    this.amount = amount;
    this.frequency = frequency;
    this.start = start;
  }
}



@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  // variables for monthly planning
  amountInSavings = 5000; //this does not include amount in emergency fun or budget
  amountInEmergency = 350;
  amountTowardsEmergency = 50;
  amountTowardsSavings = 300;
  monthlyMin = 400;
  emergencyGoal = 1000;
  savingsGoal = 10000;
  desiredFun = 25;

  // ins and outs of money
  expenses: (any)[] = [];
  incomes: (any)[] = [];
  incomeBins: any[] = [];
  expenseBins:any[] = [];
  expenseBinsSmoothed:any[] = [];

  // this months variables
  essentials = 0
  fun = 0

  // future plan
  weeklyStats: WeekStat[] = [];

  // the "date" for calculations

  currentWeek = 20;

  // later add changing date functionality
  constructor() {
    // prep fake planned expenses
    this.expenses.push(new OneTimeExpense('car', 5000, 20));
    this.expenses.push(new RegularExpense('Tuition', 4000, 'yearly', 11));
    this.expenses.push(new RegularExpense('Tuition', 4000, 'yearly', 31));

    this.expenses.push(new RegularExpense('rent', 400, 'monthly'));
    this.expenses.push(new RegularExpense('car payment', 300, 'monthly', 20));

    this.incomes.push(new OneTimeIncome('Summer Sales', 30000, 28));
    this.incomes.push(new RegularIncome('TA job', 200, 'weekly'));
    this.incomes.push(new RegularIncome('Parents Money', 100, 'monthly', 2));
    this.incomes.push(new RegularIncome('Lottery', 100, 'yearly', 4))
    this.calculateMonth();
    console.log('constructed');
  }

  calculateMonth() {
    // put back in savings all the money set aside. This is a bit of a bug that needs to be fixed eventually
    // this.amountInSavings += this.essentials;
    // this.amountInSavings += this.fun;
    this.essentials = 0;
    this.fun = 0;
    this.calculateBudget();
    // calculate week and week in the month
    let month = Math.floor(this.currentWeek / 4);
    let weekInMonth = this.currentWeek % 4;
    // console.log(weekInMonth)

    // address being in the middle of the month
    for (let i = this.currentWeek; i < this.currentWeek + (4 - weekInMonth); ++i) {
      this.essentials += this.weeklyStats[i].budget;
      this.fun += this.weeklyStats[i].fun;
    }

    // this.essentials = this.monthlyMin / 4 * (4 - weekInMonth);
    // this.fun = this.weeklyStats[this.currentWeek].fun / 4 * (4 - weekInMonth);

    this.amountInSavings = this.weeklyStats[this.currentWeek].savings;

    this.amountInEmergency = this.weeklyStats[this.currentWeek].emergency;

    // post adjust for being in the middle of the month
    // this.amountInSavings += this.monthlyMin - this.essentials;
    // this.amountInSavings = this.weeklyStats[this.currentWeek].fun / 4 * (weekInMonth);

    console.log(this.essentials, this.fun, this.amountInEmergency, this.amountInSavings)
    console.log(this.weeklyStats[this.currentWeek]);


  }

  adjust_amount(essentials:number = 0, fun:number = 0, emergency:number=0){
    this.essentials+=essentials;
    this.fun+=fun;
    this.amountInEmergency+=emergency
  }

  addExpense(expense: OneTimeExpense | RegularExpense): void {
    this.expenses.push(expense);
  }
  addIncome(income: OneTimeIncome | RegularIncome): void {
    this.incomes.push(income);
  }
  calculateBudget(): void {
    // reset data-member and prep variables
    this.weeklyStats = [];
    this.expenseBins=[];
    this.incomeBins=[];
    for (let i = 0; i < 48; ++i) {
      this.expenseBins.push(0);
      this.incomeBins.push(0);
      this.expenseBinsSmoothed.push(0);
    }

    for (let i = 0; i < this.incomes.length; i++) {
      if (this.incomes[i]['date'] != null) {
        // this is a one time income
        this.incomeBins[this.incomes[i].date] += this.incomes[i].amount;
      } else {
        switch (this.incomes[i].frequency) {
          case 'weekly':
            for (let j = this.incomes[i].start; j < 48; j++) {
              this.incomeBins[j] += this.incomes[i].amount;
            }
            break;
          case 'monthly':
            for (let j = this.incomes[i].start; j < 48; j += 4) {
              this.incomeBins[j] += this.incomes[i].amount
            }
            break;
          case 'yearly':
            for (let j = this.incomes[i].start; j < 48; j += 48) {
              this.incomeBins[j] += this.incomes[i].amount
            }
            break;
        }
      }
    }
    for (let i = 0; i < this.expenses.length; i++) {
      if (this.expenses[i]['date'] != null) {
        // this is a one time income
        this.expenseBins[this.expenses[i].date] += this.expenses[i].amount;
      } else {
        switch (this.expenses[i].frequency) {
          case 'weekly':
            for (let j = this.expenses[i].start; j < 48; j++) {
              this.expenseBins[j] += this.expenses[i].amount;
            }
            break;
          case 'monthly':
            for (let j = this.expenses[i].start; j < 48; j += 4) {
              this.expenseBins[j] += this.expenses[i].amount
            }
            break;
          case 'yearly':
            for (let j = this.expenses[i].start; j < 48; j += 48) {
              this.expenseBins[j] += this.expenses[i].amount
            }
            break;
        }
      }
    }
    console.log(this.expenseBins)
    let funAmount = 0;
    let savingsDeficit = 0;

    // deep copy expense bins
    let incomeBinsAdjusted = this.incomeBins.map(value => value);

    // take out mandatory expenses
    for (let i = this.currentWeek; i < incomeBinsAdjusted.length; ++i) {
      incomeBinsAdjusted[i] -= this.monthlyMin / 4;
      // this.expenseBinsSmoothed[i] +=this.monthlyMin/4
    }

    // calculate the amount that needs to be spent each month for the future expenses
    for (let j = this.currentWeek; j < this.expenseBins.length; j++) {
      for (let k = 0; k < j; k++) {
        incomeBinsAdjusted[k] -= this.expenseBins[j] / (j + 1);
        this.expenseBinsSmoothed[k] += this.expenseBins[j] / (j + 1);
      }
    }

    // this.incomeBinsSmoothed = this.incomeBins.map(value=>value);

    for (let i = this.currentWeek; i < incomeBinsAdjusted.length; ++i) {
      if (incomeBinsAdjusted[i] < 0) {
        // pull from savings
        this.amountInSavings += incomeBinsAdjusted[i]; // this is negative
        savingsDeficit -= incomeBinsAdjusted[i];
        // console.log(incomeBinsAdjusted[i]);
        incomeBinsAdjusted[i] = 0;
      }
      // don't pull from savings
      else {
        // fix the deficit
        if (incomeBinsAdjusted[i] < savingsDeficit) {
          // if there is less left than the deficit add all back to the amount in savings and reduce the deficit
          this.amountInSavings += incomeBinsAdjusted[i];
          savingsDeficit -= incomeBinsAdjusted[i];
          incomeBinsAdjusted[i] = 0;
        } else {
          // completely reduce the savings deficit
          incomeBinsAdjusted[i] -= savingsDeficit;
          this.amountInSavings += savingsDeficit;
          savingsDeficit = 0;
        }

        // move money towards emergency
        if (incomeBinsAdjusted[i] > this.amountTowardsEmergency) {
          // if there is more money left than emergency, put the full amount towards emergency
          this.amountInEmergency += this.amountTowardsEmergency;
          incomeBinsAdjusted[i] -= this.amountTowardsEmergency;
        } else {
          // if there is less
          this.amountInEmergency += incomeBinsAdjusted[i];
          incomeBinsAdjusted[i] = 0;
        }

        // move money towards fun if needed
        if (funAmount < this.desiredFun) {
          // we need to move money into fun
          let amountToMove = this.desiredFun - funAmount //the amount I want to move
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
        this.amountInSavings += incomeBinsAdjusted[i];
        incomeBinsAdjusted[i] = 0

        // pull from savings if above goal for fun and rainy day
        if (this.amountInSavings > this.savingsGoal) {
          let excessSavings = this.amountInSavings - this.savingsGoal; // the extra money in savings that will be put to other uses

          // if there isn't enough in fun
          if (funAmount < this.desiredFun) {
            // we need to move money into fun
            let amountToMove = this.desiredFun - funAmount //the amount I want to move
            if (amountToMove < excessSavings) {
              // there's more left than it needed to 'have fun'
              funAmount += amountToMove;
              this.amountInSavings -= amountToMove;
              excessSavings -= amountToMove
            } else {
              // use all the rest of the money for fun
              funAmount += excessSavings;
              this.amountInSavings - excessSavings;
              excessSavings = 0;
            }
          }

          // move money towards emergency (currently not used, also may have a bug)
          // if (excessSavings > this.amountTowardsEmergency) {
          //     // if there is more money left than emergency, put the full amount towards emergency
          //     this.amountInEmergency += this.amountTowardsEmergency;
          //     excessSavings -= this.amountTowardsEmergency;
          //     this.amountInSavings -= this.amountInEmergency;
          // } else {
          //     // if there is less
          //     this.amountInEmergency += excessSavings;
          //     this.amountInSavings -= excessSavings;
          //     excessSavings = 0;
          // }
        }
      }
      // move excess in emergency to savings
      if (this.amountInEmergency > this.emergencyGoal) {
        this.amountInSavings += this.amountInEmergency - this.emergencyGoal;
        this.amountInEmergency = this.emergencyGoal;
      }
      this.weeklyStats.push(new WeekStat(this.monthlyMin / 4, funAmount, this.amountInSavings, this.amountInEmergency, savingsDeficit))
    }

    // console.log(this.weeklyStats);
  }
}
