import { go } from "fuzzysort";
import debounce from "lodash.debounce";
import {
  Fragment,
  ReactNode,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";

/**
 * An item that can be searched through
 */
export type SearchItem = {
  /**
   * The string that is used to both discriminate and search an item
   */
  string: string;
  /**
   * The thing that gets rendered
   */
  node: ReactNode;
  /**
   * This is called when enter is clicked when this item is the first in the
   * list
   */
  callback?: () => void;
};

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
   * If escape is clicked, this will run
   */
  escape?: () => void;
  /**
   * The debounce time to avoid excessive rerenders
   */
  debounce?: number;
}

/**
 * Searches through a list of nodes based on the value on input powered by
 * the fuzzysort library
 */
export default function Search({
  list,
  input,
  fallback,
  escape,
  debounce: debounceTime = 0,
}: SearchProps) {
  const [defaultList] = useState<ReactNode[]>(
    list.map(({ node, string }) => <Fragment key={string}>{node}</Fragment>)
  );
  const [children, setChildren] = useState(defaultList);
  const firstCallback = useRef<(() => void) | undefined>(list[0]?.callback);

  const handleChange = debounce((event: Event) => {
    const { value } = event.target as HTMLInputElement;

    if (value === "") {
      setChildren(defaultList);
    } else {
      const results = go(value, list, { key: "string" });
      const resultNodes = results.map((result, index) => {
        if (index === 0) firstCallback.current = result.obj.callback;
        return result.obj.node;
      });

      if (resultNodes.length === 0) {
        firstCallback.current = undefined;

        if (fallback) {
          setChildren([fallback]);
        } else {
          setChildren([]);
        }
      } else {
        setChildren(resultNodes);
      }
    }
  }, debounceTime);
  const handleKeydown = (event: Event) => {
    if ((event as KeyboardEvent).key === "Enter") {
      if (firstCallback.current) firstCallback.current();
    } else if ((event as KeyboardEvent).key === "Escape") {
      if (escape) escape();
    }
  };

  useEffect(() => {
    const copiedInput = input.current;

    copiedInput?.addEventListener("input", handleChange);
    copiedInput?.addEventListener("keydown", handleKeydown);

    return () => {
      copiedInput?.removeEventListener("input", handleChange);
      copiedInput?.removeEventListener("keydown", handleKeydown);
    };
  });

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
}
