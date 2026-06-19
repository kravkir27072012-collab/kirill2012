import type { MarketplaceProvider } from "./MarketplaceProvider";
import { kaspiProvider } from "./mock/kaspiProvider";
import { technodomProvider } from "./mock/technodomProvider";
import { mechtaProvider } from "./mock/mechtaProvider";
import { wildberriesKzProvider } from "./mock/wildberriesKzProvider";
import { ozonKzProvider } from "./mock/ozonKzProvider";

/**
 * Single place that wires up which `MarketplaceProvider` implementation
 * backs each marketplace. Replacing a mock with a real integration is a
 * one-line change here — nothing else in the app references the mocks
 * directly.
 */
export const MARKETPLACE_PROVIDERS: MarketplaceProvider[] = [
  kaspiProvider,
  technodomProvider,
  mechtaProvider,
  wildberriesKzProvider,
  ozonKzProvider,
];
