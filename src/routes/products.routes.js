import { Router } from "express";
import ProductController from "../controllers/products.controller.js";
import { uploader } from "../utils.js";
import { uploaderProduct } from "../utils.js";

const router = Router();
const productController = new ProductController

router.get('/mockingproducts', productController.mockingProducts);
router.get('/', productController.getProducts);
router.get("/:pid", productController.getProductsById);
router.post('/', uploaderProduct.single("thumbnail"), productController.addProduct);//agregue aca el multer
router.delete("/:pid", productController.deleteProduct);
router.put('/:pid', productController.updateProduct);

export default router;