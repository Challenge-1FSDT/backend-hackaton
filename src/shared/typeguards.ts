export function isUndefined(value: unknown): value is undefined {
    return value === undefined;
}

export function isNull(value: unknown): value is null {
    return value === null;
}

export function isDefined<T>(value: T | undefined): value is T {
    return !isUndefined(value);
}

export function isDefinedAndNotNull<T>(
    value: T | undefined | null,
): value is T {
    return !isUndefined(value) && !isNull(value);
}

export function isString(value: unknown): value is string {
    return isDefined(value) && typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
    return isDefined(value) && typeof value === 'number';
}

export function isNan(value: unknown): value is number {
    return isDefined(value) && isNumber(value) && Number.isNaN(value);
}

export function isValidNumber(value: unknown): value is number {
    return isDefined(value) && isNumber(value) && !isNaN(value);
}
