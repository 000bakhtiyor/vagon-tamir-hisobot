import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class FindReleasedVagonsQueryDto {
    @ApiPropertyOptional({ description: 'Wagon number (can be number or string)' })
    @IsOptional()
    @IsNumberString()
    wagonNumber?: string;

    @ApiPropertyOptional({ description: 'Wagon code' })
    @IsOptional()
    @IsString()
    wagonCode?: string;

    @ApiPropertyOptional({ description: 'Vagon type' })
    @IsOptional()
    @IsString()
    vagonType?: string;

    @ApiPropertyOptional({ description: 'Release date (YYYY-MM-DD)' })
    @IsOptional()
    @IsString()
    releaseDate?: string;

    @ApiPropertyOptional({ description: 'Owner type' })
    @IsOptional()
    @IsString()
    ownerType?: string;

    @ApiPropertyOptional({ description: 'Repair classification id' })
    @IsOptional()
    @IsString()
    repairClassificationId?: string;

    @ApiPropertyOptional({ description: 'Ownership id' })
    @IsOptional()
    @IsString()
    ownershipId?: string;

    @ApiPropertyOptional({ description: 'Station id' })
    @IsOptional()
    @IsString()
    stationId?: string;

    @ApiPropertyOptional({ description: 'Imported date (YYYY-MM-DD)' })
    @IsOptional()
    @IsString()
    importedDate?: string;

    @ApiPropertyOptional({ description: 'Taken out date (YYYY-MM-DD)' })
    @IsOptional()
    @IsString()
    takenOutDate?: string;
}
