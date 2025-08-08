import { IsNotEmpty, IsString } from "class-validator";

export class CreateOwnershipDto {

    @IsString()
    @IsNotEmpty()
    ownershipName: string;
}
