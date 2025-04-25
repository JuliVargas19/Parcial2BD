const express = require('express');
const pool = require('./bd');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/restaurantes', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM restaurante');
      res.json(result.rows);  
    } catch (err) {
      console.error('Error al obtener restaurantes', err);
      res.status(500).json({ error: 'Error al obtener restaurantes' });
    }
  });
  
  app.get('/api/restaurantes/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query('SELECT * FROM restaurante WHERE id_rest = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Restaurante no encontrado' });
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error('Error al obtener el restaurante', err);
      res.status(500).json({ error: 'Error al obtener el restaurante' });
    }
  });
  
  app.post('/api/restaurantes', async (req, res) => {
    const { nombre, ciudad, direccion, fecha_apertura } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO restaurante (nombre, ciudad, direccion, fecha_apertura) VALUES ($1, $2, $3, $4) RETURNING *',
        [nombre, ciudad, direccion, fecha_apertura]
      );
      res.status(201).json(result.rows[0]);  
    } catch (err) {
      console.error('Error al crear el restaurante', err);
      res.status(500).json({ error: 'Error al crear el restaurante' });
    }
  });
  
  app.put('/api/restaurantes/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, ciudad, direccion, fecha_apertura } = req.body;
    try {
      const result = await pool.query(
        'UPDATE restaurante SET nombre = $1, ciudad = $2, direccion = $3, fecha_apertura = $4 WHERE id_rest = $5 RETURNING *',
        [nombre, ciudad, direccion, fecha_apertura, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Restaurante no encontrado' });
      }
      res.json(result.rows[0]);  
    } catch (err) {
      console.error('Error al actualizar el restaurante', err);
      res.status(500).json({ error: 'Error al actualizar el restaurante' });
    }
  });
  
  app.delete('/api/restaurantes/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM restaurante WHERE id_rest = $1', [id]);
    res.json({ message: 'Restaurante eliminado' });
  });
  
  app.get('/api/empleados', async (req, res) => {
    const result = await pool.query('SELECT * FROM empleado');
    res.json(result.rows);
  });
  
  app.post('/api/empleados', async (req, res) => {
    const { nombre, rol, id_rest } = req.body;
    const result = await pool.query(
      'INSERT INTO empleado (nombre, rol, id_rest) VALUES ($1, $2, $3) RETURNING *',
      [nombre, rol, id_rest]
    );
    res.status(201).json(result.rows[0]);
  });
  
  app.get('/api/empleados/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query('SELECT * FROM empleado WHERE id_empleado = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Empleado no encontrado' });
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error('Error al obtener el empleado', err);
      res.status(500).json({ error: 'Error al obtener el empleado' });
    }
  });
  
  app.delete('/api/empleados/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM empleado WHERE id_empleado = $1', [id]);
    res.json({ message: 'El empleado ha sido eliminado' });
  });

  app.get('/api/productos', async (req, res) => {
    const result = await pool.query('SELECT * FROM producto');
    res.json(result.rows);
  });

 app.post('/api/productos', async (req, res) => {
  const { nombre, precio } = req.body;

  if (!nombre || !precio) {
    return res.status(400).json({ error: 'Nombre y precio son requeridos' });
  }

  if (isNaN(precio)) {
    return res.status(400).json({ error: 'El precio debe ser un número válido' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO producto (nombre, precio) VALUES ($1, $2) RETURNING *',
      [nombre, precio]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al insertar producto:', error);
    res.status(500).json({ error: 'Error al insertar el producto en la base de datos' });
  }
});

  
  app.put('/api/productos/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, precio } = req.body;
    const result = await pool.query(
      'UPDATE producto SET nombre = $1, precio = $2 WHERE id_prod = $3 RETURNING *',
      [nombre, precio, id]
    );
    res.json(result.rows[0]);
  });
  
  app.delete('/api/productos/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM producto WHERE id_prod = $1', [id]);
    res.json({ message: 'El product fue eliminado' });
  });
  
  app.get('/api/pedidos', async (req, res) => {
    const result = await pool.query('SELECT * FROM pedido');
    res.json(result.rows);
  });
  
  app.post('/api/pedidos', async (req, res) => {
    const { fecha, id_rest, total } = req.body;
    const result = await pool.query(
      'INSERT INTO pedido (fecha, id_rest, total) VALUES ($1, $2, $3) RETURNING *',
      [fecha, id_rest, total]
    );
    res.status(201).json(result.rows[0]);
  });
  
  app.put('/api/pedidos/:id', async (req, res) => {
    const { id } = req.params;
    const { fecha, id_rest, total } = req.body;
    const result = await pool.query(
      'UPDATE pedido SET fecha = $1, id_rest = $2, total = $3 WHERE id_pedido = $4 RETURNING *',
      [fecha, id_rest, total, id]
    );
    res.json(result.rows[0]);
  });
  
  app.delete('/api/pedidos/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM pedido WHERE id_pedido = $1', [id]);
    res.json({ message: 'Pedido eliminado exitosamente' });
  });
  
  app.get('/api/detalles', async (req, res) => {
    const result = await pool.query('SELECT * FROM detalle_pedido');
    res.json(result.rows);
  });
  
  app.post('/api/detalles', async (req, res) => {
    const { id_pedido, id_prod, cantidad, subtotal } = req.body;
    const result = await pool.query(
      'INSERT INTO detalle_pedido (id_pedido, id_prod, cantidad, subtotal) VALUES ($1, $2, $3, $4) RETURNING *',
      [id_pedido, id_prod, cantidad, subtotal]
    );
    res.status(201).json(result.rows[0]);
  });
  
  app.put('/api/detalles/:id', async (req, res) => {
    const { id } = req.params;
    const { id_pedido, id_prod, cantidad, subtotal } = req.body;
    const result = await pool.query(
      'UPDATE detalle_pedido SET id_pedido = $1, id_prod = $2, cantidad = $3, subtotal = $4 WHERE id_detalle = $5 RETURNING *',
      [id_pedido, id_prod, cantidad, subtotal, id]
    );
    res.json(result.rows[0]);
  });
  
  app.delete('/api/detalles/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM detalle_pedido WHERE id_detalle = $1', [id]);
    res.json({ message: 'Detalle del pedido eliminado' });
  });
  
  
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });