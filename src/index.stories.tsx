import { faker } from '@faker-js/faker';
import { ComponentMeta } from '@storybook/react';
import { times } from 'lodash';
import { useRef } from 'react';
import { Search, SearchItem } from '.';

export default {
  title: 'Search',
  component: Search,
} as ComponentMeta<typeof Search>;

function simpleList(size: number, generator: () => string) {
  const list: SearchItem[] = [];

  times(size, () => {
    const item = generator();

    list.push({
      node: <p>{item}</p>,
      query: item,
    });
  });

  return list;
}

export function Addresses1000() {
  const input = useRef<HTMLInputElement>(null);
  const list = simpleList(1000, faker.address.streetAddress);

  return (
    <>
      <input ref={input} />
      <Search input={input} list={list} />
    </>
  );
}

export function Names1000() {
  const input = useRef<HTMLInputElement>(null);
  const list = simpleList(1000, faker.name.fullName);

  return (
    <>
      <input ref={input} />
      <Search input={input} list={list} />
    </>
  );
}

export function Fallback() {
  const input = useRef<HTMLInputElement>(null);
  const list = simpleList(5, faker.name.fullName);

  return (
    <>
      <input ref={input} />
      <Search
        input={input}
        list={list}
        fallback={<p style={{ color: 'gray' }}>No results found</p>}
      />
    </>
  );
}

export function Debounce() {
  const input = useRef<HTMLInputElement>(null);
  const list = simpleList(5, faker.name.fullName);

  return (
    <>
      <input ref={input} />
      <Search input={input} list={list} debounce={500} />
    </>
  );
}

export function OnFirstItemChange() {
  const input = useRef<HTMLInputElement>(null);
  const paragraph = useRef<HTMLParagraphElement>(null);
  const list = simpleList(5, faker.name.fullName);

  return (
    <>
      <p ref={paragraph}>First item: {list[0].query}</p>

      <hr />

      <input ref={input} />
      <Search
        input={input}
        list={list}
        onFirstItemChange={(item) => {
          if (paragraph.current) {
            paragraph.current.innerText = `First item: ${item?.query}`;
          }
        }}
      />
    </>
  );
}

export function OnNoResults() {
  const input = useRef<HTMLInputElement>(null);
  const paragraph = useRef<HTMLParagraphElement>(null);
  const list = simpleList(5, faker.name.fullName);
  let count = 0;

  return (
    <>
      <p ref={paragraph}>Number of times there have been no results: 0</p>

      <hr />

      <input ref={input} />
      <Search
        input={input}
        list={list}
        onNoResults={() => {
          if (paragraph.current) {
            count++;
            paragraph.current.innerText = `Number of times there have been no results: ${count}`;
          }
        }}
      />
    </>
  );
}
