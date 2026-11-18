const express = require('express');
const router = express.Router();
const Recinto = require(__dirname + '/../models/recinto.js');

// GET /recintos - Obtiene un listado de todos los recintos
router.get('/', async (req, res) => {
  try {
    const recintos = await Recinto.find();
    if (recintos && recintos.length > 0) {
      return res.status(200).send({ ok: true, resultado: recintos });
    } else {
      return res.status(500).send({ ok: false, error: 'No se han encontrado recintos' });
    }
  } catch (error) {
    return res.status(500).send({ ok: false, error: 'No se han encontrado recintos' });
  }
});

// GET /recintos/localidad/:nombre - Obtiene los recintos de una localidad (antes de /:id)
router.get('/localidad/:nombre', async (req, res) => {
  try {
    const recintos = await Recinto.find({ localidad: req.params.nombre });
    if (recintos && recintos.length > 0) {
      return res.status(200).send({ ok: true, resultado: recintos });
    } else {
      return res.status(404).send({ ok: false, error: 'No se han encontrado recintos de la localidad indicada' });
    }
  } catch (error) {
    return res.status(404).send({ ok: false, error: 'No se han encontrado recintos de la localidad indicada' });
  }
});

// GET /recintos/:id - Obtiene el recinto por id
router.get('/:id', async (req, res) => {
  try {
    const recinto = await Recinto.findById(req.params.id);
    if (recinto) {
      return res.status(200).send({ ok: true, resultado: recinto });
    } else {
      return res.status(404).send({ ok: false, error: `Recinto ${req.params.id} no encontrado` });
    }
  } catch (error) {
    return res.status(404).send({ ok: false, error: `Recinto ${req.params.id} no encontrado` });
  }
});

// POST /recintos - Añade un recinto
router.post('/', async (req, res) => {
  try {
    const nuevoRecinto = new Recinto(req.body);
    const resultado = await nuevoRecinto.save();
    return res.status(201).send({ ok: true, resultado: resultado });
  } catch (error) {
    return res.status(500).send({ ok: false, error: 'Error añadiendo recinto' });
  }
});

// DELETE /recintos/:id - Elimina el recinto por id
router.delete('/:id', async (req, res) => {
  try {
    const recintoEliminado = await Recinto.findByIdAndDelete(req.params.id);
    if (recintoEliminado) {
      return res.status(200).send({ ok: true, resultado: recintoEliminado });
    } else {
      return res.status(404).send({ ok: false, error: `Error eliminando recinto ${req.params.id}` });
    }
  } catch (error) {
    return res.status(404).send({ ok: false, error: `Error eliminando recinto ${req.params.id}` });
  }
});

module.exports = router;
