const orderStatusTransitions = {
  pending: ["paid", "payment_failed"],
  paid: ["refund_pending", "refunded", "partially_refunded"],
  refund_pending: ["refunded", "partially_refunded", "refund_failed"],
  refund_failed: ["refund_pending"],
  partially_refunded: ["refund_pending", "refunded"],
  refunded: [],
  payment_failed: [],
};

const isValidOrderStatusTransition = (fromStatus, toStatus) => {
  if (fromStatus === toStatus) return true;
  const allowed = orderStatusTransitions[fromStatus] || [];
  return allowed.includes(toStatus);
};

export { orderStatusTransitions, isValidOrderStatusTransition };
