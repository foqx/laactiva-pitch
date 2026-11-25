/* Laactiva deck — 3D entry point */
import { initProduct } from './product.js';
import { initFactory } from './factory.js';
(async () => {
  try { await initProduct(); } catch (e) { console.error('product scenes', e); }
  try { await initFactory(); } catch (e) { console.error('factory scene', e); }
  window.DECK && DECK.ready && DECK.ready();
})();
