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


  adjustAmount=0;

  adjust(fromWhere:string = 'essentials'):void{
    switch(fromWhere){
      case 'essentials':
        this.budgetService.adjust_amount(this.adjustAmount,0,0);
        break;
      case 'fun':
        this.budgetService.adjust_amount(0,this.adjustAmount,0);
        break;
      case 'emergency':
        this.budgetService.adjust_amount(0,0,this.adjustAmount);
        break;
    }
    this.adjustAmount = 0;
    this.getTotals();
  }

  ngOnInit(): void {
    this.getTotals();
  }

  getTotals():void{
    this.essentials = this.budgetService.essentials;
    this.fun = this.budgetService.fun;
    this.emergency = this.budgetService.amountInEmergency;
  }
  

}
