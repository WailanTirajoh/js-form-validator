import type { ErrorBag } from "./type";

export default class ValidatorError {
	private errorMessage: string | undefined;
	private errorBag: ErrorBag = {};

	public add(field: string, error: string): void {
		this.errorBag[field]
			? this.errorBag[field].push(error)
			: (this.errorBag[field] = [error]);
	}

	public clearErrorBag(): void {
		this.errorBag = {};
	}

	public getErrorBag(): ErrorBag {
		return this.errorBag;
	}

	public setErrorMessage(errorMessage: string) {
		this.errorMessage = errorMessage;
	}

	public getErrorMessage(): string {
		return this.errorMessage || this.generateErrorMessage();
	}

	private generateErrorMessage(): string {
		return `${Object.keys(this.errorBag).length} error occured`;
	}

	public hasErrors() {
		return Object.keys(this.errorBag).length > 0;
	}
}
