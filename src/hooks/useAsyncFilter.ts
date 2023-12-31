// Absolute imports
import { useState, useEffect } from 'react';

// Types
import { ISuggestionItem } from '../api';

// Helpers
const asyncFilter = (items: ISuggestionItem[], conditionFn: (item: ISuggestionItem) => boolean) =>
  items.filter(conditionFn);

const useAsyncFilter = (request: () => Promise<ISuggestionItem[]>, searchValue: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<ISuggestionItem[]>([]);

  useEffect(() => {
    // Only proceed if searchValue has length >= 1
    if (searchValue.trim().length >= 1) {
      const fetchFilteredFruits = async () => {
        try {
          setIsLoading(true);

          const data = await request();
          const filteredItems = asyncFilter(data, ({ name }: ISuggestionItem) =>
            name.substring(0, searchValue.length).toLocaleLowerCase() === searchValue.toLocaleLowerCase()
          )
            .sort((a: ISuggestionItem, b: ISuggestionItem) => a.name.localeCompare(b.name))
            .slice(0, 5);

          setSuggestions(filteredItems);
          setIsLoading(false);
        } catch (error) {
          console.error('Error:', error);
          setIsLoading(false);
        }
      };

      fetchFilteredFruits();
    } else {
      // If searchValue is empty, reset suggestions and remove loading
      setSuggestions([]);
      setIsLoading(false);
    }
  }, [searchValue, request]);

  return {
    isLoading,
    suggestions,
  };
};

export default useAsyncFilter;
