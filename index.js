require('dotenv').config();

const { Pool, Client } = require("pg");
const fs = require('fs');
const stripBomStream = require('strip-bom-stream');
const path = require('path');
const csv = require('fast-csv');
var moment = require('moment');
const {on} = require('events');

const pool = new Pool();

const client = new Client();
client.connect();
client
  .query('SELECT NOW() as now')
  .then(res => console.log(res.rows[0]))
  .catch(e => console.error(e.stack))
  .then(() => client.end());

const file = path.resolve(__dirname, './data/01-Trámites_Tlax_01Marzo_31Mayo2020.txt');
console.log(`Archivo: ${file}`);

const campos = ['folio', 'estatus', 'causa_rechazo', 'movimiento_solicitado',
    'movimiento_definitivo', 'fecha_tramite', 'fecha_recibido_cecyrd',
    'fecha_registrado_cecyrd', 'fecha_rechazado',
    'fecha_cancelado_movimiento_posterior', 'fecha_alta_pe',
    'fecha_afectacion_padron', 'fecha_actualizacion_pe',
    'fecha_reincorporacion_pe', 'fecha_exitoso', 'fecha_lote_produccion',
    'fecha_listo_reimpresion', 'fecha_cpv_creada', 'fecha_cpv_registrada_mac',
    'fecha_cpv_disponible', 'fecha_cpv_entregada', 'fecha_afectacion_ln'];

const date = "DD/MM/YYYY hh:mm:ss AM";
const f = (fecha="") => moment(fecha, date).isValid() ? moment(fecha, date).format() : null;

fs.createReadStream(file, {encoding: 'utf8'})
    .pipe(csv.parse({headers: campos, delimiter: '|'}))
    .on('error', error => console.error(error))
    .on('data', fila => {
        fila.fecha_tramite = f(fila.fecha_tramite);
        fila.fecha_recibido_cecyrd = f(fila.fecha_recibido_cecyrd);
        fila.fecha_registrado_cecyrd = f(fila.fecha_registrado_cecyrd);
        fila.fecha_rechazado = f(fila.fecha_rechazado);
        fila.fecha_cancelado_movimiento_posterior = f(fila.fecha_cancelado_movimiento_posterior);
        fila.fecha_alta_pe = f(fila.fecha_alta_pe);
        fila.fecha_afectacion_padron = f(fila.fecha_afectacion_padron);
        fila.fecha_actualizacion_pe = f(fila.fecha_actualizacion_pe);
        fila.fecha_reincorporacion_pe = f(fila.fecha_reincorporacion_pe);
        fila.fecha_exitoso = f(fila.fecha_exitoso);
        fila.fecha_lote_produccion = f(fila.fecha_lote_produccion);
        fila.fecha_listo_reimpresion = f(fila.fecha_listo_reimpresion);
        fila.fecha_cpv_creada = f(fila.fecha_cpv_creada);
        fila.fecha_cpv_registrada_mac = f(fila.fecha_cpv_registrada_mac);
        fila.fecha_cpv_disponible = f(fila.fecha_cpv_disponible);
        fila.fecha_cpv_entregada = f(fila.fecha_cpv_entregada);
        fila.fecha_afectacion_ln =  f(fila.fecha_afectacion_ln);
        fila.distrito = fila.folio.slice(5,6);
        fila.mac = fila.folio.slice(2,8);
        console.log(fila.fecha_cpv_disponible ? moment.duration(moment(fila.fecha_cpv_disponible).diff(moment(fila.fecha_tramite))).asSeconds() : null);
    })
    .on('end', rowCount => console.log(`Parsed ${rowCount} rows`));

