// --- Copy all of this into generate_dictionary.mjs ---

import 'dotenv/config'; // Loads your API key from .env
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';

// --- CONFIGURATION ---
const TEST_MODE = true;
// ---------------------

// Helper function for a 1-second delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// This is the main function. We wrap everything in it.
async function buildDictionary() {
  console.log('Script started...');

  // 1. Set up the LLM
  console.log('Checking for API key...');
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.length < 10) {
    // This is a new, specific error message!
    throw new Error(
      'Error: GEMINI_API_KEY is not found or is invalid. Please check your .env file.'
    );
  }
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
  console.log('API key loaded successfully.');

  // 2. Read your "gold standard" dictionary.ts file
  console.log('Reading ./data/dictionary.ts...');
  const goldData = fs.readFileSync(
    './data/dictionary.ts', // Assumes your manual file is here
    'utf8'
  );
  const goldWordMatches = goldData.matchAll(/"word":\s*"([^"]+)"/g);
  const goldWords = new Set();
  for (const match of goldWordMatches) {
    goldWords.add(match[1]);
  }
  console.log(`Found ${goldWords.size} words in dictionary.ts to skip.`);

  // 3. Read your 50k word list
  console.log('Reading es_merged_50k.txt...');
  const wordListText = fs.readFileSync('es_merged_50k.txt', 'utf8');
  const allWords = wordListText.split('\n').map((line) => {
    const parts = line.split('\t'); // Split by tab
    return { word: parts[0], frequency: parseInt(parts[1], 10) || 0 };
  });
  console.log('Word list loaded.');

  // 4. Start processing
  const generatedEntries = [];
  let nextId = 100001;
  let wordsToProcess = allWords;

  if (TEST_MODE) {
    console.log('--- RUNNING IN TEST MODE (5 WORDS) ---');
    wordsToProcess = allWords.slice(0, 5); // Just do 5 words
  }

  for (const { word, frequency } of wordsToProcess) {
    if (goldWords.has(word)) {
      console.log(`Skipping "${word}" (already in dictionary.ts)`);
      continue;
    }

    const prompt = `
      You are a linguistic API. For the Spanish word "${word}", generate a JSON object for its meanings.
      
      The JSON must follow this TypeScript interface:
      { "meanings": { "pos": string, "as_in": string, "spanish_word": string, "english_word": string, "note"?: string, "gender_map"?: Record<string, "m" | "f" | "n">, "tags"?: string[], "region"?: string }[] }

      - pos: Part of speech (noun, verb, adjective, adverb).
      - as_in: A brief English disambiguation (e.g., "the animal").
      - spanish_word: The Spanish word itself.
      - english_word: The primary English translation.
      - gender_map: (For nouns/adjectives) e.g., {"chico": "m", "chica": "f"}. If gender-neutral, use {"${word}": "n"}.
      - tags: (e.g., "VULGAR", "COLLOQUIAL").
      
      Do NOT include conjugations.
      Return *only* the valid JSON object.
    `;

    console.log(`Processing word: ${word}`);
    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const jsonString = response.text().replace(/```json/g, '').replace(/```/g, '').trim();

      const llmData = JSON.parse(jsonString);

      const newEntry = {
        id: String(nextId++).padStart(6, '0'),
        starred: false,
        frequency: frequency,
        grand_note: null,
        meanings: llmData.meanings.map((m) => ({
          pos: m.pos,
          as_in: m.as_in,
          spanish: {
            word: m.spanish_word,
            gender_map: m.gender_map,
            tags: m.tags,
            region: m.region,
            conjugations: null,
            exceptions: null,
          },
          english: {
            word: m.english_word,
          },
          note: m.note,
        })),
        related_spanish: [],
        related_english: [],
      };
      generatedEntries.push(newEntry);
    } catch (e) {
      console.error(`Failed to process word: "${word}"`, e);
      console.log('Skipping this word.');
    }

    await delay(1000);
  }

  const outputPath = 'public/data/generated_dictionary.json';
  fs.writeFileSync(outputPath, JSON.stringify(generatedEntries, null, 2));

  console.log(`
    🎉 --- DONE! --- 🎉
    Processed ${generatedEntries.length} new words.
    File saved to: ${outputPath}
  `);
}

//
// --- This is the new, important part! ---
//
// We call the main function. If it crashes for *any reason*,
// the .catch() block will grab the error and print it
// instead of just exiting silently.
//
buildDictionary().catch((error) => {
  console.error('\n--- SCRIPT FAILED ---');
  console.error('Error:', error.message);
  console.log('\nPlease fix the error above and try running the script again.');
  process.exit(1); // Exit with a failure code
});