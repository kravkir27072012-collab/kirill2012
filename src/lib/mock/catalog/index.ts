import { SNEAKERS } from "./sneakers";
import { ELECTRONICS } from "./electronics";
import { FURNITURE } from "./furniture";
import { APPLIANCES } from "./appliances";
import { CLOTHING } from "./clothing";

export type { CatalogModel } from "./types";

/** Combined catalog across every supported product category. */
export const CATALOG = [...SNEAKERS, ...ELECTRONICS, ...FURNITURE, ...APPLIANCES, ...CLOTHING];
