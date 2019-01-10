export default class UnsupportedTypeError extends Error {
    constructor(stack?: string) {
        super(stack);
    }
}
