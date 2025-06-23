import { fetchAIResponse, AIQueryRequest, AIQueryResponse, AIErrorResponse } from './aiAssistantService';

// Mocking global fetch
global.fetch = jest.fn();

const mockFetch = global.fetch as jest.Mock;

describe('aiAssistantService', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  const sampleRequest: AIQueryRequest = {
    user_id: 'test-user',
    query_text: 'Hello AI',
  };

  it('should fetch AI response successfully', async () => {
    const mockSuccessResponse: AIQueryResponse = {
      conversation_id: 'conv123',
      response_id: 'resp456',
      assistant_response: {
        text_response: 'Hello user!',
      },
      timestamp: new Date().toISOString(),
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockSuccessResponse,
    } as Response);

    const response = await fetchAIResponse(sampleRequest);
    expect(response).toEqual(mockSuccessResponse);
    expect(mockFetch).toHaveBeenCalledWith('/api/v1/ai-assistant/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sampleRequest),
    });
  });

  it('should handle API error response (structured error)', async () => {
    const mockErrorDetail: AIErrorResponse = {
        error_code: 'LLM_ERROR',
        message: 'LLM is having a nap.',
    };
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 503,
      json: async () => ({ detail: mockErrorDetail }), // FastAPI wraps HTTPException detail in a "detail" key
    } as Response);

    await expect(fetchAIResponse(sampleRequest)).rejects.toEqual(mockErrorDetail);
  });

  it('should handle API error response (string detail)', async () => {
    const mockErrorStringDetail = "Service Unavailable";
    const expectedErrorOutput: AIErrorResponse = {
        error_code: 'HTTP_503', // Constructed from status
        message: mockErrorStringDetail,
    };
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 503,
      statusText: "Service Unavailable", // Fallback if JSON parse fails or detail is not structured
      json: async () => ({ detail: mockErrorStringDetail }),
    } as Response);

    await expect(fetchAIResponse(sampleRequest)).rejects.toEqual(expectedErrorOutput);
  });


  it('should handle network error', async () => {
    mockFetch.mockRejectedValueOnce(new TypeError('Network failed')); // Simulate network error

    const expectedError: AIErrorResponse = {
      error_code: 'NETWORK_ERROR',
      message: 'Network error or API unreachable.',
    };
    await expect(fetchAIResponse(sampleRequest)).rejects.toEqual(expectedError);
  });

  it('should handle non-JSON error response from API', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => { throw new Error("Not JSON"); }, // Simulate error during error JSON parsing
    } as Response);

    const expectedError: AIErrorResponse = {
        error_code: 'HTTP_500',
        message: 'Internal Server Error',
    };
    await expect(fetchAIResponse(sampleRequest)).rejects.toEqual(expectedError);
  });
});
