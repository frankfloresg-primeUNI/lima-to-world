"""Mide la latencia desde tu PC hacia las regiones de AWS.

Uso (desde la carpeta del proyecto):
    python scripts/latencia_aws.py manana
    python scripts/latencia_aws.py noche

Genera datos/latencia_<etiqueta>.csv (lo lee la web) y datos/latencia_<etiqueta>.png.
"""
import csv
import os
import statistics
import sys
import time

import boto3
import matplotlib.pyplot as plt
import requests

etiqueta = sys.argv[1] if len(sys.argv) > 1 else "manana"
os.makedirs("datos", exist_ok=True)
archivo_csv = f"datos/latencia_{etiqueta}.csv"
archivo_png = f"datos/latencia_{etiqueta}.png"

# Lista de regiones de AWS (no necesita cuenta ni credenciales)
regiones = boto3.session.Session().get_available_regions("dynamodb")
resultados = {}

for region in regiones:
    url = f"https://dynamodb.{region}.amazonaws.com/ping"
    sesion = requests.Session()
    tiempos = []
    try:
        sesion.get(url, timeout=3)  # calentamiento: abre la conexión
        for _ in range(5):
            inicio = time.perf_counter()
            sesion.get(url, timeout=3)
            tiempos.append((time.perf_counter() - inicio) * 1000)
    except requests.RequestException:
        print(f"{region:<16} sin respuesta")
        continue
    resultados[region] = statistics.median(tiempos)
    print(f"{region:<16} {resultados[region]:>7.0f} ms")

# Guardar CSV
with open(archivo_csv, "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["region", "latencia_ms"])
    for region, ms in sorted(resultados.items(), key=lambda x: x[1]):
        writer.writerow([region, round(ms, 1)])

# Gráfico de las 10 regiones más cercanas
top = sorted(resultados.items(), key=lambda x: x[1])[:10]
nombres, valores = zip(*top)
plt.figure(figsize=(8, 5))
plt.barh(nombres[::-1], valores[::-1])
plt.xlabel("Latencia desde mi PC (ms)")
plt.title(f"¿Qué región de AWS está más cerca de mí? ({etiqueta})")
plt.tight_layout()
plt.savefig(archivo_png, dpi=150)
print(f"Listo: {archivo_csv} y {archivo_png}")
