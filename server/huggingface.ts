/**
 * Hugging Face Inference API integration for chat
 * Using the free Inference API with Qwen models
 */

const HF_API_URL = "https://api-inference.huggingface.co/models/Qwen/Qwen2.5-7B-Instruct";

interface HFMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface HFChatRequest {
  inputs: string;
  parameters?: {
    max_new_tokens?: number;
    temperature?: number;
    top_p?: number;
    return_full_text?: boolean;
  };
}

/**
 * Generate a chat response using Hugging Face Inference API
 */
export async function generateChatResponse(
  messages: HFMessage[],
  apiKey?: string
): Promise<string> {
  // Format messages into a prompt
  const prompt = formatMessagesAsPrompt(messages);

  const requestBody: HFChatRequest = {
    inputs: prompt,
    parameters: {
      max_new_tokens: 500,
      temperature: 0.7,
      top_p: 0.9,
      return_full_text: false,
    },
  };

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Add API key if provided (optional for public models)
  if (apiKey) {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }

  try {
    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Hugging Face API error:", errorText);
      
      // Check if model is loading
      if (response.status === 503) {
        return "The AI model is currently loading. Please try again in a few moments.";
      }
      
      throw new Error(`Hugging Face API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    
    // Handle different response formats
    if (Array.isArray(data) && data.length > 0) {
      return data[0].generated_text || "No response generated.";
    } else if (data.generated_text) {
      return data.generated_text;
    } else {
      console.error("Unexpected response format:", data);
      return "Sorry, I couldn't generate a response. Please try again.";
    }
  } catch (error) {
    console.error("Error calling Hugging Face API:", error);
    throw error;
  }
}

/**
 * Format messages array into a prompt string for the model
 */
function formatMessagesAsPrompt(messages: HFMessage[]): string {
  let prompt = "";
  
  for (const message of messages) {
    if (message.role === "system") {
      prompt += `System: ${message.content}\n\n`;
    } else if (message.role === "user") {
      prompt += `User: ${message.content}\n\n`;
    } else if (message.role === "assistant") {
      prompt += `Assistant: ${message.content}\n\n`;
    }
  }
  
  // Add the assistant prompt to trigger response
  prompt += "Assistant:";
  
  return prompt;
}

