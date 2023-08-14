// Absolute imports
import { useState, useEffect } from 'react';

// Styles
import {
  Loader,
  Wrapper,
  SearchInput,
  SuggestionList,
  SuggestionItem,
  SuggestionPlaceholder,
} from './Autocomplete.styles';

// Hooks
import { useAsyncFilter, useOutsideClick } from '../hooks';

// Types
import { TReadonlySuggestionItem } from '../api';

interface IAutocompleteProps {
  value: string;
  request: (params?: any) => Promise<TReadonlySuggestionItem[]>;
  onChange: (selecteValue: string) => void;
}

function Autocomplete({ value, request, onChange }: IAutocompleteProps) {
  const [focusedItemIndex, setFocusedIndex] = useState(-1);
  const [searchValue, setSearchValue] = useState(value || '');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { isLoading, suggestions } = useAsyncFilter(request, searchValue);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleSelectSuggestion = (text: string) => {
    setSearchValue(text);
    setShowSuggestions(false);
  };

  const handleInputClick = () => {
    setFocusedIndex(-1);
    setShowSuggestions(true);
  };

  const handleClickOutside = () => {
    setFocusedIndex(-1);
    setShowSuggestions(false);
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    setShowSuggestions(true);

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
          setShowSuggestions(false);
        } else {
          setFocusedIndex(0);
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    onChange(searchValue);
  }, [searchValue, onChange]);

  const wrapperRef = useOutsideClick(handleClickOutside);
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
      {isLoading ? <Loader /> : null}
      {suggestions.length !== 0 && searchValue ?
        <SuggestionPlaceholder
          disabled
          type="text"
          tabIndex={-1}
          placeholder=""
          value={`${searchValue}${suggestions[0].name.substring(searchValue.length)}`}
        /> : null}
      {showSuggestions ? (
        <SuggestionList>
          {suggestions.map(({ id, name }: TReadonlySuggestionItem, index: number) => (
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
