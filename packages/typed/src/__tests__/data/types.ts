import { Placeholder } from "../../types";

export type SubBody = {
  prop1: string;
  prop2: string;
  prop3: Placeholder<{
    hoge: string;
  }>;
};
