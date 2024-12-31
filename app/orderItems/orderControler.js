const Order = require("./orderModel");
const Payment = require("../Payment/payModel");

const createOrder = async (req, res, next) => {
  try {
    const { orderItems, payment, deliveryAddress } = req.body;

    let totalProductPrice = 0;

    const getPayments = await Payment.findById(payment);
    if (!getPayments) {
      return res.status(404).json({
        error: 1,
        message: `Payment dengan ID ${getPayments} tidak ditemukan.`,
      });
    }

    const orderItem = orderItems?.map((item) => {
      const { name, price, quantity } = item;
      const subtotal = price * quantity;
      totalProductPrice += subtotal;
      return {
        name,
        price,
        quantity,
      };
    });

    const deliveryFee = 0.5;
    const totalAmount = totalProductPrice + deliveryFee;

    const newOrder = new Order({
      orderItem,
      deliveryAddress,
      deliveryFee,
      totalProductPrice,
      totalAmount,
      payment,
    });

    const savedOrder = await newOrder.save();

    return res.status(201).json({
      message: "order Berhasil di buat ",
      order: savedOrder,
    });
  } catch (error) {
    next(error); // Tangani error
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id).populate("payment");

    if (!order) {
      return res.status(404).json({
        error: 1,
        message: `Order dengan ID ${id} tidak ditemukan.`,
      });
    }

    return res.status(200).json({
      message: "Order berhasil ditemukan",
      order,
    });
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate("payment");
    return res.status(200).json({
      message: "Orders berhasil ditemukan",
      orders,
    });
  } catch (error) {
    next(error);
  }
};

const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        error: 1,
        message: `Order dengan ID ${id} tidak ditemukan.`,
      });
    }

    await order.remove();

    return res.status(200).json({
      message: `Order dengan ID ${id} berhasil dihapus.`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getOrderById, getAllOrders, deleteOrder };
