import {
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';

export const validationPipeConfig: ValidationPipeOptions = {
  whitelist: true, // Strip properties that don't have decorators
  forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
  transform: true, // Automatically transform payloads to DTO instances
  transformOptions: {
    enableImplicitConversion: true, // Enable implicit type conversion
  },
  disableErrorMessages: false, // Show detailed error messages
  validationError: {
    target: false, // Don't expose the target object in errors
    value: false, // Don't expose the value in errors
  },
};

export const createValidationPipe = (): ValidationPipe => {
  return new ValidationPipe(validationPipeConfig);
};
