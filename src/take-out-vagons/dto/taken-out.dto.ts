import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsOptional, IsString } from "class-validator";

export class TakenOutWagonDto {

    @ApiProperty({
        description: 'The unique ID of the wagon to import',
        example: 'c7c4f6a3-98d7-4f32-9b5e-cc75f60f98d2',
    })
    @IsString()
    wagonId: string;

    @ApiProperty({
        description: 'The date when the vagon was taken out.',
        type: String,
        format: 'date',
        example: '2025-08-15',
        required: false,
    })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    takenOutDate?: Date;
}