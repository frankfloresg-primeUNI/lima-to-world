// Precios on-demand en USD por región.
// Los valores con verificado: false son REFERENCIALES: compruébalos en https://calculator.aws,
// corrígelos si cambiaron y pon verificado: true. Usa null si no tienes el dato.
window.PRECIOS = {
  fecha_consulta: "pendiente",
  regiones: {
    "sa-east-1": {
      s3_gb_mes: 0.0405,         // S3 Standard, por GB al mes
      s3_get_por_1000: 0.00056,  // solicitudes GET, por cada 1 000
      salida_internet_gb: 0.15,  // transferencia de salida a internet, por GB
      ec2_t3micro_hora: 0.0168,  // EC2 t3.micro Linux, por hora
      ebs_gp3_gb_mes: 0.152,     // disco EBS gp3, por GB al mes
      verificado: false,
    },
    "us-east-1": {
      s3_gb_mes: 0.023,
      s3_get_por_1000: 0.0004,
      salida_internet_gb: 0.09,
      ec2_t3micro_hora: 0.0104,
      ebs_gp3_gb_mes: 0.08,
      verificado: false,
    },
    "us-east-2": {
      s3_gb_mes: 0.023,
      s3_get_por_1000: 0.0004,
      salida_internet_gb: 0.09,
      ec2_t3micro_hora: 0.0104,
      ebs_gp3_gb_mes: 0.08,
      verificado: false,
    },
    "us-west-1": {
      s3_gb_mes: 0.026,
      s3_get_por_1000: 0.00044,
      salida_internet_gb: 0.09,
      ec2_t3micro_hora: 0.0124,
      ebs_gp3_gb_mes: 0.096,
      verificado: false,
    },
    "mx-central-1": {
      s3_gb_mes: null,
      s3_get_por_1000: null,
      salida_internet_gb: null,
      ec2_t3micro_hora: null,
      ebs_gp3_gb_mes: null,
      verificado: false,
    },
  },
};
