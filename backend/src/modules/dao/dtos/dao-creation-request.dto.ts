import {
  IsNotEmpty,
  IsString,
  IsArray,
  ArrayMinSize,
  IsEthereumAddress,
  IsInt,
  Min,
  ValidateNested,
  IsPositive,
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { Type } from 'class-transformer';

export function IsThresholdValid(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isThresholdValid',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const owners = (args.object as DaoCreationRequestDto).owners;
          if (!owners || !Array.isArray(owners)) {
            return false;
          }
          return typeof value === 'number' && value > 0 && value <= owners.length;
        },
        defaultMessage(args: ValidationArguments) {
          const owners = (args.object as DaoCreationRequestDto).owners;
          const ownersCount = (owners && Array.isArray(owners)) ? owners.length : 0;
          return \`Threshold (\${value}) must be a positive integer less than or equal to the number of owners (\${ownersCount}).\`;
        },
      },
    });
  };
}

export class DaoCreationRequestDto {
  @IsNotEmpty({ message: 'DAO name should not be empty.' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Network should not be empty.' })
  @IsString()
  network: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'At least one owner is required.' })
  @IsEthereumAddress({ each: true }, { message: 'Each owner must be a valid Ethereum address.'})
  owners: string[];

  @IsNotEmpty({ message: 'Threshold should not be empty.' })
  @IsInt({ message: 'Threshold must be an integer.' })
  @IsPositive({ message: 'Threshold must be a positive number.'})
  @IsThresholdValid({ message: 'Threshold validation failed.' }) // Message plus générique ici, le validateur donne le détail
  threshold: number;
}
