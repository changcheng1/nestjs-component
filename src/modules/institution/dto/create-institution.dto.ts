import { IsString } from 'class-validator';

export class CreateInstitutionDto {
  @IsString()
  institutionName: string;
}
