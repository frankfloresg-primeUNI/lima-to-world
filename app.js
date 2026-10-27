"use strict";

// ======================= DATOS =======================

// Ubicación aproximada por ciudad: AWS no publica la ubicación exacta de sus centros de datos.
const REGIONES = [
  { codigo: "sa-east-1",      nombre: "São Paulo",           pais: "Brasil",          lat: -23.55, lon: -46.63,  latam: true },
  { codigo: "mx-central-1",   nombre: "Querétaro",           pais: "México",          lat: 20.59,  lon: -100.39, latam: true },
  { codigo: "us-east-1",      nombre: "Norte de Virginia",   pais: "EE. UU.",         lat: 39.04,  lon: -77.49 },
  { codigo: "us-east-2",      nombre: "Ohio",                pais: "EE. UU.",         lat: 39.96,  lon: -83.00 },
  { codigo: "us-west-1",      nombre: "Norte de California", pais: "EE. UU.",         lat: 37.35,  lon: -121.96 },
  { codigo: "us-west-2",      nombre: "Oregón",              pais: "EE. UU.",         lat: 45.84,  lon: -119.70 },
  { codigo: "ca-central-1",   nombre: "Montreal",            pais: "Canadá",          lat: 45.50,  lon: -73.57 },
  { codigo: "ca-west-1",      nombre: "Calgary",             pais: "Canadá",          lat: 51.05,  lon: -114.07 },
  { codigo: "eu-west-1",      nombre: "Irlanda",             pais: "Irlanda",         lat: 53.35,  lon: -6.26 },
  { codigo: "eu-west-2",      nombre: "Londres",             pais: "Reino Unido",     lat: 51.51,  lon: -0.13 },
  { codigo: "eu-west-3",      nombre: "París",               pais: "Francia",         lat: 48.86,  lon: 2.35 },
  { codigo: "eu-central-1",   nombre: "Fráncfort",           pais: "Alemania",        lat: 50.11,  lon: 8.68 },
  { codigo: "eu-central-2",   nombre: "Zúrich",              pais: "Suiza",           lat: 47.38,  lon: 8.54 },
  { codigo: "eu-north-1",     nombre: "Estocolmo",           pais: "Suecia",          lat: 59.33,  lon: 18.07 },
  { codigo: "eu-south-1",     nombre: "Milán",               pais: "Italia",          lat: 45.46,  lon: 9.19 },
  { codigo: "eu-south-2",     nombre: "Aragón",              pais: "España",          lat: 41.65,  lon: -0.89 },
  { codigo: "il-central-1",   nombre: "Tel Aviv",            pais: "Israel",          lat: 32.09,  lon: 34.78 },
  { codigo: "me-central-1",   nombre: "EAU",                 pais: "Emiratos Árabes", lat: 25.20,  lon: 55.27 },
  { codigo: "me-south-1",     nombre: "Baréin",              pais: "Baréin",          lat: 26.07,  lon: 50.56 },
  { codigo: "af-south-1",     nombre: "Ciudad del Cabo",     pais: "Sudáfrica",       lat: -33.92, lon: 18.42 },
  { codigo: "ap-south-1",     nombre: "Mumbai",              pais: "India",           lat: 19.08,  lon: 72.88 },
  { codigo: "ap-south-2",     nombre: "Hyderabad",           pais: "India",           lat: 17.39,  lon: 78.49 },
  { codigo: "ap-east-1",      nombre: "Hong Kong",           pais: "Hong Kong",       lat: 22.32,  lon: 114.17 },
  { codigo: "ap-east-2",      nombre: "Taipéi",              pais: "Taiwán",          lat: 25.03,  lon: 121.57 },
  { codigo: "ap-northeast-1", nombre: "Tokio",               pais: "Japón",           lat: 35.68,  lon: 139.69 },
  { codigo: "ap-northeast-2", nombre: "Seúl",                pais: "Corea del Sur",   lat: 37.57,  lon: 126.98 },
  { codigo: "ap-northeast-3", nombre: "Osaka",               pais: "Japón",           lat: 34.69,  lon: 135.50 },
  { codigo: "ap-southeast-1", nombre: "Singapur",            pais: "Singapur",        lat: 1.35,   lon: 103.82 },
  { codigo: "ap-southeast-2", nombre: "Sídney",              pais: "Australia",       lat: -33.87, lon: 151.21 },
  { codigo: "ap-southeast-3", nombre: "Yakarta",             pais: "Indonesia",       lat: -6.21,  lon: 106.85 },
  { codigo: "ap-southeast-4", nombre: "Melbourne",           pais: "Australia",       lat: -37.81, lon: 144.96 },
  { codigo: "ap-southeast-5", nombre: "Kuala Lumpur",        pais: "Malasia",         lat: 3.14,   lon: 101.69 },
  { codigo: "ap-southeast-7", nombre: "Bangkok",             pais: "Tailandia",       lat: 13.76,  lon: 100.50 },
];

const ORIGENES = {
  lima:        { nombre: "Lima, Perú",              lat: -12.05, lon: -77.04 },
  arequipa:    { nombre: "Arequipa, Perú",          lat: -16.41, lon: -71.54 },
  trujillo:    { nombre: "Trujillo, Perú",          lat: -8.11,  lon: -79.03 },
  cusco:       { nombre: "Cusco, Perú",             lat: -13.53, lon: -71.97 },
  piura:       { nombre: "Piura, Perú",             lat: -5.19,  lon: -80.63 },
  bogota:      { nombre: "Bogotá, Colombia",        lat: 4.71,   lon: -74.07 },
  quito:       { nombre: "Quito, Ecuador",          lat: -0.18,  lon: -78.47 },
  santiago:    { nombre: "Santiago, Chile",         lat: -33.45, lon: -70.67 },
  buenosaires: { nombre: "Buenos Aires, Argentina", lat: -34.60, lon: -58.38 },
  cdmx:        { nombre: "Ciudad de México",        lat: 19.43,  lon: -99.13 },
  madrid:      { nombre: "Madrid, España",          lat: 40.42,  lon: -3.70 },
};

// Instancias EC2. Precio referencial on-demand, Linux, us-east-1.
// En otras regiones se estima con la proporción del precio de t3.micro de esa región.
const INSTANCIAS = [
  { tipo: "t3.micro",     vcpu: 2,  ram: 1,   hora: 0.0104 },
  { tipo: "t3.small",     vcpu: 2,  ram: 2,   hora: 0.0208 },
  { tipo: "t3.medium",    vcpu: 2,  ram: 4,   hora: 0.0416 },
  { tipo: "t3.large",     vcpu: 2,  ram: 8,   hora: 0.0832 },
  { tipo: "c6i.large",    vcpu: 2,  ram: 4,   hora: 0.085 },
  { tipo: "t3.xlarge",    vcpu: 4,  ram: 16,  hora: 0.1664 },
  { tipo: "c6i.xlarge",   vcpu: 4,  ram: 8,   hora: 0.17 },
  { tipo: "t3.2xlarge",   vcpu: 8,  ram: 32,  hora: 0.3328 },
  { tipo: "c6i.2xlarge",  vcpu: 8,  ram: 16,  hora: 0.34 },
  { tipo: "c6i.4xlarge",  vcpu: 16, ram: 32,  hora: 0.68 },
  { tipo: "m6i.4xlarge",  vcpu: 16, ram: 64,  hora: 0.768 },
  { tipo: "c6i.8xlarge",  vcpu: 32, ram: 64,  hora: 1.36 },
  { tipo: "m6i.8xlarge",  vcpu: 32, ram: 128, hora: 1.536 },
  { tipo: "m6i.16xlarge", vcpu: 64, ram: 256, hora: 3.072 },
];
const T3MICRO_BASE = 0.0104;

// Pesos del puntaje: latencia, costo y estabilidad (jitter).
const PRIORIDADES = {
  equilibrado: { latencia: 0.4, costo: 0.4, estabilidad: 0.2 },
  velocidad:   { latencia: 0.6, costo: 0.2, estabilidad: 0.2 },
  ahorro:      { latencia: 0.2, costo: 0.6, estabilidad: 0.2 },
};

const MUESTRAS = 5;              // mediciones por región, después del calentamiento
const TIMEOUT_MS = 3000;
const VEL_FIBRA_KM_POR_MS = 200;
const HORAS_MES = 730;
const DIAS_MES = 30.4;

const estado = { medicion: {}, analizando: false };

// ======================= UTILIDADES =======================

const $ = (selector) => document.querySelector(selector);
const num = (id) => Number($(id).value) || 0;

function mediana(valores) {
  const o = [...valores].sort((a, b) => a - b);
  const m = Math.floor(o.length / 2);
  return o.length % 2 ? o[m] : (o[m - 1] + o[m]) / 2;
}

// Jitter: variación promedio entre mediciones consecutivas.
function jitter(valores) {
  if (valores.length < 2) return 0;
  let suma = 0;
  for (let i = 1; i < valores.length; i++) suma += Math.abs(valores[i] - valores[i - 1]);
  return suma / (valores.length - 1);
}

function distanciaKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const rad = (g) => (g * Math.PI) / 180;
  const dLat = rad(lat2 - lat1);
  const dLon = rad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

const usd = (v) => `$${v < 1 ? v.toFixed(3) : v.toFixed(2)}`;
const soles = (v) => `S/ ${v.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function infoRegion(codigo) {
  return REGIONES.find((r) => r.codigo === codigo) || { codigo, nombre: codigo, pais: "" };
}

function preciosDe(codigo) {
  return (window.PRECIOS && window.PRECIOS.regiones && window.PRECIOS.regiones[codigo]) || null;
}

function normalizar(valor, lista) {
  const min = Math.min(...lista);
  const max = Math.max(...lista);
  return max === min ? 0 : (valor - min) / (max - min);
}

function instancia(tipo) {
  return INSTANCIAS.find((i) => i.tipo === tipo) || INSTANCIAS[0];
}

// Precio por hora de una instancia en una región (estimado a partir de t3.micro).
function precioHoraEc2(tipo, codigo) {
  const p = preciosDe(codigo);
  if (!p || typeof p.ec2_t3micro_hora !== "number") return null;
  return instancia(tipo).hora * (p.ec2_t3micro_hora / T3MICRO_BASE);
}

// ======================= MEDICIÓN =======================

async function pingUna(url) {
  const control = new AbortController();
  const temporizador = setTimeout(() => control.abort(), TIMEOUT_MS);
  const inicio = performance.now();
  try {
    await fetch(`${url}?x=${Math.random().toString(36).slice(2)}`, { mode: "no-cors", cache: "no-store", signal: control.signal });
    return performance.now() - inicio;
  } finally {
    clearTimeout(temporizador);
  }
}

async function medirRegion(codigo) {
  const url = `https://dynamodb.${codigo}.amazonaws.com/ping`;
  try {
    await pingUna(url); // calentamiento: descarta DNS y apertura de conexión
    const tiempos = [];
    for (let i = 0; i < MUESTRAS; i++) tiempos.push(await pingUna(url));
    return { ms: mediana(tiempos), jitter: jitter(tiempos) };
  } catch {
    return null;
  }
}

// ======================= ASESOR =======================

function leerFormulario() {
  return {
    origen: $("#origen").value,
    soloLatam: $("#solo-latam").checked,
    usaS3: $("#usa-s3").checked,
    usaEc2: $("#usa-ec2").checked,
    s3Gb: num("#s3-gb"),
    objetosVisita: num("#objetos-visita"),
    ec2Tipo: $("#ec2-tipo").value,
    ec2Horas: Math.min(24, num("#ec2-horas")),
    ec2Disco: num("#ec2-disco"),
    visitas: num("#visitas"),
    mbVisita: num("#mb-visita"),
    tipoCambio: num("#tipo-cambio"),
    prioridad: $("#prioridad").value,
  };
}

function costoRegion(codigo, f) {
  const p = preciosDe(codigo);
  if (!p) return null;
  const requeridos = ["salida_internet_gb"];
  if (f.usaS3) requeridos.push("s3_gb_mes", "s3_get_por_1000");
  if (f.usaEc2) requeridos.push("ec2_t3micro_hora", "ebs_gp3_gb_mes");
  if (requeridos.some((c) => typeof p[c] !== "number")) return null;

  const almacenamiento = f.usaS3 ? f.s3Gb * p.s3_gb_mes : 0;
  const peticiones = f.usaS3 ? ((f.visitas * f.objetosVisita) / 1000) * p.s3_get_por_1000 : 0;
  const transferencia = ((f.visitas * f.mbVisita) / 1024) * p.salida_internet_gb;
  const computo = f.usaEc2 ? precioHoraEc2(f.ec2Tipo, codigo) * f.ec2Horas * DIAS_MES : 0;
  const disco = f.usaEc2 ? f.ec2Disco * p.ebs_gp3_gb_mes : 0;
  return { total: almacenamiento + peticiones + transferencia + computo + disco };
}

function regionesCandidatas(f) {
  const conPrecios = Object.keys((window.PRECIOS && window.PRECIOS.regiones) || {});
  return conPrecios.filter((c) => !f.soloLatam || infoRegion(c).latam);
}

async function analizar() {
  if (estado.analizando) return;
  const f = leerFormulario();
  if (!f.usaS3 && !f.usaEc2) {
    $("#estado").textContent = "Elige al menos un servicio en el paso 02.";
    return;
  }

  estado.analizando = true;
  estado.medicion = {};
  const boton = $("#btn-analizar");
  boton.disabled = true;
  $("#estado").classList.add("pulso");

  // Primero las regiones con precio (para recomendar rápido); luego el resto para el ranking.
  const candidatas = regionesCandidatas(f);
  const orden = [...candidatas, ...REGIONES.map((r) => r.codigo).filter((c) => !candidatas.includes(c))];

  for (let i = 0; i < orden.length; i++) {
    const codigo = orden[i];
    $("#estado").textContent = `Midiendo ${infoRegion(codigo).nombre} (${codigo})… ${i + 1}/${orden.length}`;
    estado.medicion[codigo] = await medirRegion(codigo);
    $("#barra").style.width = `${((i + 1) / orden.length) * 100}%`;

    if (i === candidatas.length - 1) {
      renderResultado();
      $("#resultado").scrollIntoView({ behavior: "smooth" });
    }
    if (i >= candidatas.length) renderRanking();
  }

  const respondieron = Object.values(estado.medicion).filter(Boolean).length;
  $("#estado").classList.remove("pulso");
  $("#estado").textContent = `Análisis completo: ${respondieron} de ${orden.length} regiones respondieron.`;
  boton.disabled = false;
  boton.textContent = "Volver a analizar";
  estado.analizando = false;
  renderResultado();
}

function renderResultado() {
  const f = leerFormulario();
  const tc = f.tipoCambio;
  const origen = ORIGENES[f.origen];
  const candidatas = regionesCandidatas(f);
  $("#resultado").hidden = false;

  const filas = candidatas
    .map((codigo) => ({ codigo, ...infoRegion(codigo), med: estado.medicion[codigo], costo: costoRegion(codigo, f) }))
    .filter((c) => c.med && c.costo);
  const sinPrecio = candidatas.filter((c) => !costoRegion(c, f));

  if (!filas.length) {
    $("#ganador").innerHTML = '<p>No hay regiones con medición y precios completos. Revisa tu conexión o completa <code>datos/precios.js</code>.</p>';
    $("#tabla-candidatos").innerHTML = "";
    return;
  }

  // Puntaje: 0 = peor, 100 = mejor, según los pesos de la prioridad elegida.
  const pesos = PRIORIDADES[f.prioridad];
  const lats = filas.map((c) => c.med.ms);
  const costos = filas.map((c) => c.costo.total);
  const jits = filas.map((c) => c.med.jitter);
  filas.forEach((c) => {
    const malo = pesos.latencia * normalizar(c.med.ms, lats)
      + pesos.costo * normalizar(c.costo.total, costos)
      + pesos.estabilidad * normalizar(c.med.jitter, jits);
    c.puntaje = Math.round(100 * (1 - malo));
  });
  filas.sort((a, b) => b.puntaje - a.puntaje || a.med.ms - b.med.ms);

  const top = filas[0];
  const masRapida = filas.reduce((a, b) => (a.med.ms <= b.med.ms ? a : b));
  const masBarata = filas.reduce((a, b) =>
    (a.costo.total < b.costo.total || (a.costo.total === b.costo.total && a.med.ms <= b.med.ms) ? a : b));

  const razones = [];
  razones.push(top.codigo === masRapida.codigo
    ? `Es la más rápida desde ${origen.nombre}.`
    : `Está a ${Math.round(top.med.ms - masRapida.med.ms)} ms de la más rápida (${masRapida.codigo}).`);
  const difCosto = (top.costo.total - masBarata.costo.total) * tc;
  razones.push(top.codigo === masBarata.codigo || difCosto < 0.01
    ? "Es la opción más barata para tus servicios."
    : `Cuesta ${soles(difCosto)} más al mes que la más barata (${masBarata.codigo}), a cambio de ${Math.round(masBarata.med.ms - top.med.ms)} ms menos de latencia.`);
  razones.push(top.med.jitter <= 5
    ? `Conexión estable: varía solo ${top.med.jitter.toFixed(1)} ms entre mediciones.`
    : `Ojo: la conexión varía ${top.med.jitter.toFixed(1)} ms entre mediciones. Vuelve a analizar en otro horario.`);

  $("#resumen-analisis").textContent =
    `Desde ${origen.nombre} · ${[f.usaS3 && "S3", f.usaEc2 && `EC2 ${f.ec2Tipo}`].filter(Boolean).join(" + ")} · ` +
    `${f.visitas.toLocaleString("es-PE")} visitas/mes · prioridad: ${f.prioridad}`;

  $("#ganador").innerHTML = `
    <h3>Región recomendada</h3>
    <p class="region-codigo">${top.codigo}</p>
    <p class="region-nombre">${top.nombre}, ${top.pais}</p>
    <div class="kpis">
      <div class="kpi"><div class="v">${top.puntaje}/100</div><div class="k">Puntaje</div></div>
      <div class="kpi"><div class="v">${top.med.ms.toFixed(0)} ms</div><div class="k">Latencia</div></div>
      <div class="kpi"><div class="v">${soles(top.costo.total * tc)}</div><div class="k">Al mes (${usd(top.costo.total)})</div></div>
      <div class="kpi"><div class="v">±${top.med.jitter.toFixed(1)} ms</div><div class="k">Estabilidad</div></div>
    </div>
    <ul class="porque">${razones.map((r) => `<li>${r}</li>`).join("")}</ul>`;

  $("#tabla-candidatos").innerHTML = filas.map((c, i) => `
    <tr class="${i === 0 ? "top" : ""}">
      <td class="num">${i + 1}</td>
      <td class="region-celda"><strong>${c.codigo}</strong><span>${c.nombre}</span></td>
      <td class="num">${c.med.ms.toFixed(0)} ms</td>
      <td class="num">±${c.med.jitter.toFixed(1)} ms</td>
      <td class="num">${soles(c.costo.total * tc)}<span style="display:block;color:var(--muted)">${usd(c.costo.total)}</span></td>
      <td class="num">${c.puntaje}<div class="bar" style="width:${Math.max(2, c.puntaje)}%"></div></td>
    </tr>`).join("");

  const notas = [];
  if (sinPrecio.length) notas.push(`Sin precios cargados: ${sinPrecio.join(", ")}. Complétalos en <code>datos/precios.js</code>.`);
  if (f.usaEc2) notas.push("El precio de EC2 fuera de t3.micro se estima por región.");
  const verificados = filas.every((c) => preciosDe(c.codigo).verificado);
  notas.push(verificados
    ? `Precios verificados el ${window.PRECIOS.fecha_consulta}.`
    : '<span class="badge warn">precios referenciales</span> Sin capa gratuita ni impuestos.');
  $("#nota-precios").innerHTML = notas.join(" ");

  renderResponsabilidades(f);
  renderOnPrem(top, tc);
  renderRanking();
}

function renderResponsabilidades(f) {
  const tareas = [
    ["Cuenta", "Activa una alerta de presupuesto en AWS Budgets antes de crear recursos."],
    ["Cuenta", "Activa MFA en el usuario raíz y trabaja con un usuario IAM."],
  ];
  if (f.usaS3) {
    tareas.push(["S3", "Permite solo lectura pública (s3:GetObject) y solo si la web es pública."]);
    tareas.push(["S3", "No subas datos personales, contraseñas ni claves de acceso al bucket."]);
  }
  if (f.usaEc2) {
    tareas.push(["EC2", "Actualiza el sistema operativo: en EC2 los parches te tocan a ti, no a AWS."]);
    tareas.push(["EC2", "Abre solo los puertos necesarios en el grupo de seguridad (SSH solo desde tu IP)."]);
    tareas.push(["EC2", "Programa snapshots del disco para tener respaldo."]);
    if (f.ec2Horas < 24) tareas.push(["EC2", `Apaga la instancia fuera de tus ${f.ec2Horas} horas de uso (o automatízalo).`]);
  }
  $("#responsabilidades").innerHTML = tareas.map(([s, t]) => `<li><span class="serv">[${s}]</span>${t}</li>`).join("");
}

function renderOnPrem(top, tc) {
  if (!top) return;
  const mensualPropio = num("#onprem-precio") / Math.max(1, num("#onprem-vida")) + num("#onprem-operacion");
  const nube = top.costo.total * tc;
  const dif = mensualPropio - nube;
  $("#onprem-resultado").innerHTML =
    `Servidor propio: <strong>${soles(mensualPropio)}/mes</strong> + ${soles(num("#onprem-precio"))} por adelantado. ` +
    `AWS en ${top.codigo}: <strong>${soles(nube)}/mes</strong>, sin inversión inicial. ` +
    (dif >= 0 ? `Ahorras ${soles(dif)} al mes en la nube.` : `El servidor propio sale ${soles(-dif)} más barato al mes, pero lo pagas por adelantado y lo mantienes tú.`);
}

function renderRanking() {
  const origen = ORIGENES[$("#origen").value];
  const filas = Object.entries(estado.medicion)
    .filter(([, m]) => m)
    .map(([codigo, m]) => {
      const r = infoRegion(codigo);
      const km = r.lat === undefined ? null : distanciaKm(origen.lat, origen.lon, r.lat, r.lon);
      return { ...r, ms: m.ms, km, minimo: km === null ? null : (2 * km) / VEL_FIBRA_KM_POR_MS };
    })
    .sort((a, b) => a.ms - b.ms);
  const maximo = Math.max(1, ...filas.map((f) => f.ms));

  $("#detalle-ranking summary").textContent = `Ranking completo de regiones (${filas.length})`;
  $("#tabla-ranking").innerHTML = filas.map((f, i) => {
    let eficiencia = "—";
    if (f.minimo !== null) {
      const p = Math.round((f.minimo / f.ms) * 100);
      eficiencia = p > 100 ? '<span class="badge warn">revisa tu ciudad</span>' : `${p}%`;
    }
    return `<tr>
      <td class="num">${i + 1}</td>
      <td class="region-celda"><strong>${f.codigo}</strong><span>${f.nombre}, ${f.pais}</span></td>
      <td class="num">${f.ms.toFixed(0)} ms<div class="bar" style="width:${(f.ms / maximo) * 100}%"></div></td>
      <td class="num">${f.km === null ? "—" : `${Math.round(f.km).toLocaleString("es-PE")} km`}</td>
      <td class="num">${eficiencia}</td>
    </tr>`;
  }).join("");
}

function renderPesos() {
  const p = PRIORIDADES[$("#prioridad").value];
  $("#pesos").textContent = `Puntaje = ${p.latencia * 100}% velocidad + ${p.costo * 100}% costo + ${p.estabilidad * 100}% estabilidad de la conexión.`;
}

// ======================= TU PC EN LA NUBE =======================

function detectarMiPc() {
  const hilos = navigator.hardwareConcurrency || null;
  const ram = navigator.deviceMemory || null;
  const conexion = navigator.connection || null;

  if (hilos) $("#pc-hilos").value = hilos;
  if (ram && ram < 8) $("#pc-ram").value = ram; // los navegadores reportan 8 como máximo

  const chips = [
    hilos ? `CPU: ${hilos} hilos` : "CPU: no detectada",
    ram ? `RAM: ${ram >= 8 ? "8 GB o más" : `${ram} GB`}` : "RAM: no detectada (ajústala)",
    conexion && conexion.downlink ? `Red: ~${conexion.downlink} Mbps` : null,
  ].filter(Boolean);
  $("#pc-detectado").innerHTML = chips.map((c) => `<span class="chip">${c}</span>`).join("");
}

function calcularMiPcEnLaNube() {
  const hilos = Math.max(1, num("#pc-hilos"));
  const ram = Math.max(1, num("#pc-ram"));
  const disco = num("#pc-disco");
  const horas = Math.min(24, num("#pc-horas"));
  const dias = Math.min(31, num("#pc-dias"));
  const region = $("#pc-region").value;
  const tc = num("#tipo-cambio");
  const laptop = num("#pc-laptop");
  const p = preciosDe(region);
  const destino = $("#pc-resultado");
  destino.hidden = false;

  if (!p || typeof p.ec2_t3micro_hora !== "number" || typeof p.ebs_gp3_gb_mes !== "number") {
    destino.innerHTML = `<div class="panel"><p>Faltan precios de EC2 o EBS para ${region} en <code>datos/precios.js</code>.</p></div>`;
    return;
  }

  // La instancia más barata que iguala o supera tu CPU y tu RAM.
  const opciones = INSTANCIAS.filter((i) => i.vcpu >= hilos && i.ram >= ram);
  const inst = opciones.length
    ? opciones.reduce((a, b) => (a.hora <= b.hora ? a : b))
    : INSTANCIAS[INSTANCIAS.length - 1];

  const hora = precioHoraEc2(inst.tipo, region);
  const computoMes = hora * horas * dias;
  const discoMes = disco * p.ebs_gp3_gb_mes;
  const totalMes = computoMes + discoMes;
  const total247 = hora * HORAS_MES + discoMes;
  const meses = totalMes > 0 ? (laptop / (totalMes * tc)) : 0;

  const notas = [
    `El disco (${soles(discoMes * tc)}/mes) se cobra aunque apagues la instancia.`,
    "Apagarla cuando no la usas es lo que más ahorra.",
  ];
  if (inst.tipo.startsWith("t3")) notas.push("Las t3 rinden a ráfagas: van bien para uso ligero; para carga pesada continua, usa la familia c6i.");
  if (!opciones.length) notas.push("Tu equipo supera a las instancias de esta lista: se muestra la más grande.");

  destino.innerHTML = `
    <div class="panel ganador">
      <h3>Tu PC en AWS (${region})</h3>
      <p class="grande">${inst.tipo}</p>
      <p class="region-nombre">${inst.vcpu} vCPU · ${inst.ram} GiB RAM · ${disco} GB de disco</p>
      <div class="kpis">
        <div class="kpi"><div class="v">${usd(hora)}</div><div class="k">Por hora</div></div>
        <div class="kpi"><div class="v">${soles(totalMes * tc)}</div><div class="k">Al mes con tu uso (${horas} h × ${dias} días)</div></div>
        <div class="kpi"><div class="v">${soles(total247 * tc)}</div><div class="k">Al mes encendida 24/7</div></div>
        <div class="kpi"><div class="v">${meses >= 1 ? `${meses.toFixed(1)} meses` : "< 1 mes"}</div><div class="k">De nube, con lo que costó tu laptop</div></div>
      </div>
      <ul class="porque">${notas.map((n) => `<li>${n}</li>`).join("")}</ul>
      <p class="nota">Precios referenciales on-demand, Linux, sin impuestos. El precio por región es estimado.</p>
    </div>`;
}

// ======================= INICIO =======================

document.addEventListener("DOMContentLoaded", () => {
  $("#origen").innerHTML = Object.entries(ORIGENES).map(([k, o]) => `<option value="${k}">${o.nombre}</option>`).join("");
  $("#ec2-tipo").innerHTML = [...INSTANCIAS].sort((a, b) => a.hora - b.hora)
    .map((i) => `<option value="${i.tipo}">${i.tipo} · ${i.vcpu} vCPU · ${i.ram} GiB</option>`).join("");

  const regionesEc2 = Object.keys((window.PRECIOS && window.PRECIOS.regiones) || {})
    .filter((c) => typeof preciosDe(c).ec2_t3micro_hora === "number");
  $("#pc-region").innerHTML = regionesEc2
    .map((c) => `<option value="${c}" ${c === "us-east-1" ? "selected" : ""}>${c} · ${infoRegion(c).nombre}</option>`).join("");

  $("#btn-analizar").addEventListener("click", analizar);
  $("#btn-pc").addEventListener("click", calcularMiPcEnLaNube);
  $("#prioridad").addEventListener("change", renderPesos);

  // Si ya se midió, recalcula costos y puntaje al cambiar datos (sin volver a medir).
  document.querySelectorAll("#asesor input, #asesor select, #resultado input").forEach((el) => {
    el.addEventListener("input", () => {
      if (Object.keys(estado.medicion).length && !estado.analizando) renderResultado();
    });
  });
  $("#origen").addEventListener("change", () => { if (Object.keys(estado.medicion).length) renderRanking(); });
  document.querySelectorAll("#mi-pc input, #mi-pc select").forEach((el) => {
    el.addEventListener("input", () => { if (!$("#pc-resultado").hidden) calcularMiPcEnLaNube(); });
  });

  if (!window.PRECIOS) $("#estado").textContent = "No se cargó datos/precios.js: revisa que la carpeta datos esté junto a index.html.";
  renderPesos();
  detectarMiPc();
});
