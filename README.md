# 🧩 react-soft-no-ssr
A lightweight NoSSR alternative for React that avoids blocking the 
main thread — even when used many times on a single page.

## ✨ Motivation
In server-side rendered frameworks like Next.js, it’s common to use a 
NoSSR wrapper to defer certain components to client-only rendering. 
However, when many such components are rendered on the same page, they can 
collectively block the main thread, causing jank and performance issues.

`react-soft-no-ssr` offers a safer, softer approach — rendering 
client-only components in a way that avoids overwhelming the main thread, 
especially when used repeatedly.

## 🚀 Features
- ✅ Fully client-side rendering for wrapped components 
- 🧠 Designed to reduce main thread blocking<
- ⚙️ Framework-agnostic (works in Next.js, Remix, etc.)
- 📦 Tiny and tree-shakable
- 🧩 Drop-in replacement for traditional NoSSR

## 📦 Installation

```bash 
npm install react-soft-no-ssr 
```

## 🛠 Usage
Add general provider to your app (example for Next.js):

```tsx
// pages/_app.tsx
import { NoSSRProvider } from 'react-soft-no-ssr';

export default function App({ Component, pageProps }) {
  return (
    <NoSSRProvider>
      <Component {...pageProps} />
    </NoSSRProvider>
  );
}
```

```tsx
// pages/pageName/index.ts
import { NoSSR } from 'react-soft-no-ssr';

function SomePage() {
  return (
    <>
      <NoSSR fallback={<div>Loading widget...</div>}>
        <HeavyClientOnlyWidget />
      </NoSSR>

      <NoSSR>
        <AnotherClientOnlyComponent />
      </NoSSR>
    </>
  );
}
```

## 📋 API
### `<NoSSRProvider>`
The provider component that must wrap your app (e.g. in _app.tsx) to 
coordinate the scheduling and priority of NoSSR client-only components.


| Prop             | Type                | Description                                                                                                                | Default |
|------------------|---------------------|----------------------------------------------------------------------------------------------------------------------------|---------|
| `priorityLevels` | `number`            | Maximum count of priority levels. Defines how many priority tiers are allowed for tasks.                                   | 1       |
| `maxWeight`      | `number \| null`    | If set, unblocks the main thread only when the sum of task weights exceeds this value. If null, unblocks after every task. | null    |
| `defaultWeight`  | `number (optional)` | Default weight assigned to each task if maxWeight is used.                                                                 | 1       |

### `<NoSSR>`
The wrapper component to defer rendering to the client side with 
optional control over scheduling and priority.

| Prop         | Type                | Description                                                                                | Default |
|--------------|---------------------|--------------------------------------------------------------------------------------------|---------|
| `fallback`   | `React.JSX.Element` | Optional fallback element rendered during SSR before client hydration.                     | —       |
| `shouldShow` | `() => boolean`     | Optional function to conditionally control if the client component should be shown.        | —       |
| `id`         | `number \| string`  | Optional identifier for the task. Useful for tracking or debugging.                        | —       |
| `weight`     | `number \| null`    | Task weight used for scheduling with `maxWeight`.                                          | —       |
| `priority`   | `number`            | Task priority level. Minimum `0`, maximum `priorityLevels - 1` as defined in the provider. | —       |

