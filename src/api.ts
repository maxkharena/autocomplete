// Types
export interface ISuggestionItem {
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

// Constants
const API = 'https://run.mocky.io/v3/234da5c0-a578-4aea-93af-be4152e8bd6a';

const fetchFruits = async (): Promise<ISuggestionItem[]> => {
  const response = await fetch(API);
  const data = await response.json();
  return data as ISuggestionItem[];
};


export default fetchFruits;
