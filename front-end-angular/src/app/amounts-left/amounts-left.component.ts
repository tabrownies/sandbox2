import { Component, OnInit } from '@angular/core';

import {BudgetService} from '../services/budget.service'

@Component({
  selector: 'app-amounts-left',
  templateUrl: './amounts-left.component.html',
  styleUrls: ['./amounts-left.component.css']
})
export class AmountsLeftComponent implements OnInit {

  constructor(public budgetService:BudgetService) { }

  essentials = 0;
  fun = 0;
  emergency = 0;
  ngOnInit(): void {
    this.getTotals();
  }

  getTotals():void{
    this.essentials = this.budgetService.essentials;
    this.fun = this.budgetService.fun;
    this.emergency = this.budgetService.amountInEmergency;
  }

}
