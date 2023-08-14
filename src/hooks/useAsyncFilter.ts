// Absolute imports
import { useState, useEffect } from 'react';

// Types
import { TReadonlySuggestionItem } from '../api';

// Hooks
import useDebounce from './useDebounce';

// Helpers
const filterFruits = (items: TReadonlySuggestionItem[], conditionFn: (item: TReadonlySuggestionItem) => boolean) =>
  items.filter(conditionFn);

const useAsyncFilter = (request: (params?: any) => Promise<TReadonlySuggestionItem[]>, searchValue: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<TReadonlySuggestionItem[]>([]);

  // Avoid request sending while user still typing
  const value = useDebounce(searchValue, 300);
  const controller = new AbortController();

  const fetchFilteredFruits = async () => {
    try {
      setIsLoading(true);
      const data = await request({ signal: controller.signal });
      const filteredItems = filterFruits(data, ({ name }: TReadonlySuggestionItem) =>
        name.substring(0, searchValue.length).toLocaleLowerCase() === searchValue.toLocaleLowerCase()
      )
        .sort((a: TReadonlySuggestionItem, b: TReadonlySuggestionItem) => a.name.localeCompare(b.name))
        .slice(0, 5);

      setSuggestions(filteredItems);
      setIsLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchValue.trim().length < 1) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    fetchFilteredFruits();

    return () => {
      controller.abort();
    };
  }, [value, request]);

  return {
    isLoading,
    suggestions,
  };
};

export default useAsyncFilter;
