import { derived, readable, writable } from "../src/index";
import { Observable } from "../src/Observable";

/**
 * Counter
 */

const counter = document.querySelector("#counter") as HTMLSpanElement;
const increment = document.querySelector("#increment") as HTMLButtonElement;
const decrement = document.querySelector("#decrement") as HTMLButtonElement;
const reset = document.querySelector("#reset") as HTMLButtonElement;

const count = writable(0);

count.subscribe((n) => {
  counter.innerHTML = `${n}`;
});

increment.onclick = () => {
  count.update((x) => x + 1);
};

decrement.onclick = () => {
  count.update((x) => x - 1);
};

reset.onclick = () => {
  count.set(0);
};

/**
 * Opened since
 */
const since = document.querySelector("#since") as HTMLSpanElement;

const startAt = Date.now();

const clock = readable((set) => {
  setInterval(() => {
    set(Date.now());
  }, 1000);
}, Date.now());

clock.subscribe((t) => {
  const delta = Math.floor((t - startAt) / 1000);
  since.innerHTML = `${delta}s`;
});

/**
 * Derived square
 */
const input = document.querySelector("#number") as HTMLInputElement;
const square = document.querySelector("#square") as HTMLSpanElement;

const inputValue = writable(0);

input.oninput = () => {
  let parsedInt = parseInt(input.value);
  if (isNaN(parsedInt)) {
    parsedInt = 0;
  }
  inputValue.set(parsedInt);
};

const squareValue = derived(inputValue, (x) => x * x);

squareValue.subscribe((x) => {
  square.innerHTML = `${x}`;
});

/**
 * Search book
 */
const search = document.querySelector("#search") as HTMLInputElement;
const view = document.querySelector("#view") as HTMLDivElement;

const searchValue = writable("");

search.oninput = () => {
  searchValue.set(search.value);
};

type AsyncBooks = "notAsked" | "pending" | "failure" | { results: any[] };

const resultValue = derived<Observable<string>, AsyncBooks>(
  searchValue,
  (search, set) => {
    console.log(search);
    if (search === "") {
      set("notAsked");
      return;
    }

    set("pending");
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      fetch(`https://gutendex.com/books/?search=${search}`, {
        signal: controller.signal,
      })
        .then((resp) => resp.json())
        .then((items) => set(items))
        .catch((reason) => {
          if (!(reason instanceof DOMException)) {
            set("failure");
          }
        });
    }, 500);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  },
  "notAsked"
);

resultValue.subscribe((result) => {
  if (typeof result === "string") {
    if (result === "notAsked") {
      view.innerHTML = "";
    } else if (result === "pending") {
      view.innerHTML = "loading...";
    } else if (result === "failure") {
      view.innerHTML = "An error occurred.";
    }
  } else {
    const books = result.results.map(
      (r) => `${r.title} by ${r.authors.map((a) => a.name).join(" and ")}`
    );
    const uniqueBooks = [...new Set(books)];
    view.innerHTML = `<ul>${uniqueBooks
      .map((book) => `<li>${book}</li>`)
      .join("")}</ul>`;
  }
});
