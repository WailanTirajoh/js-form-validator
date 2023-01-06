import { describe, it, expect, beforeEach } from "vitest";
import Validator from "../src/validator";
import { validatorErrorMessage } from "../src/validator-error-message";

import validateMax from "./validator-base/validate-max";
import validateIpV4 from "./validator-base/validate-ipv4";
import validateIpV6 from "./validator-base/validate-ipv6";

describe("Validator Base Rule", () => {
	let validator: Validator;

	beforeEach(() => {
		validator = new Validator({
			formData: {},
		});
	});

	it("validate required field with expected value", async () => {
		validator
			.setFormData({
				value: "pass",
			})
			.setRules({
				value: ["required"],
			});
		await validator.validate();
		expect(validator.pass()).toBeTruthy();
	});

	it("validate required field with unexpected value", async () => {
		validator
			.setFormData({
				value: null,
				value1: undefined,
				value2: "",
			})
			.setRules({
				value: ["required"],
				value1: ["required"],
				value2: ["required"],
			});
		await validator.validate();
		expect(validator.pass()).toBeFalsy();
		const error = validator.getErrorBag();
		expect(error.value).include(validatorErrorMessage["required"]);
		expect(error.value1).include(validatorErrorMessage["required"]);
		expect(error.value2).include(validatorErrorMessage["required"]);
	});

	it("validate array field with expected array values", async () => {
		validator
			.setFormData({
				value: ["array1", "array2"],
			})
			.setRules({
				value: ["array"],
			});
		await validator.validate();
		expect(validator.pass()).toBeTruthy();
	});

	it("validate array field with null value", async () => {
		validator
			.setFormData({
				value: null,
			})
			.setRules({
				value: ["array"],
			});
		await validator.validate();
		expect(validator.pass()).toBeFalsy();
		const error = validator.getErrorBag();
		expect(error.value).include(validatorErrorMessage["array"]);
	});

	it("validate integer field with expected value", async () => {
		validator
			.setFormData({
				value: 123,
			})
			.setRules({
				value: ["integer"],
			});
		await validator.validate();
		expect(validator.pass()).toBeTruthy();
	});

	it("validate integer field with null value", async () => {
		validator
			.setFormData({
				value: null,
			})
			.setRules({
				value: ["integer"],
			});
		await validator.validate();
		expect(validator.pass()).toBeFalsy();
		const error1 = validator.getErrorBag();
		expect(error1.value).include(validatorErrorMessage["integer"]);
		validator.clearErrors();
	});

	it("validate integer field with string value", async () => {
		validator
			.setFormData({
				value: "string value",
			})
			.setRules({
				value: ["integer"],
			});
		await validator.validate();
		expect(validator.pass()).toBeFalsy();
		const error = validator.getErrorBag();
		expect(error.value).include(validatorErrorMessage["integer"]);
	});

	it("validate numeric field with expected value", async () => {
		validator
			.setFormData({
				value: 15000,
			})
			.setRules({
				value: ["numeric"],
			});
		await validator.validate();
		expect(validator.pass()).toBeTruthy();
	});
	it("validate numeric field with with non numeric value", async () => {
		validator
			.setFormData({
				value: "test",
			})
			.setRules({
				value: ["numeric"],
			});
		await validator.validate();
		expect(validator.pass()).toBeFalsy();
		expect(validator.getErrorBag().value).include(
			validatorErrorMessage["numeric"]
		);
	});

	it("validate string field with expected value", async () => {
		validator
			.setFormData({
				value: "test",
			})
			.setRules({
				value: ["string"],
			});
		await validator.validate();
		expect(validator.pass()).toBeTruthy();
	});
	it("validate string field with non string value", async () => {
		validator
			.setFormData({
				pass: "test",
				failA: null,
				failB: [],
				failC: 123,
			})
			.setRules({
				pass: ["string"],
				failA: ["string"],
				failB: ["string"],
				failC: ["string"],
			});
		await validator.validate();
		expect(validator.pass()).toBeFalsy();
		const error = validator.getErrorBag();
		expect(error.pass).toBeUndefined();
		expect(error.failA).include(validatorErrorMessage["string"]);
		expect(error.failB).include(validatorErrorMessage["string"]);
		expect(error.failC).include(validatorErrorMessage["string"]);
	});

	it("validate boolean field with expected value", async () => {
		validator
			.setFormData({
				pass1: true,
				pass2: false,
			})
			.setRules({
				pass1: ["boolean"],
				pass2: ["boolean"],
			});
		await validator.validate();
		expect(validator.pass()).toBeTruthy();
	});
	it("validate boolean field with non boolean value", async () => {
		validator
			.setFormData({
				pass: true,
				failA: "true",
				failB: "false",
			})
			.setRules({
				pass: ["boolean"],
				failA: ["boolean"],
				failB: ["boolean"],
			});
		await validator.validate();
		expect(validator.pass()).toBeFalsy();
		const error = validator.getErrorBag();
		expect(error.pass).toBeUndefined();
		expect(error.failA).include(validatorErrorMessage["boolean"]);
		expect(error.failB).include(validatorErrorMessage["boolean"]);
	});

	it("validate allowed field that pass", async () => {
		validator
			.setFormData({
				jobs: [
					{
						status: "started",
					},
					{
						status: "started",
					},
					{
						status: "ready",
					},
				],
			})
			.setRules({
				["jobs.*.status"]: ["allowed:started,ready,finished"],
			});
		await validator.validate();
		expect(validator.pass()).toBeTruthy();
	});
	it("validate allowed field that fail", async () => {
		validator
			.setFormData({
				jobs: [
					{
						status: "started",
					},
					{
						status: "started",
					},
					{
						status: "fail",
					},
					{
						status: "ready",
					},
				],
			})
			.setRules({
				["jobs.*.status"]: ["allowed:started,ready,finished"],
				pass2: ["boolean"],
			});
		await validator.validate();
		expect(validator.pass()).toBeFalsy();
		const error = validator.getErrorBag();
		expect(error["jobs.2.status"]).include(
			validatorErrorMessage["allowed"].replace(
				"{args}",
				["started", "ready", "finished"].join(", ")
			)
		);
	});

	it("validate email field that pass", async () => {
		validator
			.setFormData({
				email: "wailantirajoh@gmail.com",
			})
			.setRules({
				email: ["email"],
			});
		await validator.validate();
		expect(validator.pass()).toBeTruthy();
	});
	it("validate email field that fail", async () => {
		validator
			.setFormData({
				email: "wailantirajoh",
			})
			.setRules({
				email: ["email"],
			});
		await validator.validate();
		expect(validator.pass()).toBeFalsy();
		const error = validator.getErrorBag();
		expect(error.email).include(validatorErrorMessage["email"]);
	});

	it("validate min field that pass", async () => {
		validator
			.setFormData({
				age: 20,
			})
			.setRules({
				age: ["min:20"],
			});
		await validator.validate();
		expect(validator.pass()).toBeTruthy();
	});
	it("validate min field that fail", async () => {
		const age = 19;
		validator
			.setFormData({
				age: age,
			})
			.setRules({
				age: ["min:20"],
			});
		await validator.validate();
		expect(validator.pass()).toBeFalsy();
		const error = validator.getErrorBag();
		expect(error.age).include(
			validatorErrorMessage["min"]
				.replace("{minSize}", "20")
				.replace("{value}", age.toString())
		);
	});

	it("validate min length of string field that pass", async () => {
		validator
			.setFormData({
				password: "password",
			})
			.setRules({
				password: ["min:8"],
			});
		await validator.validate();
		expect(validator.pass()).toBeTruthy();
	});
	it("validate min length of string field that fail", async () => {
		validator
			.setFormData({
				password: "password",
			})
			.setRules({
				password: ["min:9"],
			});
		await validator.validate();
		expect(validator.pass()).toBeFalsy();
		const error = validator.getErrorBag();
		expect(error.password).include(
			validatorErrorMessage["min"]
				.replace("{minSize}", "9")
				.replace("{value}", "password".length.toString())
		);
	});

	validateMax();
	validateIpV4();
	validateIpV6();

	// TODO: test image & image filesize (workaround findings how to mock input image to this spec)
});
