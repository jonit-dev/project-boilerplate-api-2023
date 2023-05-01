import { container } from "@providers/inversify/container";
import { TextFormatter } from "../TextFormatter";

describe("TextFormatter", () => {
  let textFormatter: TextFormatter;

  beforeAll(() => {
    textFormatter = container.get(TextFormatter);
  });

  describe("convertCamelCaseToSentence", () => {
    it("should convert a simple camel case string to sentence case", () => {
      const input = "helloWorld";
      const expectedOutput = "hello world";
      const output = textFormatter.convertCamelCaseToSentence(input);
      expect(output).toEqual(expectedOutput);
    });

    it("should handle consecutive uppercase letters in a camel case string", () => {
      const input = "HelloWORLD";
      const expectedOutput = "hello world";
      const output = textFormatter.convertCamelCaseToSentence(input);
      expect(output).toEqual(expectedOutput);
    });

    it("should handle numbers in a camel case string", () => {
      const input = "helloWorld123";
      const expectedOutput = "hello world123";
      const output = textFormatter.convertCamelCaseToSentence(input);
      expect(output).toEqual(expectedOutput);
    });

    it("should handle an empty string", () => {
      const input = "";
      const expectedOutput = "";
      const output = textFormatter.convertCamelCaseToSentence(input);
      expect(output).toEqual(expectedOutput);
    });

    it("should handle a string with only one word", () => {
      const input = "hello";
      const expectedOutput = "hello";
      const output = textFormatter.convertCamelCaseToSentence(input);
      expect(output).toEqual(expectedOutput);
    });
  });
});
