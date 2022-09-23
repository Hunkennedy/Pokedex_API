import { IsInt, IsPositive, IsString, Min, MinLength } from 'class-validator';

export class CreatePokemonDto {
  // Integer, Positive, min(1)
  @IsPositive()
  @IsInt()
  @Min(1)
  no: number;
  // String, min(3)
  @IsString()
  @MinLength(1)
  name: string;
}
