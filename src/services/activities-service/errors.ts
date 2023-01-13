import { ApplicationError } from "@/protocols";

export function canNotSubscribeError(): ApplicationError {
  return {
    name: "CanNotSubscribeError",
    message: "ticket, payment or enrollment is missing",
  };
}

export function userAlreadySubscribedError(): ApplicationError {
  return {
    name: "UserAlreadySubscribedError",
    message: "The user already is subscribed at this activity",
  };
}

export function withoutVacanciesError(): ApplicationError {
  return {
    name: "WithoutVacanciesError",
    message: "This activity is at capacity",
  };
}

export function canNotCreateActivitySubscriptionError(): ApplicationError {
  return {
    name: "CanNotCreateActivitySubscriptionError",
    message: "Something went wrong",
  };
}
