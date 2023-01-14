import { describe, it, beforeEach, expect } from "vitest";
import Validator from "../src/validator";

describe("Validator Instance", () => {
	let validator: Validator;

	beforeEach(() => {
		validator = new Validator();
		validator.setFormData({
			name: "Wailan",
			email: null,
			age: 25,
		});
	});

	it("Add field name to error message", async () => {});

	it("Set custom field name to error message", async () => {});

	it("Override error message", async () => {});
});
