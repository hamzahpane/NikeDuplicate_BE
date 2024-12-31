const router = require("express").Router();

const orderControll = require("./orderControler");

router.post("/postorders", orderControll.createOrder);

router.get("/getOrders/:id", orderControll.getOrderById);
router.get("/getOrders", orderControll.getAllOrders);

module.exports = router;
