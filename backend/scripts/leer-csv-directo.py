import csv
import json

# Leer el CSV original con todos los datos
csv_file = '../../listado-personal.csv'

empleados = []
with open(csv_file, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        empleados.append(row)

print(f"Total empleados en CSV: {len(empleados)}")
print(f"Primeros 3: {empleados[:3]}")
