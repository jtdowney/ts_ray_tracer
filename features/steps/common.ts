export const NUMBER_EXPRESSION_REGEX =
  "(-?√?[0-9]+(?:\\.[0-9]+)?(?:\\/-?√?[0-9]+(?:\\.[0-9]+)?)?)";

export function parseNumberExpression(value: string): number {
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
