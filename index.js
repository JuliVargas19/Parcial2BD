const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/restaurantes', require('./rutas/restauranteRoutes'));
app.use('/api/empleados', require('./rutas/empleadoRoutes'));
app.use('/api/productos', require('./rutas/productoRoutes'));
app.use('/api/pedidos', require('./rutas/pedidoRoutes'));
app.use('/api/detalles', require('./rutass/detallePedidoRoutes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo por el puerto ${PORT}`));
