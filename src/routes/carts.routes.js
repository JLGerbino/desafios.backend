import { Router } from "express";
import CartController from "../controllers/carts.controller.js";

const router = Router();
const cartController = new CartController;

router.post('/', cartController.createCart);
router.post('/:cid/products/:pid', cartController.addCart);//aca agregue/email/:emu
router.get("/:cid", cartController.getCartsId);
router.delete('/:cid/products/:pid', cartController.deleteProdInCartById);
router.delete('/:cid', cartController.deleteProdInCart);
router.put('/:cid/products/:pid', cartController.UpdateQuantityProd);
router.put('/:cid', cartController.UpdateCartWithProds);
router.post("/:cid/purchase", cartController.purchase);
export default router;
