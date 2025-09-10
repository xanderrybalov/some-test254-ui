# Testing Guide

## 🧪 Тестовый стек

- **Vitest** - современный и быстрый test runner для Vite проектов
- **React Testing Library** - библиотека для тестирования React компонентов
- **jsdom** - эмуляция DOM окружения для тестов
- **Custom Test Utilities** - готовые утилиты для тестирования с Redux и Router

## 🏃‍♂️ Команды для запуска

```bash
# Запуск всех тестов
npm test

# Запуск в watch режиме (автоматически перезапускаются при изменениях)
npm run test:watch

# Запуск один раз
npm run test:run

# Запуск с покрытием кода
npm run test:coverage

# Запуск UI для тестирования (интерактивный режим)
npm run test:ui
```

## 📁 Структура тестов

```
src/
├── __tests__/           # Интеграционные тесты
├── components/__tests__/ # Тесты компонентов
├── store/__tests__/     # Тесты Redux slices
├── utils/__tests__/     # Тесты утилит
└── test/               # Тестовые утилиты и настройки
    ├── setup.ts        # Настройка тестового окружения
    └── utils.tsx       # Вспомогательные функции для тестов
```

## 🎯 Что тестируется

### Redux Slices
- ✅ **userMovieSlice** - создание, удаление, получение пользовательских фильмов
- ✅ **favoritesSlice** - управление избранными фильмами, локальное хранение
- ✅ **Async thunks** - API запросы, обработка ошибок
- ✅ **Reducers** - изменение состояния

### Компоненты
- ✅ **MovieList** - отображение списка фильмов, состояния загрузки/ошибки
- ✅ **AddMovieModal** - форма добавления фильма, валидация полей
- ✅ **User interactions** - клики, наведения, заполнение форм

### API Утилиты
- ✅ **ApiService** - HTTP методы (GET, POST, PUT, DELETE)
- ✅ **Authentication** - включение токенов в запросы
- ✅ **Error handling** - обработка сетевых ошибок и ошибок API

### Интеграционные тесты
- ✅ **Полные пользовательские сценарии** - от поиска до добавления в избранное
- ✅ **Аутентификация** - логин, регистрация, защищенные действия
- ✅ **Взаимодействие компонентов** - передача данных между компонентами

## 🔧 Кастомные утилиты

### `renderWithProviders()`
Готовая функция для рендеринга компонентов с Redux, Router и Theme провайдерами:

```tsx
import { renderWithProviders, mockUser } from '../test/utils'

test('should render with authentication', () => {
  const preloadedState = {
    auth: { isAuthenticated: true, user: mockUser }
  }
  
  renderWithProviders(<MyComponent />, { preloadedState })
})
```

### Мок данные
- `mockMovie` - тестовый фильм из OMDB
- `mockUserMovie` - пользовательский фильм  
- `mockUser` - тестовый пользователь

## 🎨 Best Practices

1. **Тестируй поведение, а не реализацию** - фокус на том, что видит пользователь
2. **Используй семантические селекторы** - `getByRole`, `getByLabelText` вместо className
3. **Мокируй внешние зависимости** - API, localStorage, browser APIs
4. **Каждый тест изолирован** - `beforeEach` для очистки состояния
5. **Осмысленные названия тестов** - описывай ожидаемое поведение

## 🚀 Примеры

### Тест компонента
```tsx
it('should render movies when available', () => {
  const preloadedState = {
    movies: { movies: [mockMovie], loading: false }
  }
  
  renderWithProviders(<MovieList />, { preloadedState })
  expect(screen.getByText(mockMovie.title)).toBeInTheDocument()
})
```

### Тест пользовательского взаимодействия
```tsx
it('should close modal when cancel is clicked', async () => {
  const user = userEvent.setup()
  const onClose = vi.fn()
  
  renderWithProviders(<AddMovieModal visible onClose={onClose} />)
  await user.click(screen.getByText('Cancel'))
  
  expect(onClose).toHaveBeenCalled()
})
```

### Тест Redux slice
```tsx
it('should handle addMovie.fulfilled', () => {
  const action = { type: addUserMovie.fulfilled.type, payload: mockMovie }
  const state = userMovieReducer(initialState, action)
  
  expect(state.userMovies).toContain(mockMovie)
  expect(state.loading).toBe(false)
})
```

## 📊 Coverage

Тесты покрывают критически важную функциональность:
- Управление состоянием приложения
- Основные пользовательские сценарии  
- API взаимодействие
- Обработка ошибок

Для получения детального отчета о покрытии кода запустите `npm run test:coverage`.
