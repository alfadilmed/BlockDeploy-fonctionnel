import { IsNotEmpty, IsString, IsEthereumAddress, Matches } from 'class-validator';

export class MintRequestDto {
  @IsNotEmpty({ message: 'Recipient address should not be empty.' })
  @IsEthereumAddress({}, { message: 'Recipient address must be a valid Ethereum address.' })
  recipient: string;

  @IsNotEmpty({ message: 'Amount should not be empty.' })
  @IsString({ message: 'Amount must be a string.'})
  @Matches(/^[0-9]+$/, { message: 'Amount must be a string representing a positive integer in its smallest unit.' })
  amount: string;
}
