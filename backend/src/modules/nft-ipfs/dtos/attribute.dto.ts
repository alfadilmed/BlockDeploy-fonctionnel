import { IsString, IsNotEmpty } from 'class-validator'; // NestJS uses class-validator for DTOs

export class AttributeDto {
  @IsString()
  @IsNotEmpty()
  trait_type: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}
