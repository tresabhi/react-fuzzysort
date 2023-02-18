# React Fuzzysort

🔎 [The Fuzzysort library](https://github.com/farzher/fuzzysort) implemented as a handy React component

## Installation

```bash
npm install react-fuzzysort
# or
yarn add react-fuzzysort
```

## Basic Usage

```tsx
import { Search } from 'react-fuzzysort';

function Catalogue() {
  const input = useRef<HTMLInputElement>(null);

  return (
    <Wrapper>
      <SearchBar ref={input} />
      <Search
        input={input}
        fallback={<FallbackText>No results!</FallbackText>}
        list={[
          { query: 'carrot', node: <Item>🥕 Carrot</Item> },
          { query: 'banana', node: <Item>🍌 Banana</Item> },
          { query: 'ketchup', node: <Item>🍅 Ketchup</Item> },
          // and so on...
        ]}
      />
    </Wrapper>
  );
}
```

## Work Smarter By Mapping!

```tsx
const list = ['🥕 Carrot', '🍌 Banana', '🍅 Ketchup'];

return (
  <Search
    list={list.map((listItem) => ({
      query: listItem,
      node: <Item>{listItem}</Item>,
    }))}
  />
);
```

# Documentation

> **Info:** documentation is temporarily available in the README while my website undergoes construction

### Configuration Options

These are passed down as `props` to the `Search` component.

#### `list`

- A list of items to be searched from
- This is an array of objects (`SearchItem[]`)
- Search items includes:
  - `query`: the string that is compared against the input value
  - `node`: the thing that is rendered

#### `input`

- A React `ref` to the search input

#### `fallback`

- The fallback that is rendered when there are no results

#### `debounce`

- A debounce time avoids excessive rerenders
- By default, it is `0` which has proven to be fine for a couple thousand items

#### `onFirstItemChange`

- Fires when the first item in the list changes
- Does not fire on mount

#### `onNoResults`

- Fires when there are no results
- Does not fire when there are no results multiple times in a row

#### `keyOptions`

- Lets you tap into the configurations for the internally used fuzzysort library
- See [the fuzzysort documentation](https://github.com/farzher/fuzzysort)

# Changelogs

## v1.0.1

- Fixed several issues with `package.json`

## v1.0.0

- Added React Fuzzysort
