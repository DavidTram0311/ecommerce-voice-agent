"use client";

import { useConversation } from "@elevenlabs/react";
import { useCart } from "@/components/cart/cart-context";
import { useState } from "react";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { mockProducts } from "@/lib/store/mock/products";
import { useRouter } from "next/navigation";

export function VoiceAgent() {
  const { addCartItem, updateCartItem, cart } = useCart();
  const router = useRouter();
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const conversation = useConversation({
    onConnect: () => {
      setIsListening(true);
      setError(null);
    },
    onDisconnect: () => {
      setIsListening(false);
    },
    onError: (error) => {
      console.error("Conversation error:", error);
      setError("An error occurred with the voice agent. Please try again.");
      setIsListening(false);
    },
    clientTools: {
      addProductToCart: async (parameters: {
        productID?: string;
        productId?: string;
        product_id?: string;
        quantity?: number;
      }) => {
        const id = parameters?.productID || parameters?.productId || parameters?.product_id;
        const quantity = parameters?.quantity || 1;

        if (!id) {
          return "I need a product ID to add it to the cart. Please specify which product you'd like to add.";
        }

        const product = mockProducts.find((p) => p.id === id);

        if (!product) {
          return `I couldn't find a product with ID ${id}. Please check the product ID and try again.`;
        }

        if (!product.availableForSale) {
          return `Sorry, ${product.title} is not available for sale at the moment.`;
        }

        const variant = product.variants[0];
        if (!variant) {
          return `Sorry, ${product.title} doesn't have any available variants right now.`;
        }

        try {
          for (let i = 0; i < quantity; i++) {
            addCartItem(variant, product);
          }

          return `Great! I've added ${quantity} ${product.title} to your cart. The price is $${variant.price.amount} each.`;
        } catch (error) {
          console.error("❌ Error adding to cart:", error);
          return "Sorry, I had trouble adding that to your cart. Please try again.";
        }
      },

      getProductIdByName: async (parameters: {
        productName?: string;
        product_name?: string;
      }) => {
        const productName = parameters?.productName || parameters?.product_name;

        if (!productName) {
          return "Please tell me what product you're looking for.";
        }

        const searchTerm = productName.toLowerCase();

        const matchingProducts = mockProducts.filter(
          (product) =>
            product.title.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.categoryId?.toLowerCase().includes(searchTerm)
        );

        if (matchingProducts.length === 0) {
          return `I couldn't find any products matching "${productName}". We have iPads, AirPods, and Apple Watch products available. What would you like to see?`;
        }

        if (matchingProducts.length === 1) {
          const product = matchingProducts[0];
          return `I found ${product.title}. The product ID is ${product.id} and it costs $${product.priceRange.minVariantPrice.amount}. Would you like me to add it to your cart?`;
        }

        const topProducts = matchingProducts.slice(0, 5);
        const productList = topProducts
          .map(
            (p) =>
              `${p.title} (ID: ${p.id}, Price: $${p.priceRange.minVariantPrice.amount})`
          )
          .join(", ");

        return `I found ${matchingProducts.length} products matching "${productName}": ${productList}${matchingProducts.length > 5 ? ", and more" : ""}. Which one interests you?`;
      },

      searchProduct: async (parameters: {
        query?: string;
        searchQuery?: string;
        search_query?: string;
      }) => {
        const query = parameters?.query || parameters?.searchQuery || parameters?.search_query;

        if (!query) {
          return "Please tell me what you'd like to search for.";
        }

        const lowerQuery = query.toLowerCase();
        const matchingProducts = mockProducts.filter(
          (p) =>
            p.title.toLowerCase().includes(lowerQuery) ||
            p.description.toLowerCase().includes(lowerQuery) ||
            p.categoryId?.toLowerCase().includes(lowerQuery)
        );

        router.push(`/shop?q=${encodeURIComponent(query)}`);

        if (matchingProducts.length === 0) {
          return `I couldn't find any products matching "${query}". Try searching for iPads, AirPods, or Apple Watch.`;
        }

        if (matchingProducts.length === 1) {
          const product = matchingProducts[0];
          return `I found 1 product matching "${query}": ${product.title} for $${product.priceRange.minVariantPrice.amount}. I'm showing it on the shop page now.`;
        }

        return `I found ${matchingProducts.length} products matching "${query}". I'm showing them on the shop page now.`;
      },

      filterCategory: async (parameters: {
        category?: string;
        categoryName?: string;
        category_name?: string;
      }) => {
        const category = (parameters?.category || parameters?.categoryName || parameters?.category_name)?.toLowerCase();

        if (!category) {
          return "Please specify which category you'd like to browse: iPads, Watch, or AirPods.";
        }

        const categoryMap: { [key: string]: string } = {
          ipad: "/shop/ipads",
          ipads: "/shop/ipads",
          watch: "/shop/watch",
          watches: "/shop/watch",
          "apple watch": "/shop/watch",
          airpod: "/shop/airpods",
          airpods: "/shop/airpods",
        };

        const route = categoryMap[category];

        if (!route) {
          return `I couldn't find the category "${category}". Available categories are: iPads, Watch, and AirPods. Which one would you like to browse?`;
        }

        router.push(route);
        return `Opening the ${category} collection for you now.`;
      },

      removeProductFromCart: async (parameters: {
        productID?: string;
        productId?: string;
        product_id?: string;
        productName?: string;
        product_name?: string;
      }) => {
        if (!cart || cart.lines.length === 0) {
          return "Your cart is empty. There's nothing to remove.";
        }

        const id = parameters?.productID || parameters?.productId || parameters?.product_id;
        const name = parameters?.productName || parameters?.product_name;

        if (!id && !name) {
          return "I need a product ID or product name to remove it from the cart. Please specify which product you'd like to remove.";
        }

        let cartItem;

        if (id) {
          cartItem = cart.lines.find((line) => line.merchandise.product.id === id);
          
          if (!cartItem) {
            const product = mockProducts.find((p) => p.id === id);
            if (product) {
              const variantId = product.variants[0]?.id;
              cartItem = cart.lines.find((line) => line.merchandise.id === variantId);
            }
          }
        }
        
        if (!cartItem && name) {
          const searchTerm = name.toLowerCase();
          cartItem = cart.lines.find((line) =>
            line.merchandise.product.title.toLowerCase().includes(searchTerm)
          );
        }

        if (!cartItem) {
          const cartContents = cart.lines
            .map((line) => line.merchandise.product.title)
            .join(", ");
          return `I couldn't find that product in your cart. Your cart contains: ${cartContents}. Which one would you like to remove?`;
        }

        try {
          updateCartItem(cartItem.merchandise.id, "delete");
          return `I've removed ${cartItem.merchandise.product.title} from your cart.`;
        } catch (error) {
          console.error("❌ Error removing from cart:", error);
          return "Sorry, I had trouble removing that from your cart. Please try again.";
        }
      },

      checkOrder: async () => {
        if (!cart || cart.lines.length === 0) {
          return "Your cart is currently empty. Would you like to browse some products?";
        }

        const itemCount = cart.totalQuantity;
        const totalAmount = cart.cost.totalAmount.amount;

        const itemsList = cart.lines
          .map((line) => {
            const unitPrice = (parseFloat(line.cost.totalAmount.amount) / line.quantity).toFixed(2);
            return `${line.quantity}x ${line.merchandise.product.title} at $${unitPrice} each`;
          })
          .join(", ");

        return `You have ${itemCount} item${itemCount > 1 ? "s" : ""} in your cart: ${itemsList}. Your total is $${totalAmount}.`;
      },

      checkProductsByPriceAndCategory: async (parameters: {
        category?: string;
        categoryName?: string;
        category_name?: string;
        minPrice?: number;
        min_price?: number;
        maxPrice?: number;
        max_price?: number;
      }) => {
        const category = (parameters?.category || parameters?.categoryName || parameters?.category_name)?.toLowerCase();
        const minPrice = parameters?.minPrice || parameters?.min_price;
        const maxPrice = parameters?.maxPrice || parameters?.max_price;

        if (!category && minPrice === undefined && maxPrice === undefined) {
          return "Please specify a category (iPads, Watch, or AirPods) and/or a price range to filter products.";
        }

        const categoryMap: { [key: string]: string } = {
          ipad: "ipads",
          ipads: "ipads",
          watch: "watch",
          watches: "watch",
          "apple watch": "watch",
          airpod: "airpods",
          airpods: "airpods",
        };

        const normalizedCategory = category ? categoryMap[category] : undefined;

        let filteredProducts = mockProducts.filter((p) => p.availableForSale);

        if (normalizedCategory) {
          filteredProducts = filteredProducts.filter(
            (p) => p.categoryId === normalizedCategory
          );
        }

        if (minPrice !== undefined) {
          filteredProducts = filteredProducts.filter(
            (p) => parseFloat(p.priceRange.minVariantPrice.amount) >= minPrice
          );
        }

        if (maxPrice !== undefined) {
          filteredProducts = filteredProducts.filter(
            (p) => parseFloat(p.priceRange.minVariantPrice.amount) <= maxPrice
          );
        }

        filteredProducts.sort(
          (a, b) =>
            parseFloat(a.priceRange.minVariantPrice.amount) -
            parseFloat(b.priceRange.minVariantPrice.amount)
        );

        if (filteredProducts.length === 0) {
          let filterDescription = "";
          if (category) filterDescription += `in the ${category} category`;
          if (minPrice !== undefined || maxPrice !== undefined) {
            if (filterDescription) filterDescription += " ";
            if (minPrice !== undefined && maxPrice !== undefined) {
              filterDescription += `between $${minPrice} and $${maxPrice}`;
            } else if (minPrice !== undefined) {
              filterDescription += `above $${minPrice}`;
            } else {
              filterDescription += `under $${maxPrice}`;
            }
          }
          return `I couldn't find any products ${filterDescription}. Try adjusting your filters or browse our iPads, Watch, and AirPods categories.`;
        }

        const topProducts = filteredProducts.slice(0, 5);
        const productList = topProducts
          .map((p) => `${p.title} at $${p.priceRange.minVariantPrice.amount}`)
          .join("; ");

        let filterDescription = "";
        if (category) filterDescription += `in ${category}`;
        if (minPrice !== undefined || maxPrice !== undefined) {
          if (filterDescription) filterDescription += " ";
          if (minPrice !== undefined && maxPrice !== undefined) {
            filterDescription += `priced between $${minPrice} and $${maxPrice}`;
          } else if (minPrice !== undefined) {
            filterDescription += `priced above $${minPrice}`;
          } else {
            filterDescription += `priced under $${maxPrice}`;
          }
        }

        if (filteredProducts.length === 1) {
          const product = filteredProducts[0];
          return `I found 1 product ${filterDescription}: ${product.title} for $${product.priceRange.minVariantPrice.amount}. Would you like me to add it to your cart?`;
        }

        return `I found ${filteredProducts.length} products ${filterDescription}. Here are some options: ${productList}${filteredProducts.length > 5 ? ". There are more options available." : ""}. Would you like more details on any of these?`;
      },
    },
  });

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleListening = async () => {
    if (isListening) {
      conversation.endSession();
      setError(null);
      return;
    }

    // Check if we're in a secure context
    if (typeof window !== 'undefined' && window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      setError('Microphone access requires HTTPS or localhost. Please use https:// or access via localhost.');
      return;
    }

    // Check if mediaDevices API is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Microphone access is not supported in your browser. Please use a modern browser like Chrome, Firefox, or Safari.');
      return;
    }

    try {
      // Request microphone permission first
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Start the conversation session
      await conversation.startSession({
        agentId: "agent_8801kjm1wq0efazrx6pb31a8g9ef",
        connectionType: "websocket",
      });
      
      setError(null);
    } catch (err: any) {
      console.error('Failed to start voice session:', err);
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Microphone access was denied. Please allow microphone permissions in your browser settings.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError('No microphone found. Please connect a microphone and try again.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setError('Microphone is already in use by another application. Please close other apps using the microphone.');
      } else if (err.name === 'SecurityError') {
        setError('Microphone access blocked due to security settings. Please use HTTPS or localhost.');
      } else {
        setError(`Failed to start voice agent: ${err.message || 'Unknown error'}`);
      }
      
      setIsListening(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex flex-col gap-2">
        {/* Voice control button */}
        <button
          onClick={toggleListening}
          className={`rounded-full p-4 shadow-lg transition-all hover:scale-110 ${
            isListening
              ? "bg-red-500 hover:bg-red-600"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          aria-label={isListening ? "Stop listening" : "Start listening"}
        >
          {isListening ? (
            <MicOff className="h-6 w-6 text-white" />
          ) : (
            <Mic className="h-6 w-6 text-white" />
          )}
        </button>

        {/* Mute button (only shown when listening) */}
        {isListening && (
          <button
            onClick={toggleMute}
            className="rounded-full bg-gray-500 p-3 shadow-lg transition-all hover:scale-110 hover:bg-gray-600"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5 text-white" />
            ) : (
              <Volume2 className="h-5 w-5 text-white" />
            )}
          </button>
        )}
      </div>

      {/* Status indicator */}
      {isListening && (
        <div className="mt-2 rounded-full bg-white px-3 py-1 text-xs shadow-lg">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            Listening...
          </span>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mt-2 max-w-xs rounded-lg bg-red-500 px-4 py-2 text-xs text-white shadow-lg">
          <div className="flex items-start gap-2">
            <span className="text-sm">⚠️</span>
            <div className="flex-1">
              <p className="font-semibold">Error</p>
              <p className="mt-1">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-xs underline hover:no-underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
