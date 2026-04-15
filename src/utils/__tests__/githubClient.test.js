import { GithubClient, GithubError } from '../githubClient.js';

describe('GithubClient.validateCredentials', () => {
  it('returns not configured when credentials are missing', async () => {
    const githubClient = new GithubClient({
      clientId: '',
      clientSecret: '',
    });

    githubClient.httpClient.get = jest.fn();

    const result = await githubClient.validateCredentials();

    expect(result).toEqual({
      configured: false,
      valid: false,
    });
    expect(githubClient.httpClient.get).not.toHaveBeenCalled();
  });

  it('returns success when GitHub accepts the credentials', async () => {
    const githubClient = new GithubClient({
      clientId: 'client-id',
      clientSecret: 'client-secret',
    });

    githubClient.httpClient.get = jest.fn().mockResolvedValue({ status: 200 });

    const result = await githubClient.validateCredentials({ timeout: 1234 });

    expect(result).toEqual({
      configured: true,
      valid: true,
      status: 200,
    });
    expect(githubClient.httpClient.get).toHaveBeenCalledWith('/rate_limit', {
      timeout: 1234,
      auth: {
        username: 'client-id',
        password: 'client-secret',
      },
    });
  });

  it('returns failure details when GitHub rejects the credentials', async () => {
    const githubClient = new GithubClient({
      clientId: 'client-id',
      clientSecret: 'client-secret',
    });

    githubClient.httpClient.get = jest.fn().mockRejectedValue({
      response: {
        status: 401,
        statusText: 'Unauthorized',
        headers: {},
        data: { message: 'Bad credentials' },
      },
    });

    const result = await githubClient.validateCredentials();

    expect(result.configured).toBe(true);
    expect(result.valid).toBe(false);
    expect(result.status).toBe(401);
    expect(result.error).toBeInstanceOf(GithubError);
  });
});
