// Absolute imports
import styled from 'styled-components';

// Types
interface ISuggestionItemProps {
  focused: boolean;
}

export const Loader = styled.span`
  width: 25px;
  height: 25px;
  margin-right: 10px;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  border: 2px solid salmon;
  border-bottom-color: transparent;
  animation: rotation 1s linear infinite;

  @keyframes rotation {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Wrapper = styled.div`
  height: 64px;
  display: flex;
  width: 250px;
  border-radius: 8px;
  position: relative;
  align-items: center;
  background-color: #fff;
  justify-content: space-between;
  box-shadow: 0px 8px 20px rgba(0,0,0,0.06);
`;

const SuggestionList = styled.ul`
  top: 30px;
  padding: 0;
  width: 250px;
  display: flex;
  list-style: none;
  max-height: 220px;
  position: absolute;
  flex-direction: column;
  background-color: #fff;
  border-radius: 0 0 8px 8px;
  box-shadow: 0px 8px 20px rgba(0,0,0,0.06);
`;

const SuggestionItem = styled.li<ISuggestionItemProps>`
  color: black;
  padding: 10px;
  cursor: pointer;
  text-align: left;
  background-color: ${(props) => props.focused ? 'salmon' : 'white'};

  &:last-child {
    border-radius: 0 0 8px 8px;
  }

  &:hover {
    background-color: ${(props) => props.focused ? 'salmon' : '#e9e9e9'} ;
  }
`;

const SearchInput = styled.input`
  padding: 0;
  height: 100%;
  border: none;
  color: black;
  z-index: 100;
  font-size: 16px;
  border-radius: 8px;
  padding-left: 10px;
  padding-right: 10px;
  background: transparent;

  &:focus {
    border: none;
    outline: none;
  }
`;

export const SuggestionPlaceholder = styled(SearchInput)`
  z-index: 0;
  color: #999;
  position: absolute;
`;

export { Wrapper, SuggestionItem, SuggestionList, SearchInput };
