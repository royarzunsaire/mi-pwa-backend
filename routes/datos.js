const express = require('express');
const router = express.Router();
<<<<<<< HEAD
const axios = require('axios');
require('dotenv').config();

// Helper para llamar a Power Automate
const callFlow = async (url, data = null) => {
  try {
    const response = await axios.post(url, data || {}, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
    return response.data;
  } catch (error) {
    console.error('❌ Error en Power Automate:', error.response?.data || error.message);
    throw error;
  }
};

// Función para mapear SharePoint → App
const mapSharePointItem = (item) => {
  return {
    id: item.ID || item.Id,
    nombre: item.nombre || item.Title || '',
    descripcion: item.descripcion || '',
    timestamp: item.timestamp || '',
    client_id: item.client_id || 0,
    created_at: item.Created || '',
    updated_at: item.Modified || item.Created || ''
  };
};
=======
const supabase = require('../supabase');
>>>>>>> ac5afb82baea1153443079899f4f9249f20d3542

// GET - Obtener todos los datos
router.get('/', async (req, res) => {
  try {
<<<<<<< HEAD
    console.log('📥 GET /api/datos - Obteniendo todos los items');

    const result = await callFlow(process.env.FLOW_READ_ALL_URL);
    
    // result es un array directo
    const items = Array.isArray(result) ? result : [];
    const mappedItems = items.map(mapSharePointItem);

    console.log(`✅ ${mappedItems.length} items obtenidos`);

    res.json({
      success: true,
      data: mappedItems
    });

  } catch (error) {
    console.error('❌ Error en GET /:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST - Crear nuevo dato
=======
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
>>>>>>> ac5afb82baea1153443079899f4f9249f20d3542
router.post('/', async (req, res) => {
  try {
    const { nombre, descripcion, timestamp, id: client_id } = req.body;

    // Validación
    if (!nombre || !descripcion) {
<<<<<<< HEAD
      return res.status(400).json({
        success: false,
        error: 'Nombre y descripción son requeridos'
      });
    }

    console.log(`📤 POST /api/datos - Creando: ${nombre}`);

    const payload = {
      nombre,
      descripcion,
      timestamp: timestamp || new Date().toISOString(),
      client_id: client_id || Date.now()
    };

    const result = await callFlow(process.env.FLOW_CREATE_URL, payload);
    const mappedResult = mapSharePointItem(result);

    console.log(`✅ Item creado con ID: ${mappedResult.id}`);

    res.status(201).json({
      success: true,
      data: mappedResult
    });

  } catch (error) {
    console.error('❌ Error en POST /:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
=======
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
>>>>>>> ac5afb82baea1153443079899f4f9249f20d3542
  }
});

// GET - Obtener dato por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
<<<<<<< HEAD

    console.log(`📥 GET /api/datos/${id}`);

    const result = await callFlow(process.env.FLOW_READ_ONE_URL, {
      id: parseInt(id)
    });

    const mappedResult = mapSharePointItem(result);

    console.log(`✅ Item ${id} obtenido`);

    res.json({
      success: true,
      data: mappedResult
    });

  } catch (error) {
    console.error('❌ Error en GET /:id:', error.message);
    res.status(404).json({
      success: false,
      error: 'Dato no encontrado'
    });
=======
    
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
>>>>>>> ac5afb82baea1153443079899f4f9249f20d3542
  }
});

// PUT - Actualizar dato
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

<<<<<<< HEAD
    console.log(`📝 PUT /api/datos/${id}`);

    const payload = {
      id: parseInt(id),
      nombre,
      descripcion
    };

    const result = await callFlow(process.env.FLOW_UPDATE_URL, payload);
    const mappedResult = mapSharePointItem(result);

    console.log(`✅ Item ${id} actualizado`);

    res.json({
      success: true,
      data: mappedResult,
      message: 'Dato actualizado correctamente'
    });

  } catch (error) {
    console.error('❌ Error en PUT /:id:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
=======
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
>>>>>>> ac5afb82baea1153443079899f4f9249f20d3542
  }
});

// DELETE - Eliminar dato
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
<<<<<<< HEAD

    console.log(`🗑️ DELETE /api/datos/${id}`);

    await callFlow(process.env.FLOW_DELETE_URL, {
      id: parseInt(id)
    });

    console.log(`✅ Item ${id} eliminado`);

    res.json({
      success: true,
      message: 'Dato eliminado correctamente'
    });

  } catch (error) {
    console.error('❌ Error en DELETE /:id:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
=======
    
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
>>>>>>> ac5afb82baea1153443079899f4f9249f20d3542
  }
});

module.exports = router;