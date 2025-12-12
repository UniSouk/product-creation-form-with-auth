import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  ValidateIf,
} from "class-validator";

export class ProductCreationFeedbackDto {
  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsNotEmpty()
  @Min(1)
  @Max(5)
  @IsNumber()
  overallExperience: number;

  @IsNotEmpty()
  @Min(1)
  @Max(5)
  @IsNumber()
  formEaseRating: number;

  @IsNotEmpty()
  @IsBoolean()
  helpToCompleteForm: boolean;

  @IsArray()
  @IsString({ each: true })
  confusingFields: string[];

  @IsNotEmpty()
  @IsBoolean()
  isRequired: boolean;

  @IsNotEmpty()
  @Min(1)
  @Max(5)
  @IsNumber()
  effortRating: number;

  @IsNotEmpty()
  @IsString()
  timeTaken: string;

  @IsNotEmpty()
  @IsBoolean()
  anyError: boolean;

  @ValidateIf((o) => o.anyError)
  @IsNotEmpty()
  @IsString()
  error?: string;

  @IsArray()
  @IsString({ each: true })
  mostTimeTakenFields: string[];

  @IsNotEmpty()
  @IsBoolean()
  isConfused: boolean;

  @ValidateIf((o) => o.isConfused)
  @IsNotEmpty()
  @IsString()
  confusingMessage?: string;

  @IsNotEmpty()
  @Min(1)
  @Max(5)
  @IsNumber()
  easyNavigationRating: number;

  @IsNotEmpty()
  @IsBoolean()
  foundButtons: boolean;

  @IsNotEmpty()
  @IsString()
  productListingFrequency: string;

  @IsNotEmpty()
  @IsString()
  suggestion: string;

  @IsNotEmpty()
  @IsBoolean()
  recommend: boolean;
}
