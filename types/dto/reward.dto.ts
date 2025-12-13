import { IsNotEmpty, IsString } from "class-validator";

export class RewardDto {
  @IsNotEmpty()
  @IsString()
  rewardId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  phone: string;
}
