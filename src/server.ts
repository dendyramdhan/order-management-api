import express from 'express';
import sequelize from './models'; // Import the sequelize instance to ensure it's initialized
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import path from 'path';

const app = express();
app.use(express.json());

// Load the Swagger YAML file
const swaggerDocument = yaml.load(path.join(__dirname, '../docs/swagger.yaml'));

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
