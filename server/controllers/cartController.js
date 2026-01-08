import cartService from '../services/cartService.js';
import cartItemService from '../services/cartItemService.js';

const getUserCart = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;

    if (!userId) {
      return res.json({ success: true, cart: { items: [], total: 0, isAnonymous: true } });
    }

    let cart = await cartService.getCartByUserId(userId);
    
    // Biztonsági ellenőrzés: ha nincs kosár, vagy hiányzik az items tömb, pótoljuk
    if (!cart || !Array.isArray(cart.items)) {
        cart = { 
            ...cart, 
            items: [], 
            total: cart ? cart.total || 0 : 0 
        };
    }

    res.json({ success: true, cart });
  } catch (err) {
    next(err);
  }
};

const createCart = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;

    if (!userId) {
       return res.status(403).json({ success: false, message: 'Cart creation requires authentication or a session ID.' });
    }

    const cart = await cartService.createCart(userId);
    res.json({ success: true, cart });
  } catch (err) {
    next(err);
  }
};

const addItem = async (req, res, next) => {
  try {
    if (!req.user || !req.body.cartId) {
        return res.status(403).json({ success: false, message: 'Adding items requires authentication or a valid cartId.' });
    }
    
    const { cartId, productId, quantity } = req.body;
    const item = await cartItemService.addItemToCart(cartId, productId, quantity);
    res.json({ success: true, item });
  } catch (err) {
    next(err);
  }
};

const removeItem = async (req, res, next) => {
  try {
    const { cartItemId } = req.params;
    const removed = await cartItemService.removeItemFromCart(cartItemId);
    res.json({ success: true, removed });
  } catch (err) {
    next(err);
  }
};

export default { getUserCart, createCart, addItem, removeItem };
