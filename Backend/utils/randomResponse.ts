import axios from 'axios';

export const fetchRandomQuote = async (): Promise<string> => {
  try {
    const response = await axios.get<{ q: string, a: string }[]>('https://zenquotes.io/api/random');
    const quote = response.data[0].q; //
    return response.data[0].q;
  } catch (error) {
    console.error('Error fetching random quote:', error);
    return 'This is a default quote.';
  }
};
