import { Type } from 'class-transformer';
import {
  IsArray,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  IsDateString,
  IsNumber,
  IsOptional,
  Validate,
} from 'class-validator';

interface Transfer {
  productId: number;
  quantity: number;
}

@ValidatorConstraint({ name: 'isLocaleDateStringValid', async: false })
export class IsLocaleDateStringValid implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (!value) {
      return true; // Optional field, skip validation
    }

    const dateParts = value.split('/');
    if (dateParts.length !== 3) {
      return false;
    }

    const [day, month, year] = dateParts;
    const date = new Date(`${day}-${month}-${year}`);

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be a valid date string in the dd/mm/yyyy format`;
  }
}

export class CreateMovementDTO {
  @IsOptional()
  @IsNumber()
  sourceId: number = -1;

  @IsOptional()
  @IsNumber()
  destinationId: number = -1;

  @IsArray()
  transfers: Transfer[];

  @IsOptional()
  @Validate(IsLocaleDateStringValid)
  date: string;
}
