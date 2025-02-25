# BlackMamba Theme

A developer-focused Shopify theme by Ecomexperts that prioritizes clean code, maintainability, and straightforward customization. Built with modern development practices in mind, this theme serves as an ideal starting point for your Shopify projects.

## Overview

BlackMamba is crafted for developers who appreciate clean, well-structured code and minimal complexity. This theme strips away unnecessary complexity to provide a solid foundation that you can build upon. The theme leverages custom web components for most of its JavaScript functionality, providing a modern, encapsulated, and maintainable approach to component development.

## Features and Benefits

### Developer Benefits
- **Component-Based Architecture**: Organized with custom web components for encapsulated functionality
- **Clean Structure**: Logical file organization with clear separation of concerns
- **Minimal Dependencies**: Only essential libraries included (Alpine.js, Liquid AJAX Cart, Swiper)
- **Modern Development**: Built using Shopify CLI 3.0 and Online Store 2.0 features
- **Performance Focused**: Lightweight base with optimized JavaScript and CSS
- **Developer Experience**: Clear naming conventions and intuitive component structure
- **Customization**: Well-documented sections and blocks for easy modifications

### Key Features
- Responsive header with mobile menu
- AJAX cart with drawer and notification
- Product page with variant selection and image gallery
- Collection page with filtering and sorting
- Predictive search functionality
- Product recommendations
- Localization support

## Theme Architecture

BlackMamba follows a component-based architecture that emphasizes:

### Custom Web Components
The theme uses JavaScript custom elements (Web Components) for most interactive features:
- Each component is self-contained with its own logic
- Components communicate through events
- Clean separation between markup (Liquid) and behavior (JS)

### Alpine.js Integration
Alpine.js is used for UI state management:
- Declarative syntax for simple interactions
- Used primarily in the header and cart components
- Minimal footprint with maximum flexibility

### Liquid AJAX Cart
Cart functionality is handled through Liquid AJAX Cart:
- Real-time cart updates without page reloads
- Automatic synchronization across components
- Built specifically for Shopify themes

### Swiper Integration
Product galleries use Swiper for touch-friendly interactions:
- Mobile-optimized image browsing
- Support for various media types
- Customizable navigation options

## Component Documentation

### Header Component
The header combines Alpine.js for UI state management and includes:
- Mobile-responsive navigation
- Search functionality with predictive results
- Cart integration

Example of Alpine.js usage in the header:
```liquid
<header
  x-data="{ searchOpen: false, searchTerm: '' }"
  @click.outside="searchOpen = false"
  @input="searchTerm = $event.target.value"
>
```

### Product Component
The product page includes:
- Variant selection (dropdown or button style)
- Image gallery with Swiper integration
- Dynamic price and availability updates
- Add to cart functionality with AJAX
- Product recommendations

The product component uses a custom element for handling variant changes:
```javascript
class ProductInfo extends HTMLElement {
  constructor() {
    super();
    this.variantSelector?.addEventListener('change', this.onVariantChange.bind(this));
    // Other event listeners...
  }

  onVariantChange(e) {
    // Update product information based on selected variant
    this.renderSection();
  }
}
```

### Collection Component
The collection page features:
- Filtering system with multiple filter types
- Price range filter with slider
- Sorting options
- Pagination
- Dynamic updates without page reload

The collection component handles filter changes with debounced events:
```javascript
class CollectionInfo extends HTMLElement {
  constructor() {
    super();
    this.debounceOnChange = debounce((event) => this.onChangeHandler(event), 800);
    this.addEventListener('change', this.debounceOnChange.bind(this));
    this.addEventListener('click', this.onClickHandler.bind(this));
  }
  
  // Event handlers for filtering and sorting
}
```

### Cart Components
Cart functionality includes:
- Cart drawer for quick access
- Cart notification for added items
- Quantity adjustments with AJAX updates
- Cart page with full details

The cart notification component listens for item-added-to-cart events:
```javascript
class CartNotification extends HTMLElement {
  constructor() {
    super();
    // Event listeners...
    document.addEventListener('item-added-to-cart', (event) => this.updateNotification(event.detail));
  }
  
  // Methods for showing/hiding notifications
}
```

### Search Components
Search functionality includes:
- Predictive search with live results
- Search page with filtering
- Keyboard navigation support

The predictive search component fetches results as you type:
```javascript
class PredictiveSearch extends HTMLElement {
  // Methods for handling search input and displaying results
  getSearchResults(searchTerm) {
    fetch(`/search/suggest?q=${encodeURIComponent(searchTerm)}&section_id=predictive-results`)
      .then(response => response.text())
      .then(text => {
        // Parse and display search results
      });
  }
}
```

## File Structure

```
├── assets/              # JavaScript, CSS, and SVG files
│   ├── *.js             # JavaScript components and utilities
│   ├── *.css            # CSS files for styling
│   └── *.svg            # SVG icons and images
├── config/              # Theme settings and configuration
│   ├── settings_data.json    # Theme settings data
│   └── settings_schema.json  # Theme settings schema
├── layout/              # Theme layout templates
│   └── theme.liquid     # Main theme layout
├── locales/             # Translation files
│   ├── en.default.json  # Default English translations
│   └── *.json           # Other language translations
├── sections/            # Theme sections
│   ├── header.liquid    # Header section
│   ├── main-product.liquid  # Product page section
│   └── ...              # Other sections
├── snippets/            # Reusable components
│   ├── component-*.liquid  # Component snippets
│   └── ...              # Other snippets
└── templates/           # Page templates
    ├── product.json     # Product page template
    ├── collection.json  # Collection page template
    └── ...              # Other templates
```

## Installation and Setup

### Prerequisites
- [Shopify CLI](https://shopify.dev/themes/tools/cli) installed
- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Development Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/EcomExperts-io/Base.git
   cd Base
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Connect to your Shopify store:
   ```bash
   shopify login
   ```

4. Start development server:
   ```bash
   shopify theme serve
   ```

### Deployment
To deploy the theme to your Shopify store:
```bash
shopify theme push
```

## Customization

### Theme Settings
The theme includes comprehensive settings in the Shopify admin:
- Logo and favicon
- Color schemes
- Typography options
- Layout settings
- Social media links
- Cart behavior options

### Creating New Sections
To create a new section:
1. Add a new Liquid file in the `sections/` directory
2. Register the section in the theme editor schema
3. Add the section to templates as needed

### Modifying Components
To modify existing components:
1. Locate the component in the `snippets/` directory
2. Make changes to the Liquid markup
3. If needed, update the corresponding JavaScript in the `assets/` directory

## Development Workflow

### Code Standards
This theme follows Shopify's code standards:
- ESLint with Shopify configuration
- Prettier with Liquid plugin
- Consistent naming conventions

### Testing Changes
When making changes:
1. Test on multiple devices and browsers
2. Verify performance using Lighthouse
3. Check for Liquid errors in the theme editor
4. Validate accessibility compliance

### Version Control
Follow these practices for version control:
1. Create feature branches from `development`
2. Use descriptive commit messages
3. Create pull requests for review
4. Merge to `development` for testing
5. Merge to `main` for production releases

## Third-Party Libraries

The theme uses a carefully selected set of third-party libraries:

### Alpine.js (v3.14.8)
- **Purpose**: Lightweight JavaScript framework for component behavior
- **Usage**: UI state management and interactivity
- **Documentation**: [Alpine.js Docs](https://alpinejs.dev/)

### Liquid AJAX Cart (v2.1.1)
- **Purpose**: Cart functionality without custom JavaScript
- **Usage**: Real-time cart updates and synchronization
- **Documentation**: [Liquid AJAX Cart Docs](https://liquid-ajax-cart.js.org/)

### Swiper (v7.4.1)
- **Purpose**: Modern mobile touch slider
- **Usage**: Product image galleries
- **Documentation**: [Swiper Docs](https://swiperjs.com/)

## Contributing Guidelines

Please refer to [CONTRIBUTING.md](CONTRIBUTING.md) for detailed information on how to contribute to this theme.

### Quick Start for Contributors
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting: `npm run lint`
5. Submit a pull request

## License

This theme is licensed under the [MIT License](LICENSE.md).
