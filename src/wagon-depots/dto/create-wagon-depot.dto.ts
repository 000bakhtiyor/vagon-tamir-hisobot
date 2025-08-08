import { IsNotEmpty, IsString } from "class-validator";

export class CreateWagonDepotDto {

    @IsNotEmpty()
    @IsString()
    name: string;
}
