import { IsString } from "class-validator";

export class CreateCreateWagonDto {
    
    @IsString()
    number: string;

    @IsString()
    createdAt: Date;
    
    @IsString()
    wagonDepotId: string;
}
