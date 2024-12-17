export default interface GenerateTokenParams {
    userId: string;
    secret: string;
    expiresIn?: string | number;
  }