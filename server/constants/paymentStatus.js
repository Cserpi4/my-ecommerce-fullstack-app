const paymentStatusTransitions = {
  pending: ["succeeded", "failed"],
  succeeded: ["refund_pending", "refunded", "partially_refunded"],
  refund_pending: ["refunded", "partially_refunded", "refund_failed"],
  refund_failed: ["refund_pending"],
  partially_refunded: ["refund_pending", "refunded"],
  refunded: [],
  failed: [],
};

const isValidPaymentStatusTransition = (fromStatus, toStatus) => {
  if (fromStatus === toStatus) return true;
  const allowed = paymentStatusTransitions[fromStatus] || [];
  return allowed.includes(toStatus);
};

export { paymentStatusTransitions, isValidPaymentStatusTransition };
