import type { BaseValidatorRule } from "./type";

export const validatorErrorMessage: Record<keyof BaseValidatorRule, string> = {
  ["required"]: `The field cannot be empty`,
  ["array"]: `The field must be instance of Array`,
  ["integer"]: `The field must be integer`,
  ["numeric"]: `The field must be numeric`,
  ["string"]: `The field must be string`,
  ["boolean"]: `The field must be a boolean`,
  ["image"]: `The field must be an image`,
  ["size"]: `The size must be between {minSize} and {maxSize} bytes`,
  ["allowed"]: `The field must be one of the following: {args}`,
};

export const baseValidatorRule = {
  required(value: any) {
    if (value === undefined || value === "" || value === null) {
      return validatorErrorMessage["required"];
    }
  },

  array(value: any) {
    if (!(value instanceof Array)) {
      return validatorErrorMessage["array"];
    }
  },

  integer(value: any) {
    if (!Number.isInteger(value)) {
      return validatorErrorMessage["integer"];
    }
  },

  numeric(value: any) {
    if (!(value instanceof Number)) {
      return validatorErrorMessage["numeric"];
    }
  },

  string(value: any) {
    if (typeof value !== "string") {
      return validatorErrorMessage["string"];
    }
  },

  boolean(value: any) {
    if (typeof value !== "boolean") {
      return validatorErrorMessage["boolean"];
    }
  },

  allowed(value: any, ...args: any[]) {
    if (!args.includes(value)) {
      return validatorErrorMessage["allowed"].replace(
        "{args}",
        args.join(", ")
      );
    }
  },

  image(value: any) {
    if (!(value instanceof File)) {
      return validatorErrorMessage["image"];
    }

    // Check if the file is an image by checking the MIME type
    if (!value.type.startsWith("image/")) {
      return validatorErrorMessage["image"];
    }
  },

  size(value: any, minSize: number, maxSize: number) {
    console.log(value, minSize, maxSize);
    if (!(value instanceof File)) {
      return "The field must be an instanceof File";
    }

    // Check if the file size is within the specified range
    if (value.size < minSize || value.size > maxSize) {
      return validatorErrorMessage["image"]
        .replace("{minSize}", minSize.toString())
        .replace("{maxSize}", maxSize.toString());
    }
  },
};
