export interface UserInput {
  age: string;
  gender: string;
  symptoms: string;
  duration: string;
  history: string;
}

export interface Advice {
  possibleConditions: {
    name: string;
    description: string;
  }[];
  ayurvedicSuggestions: {
    name: string;
    advice: string;
  }[];
  homeRemedies: {
    name: string;
    advice: string;
  }[];
  lifestyleAdvice: {
    name: string;
    advice: string;
  }[];
  urgencyWarning: string | null;
}