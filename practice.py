# goals
rainy_goal = 1000
savings_goal = 10000

# current amounts
fun_amount = 0
savings_amount = 5000
rainy_amount = 350

# monthy allowances
budget = 0
fun = 0

# types of regularness
frequencies = ['daily','weekly','monthly','yearly']
one_time_expense_types = ['fun','budget','emergency']
scheduled_expense_types = ['definite', 'variable']

#types of expenses and income
class Expense():
    # if date is in future this a future scheduled expense
    # if date is in past this is an expense that has occured
    def __init__(self, amount, date, expense_type):
        self.amount = amount
        self.date = date
        self.expense_type = expense_type

# class One_Time_Expense(Expense):
#     def __init__(self, amount, date):
#         super().__init__(self,amount,date)

class Repeat_Expense(Expense):
    def __init__(self, amount, date, expense_type, frequency):
        super().__init__(amount, date, expense_type)
        if frequency not in frequencies:
            raise ValueError("frequency not known")
        self.frequency = frequency

# class Scheduled_Expense(Expense):
#     def __init__(self, amount, date):
#         super().__init__(amount, date)

# class Rainy_Day(One_Time):
#     pass

# class Fun(One_Time):
#     pass

class Income():
    pass

class Scheduled_Income(Income):
    pass

class One_Time_Income(Income):
    pass

class Repeat_Income(Scheduled_Income):
    pass


