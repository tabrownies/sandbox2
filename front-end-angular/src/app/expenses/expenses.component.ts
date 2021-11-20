import { Component, OnInit } from '@angular/core';
// import { format } from 'path';

import { BudgetService } from '../services/budget.service';

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

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css']
})
export class ExpensesComponent implements OnInit {

  weeklyStats: any[] = [];
  expenses: any[] = [];
  incomes: any[] = [];
  incomeBins: any[] = [];
  expenseBins: any[] = [];
  monthlyIncomeBins: any[] = [];
  monthlyExpenseBins: any[] = [];
  monthlySmoothedExpenseBins: any[] = [];

  future_expense_strings: string[] = [];
  // past_expense_strings: string[] = [];
  future_income_strings: string[] = [];
  // past_income_strings: string[] = [];

  expenseBinsSmoothed: number[] = [];


  constructor(public budgetService: BudgetService) { }

  ngOnInit(): void {
    this.calculate();
  }

  addExampleExpense(){
    console.log(this.budgetService.expenses)
    this.budgetService.expenses.push(new RegularExpense('House Payment', 1000, 'yearly', 5));
    // this.budgetService.calculateBudget()
    this.budgetService.calculateMonth();
    this.calculate();
    console.log(this.budgetService.expenses);
  }
  addExampleIncome(){
    this.budgetService.addIncome(new OneTimeIncome('Money Ball',1000000,13));
    this.budgetService.calculateMonth();
    this.calculate();
  }

  formatDate(weekNum: number) {
    let month = Math.floor(weekNum / 4);
    let weekInMonth = weekNum % 4;
    let monthString = '';
    let weekOrderString = ''
    switch (month + 1) {
      case 1:
        monthString = 'January'
        break;
      case 2:
        monthString = 'February'
        break;
      case 3:
        monthString = 'March'
        break;
      case 4:
        monthString = 'April'
        break;
      case 5:
        monthString = 'May'
        break;
      case 6:
        monthString = 'June'
        break;
      case 7:
        monthString = 'July'
        break;
      case 8:
        monthString = 'August'
        break;
      case 9:
        monthString = 'September'
        break;
      case 10:
        monthString = 'October'
        break;
      case 11:
        monthString = 'November'
        break;
      case 12:
        monthString = 'December'
        break;
    }
    switch (weekInMonth) {
      case 0:
        weekOrderString = 'first';
        break;
      case 1:
        weekOrderString = 'second';
        break;
      case 2:
        weekOrderString = 'third';
        break;
      case 3:
        weekOrderString = 'fourth';
        break;
    }
    return `the ${weekOrderString} week of ${monthString}`;
  }
  calculate() {
    this.weeklyStats = this.budgetService.weeklyStats;
    this.expenses = this.budgetService.expenses;
    console.log('in calculate this.expenses', this.expenses)
    this.incomes = this.budgetService.incomes;
    this.incomeBins = this.budgetService.incomeBins;
    this.expenseBins = this.budgetService.expenseBins;
    this.expenseBinsSmoothed = this.budgetService.expenseBinsSmoothed;
    
    this.monthlyExpenseBins = []
    this.monthlyIncomeBins = []
    this.monthlySmoothedExpenseBins = []
    this.future_expense_strings = [];
    this.future_income_strings = [];
    for (let i = 0; i < this.expenseBins.length; i += 4) {
      let monthExpenseTotal = 0;
      let monthIncomeTotal = 0;
      let monthSmoothedExpenseTotal = 0
      for (let j = 0; j < 4; ++j) {
        monthExpenseTotal += this.expenseBins[i + j];
        monthIncomeTotal += this.incomeBins[i + j];
        monthSmoothedExpenseTotal += this.expenseBinsSmoothed[i + j];
        console.log(this.expenseBinsSmoothed[i+j])
      }
      console.log('smoothed')
      this.monthlyExpenseBins.push(monthExpenseTotal);
      this.monthlyIncomeBins.push(monthIncomeTotal);
      this.monthlySmoothedExpenseBins.push(monthSmoothedExpenseTotal);
    }

    // console.log('now',this.future_expense_strings)
    let expenseString = '';
    for (let expense of this.expenses) {
      if (expense['date'] != null) {
        expenseString = `${expense.title}: ${expense.amount} on ${this.formatDate(expense.date)}`;
      }
      else {
        expenseString = `${expense.title}: ${expense.amount} ${expense.frequency} starting on ${this.formatDate(expense.start)}`
      }
      console.log(expenseString)
      this.future_expense_strings.push(expenseString);
    }
    // console.log(this.future_expense_strings)

    let incomeString = '';
    for (let income of this.incomes) {
      if (income['date'] != null) {
        incomeString = `${income.title}: ${income.amount} on ${this.formatDate(income.date)}`;
      }
      else {
        incomeString = `${income.title}: ${income.amount} ${income.frequency} starting on ${this.formatDate(income.start)}`
      }
      this.future_income_strings.push(incomeString);
    }

  }

}
