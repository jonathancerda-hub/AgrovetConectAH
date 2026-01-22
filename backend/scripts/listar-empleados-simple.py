import json

with open(r'c:\Users\jcerda\Desktop\reac\datos-procesados.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Solo imprimir códigos y cargos de forma simple
count = 0
for emp in data['empleados']:
    codigo = emp.get('codigo', '')
    cargo = emp.get('cargo', '')
    if cargo and codigo:
        count += 1
        # Imprimir solo los primeros 50
        if count <= 50:
            # Formato: codigo|cargo
            print(f"{codigo}|{cargo}")
