import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsOptional, IsString } from "class-validator";

export class ImportWagonDto {

    @ApiProperty({
        description: 'The unique ID of the wagon to import',
        example: 'c7c4f6a3-98d7-4f32-9b5e-cc75f60f98d2',
    })
    @IsString()
    wagonId: string;

    @ApiProperty({
        description: 'The date when the vagon was imported.',
        type: String,
        format: 'date-time',
        required: false, 
    })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    importedDate?: Date;
}