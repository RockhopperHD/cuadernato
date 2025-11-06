export type GeminiMistake = {
  prompt: string;
  expected: string;
  userAnswer: string;
};

export type GeminiDirection = 'ES_TO_EN' | 'EN_TO_ES';

interface GenerateTipParams {
  mistakes: GeminiMistake[];
  direction: GeminiDirection;
  batchSize: number;
}

const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite:generateContent';

const FALLBACK_SUCCESS = 'Great work! Keep building those connections by reviewing the words you just practiced.';

const formatMistakes = (mistakes: GeminiMistake[]): string => {
  if (mistakes.length === 0) {
    return 'No recorded mistakes; celebrate the success and suggest a challenge.';
  }

  return mistakes
    .map((mistake, index) => {
      return `${index + 1}. Prompt: ${mistake.prompt} | Learner answered: ${mistake.userAnswer || '—'} | Correct: ${mistake.expected}`;
    })
    .join('\n');
};

export const generateGeminiTip = async ({ mistakes, direction, batchSize }: GenerateTipParams): Promise<string> => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return FALLBACK_SUCCESS;
  }

  try {
    const prompt = [
      'You are Cuadernato, an encouraging tutor helping English speakers learn Spanish vocabulary.',
      `The learner just completed a batch of ${batchSize} flashcards in ${direction === 'ES_TO_EN' ? 'Spanish → English' : 'English → Spanish'} mode.`,
      'Provide a single short tip (max 80 words) in English.',
      'Offer a concrete mnemonic, memory hook, or clarification about tricky distinctions highlighted in the mistakes.',
      'If there were no mistakes, celebrate the success and suggest a next-step challenge focused on nuance or usage.',
      'Use a friendly, supportive tone and avoid repeating the raw statistics verbatim.',
      '',
      'Here is the performance summary:',
      formatMistakes(mistakes),
    ].join('\n');

    const response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error('Gemini response error', await response.text());
      return FALLBACK_SUCCESS;
    }

    const data = await response.json();
    const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    return text?.trim() || FALLBACK_SUCCESS;
  } catch (error) {
    console.error('Gemini fetch failed', error);
    return FALLBACK_SUCCESS;
  }
};
