const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// GET - Obtener todos los datos
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('datos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ success: true, data: data || [] });
  } catch (error) {
    console.error('Error obteniendo datos:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST - Crear nuevo dato (sincronización)
router.post('/', async (req, res) => {
  try {
    const { nombre, descripcion, timestamp, id: client_id } = req.body;

    // Validación
    if (!nombre || !descripcion) {
      return res.status(400).json({ 
        success: false, 
        error: 'Nombre y descripción son requeridos' 
      });
    }

    // Insertar en Supabase
    const { data, error } = await supabase
      .from('datos')
      .insert([
        { 
          nombre, 
          descripcion, 
          timestamp: timestamp || new Date().toISOString(), 
          client_id 
        }
      ])
      .select()
      .single();

    if (error) throw error;

    console.log(`✓ Dato sincronizado: ${nombre} (ID: ${data.id})`);

    res.status(201).json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Error creando dato:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET - Obtener dato por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('datos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ 
          success: false, 
          error: 'Dato no encontrado' 
        });
      }
      throw error;
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error obteniendo dato:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT - Actualizar dato
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    const { data, error } = await supabase
      .from('datos')
      .update({ nombre, descripcion })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({ 
      success: true, 
      data,
      message: 'Dato actualizado correctamente' 
    });
  } catch (error) {
    console.error('Error actualizando dato:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE - Eliminar dato
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('datos')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ 
      success: true, 
      message: 'Dato eliminado correctamente' 
    });
  } catch (error) {
    console.error('Error eliminando dato:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;