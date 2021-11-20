# for simplification I'm going a year out and planning for each quarter month

# types of regularness
frequencies = ['monthly','yearly']
one_time_expense_types = ['fun','budget','emergency']
scheduled_expense_types = ['definite', 'variable']

#types of expenses and income
class Expense():
    # if date is in future this a future scheduled expense
    # if date is in past this is an expense that has occured
    def __init__(self, title, amount, date, expense_type):
        self.title = title
        self.amount = amount
        self.date = date
        self.expense_type = expense_type

class Repeat_Expense(Expense):
    def __init__(self, title, amount, expense_type, frequency):
        super().__init__(title, amount, 0, expense_type)
        # if frequency not in frequencies:
        #     raise ValueError("frequency not known")
        self.frequency = frequency

class Income():
    # if the date is in the future this a scheduled event
    def __init__(self, title, amount, date):
        self.title = title
        self.amount = amount
        self.date = date

class Repeat_Income(Income):
    def __init__(self, title, amount, frequency):
        super().__init__(title, amount, 0)
        self.frequency = frequency

# fake data
expenses = []
income = []

# rent (monthly constant)
expenses.append(Repeat_Expense('rent',400,'definite','monthly'))
# food (weekly variable)
expenses.append(Repeat_Expense('food',200,'variable','monthly'))
# date night (one time fun)
# expenses.append(Expense('date', 30,4,'fun'))
# transportation (monthly variable)
expenses.append(Repeat_Expense('transportation',150,'variable','monthly'))
# tuition (twice a year)
expenses.append(Expense('tuition', 5000,3,'budget'))
expenses.append(Expense('tuition', 5000,9,'budget'))

# monthly paycheck
income.append(Repeat_Income('TA job',800,'monthly'))
# summer sales
income.append(Income('Summer Sales',30000,7))

# goals
rainy_goal = 1000
savings_goal = 10000

#amount to be put aside
toward_rainy = 50
towards_savings = 300

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
    monthly_income = [0]*12

    # initialize values
    savings[0] = savings_amount
    rainy_day[0] = rainy_amount

    for expense in expenses:
        # filter expenses
        print(expense.expense_type)
        if expense.expense_type != 'monthly':
            monthly_expenses[expense.date]+=expense.amount
        else:
            for i, value in enumerate(monthly_expenses):
                monthly_expenses[i] += expense.amount
    print(monthly_expenses)









calculate_yearly_plan()




