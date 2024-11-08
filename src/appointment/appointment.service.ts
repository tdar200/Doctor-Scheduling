import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAppointmentDto, EditAppointmentDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AppointmentService {
  constructor(private prisma: PrismaService) {}

  getAppointments(userId: number, role: 'DOCTOR' | 'PATIENT') {
    if (role === 'DOCTOR') {
      return this.prisma.appointment.findMany({
        where: { doctor: { userId } },
      });
    } else if (role === 'PATIENT') {
      return this.prisma.appointment.findMany({
        where: { patient: { userId } },
      });
    }

    return [];
  }

  getAppointmentById(userId: number, appointmentId: number) {
    return this.prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        OR: [{ doctorId: userId }, { patientId: userId }],
      },
    });
  }

  async createAppointment(dto: CreateAppointmentDto) {
    const appointment = await this.prisma.appointment.create({
      data: {
        appointmentDate: new Date(dto.appointmentDate),
        ...dto,
      },
    });

    return appointment;
  }

  async editAppointmentById(
    userId: number,
    appointmentId: number,
    dto: EditAppointmentDto,
  ) {
    const appointment = await this.prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        OR: [{ doctorId: userId }, { patientId: userId }],
      },
    });

    if (!appointment) {
      throw new NotFoundException(
        'Appointment not found or you do not have permission to edit it',
      );
    }

    return this.prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        ...dto,
      },
    });
  }

  async deleteAppointmentById(userId: number, appointmentId: number) {
    const appointment = await this.prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        OR: [{ doctorId: userId }, { patientId: userId }],
      },
    });

    if (!appointment) {
      throw new NotFoundException(
        'Appointment not found or you do not have permission to delete it',
      );
    }

    return this.prisma.appointment.delete({
      where: { id: appointmentId },
    });
  }
}
