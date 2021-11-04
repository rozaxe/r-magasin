# Magasin

> **magasin** \\ma.ɡa.zɛ̃\\
> *A simple solution to reactive variable.*


```js
import { writable } from 'r-magasin'

const count = writable(0)

console.log(count.value)
// => 0

count.subscribe((c) => {
  console.log(`Count is ${c}`)
})
// => Count is 0

count.set(10)
// => Count is 10
```

## Installation

```sh
npm install r-magasin
```

## Writable

Allows to store a reactive value, updates its value and notify observers.

```js
import { writable } from 'r-magasin'

const count = writable(0)

console.log(count.value)
// => 0

count.subscribe((c) => {
  console.log(`Count is ${c}`)
})
// => Count is 0

count.set(10)
// => Count is 10

count.update((c) => c + 5)
// => Count is 15
```

## Readable

Allows to a store a reactive value based on a custom callback.

```js
import { readable } from 'r-magasin'

const startAt = Date.now()

const timer = readable((set) => {
  setInterval(() => {
    const seconds = Math.floor((Date.now() - startAt) / 1000)
    set(seconds)
  }, 1000)
}, 0)

console.log(timer.value)
// => 0

timer.subscribe((t) => {
  console.log(`Opened since: ${t}s`)
})

// => Opened since: 0s
// => Opened since: 1s
// => Opened since: 2s
// => ...
```

## Derived

Allows to derive a reactive value based on one or many reactive values

```js
import { writable, derived } from 'r-magasin'

const number = writable(3)
const square = derived(number, (x) => x * x)

console.log(square.value)
// => 9

square.subscribe((x) => {
  console.log(`Square of ${number.value} is ${x}`)
})
// => Square of 3 is 9

number.set(5)
// => Square of 5 is 25
```

## More

More examples, like cleanup effect and many inputs for derived, are available in `test/index.ts`.
