import { Component, OnInit } from '@angular/core';

import {BudgetService} from '../services/budget.service'

@Component({
  selector: 'app-amounts-left',
  templateUrl: './amounts-left.component.html',
  styleUrls: ['./amounts-left.component.css']
})
export class AmountsLeftComponent implements OnInit {

  constructor(public budgetService:BudgetService) { }

  ngOnInit(): void {
    
  }

}
