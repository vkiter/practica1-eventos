const express = require('express');
const router = express.Router();
const Evento = require(__dirname + '/../models/evento.js');
const Recinto = require(__dirname + '/../models/recinto.js');

// GET /eventos - Listado de todos los eventos con información de recinto y entradas
router.get('/', async (req, res) => {
  try {
    const eventos = await Evento.find().populate('recinto');
    if (eventos && eventos.length > 0) {
      return res.status(200).send({ ok: true, resultado: eventos });
    } else {
      return res.status(500).send({ ok: false, error: 'No se han encontrado eventos' });
    }
  } catch (error) {
    return res.status(500).send({ ok: false, error: 'No se han encontrado eventos' });
  }
});

// GET /eventos/localidad/:nombre - Eventos en la localidad cuya fecha no haya pasado (antes de /:id)
router.get('/localidad/:nombre', async (req, res) => {
  try {
    const recintos = await Recinto.find({ localidad: req.params.nombre });
    if (!recintos || recintos.length === 0) {
      return res.status(404).send({ ok: false, error: 'No se han encontrado eventos' });
    }

    const recintosIds = recintos.map(r => r._id);
    const eventos = await Evento.find({
      recinto: { $in: recintosIds },
      fecha: { $gte: new Date() }
    }).populate('recinto');

    if (eventos && eventos.length > 0) {
      return res.status(200).send({ ok: true, resultado: eventos });
    } else {
      return res.status(404).send({ ok: false, error: 'No se han encontrado eventos' });
    }
  } catch (error) {
    return res.status(404).send({ ok: false, error: 'No se han encontrado eventos' });
  }
});

// GET /eventos/entradas/:idEvento/:tipoEntrada - Obtiene precio y entradas disponibles (antes de /:id)
router.get('/entradas/:idEvento/:tipoEntrada', async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.idEvento);
    if (!evento) {
      return res.status(404).send({ ok: false, error: `Error obteniendo datos de entrada para evento ${req.params.idEvento}` });
    }

    const entrada = evento.entradas.find(e => e.tipo === req.params.tipoEntrada);
    if (!entrada) {
      return res.status(404).send({ ok: false, error: `Error obteniendo datos de entrada para evento ${req.params.idEvento}` });
    }

    return res.status(200).send({
      ok: true,
      resultado: {
        precio: entrada.precio,
        disponibles: entrada.disponibles
      }
    });
  } catch (error) {
    return res.status(404).send({ ok: false, error: `Error obteniendo datos de entrada para evento ${req.params.idEvento}` });
  }
});

// PUT /eventos/entradas/:idEvento/:tipoEntrada/:cantidad - Resta entradas disponibles (antes de /:id)
router.put('/entradas/:idEvento/:tipoEntrada/:cantidad', async (req, res) => {
  try {
    const cantidad = Number(req.params.cantidad);
    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      return res.status(404).send({ ok: false, error: `Error actualizando entradas del evento ${req.params.idEvento}` });
    }

    const evento = await Evento.findById(req.params.idEvento);
    if (!evento) {
      return res.status(404).send({ ok: false, error: `Error actualizando entradas del evento ${req.params.idEvento}` });
    }

    const entrada = evento.entradas.find(e => e.tipo === req.params.tipoEntrada);
    if (!entrada) {
      return res.status(404).send({ ok: false, error: `Error actualizando entradas del evento ${req.params.idEvento}` });
    }

    if (entrada.disponibles < cantidad) {
      return res.status(404).send({ ok: false, error: `Error actualizando entradas del evento ${req.params.idEvento}` });
    }

    entrada.disponibles -= cantidad;
    await evento.save();

    return res.status(200).send({ ok: true, resultado: evento });
  } catch (error) {
    return res.status(404).send({ ok: false, error: `Error actualizando entradas del evento ${req.params.idEvento}` });
  }
});

// GET /eventos/:id - Obtiene un evento por su id
router.get('/:id', async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id).populate('recinto');
    if (evento) {
      return res.status(200).send({ ok: true, resultado: evento });
    } else {
      return res.status(404).send({ ok: false, error: `Evento ${req.params.id} no encontrado` });
    }
  } catch (error) {
    return res.status(404).send({ ok: false, error: `Evento ${req.params.id} no encontrado` });
  }
});

// POST /eventos - Añade un nuevo evento
router.post('/', async (req, res) => {
  try {
    const nuevoEvento = new Evento(req.body);
    const resultado = await nuevoEvento.save();
    return res.status(201).send({ ok: true, resultado: resultado });
  } catch (error) {
    return res.status(500).send({ ok: false, error: 'Error añadiendo evento' });
  }
});

// PUT /eventos/:id - Actualiza los datos de un evento
router.put('/:id', async (req, res) => {
  try {
    const eventoActualizado = await Evento.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          nombre: req.body.nombre,
          fecha: req.body.fecha,
          recinto: req.body.recinto,
          entradas: req.body.entradas
        }
      },
      { returnDocument: 'after', runValidators: true }
    );
    if (eventoActualizado) {
      return res.status(200).send({ ok: true, resultado: eventoActualizado });
    } else {
      return res.status(404).send({ ok: false, error: `Error actualizando evento ${req.params.id}` });
    }
  } catch (error) {
    return res.status(404).send({ ok: false, error: `Error actualizando evento ${req.params.id}` });
  }
});

// DELETE /eventos/:id - Elimina un evento
router.delete('/:id', async (req, res) => {
  try {
    const eventoEliminado = await Evento.findByIdAndDelete(req.params.id);
    if (eventoEliminado) {
      return res.status(200).send({ ok: true, resultado: eventoEliminado });
    } else {
      return res.status(404).send({ ok: false, error: `Error eliminando evento ${req.params.id}` });
    }
  } catch (error) {
    return res.status(404).send({ ok: false, error: `Error eliminando evento ${req.params.id}` });
  }
});

module.exports = router;
