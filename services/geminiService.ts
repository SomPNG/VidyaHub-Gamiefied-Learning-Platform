import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion, StudentData, Subject, Recommendation } from '../types';

// FIX: Per coding guidelines, API key must be from process.env.API_KEY. This also resolves the 'env' does not exist on 'ImportMeta' error.
// Access the API key from environment variables
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
} else {
  // FIX: Updated warning message to reflect the correct environment variable.
  console.warn("API_KEY environment variable is not set. Using mock data.");
}

export interface AITutorResponse {
  explanation: string;
  quiz: QuizQuestion[];
}

export async function generateTutorContent(topic: string): Promise<AITutorResponse> {
  // If the API key is not set, or the AI client failed to initialize, return mock data.
  if (!apiKey || !ai) {
    console.log(`Using mock data for topic: "${topic}"`);
    return {
      explanation: `This is a mock explanation for "${topic}". In a real scenario, Gemini would provide a detailed, student-friendly explanation here. For example, it would break down complex concepts into simple, understandable parts with analogies and examples.`,
      quiz: Array.from({ length: 15 }, (_, i) => ({
        id: `ai_q${i + 1}`,
        question: `This is mock question ${i + 1} about "${topic}". What is the primary concept?`,
        options: [`Mock Answer A${i}`, `Mock Answer B${i}`, `Mock Answer C${i}`, `Correct Answer ${i}`],
        answer: `Correct Answer ${i}`,
        type: 'mcq',
        explanation: `This is the mock explanation for question ${i + 1}. The correct answer is what it is because of key concept XYZ, which relates to the broader topic.`
      }))
    };
  }

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Explain the topic "${topic}" in a simple, student-friendly way, suitable for a 10th-grade student. After the explanation, create a comprehensive quiz with at least 15 questions (a mix of multiple-choice and fill-in-the-blanks) to test understanding. For each question, provide an explanation for the correct answer.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    explanation: {
                        type: Type.STRING,
                        description: "A clear, student-friendly explanation of the topic."
                    },
                    quiz: {
                        type: Type.ARRAY,
                        description: "A list of at least 15 quiz questions.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                id: { type: Type.STRING, description: "A unique ID for the question." },
                                question: { type: Type.STRING },
                                type: { type: Type.STRING, description: "'mcq' or 'fill-in-the-blanks'." },
                                options: { 
                                    type: Type.ARRAY, 
                                    description: "Options for MCQ. Empty for fill-in-the-blanks.",
                                    items: { type: Type.STRING }
                                },
                                answer: { type: Type.STRING, description: "The correct answer." },
                                explanation: { type: Type.STRING, description: "A brief explanation of why the answer is correct." }
                            },
                            required: ["id", "question", "type", "answer", "explanation"]
                        }
                    }
                },
                required: ["explanation", "quiz"]
            },
        },
    });

    const jsonText = response.text.trim();
    const parsedResponse = JSON.parse(jsonText) as AITutorResponse;
    return parsedResponse;
  } catch (error) {
    console.error("Error generating content from Gemini:", error);
    throw new Error("Failed to get a response from the AI tutor. Please try again.");
  }
}

const MOCK_RECOMMENDATIONS: Recommendation[] = [
    {
        subjectId: 'math',
        chapterId: 'm2',
        contentId: 'm2l1',
        type: 'lecture',
        title: 'Understanding Polynomials',
        reason: 'Looks like you\'ve started Polynomials. This lecture is a great next step!',
      },
      {
        subjectId: 'science',
        chapterId: 's1',
        contentId: 's1q1',
        type: 'quiz',
        title: 'Motion Quiz',
        reason: 'You aced the lecture, now test your knowledge on the Laws of Motion with this quiz!',
      },
      {
        subjectId: 'english',
        chapterId: 'e2',
        contentId: 'e2g1',
        type: 'game',
        title: 'Tense Troubles',
        reason: 'Make grammar fun! This game will help solidify your understanding of tenses.',
      },
];

export async function getRecommendations(
  studentData: StudentData,
  subjects: Subject[],
): Promise<Recommendation[]> {
  if (!apiKey || !ai) {
    return MOCK_RECOMMENDATIONS;
  }

  const allCompletedContent = Object.values(studentData.progress).flatMap(p => p.completedContent);

  // Flatten the available content to make the prompt simpler and more robust for the model.
  const uncompletedContentList = subjects.flatMap(subject =>
    subject.chapters.flatMap(chapter =>
      chapter.content
        .filter(contentItem => !allCompletedContent.includes(contentItem.id))
        .map(contentItem => ({
          subjectId: subject.id,
          chapterId: chapter.id,
          contentId: contentItem.id,
          title: contentItem.title,
          type: contentItem.type,
        }))
    )
  );

  if (uncompletedContentList.length === 0) {
    return []; // No recommendations if everything is complete.
  }

  const simplifiedProgress = Object.fromEntries(
    Object.entries(studentData.progress).map(([subjectId, data]) => [
      subjects.find(s => s.id === subjectId)?.name || subjectId,
      {
        completionPercentage: data.completionPercentage,
        averageQuizScore: Object.keys(data.quizScores).length > 0
            ? Math.round(Object.values(data.quizScores).reduce((a, b) => a + b, 0) / Object.values(data.quizScores).length)
            : 'No quizzes taken'
      }
    ])
  );

  const prompt = `
    You are an expert academic advisor for a gamified learning platform. Your goal is to help students by providing personalized learning recommendations.
    A student's progress data is provided below, along with a flat list of available learning content they have NOT yet completed.

    **Student Progress Summary:**
    ${JSON.stringify(simplifiedProgress, null, 2)}

    **Available Uncompleted Content:**
    ${JSON.stringify(uncompletedContentList, null, 2)}

    Based on this data, identify the student's areas for improvement (e.g., subjects with low completion percentage or low average quiz scores).

    Suggest exactly 3 specific, actionable learning activities from the "Available Uncompleted Content" list. For each suggestion, provide a brief, encouraging reason (under 20 words) why it would be helpful for them.

    Prioritize suggesting content from chapters the student has started but not finished, or from subjects where their quiz scores are low.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: {
              type: Type.ARRAY,
              description: "A list of 3 learning recommendations.",
              items: {
                type: Type.OBJECT,
                properties: {
                  subjectId: { type: Type.STRING, description: "The ID of the subject from the provided list." },
                  chapterId: { type: Type.STRING, description: "The ID of the chapter from the provided list." },
                  contentId: { type: Type.STRING, description: "The ID of the content item from the provided list." },
                  title: { type: Type.STRING, description: "The title of the content from the provided list." },
                  type: { type: Type.STRING, description: "'lecture', 'pdf', 'quiz', or 'game'." },
                  reason: { type: Type.STRING, description: "A brief, encouraging reason for the recommendation." }
                },
                required: ["subjectId", "chapterId", "contentId", "title", "type", "reason"]
              }
            }
          },
          required: ["recommendations"]
        }
      }
    });

    const jsonText = response.text.trim();
    const parsedResponse = JSON.parse(jsonText) as { recommendations: Recommendation[] };
    return parsedResponse.recommendations;
  } catch (error) {
    console.error("Error generating recommendations from Gemini:", error);
    return MOCK_RECOMMENDATIONS; // Fallback to mock data on error
  }
}