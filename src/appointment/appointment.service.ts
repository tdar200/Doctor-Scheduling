import { Injectable } from '@nestjs/common';
import { CreateAppointmentDto, EditAppointmentDto } from './dto';

@Injectable()
export class AppointmentService {
  getAppointments(userId: number) {}

  getAppointmentById(userId: number, appointmentId: number) {}

  createAppointment(userId: number, dto: CreateAppointmentDto) {}

  editAppointmentById(
    userId: number,
    appointmentId: number,
    dto: EditAppointmentDto,
  ) {}

  deleteAppointmentById(userId: number, appointmentId: number) {}
}
