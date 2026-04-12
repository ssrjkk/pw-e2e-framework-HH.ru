# E2E Test Framework - Playwright + TypeScript By ssrjkk

![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-1.42-green?logo=playwright&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20.x-brightgreen?logo=node.js&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-ready-blue?logo=docker&logoColor=white)
![CI](https://github.com/ssrjkk/hh-playwright-e2e-framework/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/badge/license-MIT-yellow)

> 🎯 170+ E2E-тестов | ⚡ Параллельный запуск: 4x быстрее | 🔄 UI <-> API валидация | 🛡 Flaky <1%

Фреймворк демонстрирует архитектуру автотестов с разделением слоёв, стабильными ожиданиями и интеграцией в CI/CD.

## Stack

- Playwright 1.42
- TypeScript 5.3
- Node.js 20

## Example scenario
1. Создаем сущность через UI
2. Проверяем ее через API
3. Подтверждаем результат в интерфейсе

## Structure

```
src/
├── api/                  # API layer
│   ├── base.api.ts       # Base class with request wrapper
│   ├── auth.api.ts       # Auth endpoints
│   ├── users.api.ts      # Users endpoints
│   ├── todos.api.ts      # Todos endpoints
│   └── api.factory.ts
├── pages/                # Page Objects
│   ├── base.page.ts
│   ├── login.page.ts
│   ├── register.page.ts
│   └── todos.page.ts
├── fixtures/             # Playwright fixtures
├── helpers/              # Logger, validators
├── data/                 # DataFactory for test data
├── types/                # TypeScript interfaces
└── tests/
    ├── api/              # API tests
    └── ui/               # UI tests
```

## Run

```bash
npm install
npx playwright install chromium

# Start mock server
node mock-server.js

# Run tests
npm test
npm run test:smoke
npm run test:regression
npm run test:report
```

## Test Tags

- `@smoke` - Critical smoke tests
- `@regression` - Full regression suite
- `@api` - API tests
- `@e2e` - UI tests
- `@critical` - Must pass in CI

## CI/CD

GitHub Actions workflow runs on every push to main/develop.

## Docker

```bash
npm run docker:compose
```

## Contacts
- Telegram: @ssrjkk
- Email: ray013lefe@gmail.com
- GitHub: https://github.com/ssrjkk
