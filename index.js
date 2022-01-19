require('dotenv').config();
const { Pool } = require('pg');
const Cursor = require('pg-cursor');
const fs = require('fs');
const stripBomStream = require('strip-bom-stream');


const path = require('path');
const csv = require('fast-csv');
var moment = require('moment');
const {on} = require('events');

const file = path.resolve(__dirname, './data/02-Trámites_Tlax_01agosto_31octubre.txt');

const pool = new Pool();
pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
  });

const campos = ['folio', 'estatus', 'causa_rechazo', 'movimiento_solicitado',
    'movimiento_definitivo', 'fecha_tramite', 'fecha_recibido_cecyrd',
    'fecha_registrado_cecyrd', 'fecha_rechazado',
    'fecha_cancelado_movimiento_posterior', 'fecha_alta_pe',
    'fecha_afectacion_padron', 'fecha_actualizacion_pe',
    'fecha_reincorporacion_pe', 'fecha_exitoso', 'fecha_lote_produccion',
    'fecha_listo_reimpresion', 'fecha_cpv_creada', 'fecha_cpv_registrada_mac',
    'fecha_cpv_disponible', 'fecha_cpv_entregada', 'fecha_afectacion_ln'];

const date = "DD/MM/YYYY hh:mm:ss AM";
const f = (fecha="") => moment(fecha, date).isValid() ? `'${moment(fecha, date).format()}'` : null;

var linea = (fila) => (`
              INSERT INTO tramites VALUES (
                '${fila.folio}',
                '${fila.estatus}',
                '${fila.causa_rechazo}',
                '${fila.movimiento_solicitado}',
                '${fila.movimiento_definitivo}',
                ${fila.fecha_tramite},
                ${fila.fecha_recibido_cecyrd},
                ${fila.fecha_registrado_cecyrd},
                ${fila.fecha_rechazado},
                ${fila.fecha_cancelado_movimiento_posterior},
                ${fila.fecha_alta_pe},
                ${fila.fecha_afectacion_padron},
                ${fila.fecha_actualizacion_pe},
                ${fila.fecha_reincorporacion_pe},
                ${fila.fecha_exitoso},
                ${fila.fecha_lote_produccion},
                ${fila.fecha_listo_reimpresion},
                ${fila.fecha_cpv_creada},
                ${fila.fecha_cpv_registrada_mac},
                ${fila.fecha_cpv_disponible},
                ${fila.fecha_cpv_entregada},
                ${fila.fecha_afectacion_ln},
                ${fila.distrito},
                '${fila.mac}',
                ${fila.tramo_disponible},
                ${fila.tramo_entrega},
                ${fila.tramo_exitoso}
                ) ON CONFLICT (folio) DO UPDATE SET
                "estatus" = '${fila.estatus}',
                "causa_rechazo" = '${fila.causa_rechazo}',
                "movimiento_solicitado" = '${fila.movimiento_solicitado}',
                "movimiento_definitivo" = '${fila.movimiento_definitivo}',
                "fecha_tramite" = ${fila.fecha_tramite},
                "fecha_recibido_cecyrd" = ${fila.fecha_recibido_cecyrd},
                "fecha_registrado_cecyrd" = ${fila.fecha_registrado_cecyrd},
                "fecha_rechazado" = ${fila.fecha_rechazado},
                "fecha_cancelado_movimiento_posterior" = ${fila.fecha_cancelado_movimiento_posterior},
                "fecha_alta_pe" = ${fila.fecha_alta_pe},
                "fecha_afectacion_padron" = ${fila.fecha_afectacion_padron},
                "fecha_actualizacion_pe" = ${fila.fecha_actualizacion_pe},
                "fecha_reincorporacion_pe" = ${fila.fecha_reincorporacion_pe},
                "fecha_exitoso" = ${fila.fecha_exitoso},
                "fecha_lote_produccion" = ${fila.fecha_lote_produccion},
                "fecha_listo_reimpresion" = ${fila.fecha_listo_reimpresion},
                "fecha_cpv_creada" = ${fila.fecha_cpv_creada},
                "fecha_cpv_registrada_mac" = ${fila.fecha_cpv_registrada_mac},
                "fecha_cpv_disponible" = ${fila.fecha_cpv_disponible},
                "fecha_cpv_entregada" = ${fila.fecha_cpv_entregada},
                "fecha_afectacion_ln" = ${fila.fecha_afectacion_ln},
                "distrito" = ${fila.distrito},
                "mac" = '${fila.mac}',
                "tramo_disponible" = ${fila.tramo_disponible},
                "tramo_entrega" = ${fila.tramo_entrega},
                "tramo_exitoso" = ${fila.tramo_exitoso};`);

const diferencia = (fecha1, fecha2) => fecha1 ? `'${moment(fecha1, date).diff(moment(fecha2, date), 'seconds')}'` : null;

fs.createReadStream(file, {encoding: 'utf8'})
    .pipe(csv.parse({headers: campos, delimiter: '|'}))

    .on('error', error => console.error(error))
    .on('data', fila => {
        fila.tramo_disponible = diferencia(fila.fecha_cpv_disponible, fila.fecha_tramite);
        fila.tramo_entrega = diferencia(fila.fecha_cpv_entregada, fila.fecha_tramite);
        fila.tramo_exitoso = diferencia(fila.fecha_exitoso, fila.fecha_tramite);
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

        client.query(linea(fila))
            .then()
            .catch(e => console.error(e.stack));
    })
    .on('end', rowCount => {
        console.log(`Parsed ${rowCount} rows`);
        client.end();
    });