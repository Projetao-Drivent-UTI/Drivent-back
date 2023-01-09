import sessionRepository from "@/repositories/session-repository";
import userRepository from "@/repositories/user-repository";
import { exclude } from "@/utils/prisma-utils";
import { User } from "@prisma/client";
import axios from "axios";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userService from "../users-service";
import { invalidCredentialsError } from "./errors";

async function signIn(params: SignInParams): Promise<SignInResult> {
  const { email, password } = params;
  const user = await getUserOrFail(email);

  await validatePasswordOrFail(password, user.password);

  const token = await createSession(user.id);
  return {
    user: exclude(user, "password"),
    token,
  };
}

async function getUserOrFail(email: string): Promise<GetUserOrFailResult> {
  const user = await userRepository.findByEmail(email, { id: true, email: true, password: true });
  if (!user) throw invalidCredentialsError();

  return user;
}

async function createSession(userId: number) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET);
  await sessionRepository.create({
    token,
    userId,
  });

  return token;
}

async function validatePasswordOrFail(password: string, userPassword: string) {
  const isPasswordValid = await bcrypt.compare(password, userPassword);
  if (!isPasswordValid) throw invalidCredentialsError();
}

export type SignInParams = Pick<User, "email" | "password">;

type SignInResult = {
  user: Pick<User, "id" | "email">;
  token: string;
};

type GetUserOrFailResult = Pick<User, "id" | "email" | "password">;

async function getGitHubToken(code: string) {
  const { data } = await axios.post("https://github.com/login/oauth/access_token", {
    client_id: "ebbeb7bafbc2484662c9", // env
    client_secret: "647b74e6a3917cda539c798e3d6d1ae9e0cf6e21", //env
    code
  },
  {
    headers: {
      "Accept": "application/json"
    }
  });
  const token = data.access_token;
  const result = await getGitHubData(token);
  return result;
}

async function getGitHubData(token: string) {
  const { data } = await axios.get("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const response = await axios.get("https://api.github.com/user/emails", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const email = response.data[0].email;
  const passwordNumbers = data.id;
  const password = passwordNumbers.toString();

  const user = await userRepository.findByEmail(email);
  if(!user) {
    await userService.createUser({ email, password });
  }
  const result = await signIn({ email, password });
  return result;
}

const authenticationService = {
  signIn,
  getGitHubToken,
  getGitHubData,
};
export default authenticationService;
export * from "./errors";
