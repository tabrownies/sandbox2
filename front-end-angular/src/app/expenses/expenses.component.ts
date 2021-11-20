import { Component, OnInit } from '@angular/core';
// import { format } from 'path';

import { BudgetService } from '../services/budget.service';

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
    this.incomes = this.budgetService.incomes;
    this.incomeBins = this.budgetService.incomeBins;
    this.expenseBins = this.budgetService.expenseBins;
    this.expenseBinsSmoothed = this.budgetService.expenseBinsSmoothed;

    for (let i = 0; i < this.expenseBins.length; i += 4) {
      let monthExpenseTotal = 0;
      let monthIncomeTotal = 0;
      let monthSmoothedExpenseTotal = 0
      for (let j = 0; j < 4; ++j) {
        monthExpenseTotal += this.expenseBins[i + j];
        monthIncomeTotal += this.incomeBins[i + j];
        monthSmoothedExpenseTotal += this.expenseBinsSmoothed[i + j];
      }
      this.monthlyExpenseBins.push(monthExpenseTotal);
      this.monthlyIncomeBins.push(monthIncomeTotal);
      this.monthlySmoothedExpenseBins.push(monthSmoothedExpenseTotal);
    }


    let expenseString = '';
    for (let expense of this.expenses) {
      if (expense['date'] != null) {
        expenseString = `${expense.title}: ${expense.amount} on ${this.formatDate(expense.date)}`;
      }
      else {
        expenseString = `${expense.title}: ${expense.amount} ${expense.frequency} starting on ${this.formatDate(expense.start)}`
      }
      this.future_expense_strings.push(expenseString);
    }

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
