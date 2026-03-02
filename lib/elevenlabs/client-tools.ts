import { mockProducts } from "@/lib/store/mock/products";

// Helper to emit debug logs that the UI can capture
const emitDebugLog = (message: string) => {
  console.log(message);
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("voiceAgentDebug", {
        detail: { message },
      })
    );
  }
};

console.log("🔧 Client tools module loaded");

export const clientTools = {
  // Tool 1: Add product to cart by ID
  // Agent tool should be configured with parameters: productId (string), quantity (number, optional)
  addProductToCart: async (parameters: any) => {
    emitDebugLog("🛒 addProductToCart called!");
    emitDebugLog(`🛒 Params: ${JSON.stringify(parameters)}`);
    
    // Support both productID (from ElevenLabs) and productId (from other calls)
    const id = parameters?.productID || parameters?.productId || parameters?.product_id;
    const quantity = parameters?.quantity || 1;
    
    emitDebugLog(`🛒 ID: ${id}, Qty: ${quantity}`);
    
    if (!id) {
      console.error("❌ Product ID is required");
      return "I need a product ID to add it to the cart. Please specify which product you'd like to add.";
    }
    
    const products = mockProducts;
    const product = products.find((p) => p.id === id);
    
    if (!product) {
      emitDebugLog(`❌ Product not found: ${id}`);
      return `I couldn't find a product with ID ${id}. Please check the product ID and try again.`;
    }

    if (!product.availableForSale) {
      console.warn(`⚠️ Product not available: ${product.title}`);
      return `Sorry, ${product.title} is not available for sale at the moment.`;
    }

    const variant = product.variants[0];
    if (!variant) {
      console.error(`❌ No variants for: ${product.title}`);
      return `Sorry, ${product.title} doesn't have any available variants right now.`;
    }

    try {
      // Dispatch custom event to add to cart
      for (let i = 0; i < quantity; i++) {
        window.dispatchEvent(
          new CustomEvent("addToCart", {
            detail: { 
              variant,
              product
            },
          })
        );
      }

      emitDebugLog(`✅ Added ${quantity} x ${product.title}`);
      return `Great! I've added ${quantity} ${product.title} to your cart. The price is $${variant.price.amount} each.`;
    } catch (error) {
      console.error("❌ Error adding to cart:", error);
      return "Sorry, I had trouble adding that to your cart. Please try again.";
    }
  },

  // Tool 2: Get product ID by name
  // Agent tool should be configured with parameters: productName (string)
  getProductIdByName: async (parameters: any) => {
    emitDebugLog("🔍 getProductIdByName called!");
    emitDebugLog(`🔍 Params: ${JSON.stringify(parameters)}`);
    
    const productName = parameters?.productName || parameters?.product_name;
    
    emitDebugLog(`🔍 Product Name: ${productName}`);
    
    if (!productName) {
      console.error("❌ Product name is required");
      return "Please tell me what product you're looking for.";
    }
    
    const searchTerm = productName.toLowerCase();
    const products = mockProducts;
    
    const matchingProducts = products.filter(
      (product) =>
        product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.categoryId?.toLowerCase().includes(searchTerm)
    );

    if (matchingProducts.length === 0) {
      emitDebugLog(`⚠️ No products found: ${productName}`);
      return `I couldn't find any products matching "${productName}". We have iPads, AirPods, and Apple Watch products available. What would you like to see?`;
    }

    if (matchingProducts.length === 1) {
      const product = matchingProducts[0];
      emitDebugLog(`✅ Found: ${product.title} (${product.id})`);
      return `I found ${product.title}. The product ID is ${product.id} and it costs $${product.priceRange.minVariantPrice.amount}. Would you like me to add it to your cart?`;
    }

    const topProducts = matchingProducts.slice(0, 5);
    const productList = topProducts.map((p) => 
      `${p.title} (ID: ${p.id}, Price: $${p.priceRange.minVariantPrice.amount})`
    ).join(", ");

    emitDebugLog(`✅ Found ${matchingProducts.length} products`);
    return `I found ${matchingProducts.length} products matching "${productName}": ${productList}${matchingProducts.length > 5 ? ', and more' : ''}. Which one interests you?`;
  },
};

// Log available tools when module loads
console.log("🔧 Available client tools:", Object.keys(clientTools));
