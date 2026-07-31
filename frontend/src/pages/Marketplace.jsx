import CustomersManager from "../modules/marketplace/components/business/CustomersManager";
import OrdersManager from "../modules/marketplace/components/business/OrdersManager";
import InventoryManager from "../modules/marketplace/components/business/InventoryManager";
import ProductVariants from "../modules/marketplace/components/business/ProductVariants";
import AddProduct from "../modules/marketplace/components/business/AddProduct";
import ProductManager from "../modules/marketplace/components/business/ProductManager";
import StoreDashboard from "../modules/marketplace/components/business/StoreDashboard";
import StoreProfile from "../modules/marketplace/components/business/StoreProfile";
import BusinessRegistration from "../modules/marketplace/components/business/BusinessRegistration";
import SellerCenter from "../modules/marketplace/components/seller/SellerCenter";
import PaymentMethods from "../modules/marketplace/components/checkout/PaymentMethods";
import ShippingCompanies from "../modules/marketplace/components/checkout/ShippingCompanies";
import ShippingAddress from "../modules/marketplace/components/checkout/ShippingAddress";
import ShoppingCart from "../modules/marketplace/components/cart/ShoppingCart";
import ProductShowcase from "../modules/marketplace/components/product/ProductShowcase";
import LogisticsHub from "../modules/marketplace/components/logistics/LogisticsHub";
import BusinessProfiles from "../modules/marketplace/components/business/BusinessProfiles";
import SmartCatalog from "../modules/marketplace/components/catalog/SmartCatalog";
import ProductsManagement from "../modules/marketplace/components/products/ProductManagement";

import SellerProductManagement from "../modules/marketplace/components/seller/ProductManagement";
import VendorCenter from "../modules/marketplace/components/vendors/VendorCenter";
import PaymentCenter from "../modules/marketplace/components/payments/PaymentCenter";
import OrderManagement from "../modules/marketplace/components/orders/OrderManagement";
import AdsPlatform from "../modules/marketplace/components/ads/AdsPlatform";
import BusinessDirectory from "../modules/marketplace/components/directory/BusinessDirectory";
import DeliveryManagement from "../modules/marketplace/components/shipping/DeliveryManagement";
import ProductEditor from "../modules/marketplace/components/seller/ProductEditor";
import SellerDashboard from "../modules/marketplace/components/seller/SellerDashboard";
import OrdersSection from "../modules/marketplace/components/orders/OrdersSection";
import CheckoutSection from "../modules/marketplace/components/checkout/CheckoutSection";
import ShoppingCartSection from "../modules/marketplace/components/cart/ShoppingCart";
import DeliveryCompanies from "../modules/marketplace/components/delivery/DeliveryCompanies";
import ProductDetailsCard from "../modules/marketplace/components/products/ProductDetailsCard";
import MarketplaceLayout from "../modules/marketplace/layouts/MarketplaceLayout";
import CompaniesGrid from "../modules/marketplace/components/companies/CompaniesGrid";
import ProductGrid from "../modules/marketplace/components/products/ProductGrid";
import MarketplaceTopbar from "../modules/marketplace/components/navigation/MarketplaceTopbar";
import MarketplaceSidebar from "../modules/marketplace/components/navigation/MarketplaceSidebar";
import MarketplaceHero from "../modules/marketplace/components/hero/MarketplaceHero";
import CompanyProfileCard from "../modules/marketplace/components/company/CompanyProfileCard";
export default function Marketplace() {
  return (
    <MarketplaceLayout>

      <MarketplaceTopbar />

      <div className="grid gap-6 xl:grid-cols-[280px_1fr]">

        <MarketplaceSidebar />

        <div className="space-y-6">

          <MarketplaceHero />

<CompaniesGrid />

<CompanyProfileCard />
<ProductGrid />
<ProductDetailsCard />
<DeliveryCompanies />
<ShoppingCartSection />
<CheckoutSection />
<OrdersSection />
<SellerDashboard />
<SellerProductManagement />
<ProductEditor />
<DeliveryManagement />
<BusinessDirectory />
<AdsPlatform />
<OrderManagement />
<PaymentCenter />
<VendorCenter />
<ProductsManagement />
<SmartCatalog />
<BusinessProfiles />
<LogisticsHub />
<ProductShowcase />
<ShoppingCart />
<ShippingAddress />
<ShippingCompanies />
<PaymentMethods />
<SellerCenter />
<BusinessRegistration />
<StoreProfile />
<StoreDashboard />
<ProductManager />
<AddProduct />
<ProductVariants />
<InventoryManager />
<OrdersManager />
<CustomersManager />

          <section className="grid gap-6 md:grid-cols-2">

            <div
              className="rounded-3xl border p-6"
              style={{
                background: "var(--q-surface)",
                borderColor: "var(--q-border)",
              }}
            >
              <h2 className="text-2xl font-bold">
                🏢 Companies
              </h2>

              <p
                className="mt-3"
                style={{ color: "var(--q-muted)" }}
              >
                Industrial companies, manufacturers,
                logistics providers and economic organizations.
              </p>
            </div>

            <div
              className="rounded-3xl border p-6"
              style={{
                background: "var(--q-surface)",
                borderColor: "var(--q-border)",
              }}
            >
              <h2 className="text-2xl font-bold">
                🏛 Institutions
              </h2>

              <p
                className="mt-3"
                style={{ color: "var(--q-muted)" }}
              >
                Service institutions, commercial businesses,
                craftsmen and professional organizations.
              </p>
            </div>

            <div
              className="rounded-3xl border p-6"
              style={{
                background: "var(--q-surface)",
                borderColor: "var(--q-border)",
              }}
            >
              <h2 className="text-2xl font-bold">
                👤 Individuals
              </h2>

              <p
                className="mt-3"
                style={{ color: "var(--q-muted)" }}
              >
                Products and services offered directly by
                Quavron community members.
              </p>
            </div>

            <div
              className="rounded-3xl border p-6"
              style={{
                background: "var(--q-surface)",
                borderColor: "var(--q-border)",
              }}
            >
              <h2 className="text-2xl font-bold">
                📢 Quavron Ads
              </h2>

              <p
                className="mt-3"
                style={{ color: "var(--q-muted)" }}
              >
                Sponsored campaigns and official advertising
                managed by Quavron.
              </p>
            </div>

          </section>

        </div>

      </div>

    </MarketplaceLayout>
  );
}
