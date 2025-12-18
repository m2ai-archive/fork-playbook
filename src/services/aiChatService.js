/**
 * AI Chat Service - Handles communication with n8n webhook for AI Coach responses
 */

const N8N_WEBHOOK_URL = 'https://fiyasolutions.app.n8n.cloud/webhook/32fad67f-4be9-4670-8abc-d5028304fcd5';

/**
 * Send a message to the AI Coach via n8n webhook
 * @param {Object} payload - The message payload
 * @param {string} payload.message - The user's message
 * @returns {Promise<{success: boolean, response?: string, error?: string}>}
 */
export async function sendMessageToAI(payload) {
  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatInput: payload.message,  // This is the key field the Agent expects
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      success: true,
      response: data.response || data.output || data.message || '',
    };
  } catch (error) {
    console.error('AI Chat Service Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to connect to AI service',
    };
  }
}

/**
 * Build context object for the AI Coach
 * @param {Object} currentChapter - The current chapter object
 * @param {Object} progress - User's progress data
 * @returns {Object} Context object for the webhook
 */
export function buildChatContext(currentChapter, progress) {
  return {
    chapter: currentChapter ? {
      id: currentChapter.id,
      title: currentChapter.title,
      subtitle: currentChapter.subtitle || '',
    } : null,
    userProgress: progress ? {
      sectionsRead: progress.sectionsRead?.length || 0,
      exercisesCompleted: progress.exercisesCompleted?.length || 0,
      quizScore: progress.quizScore || null,
      videoWatched: progress.videoWatched || false,
      completed: progress.completed || false,
    } : null,
  };
}

/**
 * Format conversation history for the webhook
 * @param {Array} conversation - Array of conversation messages
 * @param {number} maxMessages - Maximum number of messages to include (default: 10)
 * @returns {Array} Formatted conversation history
 */
export function formatConversationHistory(conversation, maxMessages = 10) {
  const recentMessages = conversation
    .slice(-maxMessages)
    .map(msg => ({
      role: msg.role === 'coach' ? 'assistant' : 'user',
      content: msg.message,
    }));

  return recentMessages;
}
