# STS Store - Voice-Powered E-Commerce Frontend

A modern, voice-enabled e-commerce platform built with Next.js 15, featuring an AI-powered voice agent for hands-free shopping experiences. Shop for Apple products including iPads, Apple Watch, and AirPods using natural voice commands.

## Features

- **Voice-Powered Shopping**: Interact with the store using natural voice commands powered by ElevenLabs AI
- **Product Browsing**: Browse products by category (iPads, Apple Watch, AirPods)
- **Smart Search**: Search products by name, description, or category
- **Voice Cart Management**: Add/remove items from cart using voice commands
- **Price Filtering**: Filter products by price range and category
- **Real-time Cart Updates**: See your cart update in real-time as you shop
- **Responsive Design**: Beautiful, modern UI built with Tailwind CSS and Radix UI
- **Development Tools**: Built-in debug grid and setup toolbar for development

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, shadcn/ui
- **Voice AI**: ElevenLabs React SDK
- **State Management**: React Context API
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **Notifications**: Sonner

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.x or higher
- **npm** or **yarn** or **pnpm**: Package manager
- **ElevenLabs Account**: For voice agent functionality (get API key from [ElevenLabs](https://elevenlabs.io))

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ecommerce-voice-agent-fe
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```bash
# ElevenLabs Configuration
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=your_agent_id_here

# Optional: Add other environment variables as needed
```

**Note**: The voice agent requires an ElevenLabs agent ID. You can find this in your ElevenLabs dashboard after creating a conversational AI agent.

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will start on [http://localhost:3001](http://localhost:3001).

### 5. Run with HTTPS (Optional)

For testing microphone access in a production-like environment:

```bash
npm run dev:https
# or
yarn dev:https
# or
pnpm dev:https
```

## Available Scripts

- `npm run dev` - Start development server on port 3001
- `npm run dev:https` - Start development server with HTTPS
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality checks

## Voice Agent Commands

The voice agent supports the following commands:

### Product Search & Browsing
- "Show me iPads"
- "Search for AirPods"
- "Browse Apple Watch collection"
- "Find products under $500"
- "Show me iPads between $300 and $800"

### Cart Management
- "Add [product name] to cart"
- "Add 2 iPad Pro to my cart"
- "Remove [product name] from cart"
- "What's in my cart?"
- "Check my order"

### Product Information
- "What's the product ID for iPad Air?"
- "Tell me about [product name]"

## Project Structure

```
ecommerce-voice-agent-fe/
├── app/                          # Next.js app router pages
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Home page (redirects to /shop)
│   ├── shop/                    # Shop pages
│   ├── search/                  # Search page
│   └── product/                 # Product detail pages
├── components/                   # React components
│   ├── cart/                    # Cart components and context
│   ├── layout/                  # Layout components (header, footer)
│   ├── voice-agent/             # Voice agent component
│   └── ui/                      # Reusable UI components
├── lib/                         # Utility functions and constants
│   ├── store/                   # Store-related utilities
│   └── constants.ts             # App constants
├── public/                      # Static assets
└── styles/                      # Global styles
```

## Voice Agent Setup

The voice agent is configured in `components/voice-agent/index.tsx` and includes the following client tools:

1. **addProductToCart** - Add products to cart by ID or name
2. **getProductIdByName** - Search for products by name
3. **searchProduct** - Search and navigate to products
4. **filterCategory** - Filter products by category
5. **removeProductFromCart** - Remove items from cart
6. **checkOrder** - View cart contents and total
7. **checkProductsByPriceAndCategory** - Filter by price and category

## Browser Requirements

- **Microphone Access**: Required for voice features
- **HTTPS or Localhost**: Microphone access requires a secure context
- **Modern Browser**: Chrome, Firefox, Safari, or Edge (latest versions)

## Development Features

### Debug Grid
In development mode, a debug grid overlay is available to help with layout alignment.

### Setup Toolbar
Development toolbar for quick cart setup and testing.

## Building for Production

```bash
npm run build
npm run start
```

The production build will be optimized and ready for deployment.

## Deployment

This Next.js application can be deployed to:

- **Vercel** (recommended)
- **Netlify**
- **AWS Amplify**
- **Docker containers**
- Any Node.js hosting platform

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

## Troubleshooting

### Microphone Access Issues
- Ensure you're using HTTPS or localhost
- Check browser permissions for microphone access
- Verify no other application is using the microphone

### Voice Agent Not Responding
- Verify your ElevenLabs agent ID is correct
- Check browser console for errors
- Ensure you have a stable internet connection

### Build Errors
- Clear `.next` folder and `node_modules`
- Run `npm install` again
- Check Node.js version compatibility

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For issues and questions, please open an issue in the repository or contact the development team.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Voice AI powered by [ElevenLabs](https://elevenlabs.io)
- UI components from [Radix UI](https://www.radix-ui.com/) and [shadcn/ui](https://ui.shadcn.com/)
