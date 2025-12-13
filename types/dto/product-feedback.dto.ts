import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from "class-validator";

export class ProductFeedbackDto {
  @IsNotEmpty()
  @IsString()
  gotStuck: string;

  @IsOptional()
  @IsString()
  stuckReason?: string;

  @IsNotEmpty()
  @IsString()
  prevented: string;

  @IsOptional()
  @IsString()
  preventedReason?: string;

  @IsNotEmpty()
  @IsBoolean()
  anyError: boolean;

  @ValidateIf((o) => o.anyError)
  @IsNotEmpty()
  @IsString()
  errorDescription?: string;

  @IsNotEmpty()
  @IsNumber()
  difficulty: number;

  @IsNotEmpty()
  @IsString()
  stoppedStep: string;

  @IsNotEmpty()
  @IsString()
  neededHelp: string;

  @IsOptional()
  @IsString()
  neededHelpReason?: string;

  @IsNotEmpty()
  @IsString()
  suggestion: string;

  @IsNotEmpty()
  @IsString()
  device: string;
}
