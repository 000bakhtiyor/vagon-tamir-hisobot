import { IsDate, IsEnum, IsString } from "class-validator";
import { VagonOwnerType } from "src/common/enums/wagon-type.enum";

export class CreateReleasedVagonDto {

    @IsString()
    vagonNumber: number;

    @IsString()
    vagonCode: string;

    @IsString()
    ownership: string;

    @IsDate()
    releaseDate: Date;

    @IsString()
    failureName: string;

    @IsString()
    typeOfFailure: string;

    @IsEnum(VagonOwnerType)
    ownerType: VagonOwnerType;

    @IsString()
    station: string;
}
