# Playwright E2E Тестирование

Полноценный фреймворк для E2E и API тестирования с TypeScript, Page Objects, API слоем и CI/CD интеграцией.

## 📁 Структура проекта

```
hh-playwright-ts/
├── src/
│   ├── api/                    # API слой
│   │   ├── base.api.ts         # Базовый класс API с логированием
│   │   ├── auth.api.ts        # API авторизации
│   │   ├── users.api.ts       # API пользователей
│   │   ├── todos.api.ts       # API задач
│   │   └── api.factory.ts     # Фабрика API
│   ├── pages/                 # Page Objects
│   │   ├── base.page.ts       # Базовый класс страницы
│   │   ├── login.page.ts      # Страница входа
│   │   ├── register.page.ts   # Страница регистрации
│   │   └── todos.page.ts      # Страница задач
│   ├── fixtures/              # Playwright фикстуры
│   │   └── index.ts          # Кастомные fixtures
│   ├── data/                  # Фабрика данных
│   │   └── data.factory.ts   # Генераторы тестовых данных
│   ├── helpers/               # Утилиты
│   │   ├── response.validator.ts  # Валидация API ответов
│   │   └── logger.ts             # Логирование
│   ├── types/                 # TypeScript типы
│   │   └── api.types.ts      # DTO и интерфейсы
│   ├── tests/
│   │   ├── api/              # API тесты
│   │   │   └── auth.api.test.ts
│   │   └── ui/               # UI/E2E тесты
│   │       └── auth.ui.test.ts
│   └── test.setup.ts         # Конфигурация тестов
├── load-tests/              # k6 нагрузочное тестирование
│   ├── scenarios.js          # Основные сценарии
│   └── health.js            # Health check
├── .github/workflows/        # CI/CD
│   └── ci.yml               # GitHub Actions
├── .env.dev                 # Конфиг для dev
├── .env.stage               # Конфиг для stage
├── playwright.config.ts     # Конфиг Playwright
├── tsconfig.json            # Конфиг TypeScript
├── eslintrc.json            # Конфиг ESLint
├── .prettierrc              # Конфиг Prettier
├── Dockerfile               # Docker образ
├── docker-compose.yml       # Docker compose
└── README.md                # Этот файл
```

## 🚀 Быстрый старт

### Установка

```bash
npm install
```

### Настройка окружения

Создай `.env` файл или используй готовый `.env.dev`:

```bash
ENV=dev
BASE_URL=http://localhost:3000
API_BASE_URL=http://localhost:3000/api
```

### Запуск тестов

```bash
# Все тесты
npm test

# С UI
npm run test:ui

# В headed режиме
npm run test:headed

# По тегам
npm run test:smoke        # @smoke тесты
npm run test:regression   # @regression тесты
npm run test:critical     # @critical тесты
npm run test:api          # @api тесты

# Параллельно
npm run test:parallel
```

## 🎯 Стратегия тестирования

### Теги

| Тег           | Описание                              | Применение                   |
| ------------- | ------------------------------------- | ---------------------------- |
| `@smoke`      | Smoke тесты - критический путь        | Быстрая проверка             |
| `@regression` | Полный набор регресса                 | Комплексное тестирование     |
| `@critical`   | Критические пользовательские сценарии | Обязательно перед деплоем    |
| `@api`        | Только API тесты                      | Без UI                       |
| `@e2e`        | End-to-end UI тесты                   | Полный пользовательский путь |

### Запуск по приоритету

```bash
# Только критические
npm run test:critical

# Только smoke (быстрая обратная связь)
npm run test:smoke

# Полная регрессия
npm run test:regression
```

## 🔌 API слой

### Использование

```typescript
import { apiTest } from '../test.setup';

apiTest.describe('API тесты', () => {
  apiTest('должен зарегистрировать пользователя', async ({ api }) => {
    const response = await api.auth.register({
      email: 'test@test.com',
      name: 'Тест Юзер',
      password: 'password123',
    });

    expect(response.status).toBe(201);
  });
});
```

### Доступные API

- `api.auth` - Авторизация (login, register, logout, me)
- `api.users` - Управление пользователями
- `api.todos` - CRUD операции с задачами

### Валидация ответов

```typescript
import { ResponseValidator, authResponseRules } from '../helpers/response.validator';

ResponseValidator.validateStructure(response, authResponseRules);
ResponseValidator.validateStatus(response, 200);
ResponseValidator.validateContains(response, 'token');
```

## 📦 Фикстуры

```typescript
// Автогенерируемые уникальные данные для каждого теста
test('мой тест', async ({ uniqueUser, uniqueTodo }) => {
  console.log(uniqueUser.email); // уникальный email
});

// Авторизованный пользователь
test('авторизованный тест', async ({ authenticatedUser }) => {
  console.log(authenticatedUser.token);
});
```

## 🧪 Data Factory

```typescript
import { DataFactory } from '../data/data.factory';

// Уникальный пользователь
const user = DataFactory.generateUser();

// Уникальная задача
const todo = DataFactory.generateTodo();

// Несколько элементов
const users = DataFactory.generateMultipleUsers(5);

// Свои данные
const user = DataFactory.generateUser({
  email: 'custom@test.com',
  name: 'Свое имя',
});
```

## 🐳 Docker

### Сборка и запуск

```bash
# Собрать образ
npm run docker:build
# или
docker build -t playwright-tests .

# Запустить тесты в контейнере
npm run docker:run
# или
docker run --rm playwright-tests
```

### Docker Compose

```bash
# Запустить все сервисы
npm run docker:compose
# или
docker-compose up -d

# Запустить определенное окружение
docker-compose up app-stage

# Запустить smoke тесты
docker-compose up app-smoke
```

### Подключенные тома

Результаты сохраняются в подключенные директории:

- `test-results/` - Результаты тестов
- `playwright-report/` - HTML отчеты
- `allure-results/` - Данные Allure

## 🔧 CI/CD

### GitHub Actions

Паплайн включает:

1. **Lint & TypeCheck** - ESLint, TypeScript, Prettier
2. **Smoke Tests** - Быстрые @smoke тесты на Chromium
3. **Full Tests** - Матрица по браузерам (chromium, firefox, webkit)
4. **API Tests** - Отдельный набор API тестов
5. **Load Tests** - k6 нагрузочное тестирование
6. **Report Generation** - Генерация Allure отчетов

### Переменные окружения

```yaml
ENV: dev|stage|prod
BASE_URL: URL приложения
API_BASE_URL: URL API
BROWSERS: chromium,firefox,webkit
CI: true
```

### Ручной запуск

Запусти пайплайн вручную из вкладки GitHub Actions.

## 📊 Отчеты

### Playwright HTML Report

```bash
npm run test:report
# или
npx playwright show-report
```

### Allure Report

```bash
# Сгенерировать отчет
npm run allure:generate
# или
allure generate allure-results -o allure-report

# Открыть отчет
npm run allure:serve
# или
allure serve
```

### Trace Viewer

```bash
npm run test:trace
# или
npx playwright show-trace <trace-file>
```

## ⚡ Нагрузочное тестирование

### k6 Load Tests

```bash
# Установить k6 (если не установлен)
# macOS: brew install k6
# Ubuntu: sudo apt-get install k6
# Windows: choco install k6

# Запустить нагрузочные тесты
npm run load:test
# или
k6 run load-tests/scenarios.js

# Запустить health check
k6 run load-tests/health.js
```

### Настройки

```javascript
// scenarios.js - настраиваемые стадии
export const options = {
  stages: [
    { duration: '30s', target: 10 }, // Разгон
    { duration: '1m', target: 50 }, // Удержание
    { duration: '30s', target: 0 }, // Снижение
  ],
};
```

## 🔨 Линтинг и форматирование

```bash
# Линт
npm run lint

# Исправить автоисправляемые проблемы
npm run lint:fix

# Форматировать код
npm run format

# Проверить типы TypeScript
npm run typecheck
```

## ⚙️ Конфигурация

### Файлы окружения

| Файл         | Использование |
| ------------ | ------------- |
| `.env.dev`   | Разработка    |
| `.env.stage` | Staging       |
| `.env.prod`  | Production    |

### Playwright Config

Основные настройки в `playwright.config.ts`:

- `fullyParallel: true` - Запуск тестов параллельно
- `retries` - Повтор упавших тестов (CI: 2, локально: 0)
- `workers` - Параллельные воркеры (CI: 2, локально: без ограничений)
- `reporter` - HTML, JSON, Allure, List
- `trace`, `video`, `screenshot` - При ошибках

### TypeScript Strict Mode

Включен полный strict режим:

- `strict: true`
- `noImplicitAny: true`
- `strictNullChecks: true`
- `noUnusedLocals: true`

## 🧹 Правила качества

- **Без типов `any`** - Используй правильную типизацию
- **Без хардкода данных** - Используй DataFactory
- **Без прямых HTTP вызовов** - Используй API слой
- **Без локаторов в тестах** - Используй методы Page Object
- **Уникальные данные на тест** - Изоляция тестов
- **Понятные сообщения об ошибках** - Описательные assertions

## 📝 Написание тестов

### API тест

```typescript
import { apiTest, expect, DataFactory, ResponseValidator } from '../test.setup';
import { authResponseRules } from '../helpers/response.validator';

apiTest('@smoke @critical должен зарегистрировать пользователя @api', async ({ api }) => {
  const user = DataFactory.generateUser();

  const response = await api.auth.register({
    email: user.email,
    name: user.name,
    password: user.password,
  });

  expect(response.status).toBe(201);
  ResponseValidator.validateStructure(response, authResponseRules);
});
```

### UI тест

```typescript
import { uiTest, expect } from '../test.setup';
import { LoginPage, TodosPage } from '../pages';
import { DataFactory } from '../data/data.factory';

uiTest('@smoke должен добавить задачу @e2e', async ({ todosPage }) => {
  const todo = DataFactory.generateTodo();

  await todosPage.navigate();
  await todosPage.addTodo(todo.title);

  await expect(todosPage.page.locator('.todo-item')).toContainText(todo.title);
});
```

## 🤝 Вклад в проект

1. Создай ветку для фичи
2. Следуй стилю кода (ESLint + Prettier)
3. Добавь тесты для новой функциональности
4. Убедись что все тесты проходят
5. Обнови документацию

## 📄 Лицензия

MIT
