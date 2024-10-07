import { IsNotEmpty } from 'class-validator';

export class CurrentWeekDto {
    @IsNotEmpty({ message: 'Note is not empty' })
    readonly startDate: string;
  
    @IsNotEmpty({ message: 'Note type is required field' })
    readonly endDate: string;
}