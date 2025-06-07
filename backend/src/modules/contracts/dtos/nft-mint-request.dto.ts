import { IsNotEmpty, IsString, IsEthereumAddress, Matches, IsOptional, IsUrl } from 'class-validator';

export class NftMintRequestDto {
  @IsNotEmpty({ message: 'Recipient address should not be empty.' })
  @IsEthereumAddress({}, { message: 'Recipient address must be a valid Ethereum address.' })
  recipient: string;

  @IsNotEmpty({ message: 'Token ID should not be empty.' })
  @IsString({ message: 'Token ID must be a string.'})
  @Matches(/^[0-9]+$/, { message: 'Token ID must be a string representing a positive integer.' })
  tokenId: string;

  @IsNotEmpty({ message: 'Token URI should not be empty.' })
  @IsString({ message: 'Token URI must be a string.'})
  // Pour une validation plus stricte de l'URI (ex: https ou ipfs), une regex ou un validateur custom serait nécessaire.
  // @IsUrl({}, { message: 'Token URI must be a valid URI.'}) // Attention: ne valide pas ipfs:// par défaut
  tokenURI: string;
}
