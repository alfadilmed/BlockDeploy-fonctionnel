import { IsString, IsNotEmpty, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer'; // Required for @ValidateNested with arrays
import { AttributeDto } from './attribute.dto';

export class NftUploadDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  // Attributes are optional as per some NFT standards, but can be required by specific use cases
  // For now, let's make them optional and validated if present.
  @IsArray()
  @ValidateNested({ each: true }) // Validates each item in the array
  @Type(() => AttributeDto) // Specify the type of the items in the array
  @IsOptional()
  attributes?: AttributeDto[];
}
