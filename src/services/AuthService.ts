import ApiClient from "@/utils/apiClient";
import { CredentialsDTO, accessTokenDTO } from "@/types/auth";

export class AuthService {
  private static ENDPOINT = "/auth";

  static async login({ email, password }: CredentialsDTO) {
    return ApiClient.post<accessTokenDTO>(`${this.ENDPOINT}/signin`, {
      email,
      password,
    });
  }

  static async register({ email, password }: CredentialsDTO) {
    return ApiClient.post<accessTokenDTO>(`${this.ENDPOINT}/signup`, {
      email,
      password,
    });
  }

  static logout() {
    // Implement logout logic for backend if needed
  }
}
