import { ApplicationError } from "@/protocols";

export function cannotSubscribeError(): ApplicationError {
  return {
    name: "CannotSubscribeError",
    message: "ticket, payment or enrollment is missing",
  };
}
