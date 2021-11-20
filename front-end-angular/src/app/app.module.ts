import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AmountsLeftComponent } from './amounts-left/amounts-left.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { VariableDisplayComponent } from './variable-display/variable-display.component';

@NgModule({
  declarations: [
    AppComponent,
    AmountsLeftComponent,
    ExpensesComponent,
    VariableDisplayComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
