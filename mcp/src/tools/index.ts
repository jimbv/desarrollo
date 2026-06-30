import authTools from "./auth";
import categoriesTools from "./categories";
import productsTools from "./products";
import usersTools from "./users";
import type { ToolDef } from "../tool-factory";

export default [
  ...authTools,
  ...categoriesTools,
  ...productsTools,
  ...usersTools,
] as ToolDef[];