import {
  isString,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

export function IsCPF(validationOptions?: ValidationOptions) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      name: 'isCPF',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any): Promise<boolean> | boolean {
          if (
            !isString(value) ||
            !/^[0-9]{11}$/.test(value) || // Not CPF length
            /^\b(\d)\1+\b$/.test(value) || // All digits are the same
            '12345678909'.includes(value) // Known invalid CPF
          ) {
            return false;
          }

          const digits: number[] = value
            .split('')
            .map((digit) => parseInt(digit));

          const verifierDigit1 = calculateVerifierDigit(digits.slice(0, 9));
          const verifierDigit2 = calculateVerifierDigit(digits.slice(0, 10));

          return verifierDigit1 === digits[9] && verifierDigit2 === digits[10];
        },
      },
    });
  };
}

const calculateVerifierDigit = (digits: number[]): number => {
  const sum = digits.reduce((acc, digit, index) => {
    return acc + digit * (digits.length + 1 - index);
  }, 0);

  const remainder = sum % 11;

  return remainder < 2 ? 0 : 11 - remainder;
};
