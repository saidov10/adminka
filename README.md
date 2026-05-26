# FastCart Admin Panel 🚀

Современная и быстрая административная панель для управления интернет-магазином. Разработана на базе **React + Vite** с упором на производительность, модульную структуру и удобный пользовательский интерфейс с полной поддержкой темного режима (**Dark Mode**).

---

## 🛠 Технологический стек

* **Фреймворк / Сборщик:** [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
* **Язык программирования:** [TypeScript](https://www.typescriptlang.org/)
* **Управление состоянием:** [Redux Toolkit](https://redux-toolkit.js.org/) (AsyncThunk для работы с API)
* **Стилизация:** [Tailwind CSS](https://tailwindcss.com/)
* **Компоненты интерфейса:** [shadcn/ui](https://ui.shadcn.com/) (на базе Radix UI)
* **Иконки:** [Lucide React](https://lucide.dev/)
* **Работа с формами:** [Formik](https://formik.org/) + валидация [Yup](https://github.com/jquense/yup)
* **HTTP-клиент:** [Axios](https://axios-http.com/) (с кастомной конфигурацией токенов)
* **Маршрутизация:** [React Router DOM v6](https://reactrouter.com/)

---

## 📂 Структура проекта

```text
src/
├── assets/             # Статические ресурсы (логотипы, изображения)
├── components/         # Общие компоненты интерфейса (Header, Sidebar и т.д.)
│   └── ui/             # Компоненты системы дизайна (shadcn/ui: Dialog, Input, Button)
├── pages/              # Основные страницы админ-панели
│   ├── Dashboard.tsx   # Главная страница аналитики
│   ├── Products.tsx    # Добавление и редактирование товаров
│   ├── Categories.tsx  # Управление категориями товаров
│   ├── Brands.tsx      # Управление брендами (CRUD)
│   └── Banners.tsx     # Управление слайдерами и баннерами на главной
├── reducer/            # Слайсы Redux Toolkit (управление состоянием)
│   ├── brandsSlice.ts  # Состояние и асинхронные экшены для брендов
│   └── productsSlice.ts # Состояние для работы с продуктами
├── store/              # Конфигурация Redux Store
│   └── store.ts        # Настройка главного хранилища приложения
└── utils/              # Вспомогательные утилиты
    └── token.ts        # Конфигурация Axios, интерцепторы и работа с JWT-токенами