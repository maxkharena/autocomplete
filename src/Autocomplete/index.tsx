// Absolute imports
import { useRef, useState, useEffect } from 'react';

// Styles
import {
  Wrapper,
  SearchInput,
  SuggestionList,
  SuggestionItem,
  SuggestionPlaceholder,
} from './Autocomplete.styles';

// Hooks
import useAsyncFilter from '../hooks/useAsyncFilter';

// Types
import { ISuggestionItem } from '../api';

interface IAutocompleteProps {
  value: string;
  request: () => Promise<ISuggestionItem[]>;
  onChange: (selecteValue: string) => void;
}

function Autocomplete({ value, request, onChange }: IAutocompleteProps) {
  const [focusedItemIndex, setFocusedIndex] = useState(-1);
  const [searchValue, setSearchValue] = useState(value || '');
  const [showSuggestions, setShowSuggestion] = useState(false);

  const wrapperRef = useRef(null);

  const { isLoading, suggestions } = useAsyncFilter(request, searchValue);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleSelectSuggestion = (text: string) => {
    setSearchValue(text);
    setShowSuggestion(false);
  };

  const handleInputClick = () => {
    setFocusedIndex(-1);
    setShowSuggestion(true);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        event.preventDefault();
        if (focusedItemIndex > -1 && suggestions) {
          setSearchValue(suggestions[focusedItemIndex].name);
          setShowSuggestion(false);
        }
        break;
      default:
        break;
    }
  };

  console.log(isLoading);

  useEffect(() => {
    onChange(searchValue);
  }, [searchValue, onChange]);

  return (
    <Wrapper ref={wrapperRef}>
      <SearchInput
        type="text"
        autoComplete="off"
        value={searchValue}
        onKeyDown={handleKeyDown}
        onClick={handleInputClick}
        onChange={handleSearchChange}
        placeholder="Type to search..."
      />
      {suggestions.length !== 0 && searchValue ?
        <SuggestionPlaceholder
          disabled
          type="text"
          tabIndex={-1}
          placeholder=""
          autoComplete="off"
          value={`${searchValue}${suggestions[0].name.substring(searchValue.length)}`}
        /> : null}
      {showSuggestions ? (
        <SuggestionList>
          {suggestions.map(({ id, name }: ISuggestionItem, index: number) => (
            <SuggestionItem
              key={id}
              focused={index === focusedItemIndex}
              onClick={() => handleSelectSuggestion(name)}
            >
              <b>{name.substring(0, searchValue.length)}</b>
              <span>{name.substring(searchValue.length)}</span>
            </SuggestionItem>
          ))}
        </SuggestionList>
      ) : null}
    </Wrapper>
  );
}

export default Autocomplete;
