import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateStationDto {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsUUID()
    wagonDepotId: string;
}
