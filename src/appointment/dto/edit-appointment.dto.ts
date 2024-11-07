import { IsString, IsDate, IsOptional, IsInt } from 'class-validator';

export class EditAppointmentDto {
  @IsString()
  @IsOptional()
  status?: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';

  @IsDate()
  @IsOptional()
  appointmentDate?: Date;

  @IsInt()
  @IsOptional()
  patientId?: number;

  @IsInt()
  @IsOptional()
  doctorId?: number;

  @IsString()
  @IsOptional()
  reason?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  location?: string;
}
