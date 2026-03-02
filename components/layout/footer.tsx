import { ShopLinks } from "./shop-links";
import { SidebarLinks } from "./sidebar/product-sidebar-links";
import { getCollections } from "@/lib/store";

export async function Footer() {
  const collections = await getCollections();

  return (
    <footer className="p-sides">
      <div className="w-full h-full p-11 text-background bg-foreground rounded-[12px] flex flex-col justify-between">
        <div className="flex justify-end">
          <ShopLinks collections={collections} align="right" />
        </div>
        <div className="flex justify-between text-muted-foreground">
          <SidebarLinks className="max-w-[450px] w-full" size="base" invert />
          <p className="text-base">
            {new Date().getFullYear()}© — All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
