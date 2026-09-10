/**
 * Order State Manager
 * Tracks customer states, active orders, and photo data.
 */

const STATES = {
  IDLE: "IDLE",
  AWAITING_PHOTO: "AWAITING_PHOTO",
  AWAITING_PAYMENT: "AWAITING_PAYMENT",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
};

// In-memory customer state database
const orders = new Map();

class OrderManager {
  static getOrder(phone) {
    return orders.get(phone);
  }

  static createOrUpdateOrder(phone, data = {}) {
    const existing = orders.get(phone) || {
      orderId: `RETRO-${Date.now().toString().slice(-6)}`,
      phone,
      state: STATES.IDLE,
      createdAt: new Date(),
    };

    const updated = { ...existing, ...data, updatedAt: new Date() };
    orders.set(phone, updated);
    return updated;
  }

  static setPhoto(phone, mediaId, photoBuffer, mimeType) {
    return this.createOrUpdateOrder(phone, {
      mediaId,
      photoBuffer,
      mimeType,
      state: STATES.AWAITING_PAYMENT,
    });
  }

  static markPaid(orderId) {
    for (const [phone, order] of orders.entries()) {
      if (order.orderId === orderId || orderId === "ANY_LATEST") {
        if (order.state === STATES.AWAITING_PAYMENT) {
          order.state = STATES.PROCESSING;
          order.paidAt = new Date();
          orders.set(phone, order);
          return order;
        }
      }
    }
    return null;
  }

  static markCompleted(phone, resultUrl) {
    const order = orders.get(phone);
    if (order) {
      order.state = STATES.COMPLETED;
      order.resultUrl = resultUrl;
      order.completedAt = new Date();
      orders.set(phone, order);
    }
    return order;
  }

  static resetOrder(phone) {
    orders.delete(phone);
  }

  static get STATES() {
    return STATES;
  }
}

module.exports = OrderManager;
