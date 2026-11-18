const mongoose = require('mongoose');

const recintoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    minlength: 5
  },
  direccion: {
    type: String,
    required: true,
    minlength: 10
  },
  localidad: {
    type: String,
    required: true,
    minlength: 3
  },
  aforoMaximo: {
    type: Number,
    required: false
  }
});

module.exports = mongoose.model('recintos', recintoSchema);
