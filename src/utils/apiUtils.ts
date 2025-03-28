export const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erro na requisição.");
  }
  return response.json();
};

export const withAuthHeader = (token: string, headers: HeadersInit = {}) => ({
  ...headers,
  Authorization: `Bearer ${token}`,
});
