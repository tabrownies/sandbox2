import { Component, OnInit } from '@angular/core';
import { BudgetService } from '../services/budget.service';

@Component({
  selector: 'app-variable-display',
  templateUrl: './variable-display.component.html',
  styleUrls: ['./variable-display.component.css']
})
export class VariableDisplayComponent implements OnInit {

  constructor(public budgetService:BudgetService) { }

  amountInSavings:number = 0;
  towardsSavings=0;
  towardsEmergency =0;
  desiredFun = 0;
  amountInEmergency = 0;
  //time stamps
  currentMonth = '';
  currentWeek = '';

  ngOnInit(): void {
    this.calculate()
  }
  calculate(){
    this.amountInSavings = this.budgetService.amountInSavings;
    this.towardsEmergency = this.budgetService.amountTowardsEmergency;
    this.towardsSavings = this.budgetService.amountTowardsSavings;
    this.desiredFun = this.budgetService.desiredFun;
    this.amountInEmergency = this.budgetService.amountInEmergency;
    let month = Math.floor(this.budgetService.currentWeek / 4);
    let weekInMonth = this.budgetService.currentWeek % 4;
    switch (month + 1) {
      case 1:
        this.currentMonth = 'January'
        break;
      case 2:
        this.currentMonth = 'February'
        break;
      case 3:
        this.currentMonth = 'March'
        break;
      case 4:
        this.currentMonth = 'April'
        break;
      case 5:
        this.currentMonth = 'May'
        break;
      case 6:
        this.currentMonth = 'June'
        break;
      case 7:
        this.currentMonth = 'July'
        break;
      case 8:
        this.currentMonth = 'August'
        break;
      case 9:
        this.currentMonth = 'September'
        break;
      case 10:
        this.currentMonth = 'October'
        break;
      case 11:
        this.currentMonth = 'November'
        break;
      case 12:
        this.currentMonth = 'December'
        break;
    }
    switch (weekInMonth) {
      case 0:
        this.currentWeek = 'First';
        break;
      case 1:
        this.currentWeek = 'Second';
        break;
      case 2:
        this.currentWeek = 'Third';
        break;
      case 3:
        this.currentWeek = 'Fourth';
        break;
    }
  }

}
