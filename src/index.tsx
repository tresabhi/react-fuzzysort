import { go } from 'fuzzysort';
import debounce from 'lodash.debounce';
import { Fragment, ReactNode, RefObject, useEffect, useState } from 'react';

/**
 * An item that can be searched through
 */
export type SearchItem = {
  /**
   * The string that is used to both discriminate and search an item
   */
  query: string;
  /**
   * The thing that gets rendered;
   * [don't forget to add keys](https://reactjs.org/docs/lists-and-keys.html)!
   */
  node: ReactNode;
};

/**
 * Props for configuring the behavior of Search
 */
export interface SearchProps {
  /**
   * A list of items that can be searched through
   */
  list: SearchItem[];
  /**
   * A ref to an input based on which this component will react
   */
  input: RefObject<HTMLInputElement>;
  /**
   * If no results were found, this node will be displayed
   */
  fallback?: ReactNode;
  /**
   * The debounce time to avoid excessive rerenders
   */
  debounce?: number;
  /**
   * Called when the first item on the list changes to a different item; the
   * item argument will be undefined when there are no results
   */
  onFirstItemChange?: (item?: SearchItem) => void;
  /**
   * Called when there are no results
   */
  onNoResults?: () => void;
  /**
   * Options for the fuzzysort library that is used under the hood
   *
   * [Fuzzysort documentation](https://github.com/farzher/fuzzysort#readme)
   */
  keyOptions?: Omit<Fuzzysort.KeyOptions, 'key'>;
}

/**
 * Searches through a list of nodes based on the value on input powered by
 * the fuzzysort library
 */
export function Search({
  list,
  input,
  fallback,
  debounce: debounceTime = 0,
  onFirstItemChange,
  onNoResults,
  keyOptions,
}: SearchProps) {
  const [defaultList] = useState<ReactNode[]>(
    list.map(({ node, query: string }) => (
      <Fragment key={string}>{node}</Fragment>
    )),
  );
  const [children, setChildren] = useState(defaultList);
  let previousFirstItem: SearchItem | undefined = undefined;

  const handleChange = debounce((event: Event) => {
    const { value } = event.target as HTMLInputElement;

    if (value === '') {
      setChildren(defaultList);
      if (onFirstItemChange) onFirstItemChange(list[0]);
    } else {
      const results = go(value, list, { ...keyOptions, key: 'query' });
      const resultNodes = results.map((result) => {
        return result.obj.node;
      });

      if (results.length === 0) {
        if (fallback) {
          setChildren([fallback]);
        } else {
          setChildren([]);
        }

        if (onNoResults) onNoResults();
        if (onFirstItemChange) onFirstItemChange(undefined);

        previousFirstItem = undefined;
      } else {
        setChildren(resultNodes);

        const firstItem = results[0].obj;

        if (onFirstItemChange && previousFirstItem !== firstItem) {
          onFirstItemChange(firstItem);
          previousFirstItem = firstItem;
        }
      }
    }
  }, debounceTime);

  useEffect(() => {
    const copiedInput = input.current;

    copiedInput?.addEventListener('input', handleChange);

    return () => {
      copiedInput?.removeEventListener('input', handleChange);
    };
  });

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
}
