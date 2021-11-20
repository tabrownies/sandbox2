# for simplification I'm going a year out and planning for each quarter month

# types of regularness
expense_types = ['fun','budget','emergency']

#types of expenses and income
class Expense():
    # if date is in future this a future scheduled expense
    # if date is in past this is an expense that has occured
    def __init__(self, title, amount, date, expense_type):
        self.title = title
        self.amount = amount
        self.date = date
        self.expense_type = expense_type

class Income():
    # if the date is in the future this a scheduled event
    def __init__(self, title, amount, date):
        self.title = title
        self.amount = amount
        self.date = date

# fake data
expenses = []
incomes = []


for i in range(12):
    # rent (monthly constant)
    expenses.append(Expense('rent',400,i,'budget'))
    expenses.append(Expense('car payment',300,i,'budget'))
    # monthly paycheck
    incomes.append(Income('TA job',800,i))
# summer sales
incomes.append(Income('Summer Sales',30000,7))
# tuition (twice a year)
expenses.append(Expense('tuition', 5000,3,'budget'))
expenses.append(Expense('tuition', 5000,9,'budget'))



# goals
rainy_goal = 1000
savings_goal = 10000

#amount to be put aside
toward_rainy = 50
towards_savings = 300
monthly_min = 400

# current amounts
fun_amount = 0
savings_amount = 5000
rainy_amount = 350

# monthy allowances
budget = 0
fun = 0

# algorithm testing
def calculate_yearly_plan():
    # prep varables
    savings = [0]*12
    rainy_day = [0]*12

    monthly_expenses = [0]*12
    # print(monthly_expenses)
    monthly_incomes = [0]*12

    # initialize values
    savings[0] = savings_amount
    rainy_day[0] = rainy_amount

    savings_deficit = 0


    # prep expenses
    for expense in expenses:
        monthly_expenses[expense.date] += expense.amount
    for income in incomes:
        monthly_incomes[income.date]+=income.amount
    
    # prep variables for manipulation
    monthly_incomes_left = monthly_incomes

    for i, income in enumerate(monthly_incomes):
        monthly_incomes[i] -= monthly_min
        # check if there is enough money and pull from savings
        monthly_incomes[i]-=toward_rainy

    # print(monthly_expenses)
    for i, expense in enumerate(monthly_expenses):
        for j in range(i):
            monthly_incomes_left[j] -= expense/(i+1)
        

    # print((sum(monthly_incomes_left)+savings_amount))










calculate_yearly_plan()




