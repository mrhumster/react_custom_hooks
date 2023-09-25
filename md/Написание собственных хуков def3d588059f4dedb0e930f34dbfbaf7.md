# Написание собственных хуков

[Reusing Logic with Custom Hooks – React](https://react.dev/learn/reusing-logic-with-custom-hooks)

Предсавим что нам нужен статус бар который будет показывать состояние сети:

```jsx
import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true)
    }
    function handleOffline() {
      setIsOnline(false)
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>
  );
}

export default App;
```

Представим что нам нужна кнопка, которая будет фиксировать статус в сети и не работать пока не будет онлайн.

```jsx
import React, {useEffect, useState} from 'react';
import './App.css';

export default function SaveButton(){
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true)
    }
    function handleOffline() {
      setIsOnline(false)
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  function handleSaveClick() {
    console.log('✅ Progress saved')
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>{isOnline ? 'Save progress' : 'Reconnecting...'}</button>
  );
}
```

![Untitled](%D0%9D%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D0%B5%20%D1%81%D0%BE%D0%B1%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D1%8B%D1%85%20%D1%85%D1%83%D0%BA%D0%BE%D0%B2%20def3d588059f4dedb0e930f34dbfbaf7/Untitled.png)

![Untitled](%D0%9D%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D0%B5%20%D1%81%D0%BE%D0%B1%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D1%8B%D1%85%20%D1%85%D1%83%D0%BA%D0%BE%D0%B2%20def3d588059f4dedb0e930f34dbfbaf7/Untitled%201.png)

# Извлечение собственного пользовательского перехватчика из компонента

Представте что подобно `useEffect` и `useState` будет хук `useOnlineStatus` . Тогда оба компонента можно было бы упростить и устранить дублирование между ними:

```jsx
export function StatusBar() {
    const isOnline = useOnlineStatus();
    return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>
}

function SaveButton() {
    const isOnline = useOnlineStatus();

    function handleSaveClick() {
        console.log('✅ Progress saved')
    }

    return (
        <button disabled={!isOnline} onClick={handleSaveClick}>
            {isOnline? 'Save progress' : 'Reconnecting...'}
        </button>
    )
}
```

Хотя такого встроенног оперехватчика нет, вы можете написать его самостоятельно. Обьявите вызываемую функцию `useOnlineStatus` и перенесите весь дублированный код из компонентов, которы вы написали ранее:

```jsx
import {useEffect, useState} from "react";

export function useOnlineStatus() {
    const [isOnline, setIsOnline] = useState(true)
    useEffect(() => {
        function handleOnline() {
            setIsOnline(true)
        }
        function handleOffline() {
            setIsOnline(false)
        }
        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)
        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])
    return isOnline
}
```

```jsx
import {useOnlineStatus} from "../hooks";

export function StatusBar() {
    const isOnline = useOnlineStatus();
    return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>
}

export function SaveButton() {
    const isOnline = useOnlineStatus();

    function handleSaveClick() {
        console.log('✅ Progress saved')
    }

    return (
        <button disabled={!isOnline} onClick={handleSaveClick}>
            {isOnline? 'Save progress' : 'Reconnecting...'}
        </button>
    )
}
```

```jsx
import React from 'react';
import { StatusBar, SaveButton } from './components'
import './App.css';

export default function App(){
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

![Untitled](%D0%9D%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D0%B5%20%D1%81%D0%BE%D0%B1%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D1%8B%D1%85%20%D1%85%D1%83%D0%BA%D0%BE%D0%B2%20def3d588059f4dedb0e930f34dbfbaf7/Untitled%202.png)

Теперь в наших компонентах не так много повторяющейся логики. *Что более важно, код внутри них описывает, что они хотят сделать, а не как это сделать*.

## Имена хуков всегда начинаются в `use`

1. **Имена компонентов React должны начинаться с заглавной буквы**, как `StatusBar` и `SaveButton`. Компоненты React также должны возвращать что-то, что React умеет отображать, например, фрагмент JSX.
2. **Имена подключений должны начинаться с `use`, за которым следует заглавная буква**, например `useState` или `useOnlineStatus` . Перехватчики могут возвращать произвольные значения.