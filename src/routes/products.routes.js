import { Router } from "express";
import ProductController from "../controllers/products.controller.js";
import { uploader } from "../utils.js";


const router = Router();
const productController = new ProductController

router.get("/mockingproducts", productController.mockingProducts);
router.get("/", productController.getProducts);
router.get("/:pid", productController.getProductsById);
router.post("/", uploader.array("thumbnail"), productController.addProduct);
router.delete("/:pid", productController.deleteProduct);
router.put("/:pid", productController.updateProduct);

export default router;