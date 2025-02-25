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

### Header Implementation

The header combines Alpine.js for UI state management and Liquid AJAX Cart for cart functionality. Here's how these libraries are used together to create a seamless user experience:

#### Alpine.js Implementation
The header uses Alpine.js for managing search functionality:

```liquid
<header
  x-data="{ searchOpen: false, searchTerm: '' }"
  @click.outside="searchOpen = false"
  @input="searchTerm = $event.target.value"
>
```

The search toggle uses Alpine's `$nextTick` for focus management, providing an enhanced user experience:

```liquid
<div id="header-actions_search" 
  @click="searchOpen = !searchOpen; $nextTick(() => { if (searchOpen) $refs.searchInput.focus() })">
  {{ 'icon-search.svg' | inline_asset_content }}
</div>
```

The search form uses Alpine's x-model and x-ref for input handling, creating a reactive search experience:

```liquid
<input
  type="search"
  name="q"
  x-model="searchTerm"
  x-ref="searchInput"
  x-show="searchOpen"
  @focus="$event.target.select()"
>
```

The cart toggle behavior changes based on the cart type setting, allowing for flexible configuration:

```liquid
<a
  id="header-cart-bubble"
  {%- if settings.cart_type == 'drawer' -%}
    @click.prevent="toggleCartDrawer"
  {%- else -%}
    href="{{ routes.cart_url }}"
  {%- endif -%}
>
```

#### Liquid AJAX Cart Integration
The cart count in the header automatically updates through Liquid AJAX Cart bindings, ensuring the UI stays in sync with the cart state:

```liquid
<div data-cart-count data-ajax-cart-bind="item_count">
  {{ cart.item_count }}
</div>
```

This integration creates a responsive header that reacts to user interactions and cart changes without page reloads, enhancing the overall shopping experience.

### Product Page Implementation

The product page tells an interesting story of how variant selection works. Let's follow the flow from user interaction to UI updates:

#### The Variant Selection Journey

It starts with the `<variant-selector>` element, which can be rendered in two ways based on the theme settings:

```liquid
<variant-selector data-picker-type="{{ block.settings.picker_type }}">
  {% if block.settings.picker_type == 'dropdown' %}
    <!-- Dropdown lists for each option -->
  {% else %}
    <!-- Radio buttons for each option -->
  {% endif %}
</variant-selector>
```

When a user interacts with either the dropdowns or radio buttons, it triggers our variant change flow:

```javascript
class ProductInfo extends HTMLElement {
  constructor() {
    super();
    // Listen for any variant changes
    this.variantSelector?.addEventListener('change', this.onVariantChange.bind(this));
  }

  onVariantChange(e) {
    // Kick off the section render process
    this.renderSection();
  }
}
```

The `renderSection` method is where the magic happens. It:
1. Collects the currently selected options
2. Makes a request to Shopify's Section Rendering API
3. Updates specific parts of the page with the response:

```javascript
renderSection() {
  // Request the section with current variant selections
  fetch(`${this.dataset.url}?option_values=${this.selectedOptionValues}&section_id=${this.dataset.section}`)
    .then((response) => response.text())
    .then((responseText) => {
      // Parse the returned HTML
      const html = new DOMParser().parseFromString(responseText, 'text/html');
      
      // Get the new variant data
      const variant = this.getSelectedVariant(html);

      // Update various parts of the page
      this.updateMedia(variant?.featured_media?.id);        // Update gallery
      this.updateURL(variant?.id);                         // Update URL
      this.updateVariantInputs(variant?.id);              // Update form inputs
      
      // Update specific sections using the new HTML
      this.updateSourceFromDestination(html, `price-${this.dataset.section}`);
      this.updateSourceFromDestination(html, `sku-${this.dataset.section}`);
      this.updateSourceFromDestination(html, `inventory-${this.dataset.section}`);
      this.updateSourceFromDestination(html, `add-to-cart-container-${this.dataset.section}`);
    });
}
```

This creates a seamless experience where selecting a new variant:
1. Triggers the change event
2. Fetches fresh HTML for the new variant
3. Updates multiple parts of the page (price, SKU, inventory, etc.)
4. All without a full page reload

The beauty of this approach is that it leverages Shopify's section rendering while maintaining a smooth user experience. Each part of the page updates independently, and the URL updates to reflect the selected variant, making it shareable and maintaining browser history.

#### Cart Event item-added-to-cart

The product page also handles cart interactions through a custom event. When an item is added to the cart, we need to notify other components (like the cart drawer) about this change:

```javascript
class ProductInfo extends HTMLElement {
  
  onCartUpdate(e) {
    const { requestState } = e.detail;
    
    // Only handle successful "add to cart" requests
    if (requestState.requestType === 'add' && requestState.responseData?.ok) {
      // Show cart drawer
      document.body.classList.add('js-show-ajax-cart');
      
      // Dispatch event for other components
      document.dispatchEvent(
        new CustomEvent('item-added-to-cart', {
          detail: requestState?.responseData?.body
        })
      );
    }
  }
}
```

This event allows for:
1. Automatic cart drawer opening when items are added
2. Other components to react to cart changes
3. Passing cart data to interested components

#### Liquid AJAX Cart Integration

The product page leverages Liquid AJAX Cart for form handling:

```liquid
<ajax-cart-product-form>
  {% form 'product', product, id: product_form_id, novalidate: 'novalidate' %}
    <input type="hidden" name="id" value="{{ selected_variant.id }}">
    <div id="add-to-cart-container-{{ section.id }}">
      <button
        id="AddToCart-{{ section.id }}"
        type="submit"
        name="add"
        {% if selected_variant.available == false %}disabled{% endif %}
      >
        {% if selected_variant.available == false %}
          Sold out
        {% else %}
          Add to cart
        {% endif %}
      </button>
    </div>
  {% endform %}
</ajax-cart-product-form>
```

The integration provides:
1. Automatic form submission handling
2. Real-time cart updates without page reloads
3. Cart state synchronization across components

When a product is added:
1. Liquid AJAX Cart intercepts the form submission
2. Handles the cart addition via AJAX
3. Triggers the `liquid-ajax-cart:request-end` event
4. Our code then handles the UI updates and notifications

This creates a seamless cart experience where:
- The cart updates instantly
- The UI responds immediately
- All components stay in sync
- The user gets immediate feedback

### Collection Page Implementation

The collection page tells an interesting story of how filtering, sorting, and pagination work together through two main event handlers. Let's follow the flow of data through the system:

#### Event Handling Flow

The `<collection-info>` element manages two primary events:

```javascript
class CollectionInfo extends HTMLElement {
  constructor() {
    super();
    this.debounceOnChange = debounce((event) => this.onChangeHandler(event), 800);
    this.addEventListener('change', this.debounceOnChange.bind(this));
    this.addEventListener('click', this.onClickHandler.bind(this));
  }
}
```

1. **Filter Changes (`onChangeHandler`)**
   - Triggered by filter form changes (checkboxes, price range, etc.)
   - Debounced to prevent rapid consecutive updates
   
```javascript
onChangeHandler = (event) => {
  if (!event.target.matches('[data-render-section]')) return;

  const form = event.target.closest('form') || document.querySelector('#filters-form') || document.querySelector('#filters-form-drawer');
  const formData = new FormData(form);
  let searchParams = new URLSearchParams(formData).toString();

  // Preserve search query if it exists
  if (window.location.search.includes('?q=')) {
    const existingParams = new URLSearchParams(window.location.search);
    const qValue = existingParams.get('q');
    searchParams = `q=${qValue}&${searchParams}`;
  }

  this.fetchSection(searchParams);
};
```

   This handler:
   - Checks if the changed element is meant to trigger a section update
   - Finds the closest filter form (supports multiple form locations)
   - Collects all filter values and converts to URL parameters
   - Preserves search query if present
   - Triggers section update with new parameters

2. **Navigation Changes (`onClickHandler`)**
   - Handles sorting and pagination and active filters badges clicks through data attributes
   
```javascript
onClickHandler = (event) => {
  if (event.target.matches('[data-render-section-url]')) {
    event.preventDefault();
    const searchParams = new URLSearchParams(event.target.dataset.renderSectionUrl.split('?')[1]).toString()
    
    this.fetchSection(searchParams);
  }
};
```

   This handler:
   - Checks for elements with `data-render-section-url` attribute
   - Extracts search parameters from the URL in the data attribute
   - Prevents default link behavior
   - Triggers section update with the extracted parameters

   Used by elements like active filters and pagination:
   
```liquid
<!-- Active filter removal -->
<div class="filter active-filter-item"
  data-render-section-url="{{ v.url_to_remove }}"
>
  <span>{{ f.label }}: {{ v.label }}</span>
  <div class="filter-close">
    {{- 'icon-close.svg' | inline_asset_content -}}
  </div>
</div>

<!-- Clear all filters -->
<div class="filter active-filter-item active-filter-clear-all"
  data-render-section-url="{{ collection.url }}"
>
  <span>Clear all filters</span>
</div>
```

The beauty of this implementation is that it creates a unified approach to handling all types of collection page interactions:
- Filter changes (checkboxes, price ranges, etc.)
- Sorting changes (price, name, etc.)
- Pagination (next/previous page)
- Active filter removal

All of these interactions use the same underlying mechanism:
1. Capture the interaction
2. Extract or build the appropriate URL parameters
3. Fetch the updated section HTML
4. Replace the current section content

This creates a seamless, SPA-like experience where the collection updates instantly without page reloads, maintaining the user's scroll position and state.

### Cart Components

The cart functionality is implemented through several interconnected components that work together to create a seamless shopping experience:

#### Cart Drawer
The cart drawer provides quick access to the cart without leaving the current page:

```liquid
<cart-drawer class="cart-drawer">
  <div class="cart-drawer__header">
    <h2>Your Cart</h2>
    <button class="cart-drawer__close" @click="document.body.classList.remove('js-show-ajax-cart')">
      {{ 'icon-close.svg' | inline_asset_content }}
    </button>
  </div>
  
  <div class="cart-drawer__content" data-ajax-cart-section>
    <!-- Cart items rendered here -->
  </div>
</cart-drawer>
```

The drawer is toggled by adding/removing the `js-show-ajax-cart` class on the body element, which triggers CSS transitions for smooth opening and closing:

```javascript
// Opening the cart drawer (from product page)
document.body.classList.add('js-show-ajax-cart');

// Closing the cart drawer (from close button)
document.body.classList.remove('js-show-ajax-cart');
```

The cart drawer content is automatically updated through Liquid AJAX Cart's section rendering:

```liquid
<div class="cart-drawer__content" data-ajax-cart-section>
  {% render 'cart-drawer-items' %}
  
  <div class="cart-drawer__footer">
    <div class="cart-drawer__totals">
      <span>Subtotal</span>
      <span data-ajax-cart-bind="cart.items_subtotal_price | money_with_currency">
        {{ cart.items_subtotal_price | money_with_currency }}
      </span>
    </div>
    
    <a href="{{ routes.cart_url }}" class="button button--primary button--full-width">
      View Cart
    </a>
    
    <a href="{{ routes.checkout_url }}" class="button button--secondary button--full-width">
      Checkout
    </a>
  </div>
</div>
```

The `data-ajax-cart-bind` attributes ensure that cart totals are always up-to-date without requiring custom JavaScript.

#### Cart Notification
The cart notification component provides immediate feedback when items are added to the cart:

```javascript
class CartNotification extends HTMLElement {
  constructor() {
    super();
    // Listen for the custom event dispatched by the product page
    document.addEventListener('item-added-to-cart', (event) => this.updateNotification(event.detail));
  }
  
  updateNotification(cartData) {
    // Extract the newly added item from the cart data
    const newItem = cartData?.items[0];
    if (!newItem) return;
    
    // Update notification content
    this.querySelector('[data-cart-notification-product-title]').textContent = newItem.product_title;
    this.querySelector('[data-cart-notification-image]').src = newItem.featured_image.url;
    this.querySelector('[data-cart-notification-price]').innerHTML = formatMoney(newItem.final_price);
    
    // Show the notification
    this.classList.add('is-active');
    
    // Set a timeout to hide the notification
    clearTimeout(this.hideTimeout);
    this.hideTimeout = setTimeout(() => {
      this.classList.remove('is-active');
    }, 5000);
  }
}
```

The notification appears briefly when a product is added to the cart, showing:
- Product image
- Product title
- Price
- A link to the cart

This provides immediate feedback to the user without interrupting their shopping experience.

#### Cart Item Quantity Updates
Cart item quantity updates are handled through Liquid AJAX Cart's data attributes:

```liquid
<div class="cart-item__quantity">
  <button 
    type="button" 
    data-ajax-cart-request-button
    data-href="{{ routes.cart_change_url }}"
    data-quantity="{{ item.quantity | minus: 1 }}"
    data-id="{{ item.key }}"
    {% if item.quantity == 1 %}disabled{% endif %}
  >
    -
  </button>
  
  <span>{{ item.quantity }}</span>
  
  <button 
    type="button" 
    data-ajax-cart-request-button
    data-href="{{ routes.cart_change_url }}"
    data-quantity="{{ item.quantity | plus: 1 }}"
    data-id="{{ item.key }}"
  >
    +
  </button>
</div>
```

When a user clicks the plus or minus buttons:
1. Liquid AJAX Cart intercepts the click
2. Sends an AJAX request to update the cart
3. Updates all cart-related elements on the page
4. No custom JavaScript required

This creates a responsive, interactive cart experience with minimal code.

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
