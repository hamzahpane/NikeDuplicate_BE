const router = require("express").Router();
const Payment = require("./payControler");

router.get("/getpay", Payment.getPayment);
router.post("/postpay", Payment.createPayment);

module.exports = router;
