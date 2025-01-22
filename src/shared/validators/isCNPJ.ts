import {
    isString,
    registerDecorator,
    ValidationOptions,
} from 'class-validator';

export function IsCNPJ(validationOptions?: ValidationOptions) {
    return function (object: NonNullable<unknown>, propertyName: string) {
        registerDecorator({
            name: 'isCNPJ',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value: any): Promise<boolean> | boolean {
                    if (
                        !isString(value) ||
                        !/^[0-9]{14}$/.test(value) || // Not CNPJ length
                        /^\b(\d)\1+\b$/.test(value) // All digits are the same
                    ) {
                        return false;
                    }

                    const digits: number[] = value
                        .split('')
                        .map((digit) => parseInt(digit));

                    const verifierDigit1 = calculateVerifierDigit(
                        digits.slice(0, 12),
                    );
                    const verifierDigit2 = calculateVerifierDigit(
                        digits.slice(0, 13),
                    );

                    return (
                        verifierDigit1 === digits[12] &&
                        verifierDigit2 === digits[13]
                    );
                },
            },
        });
    };
}

const calculateVerifierDigit = (digits: number[]): number => {
    let index = 2;
    const sum = digits.reduce((acc, digit) => {
        const current = digit * index;
        index = index === 9 ? 2 : index + 1;
        return acc + current;
    }, 0);

    const remainder = sum % 11;

    return remainder < 2 ? 0 : 11 - remainder;
};
