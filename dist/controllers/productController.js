"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductsController = void 0;
const tsyringe_1 = require("tsyringe");
const logger_1 = __importDefault(require("../utils/logger"));
// Resolve ProductService from the container using the interface
const productService = tsyringe_1.container.resolve('ProductService');
const getProductsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield productService.getProducts();
        logger_1.default.info('Products fetched successfully', { productsCount: products.length });
        res.json(products);
    }
    catch (error) {
        logger_1.default.error('Failed to fetch products', { error });
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});
exports.getProductsController = getProductsController;
