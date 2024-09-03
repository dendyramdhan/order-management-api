"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("./config/container"); // Import DI container configuration
const express_1 = __importDefault(require("express"));
const logger_1 = __importDefault(require("./utils/logger"));
const models_1 = __importDefault(require("./models"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Load the Swagger YAML file
const swaggerDocument = yamljs_1.default.load(path_1.default.join(__dirname, '../docs/swagger.yaml'));
// Swagger setup
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
app.use('/products', productRoutes_1.default);
app.use('/orders', orderRoutes_1.default);
const PORT = process.env.PORT || 3000;
models_1.default.sync({ force: false }).then(() => {
    app.listen(PORT, () => {
        logger_1.default.info(`Server is running on port ${PORT}`);
    });
});
