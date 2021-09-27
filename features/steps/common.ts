import { Before, defineParameterType } from "@cucumber/cucumber";

function transformExpression(value: string): number {
  return value
    .split("/")
    .map((part) => {
      let negated = false;
      let square_rooted = false;

      if (part.startsWith("-")) {
        negated = true;
        part = part.substr(1);
      }

      if (part.startsWith("√")) {
        square_rooted = true;
        part = part.substr(1);
      }

      let value = Number(part);
      if (square_rooted) {
        value = Math.sqrt(value);
      }

      if (negated) {
        value = -value;
      }

      return value;
    })
    .reduceRight((acc, value) => {
      return value / acc;
    }, 1);
}

defineParameterType({
  name: "expression",
  regexp: "(-?√?[0-9]+(?:\\.[0-9]+)?(?:\\/-?√?[0-9]+(?:\\.[0-9]+)?)?)",
  transformer: transformExpression,
  useForSnippets: false,
});

defineParameterType({
  name: "variable",
  regexp: "[a-z][a-z0-9]*",
  transformer: (s) => {
    return s;
  },
  useForSnippets: false,
});

defineParameterType({
  name: "operator",
  regexp: "\\+|-|\\*|\\/",
  transformer: (s) => {
    return s;
  },
  useForSnippets: false,
});

Before(function () {
  this.environment = {};
});
