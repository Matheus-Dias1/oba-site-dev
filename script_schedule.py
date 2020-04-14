#14:00, 14:30, 15:00, 15:30, 16:00, 16:30,17:00,17:30,18:00

import calendar
import datetime
from datetime import date

now = datetime.datetime.now()
year = now.year
month = now.month

offset = int(input('Você deseja gerar a lista para qual mês?\n\n1 - Este mês\n2 - Proximo mês\n')) - 1
timeDeliveries = input('\n\nQual será o horário das entregas?\nSepare por vírgulas e no formato HH:MM.\nEx: 14:00, 14:30, 15:00, 16:00.\n\n').split(',')

satDeliveries = int(input('\n\nEntregas sábado?\n\n1 - Não\n2 - Sim\n')) - 1
sunDeliveries = int(input('Entregas domingo?\n\n1 - Não\n2 - Sim\n')) - 1
holidaysS = input('Digite, separando por vírgulas, os dias desse mês além dos finais de semana que não terão entrega: ').split(',')

holidays = []
for day in holidaysS:
    holidays.append(int(day.strip()))



if (offset and month == 12):
    year+=1
    month = 1
elif (offset):
    month+=1

days = list(range(1,calendar.monthrange(year, month)[1]+1))
deliveryDays = []

f = open('inserts.txt', 'a')

f.write('INSERT INTO schedule (id_purchase, date, time)\nVALUES')

for day in days:
    weekday = date(year,month,day).isoweekday()
    if (not satDeliveries and weekday == 6):
        continue
    if (not sunDeliveries and weekday == 7):
        continue
    if (day in holidays):
        continue
    for time in timeDeliveries:
        f.write('\n    (NULL, "'
                + str(year)
                + '-'
                + str(month)
                + '-'
                + str(day)
                + '", "'
                + time
                + ':00")'
        )
        if (day == days[-1] and time == timeDeliveries[-1]):
            f.write(';')
        else:
            f.write(',')


#14:00,14:30,15:00,15:30,16:00,16:30,17:00,17:30,18:00
