import express from "express";
import cors from "cors";
import productRoutes from './routes/product.route.js'
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.route.js'
import roleRoutes from './routes/role.route.js';
import permissionRoutes from './routes/permission.route.js';
import rolePermissionRoutes from './routes/roleropermssion.route.js';
import userRoleRoutes from './routes/userrole.routes.js';
import contactRoutes from "./routes/contact.routes.js";
import taxRateRoutes from "./routes/tax-rate.routes.js";
import warrantyRoutes from "./routes/warranty.routes.js";
import businessLocationRoutes from "./routes/businessLocation.routes.js";
import discountRoutes from "./routes/discount.routes.js";
import migrationRoutes from "./routes/migration.routes.js";
import productsRoutes from "./routes/products.routes.js";
import brandRoutes from "./routes/brand.route.js";
import stockadjustmentRoutes from "./routes/stock-adjustment.route.js"
import unitRoutes from "./routes/unit.route.js"
import priceRoutes from "./routes/price.route.js"
import variationRoutes from "./routes/variation.route.js"
import purchaseRoutes from "./routes/purchase.routes.js";
import categoryRoutes from "./routes/categories.routes.js";
import saleRoutes from "./routes/sale.routes.js";
import SaleReturn from "./routes/saleReturn.routes.js"


const app = express();

//  Enable CORS
app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
// Routes
app.use('/api/v1', productRoutes);
app.use('/api/v1', userRoutes);  
app.use('/api/v1', authRoutes);
app.use('/api/v1', roleRoutes);
app.use('/api/v1', permissionRoutes);  
app.use('/api/v1', rolePermissionRoutes);
app.use('/api/v1', userRoleRoutes);
app.use('/api/v1', contactRoutes );
app.use('/api/v1', taxRateRoutes);
app.use('/api/v1', warrantyRoutes);
app.use('/api/v1', businessLocationRoutes);
app.use('/api/v1', discountRoutes);
app.use('/api/v1', migrationRoutes);
app.use('/api/v1', productsRoutes);
app.use("/api/v1", brandRoutes);
app.use("/api/v1", categoryRoutes);
app.use('/api/v1', stockadjustmentRoutes);
app.use('/api/v1', priceRoutes);
app.use('/api/v1', variationRoutes);
app.use("/api/v1", unitRoutes);
app.use("/api/v1", purchaseRoutes);
app.use("/api/v1", saleRoutes);
app.use("/api/v1", SaleReturn);






export { app };
