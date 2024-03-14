import { Max, Min } from 'class-validator';

export class CharacteristicDto {
  @Max(20)
  @Min(1)
  name: string;
}

export class CharacteristicsQueryParamsDto {
  page: number;
  search: string;
}
