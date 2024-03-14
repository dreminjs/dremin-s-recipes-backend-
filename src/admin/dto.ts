import { Max, Min } from 'class-validator';

export class CharacteristicDto {
  @Min(3)
  @Max(25)
  name: string;
}
