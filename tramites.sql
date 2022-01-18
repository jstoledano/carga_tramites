DROP TABLE IF EXISTS public.tramites;

CREATE TABLE public.tramites
(
    folio character varying(13) COLLATE pg_catalog."default" NOT NULL,
    estatus text COLLATE pg_catalog."default",
    causa_rechazo text COLLATE pg_catalog."default",
    movimiento_solicitado text COLLATE pg_catalog."default",
    movimiento_definitivo text COLLATE pg_catalog."default",
    fecha_tramite timestamp with time zone,
    fecha_recibido_cecyrd timestamp with time zone,
    fecha_registrado_cecyrd timestamp with time zone,
    fecha_rechazado timestamp with time zone,
    fecha_cancelado_movimiento_posterior timestamp with time zone,
    fecha_alta_pe timestamp with time zone,
    fecha_afectacion_padron timestamp with time zone,
    fecha_actualizacion_pe timestamp with time zone,
    fecha_reincorporacion_pe timestamp with time zone,
    fecha_exitoso timestamp with time zone,
    fecha_lote_produccion timestamp with time zone,
    fecha_listo_reimpresion timestamp with time zone,
    fecha_cpv_creada timestamp with time zone,
    fecha_cpv_registrada_mac timestamp with time zone,
    fecha_cpv_disponible timestamp with time zone,
    fecha_cpv_entregada timestamp with time zone,
    fecha_afectacion_ln timestamp with time zone,
    distrito smallint NOT NULL,
    mac character varying(6) COLLATE pg_catalog."default" NOT NULL,
    tramo_disponible interval,
    tramo_entrega interval,
    tramo_exitoso interval,
    CONSTRAINT tramites_pkey PRIMARY KEY (folio),
    CONSTRAINT tramites_distrito_check CHECK (distrito >= 0)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.tramites
    OWNER to javier;
-- Index: tramites_folio_ac564880_like

DROP INDEX IF EXISTS public.tramites_folio_ac564880_like;

CREATE INDEX tramites_folio_ac564880_like
    ON public.tramites USING btree
    (folio COLLATE pg_catalog."default" varchar_pattern_ops ASC NULLS LAST)
    TABLESPACE pg_default;
