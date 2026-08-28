# Playwright Automation Test Suite

Automation test suite for Web UI and API testing using Playwright and TypeScript.

---

## Tools & Libraries

| Tool/Library | Version | Purpose |
|---|---|---|
| Node.js | 20+ | Runtime |
| Playwright | ^1.62.1 | Web testing framework |
| TypeScript | ^5.0 | Type safety |

---

## Project Structure

```
playwright/
├── .github/
│   └── workflows/
│       └── playwright.yml          # GitHub Actions CI workflow
├── tests/
│   ├── api/
│   │   ├── apiClient.ts            # Shared API client for dummyapi.io
│   │   └── user.api.spec.ts        # API test cases (User CRUD + Tags)
│   ├── fixtures/
│   │   └── testData.ts             # Test data & constants
│   ├── pages/
│   │   ├── BasePage.ts             # Base page with common utilities
│   │   ├── LoginPage.ts            # Login/Signup page object
│   │   ├── ProductsPage.ts         # Product listing page object
│   │   ├── ProductDetailPage.ts    # Product detail page object
│   │   ├── CartPage.ts             # Shopping cart page object
│   │   └── CheckoutPage.ts         # Checkout page object
│   ├── cart.spec.ts                # Cart & checkout tests
│   ├── login.spec.ts               # Login functionality tests
│   └── products.spec.ts            # Product browsing tests
├── playwright.config.ts            # Playwright configuration
├── package.json
└── README.md
```

---

## Test Scenarios

### Web UI Tests (Target: https://www.demoblaze.com/)

| Feature | Scenario | Count |
|---|---|---|
| `login.spec.ts` | Login modal, form elements, validation (invalid, empty, username-only) | 5 |
| `products.spec.ts` | Homepage display, product detail, navigation, category filtering (Phones, Laptops, Monitors) | 10 |
| `cart.spec.ts` | Add to cart, verify total price, checkout process | 3 |
| **Total** | | **18** |

### API Tests (Target: https://dummyapi.io/data/v1)

| Feature | Scenario | Count |
|---|---|---|
| `user.api.spec.ts` | GET users, GET single user, 404 handling, limit values | 4 |
| `user.api.spec.ts` | POST create user, create & retrieve | 2 |
| `user.api.spec.ts` | PUT update user, update firstName only | 2 |
| `user.api.spec.ts` | DELETE user (create then delete) | 1 |
| `user.api.spec.ts` | GET tags, pagination, tag validation | 3 |
| **Total** | | **12** |

---

## Design Patterns

| Pattern | Implementation |
|---|---|
| **Page Object Model (POM)** | 6 page classes encapsulate locators and actions |
| **Data-Driven** | Centralized test data in `fixtures/testData.ts` |
| **API Client Pattern** | Shared `ApiClient` class with GET/POST/PUT/DELETE methods |
| **OOP** | Class-based page objects with inheritance from `BasePage` |

---

## How to Run Tests

### Prerequisites
- Node.js 20 or higher
- npm

### Install Dependencies
```bash
npm install
npx playwright install
```

### Run All Tests
```bash
npx playwright test
```

### Run Only Web UI Tests
```bash
npx playwright test tests/login.spec.ts tests/products.spec.ts tests/cart.spec.ts
```

### Run Only API Tests
```bash
npx playwright test tests/api/
```

### Run Tests in Specific Browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run Tests with HTML Report
```bash
npx playwright test
npx playwright show-report
```

---

## CI/CD

### GitHub Actions Workflow

The workflow (`.github/workflows/playwright.yml`) runs on:
- **Push** to branch `main`
- **Pull Request** to branch `main`
- **Manual trigger** via `workflow_dispatch`

### Pipeline Structure
```
test (4 shards in parallel)
  ├── shard 1
  ├── shard 2
  ├── shard 3
  └── shard 4
```

Each shard runs all tests across 3 browsers (chromium, firefox, webkit) with:
- 2 retries on failure
- HTML report upload as artifact
- 14-day retention

---

## Test Reports

After running tests, HTML report is generated in `playwright-report/`.

```bash
npx playwright show-report
```

---

## Screenshot Evidence

Screenshots are captured at two levels as test evidence:

### 1. Auto Screenshots (config-level)
- `screenshot: 'on'` in `playwright.config.ts`
- One screenshot captured automatically after every test
- Saved to `test-results/` and embedded in the HTML report

### 2. Manual Screenshots (key steps)
- Captured at important steps using `page.screenshot()`
- Saved to `screenshots/` with numbered prefixes per folder to show flow order

```
screenshots/
├── login/        (01-05)  modal, form elements, validation states
├── products/     (01-11)  homepage, detail, price, add-to-cart, categories
└── cart/         (01-04)  cart with item, checkout form, checkout success
```

In CI (GitHub Actions), both `playwright-report-*` and `screenshots-*` are uploaded as artifacts per shard and can be downloaded from the Actions run.
