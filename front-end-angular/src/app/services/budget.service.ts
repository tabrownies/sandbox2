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
  amountInSavings = 5000;
  amountInEmergency = 350;
  amountTowardsEmergency = 50;
  amountTowardsSavings = 300;
  monthlyMin = 400;
  emergencyGoal = 1000;
  savingsGoal = 10000;
  desiredFun = 100;

  // ins and outs of money
  expenses: (any)[] = [];
  incomes: (any)[] = [];

  // this months variables
  essentials = 0
  fun = 0
  emergency = 0
  savings = 0

  // future plan
  weeklyStats: WeekStat[] = [];

  // the "date" for calculations

  currentWeek = 10;

  // later add changing date functionality
  constructor() {
    this.calculateBudget();
  }
  addExpense(expense: OneTimeExpense | RegularExpense): void {
    this.expenses.push(expense);
  }
  addIncome(income: OneTimeIncome | RegularIncome): void {
    this.incomes.push(income);
  }
  calculateBudget(): void {
    // reset datamember and prep variables
    this.weeklyStats = [];
    let expenseBins: number[] = [];
    let incomeBins: number[] = [];
    for (let i = 0; i < 48; ++i) {
      expenseBins.push(0);
      incomeBins.push(0);
    }

    for (let i = 0; i < this.incomes.length; i++) {
      if (this.incomes[i]['date'] != null) {
        // this is a one time income
        incomeBins[this.incomes[i].date] += this.incomes[i].amount;
      } else {
        switch (this.incomes[i].frequency) {
          case 'weekly':
            for (let j = this.incomes[i].start; j < 48; j++) {
              incomeBins[j] += this.incomes[i].amount;
            }
            break;
          case 'monthly':
            for (let j = this.incomes[i].start; j < 48; j += 4) {
              incomeBins[j] += this.incomes[i].amount
            }
            break;
          case 'yearly':
            for (let j = this.incomes[i].start; j < 48; j += 48) {
              incomeBins[j] += this.incomes[i].amount
            }
            break;
        }
      }
    }
    for (let i = 0; i < this.expenses.length; i++) {
      if (this.expenses[i]['date'] != null) {
        // this is a one time income
        expenseBins[this.expenses[i].date] += this.expenses[i].amount;
      } else {
        switch (this.expenses[i].frequency) {
          case 'weekly':
            for (let j = this.expenses[i].start; j < 48; j++) {
              expenseBins[j] += this.expenses[i].amount;
            }
            break;
          case 'monthly':
            for (let j = this.expenses[i].start; j < 48; j += 4) {
              expenseBins[j] += this.expenses[i].amount
            }
            break;
          case 'yearly':
            for (let j = this.expenses[i].start; j < 48; j += 48) {
              expenseBins[j] += this.expenses[i].amount
            }
            break;
        }
      }
    }

    let funAmount = 0;
    let savingsDeficit = 0;

    // deep copy expense bins
    let incomeBinsAdjusted = incomeBins.map(value => value);

    // take out mandatory expenses
    for (let i = 0; i < incomeBinsAdjusted.length; ++i) {
      incomeBinsAdjusted[i] -= this.monthlyMin / 4;
    }

    // calculate the amount that needs to be spent each month for the future expenses
    for (let j = 0; j < expenseBins.length; j++) {
      for (let k = 0; k < j; k++) {
        incomeBinsAdjusted[k] -= expenseBins[j] / (j + 1);
      }
    }



    for (let i = 0; i < incomeBinsAdjusted.length; ++i) {
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

    console.log(this.weeklyStats);
  }
}
