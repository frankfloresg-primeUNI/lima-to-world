# Asesor de Región AWS

Herramienta web que recomienda en qué región de AWS publicar un proyecto según **latencia medida en vivo**, **costo mensual de los servicios elegidos (S3 y/o EC2)** y **estabilidad de la conexión (jitter)**. Incluye una calculadora de cuánto costaría tu laptop como servidor EC2. Alojada como sitio web estático en **Amazon S3**.

Proyecto del módulo **Fundamentos de la nube** · AWS re/Start · Frank Flores Gonzales
[LinkedIn](https://www.linkedin.com/in/frank-flores-gonzales) · [GitHub](https://github.com/frankfloresg-primeUNI)

## Cómo funciona

1. El usuario elige su ciudad (y si sus datos deben quedarse en Latinoamérica).
2. Elige los servicios: sitio web en S3, servidor EC2 o ambos, con su tráfico esperado.
3. Elige su prioridad: equilibrado, velocidad o ahorro.
4. La web mide la latencia y el jitter hacia cada región, calcula el costo mensual y da un puntaje:
   `puntaje = peso_velocidad × latencia + peso_costo × costo + peso_estabilidad × jitter` (normalizados).

## Estructura

```JavaScript
├── index.html
├── app.js
├── datos/precios.js        ← precios por región (verifícalos)
├── scripts/latencia_aws.py ← medición desde Python (investigación inicial)
├── politica-bucket.json
└── README.md
```

## Probar en tu PC

Abre `index.html` con doble clic o usa `python -m http.server 8000`.

## Verificar precios

En https://calculator.aws revisa por región: S3 Standard (GB/mes), GET (por 1 000), salida a internet (GB), EC2 t3.micro Linux (hora) y EBS gp3 (GB/mes). Corrige `datos/precios.js`, pon `verificado: true` y la fecha. Completa `mx-central-1`.

## Publicar en Amazon S3 (laboratorio)

1. **S3 → Create bucket.** Nombre único, por ejemplo `asesor-region-aws-frank`.
2. Desmarca **Block all public access** y confirma.
3. **Upload:** `index.html`, `app.js` y la carpeta `datos/` (usa *Add folder*).
4. **Properties → Static website hosting → Enable.** Index document: `index.html`.
5. **Permissions → Bucket policy:** pega `politica-bucket.json` con el nombre de tu bucket.
6. **Properties →** abre el **Bucket website endpoint**.

La política solo permite `s3:GetObject` (leer). Nadie puede escribir ni borrar.

## Mejoras futuras

- CloudFront para HTTPS y caché en ubicaciones de borde.
- Medición automática cada hora con Lambda (módulo Serverless).
