// Types
type ReadOnlyGeneric<T> = {
  readonly[P in keyof T]: T[P]
}

 interface ISuggestionItem {
  id: number,
  name: string,
  order: string,
  genus: string,
  family: string,
  nutritions: {
    fat: number
    sugar: number
    protein: number
    calories: number
    carbohydrates: number
  },
}

export type TReadonlySuggestionItem = ReadOnlyGeneric<ISuggestionItem>;

// Constants
const API = 'https://run.mocky.io/v3/234da5c0-a578-4aea-93af-be4152e8bd6a';

const fetchFruits = async (params: any): Promise<TReadonlySuggestionItem[]> => {
  const response = await fetch(API, params);
  const data = await response.json();
  return data as TReadonlySuggestionItem[];
};


export default fetchFruits;
