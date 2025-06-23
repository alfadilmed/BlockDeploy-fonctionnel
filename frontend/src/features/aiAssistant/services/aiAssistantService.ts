// Placeholder for AI Assistant API client service

// Corresponds to backend/app/api/v1/schemas/query_dtos.py
// For simplicity, defining minimal types here. In a real app, these might be shared or generated.

export interface ConversationMessage {
  role: 'user' | 'assistant'; // Or 'system' if frontend needs to inject system messages
  content: string;
}
export interface RequestContext {
  current_configuration?: Record<string, any>;
  deployment_id?: string;
  ui_location?: string;
  conversation_history?: ConversationMessage[];
}

export interface LLMOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

export interface AIQueryRequest {
  conversation_id?: string;
  user_id: string; // This should be obtained from the app's auth system
  query_text: string;
  context?: RequestContext;
  llm_options?: LLMOptions;
}

export interface AISource {
  name?: string;
  url?: string;
  content_snippet?: string;
}
export interface AIResponsePayload {
  text_response: string;
  structured_data?: Record<string, any>;
  confidence_score?: number;
  sources?: AISource[];
}

export interface AIQueryResponse {
  conversation_id: string;
  response_id: string;
  assistant_response: AIResponsePayload;
  timestamp: string; // ISO datetime string
}

export interface AIErrorResponse {
    error_code: string;
    message: string;
    details?: Record<string, any>;
}


const API_BASE_URL = '/api/v1/ai-assistant'; // Adjust if your API is hosted elsewhere or needs prefix

export const fetchAIResponse = async (request: AIQueryRequest): Promise<AIQueryResponse> => {
  // In a real app, get the auth token and add it to headers
  // const token = getAuthToken();
  // const headers = {
  //   'Content-Type': 'application/json',
  //   'Authorization': `Bearer ${token}`
  // };

  const headers = {
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(`${API_BASE_URL}/query`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      let errorData: AIErrorResponse | null = null;
      try {
        // FastAPI returns error details in `detail` field for HTTPExceptions
        const errorJson = await response.json();
        if (errorJson.detail && typeof errorJson.detail === 'object' && errorJson.detail.error_code) {
            errorData = errorJson.detail as AIErrorResponse;
        } else if (errorJson.detail && typeof errorJson.detail === 'string') {
            // Handle cases where detail is just a string (FastAPI default for some errors)
             errorData = { error_code: `HTTP_${response.status}`, message: errorJson.detail };
        } else {
            errorData = { error_code: `HTTP_${response.status}`, message: response.statusText || 'Unknown API error' };
        }
      } catch (e) {
        // Failed to parse error JSON
        errorData = { error_code: `HTTP_${response.status}`, message: response.statusText || 'Failed to fetch or parse error' };
      }
      throw errorData; // Throw the structured error
    }

    const data: AIQueryResponse = await response.json();
    return data;

  } catch (error) {
    // Log the error or handle it as per application's error handling strategy
    console.error('AI Assistant API call failed:', error);
    // Re-throw if it's already our structured error, or wrap it
    if (typeof error === 'object' && error !== null && 'error_code' in error && 'message' in error) {
        throw error as AIErrorResponse;
    }
    throw { error_code: 'NETWORK_ERROR', message: 'Network error or API unreachable.' } as AIErrorResponse;
  }
};
