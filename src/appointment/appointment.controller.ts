import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateAppointmentDto, EditAppointmentDto } from './dto';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { AppointmentService } from './appointment.service';

@UseGuards(JwtGuard)
@Controller('appointment')
export class AppointmentController {
  constructor(private appointmentService: AppointmentService) {}

  @Get()
  getAppointments(@GetUser('id') userId: number) {
    return this.appointmentService.getAppointments(userId);
  }

  @Get('id')
  getAppointmentById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) appointmentId: number,
  ) {
    return this.appointmentService.getAppointmentById(userId, appointmentId);
  }

  @Post()
  createAppointment(
    @GetUser('id') userId: number,
    @Body() dto: CreateAppointmentDto,
  ) {
    return this.appointmentService.createAppointment(userId, dto);
  }

  @Patch('id')
  editAppointmentById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) appointmentId: number,
    @Body() dto: EditAppointmentDto,
  ) {
    return this.appointmentService.editAppointmentById(
      userId,
      appointmentId,
      dto,
    );
  }

  @Delete(':id')
  deleteAppointmentById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) appointmentId: number,
  ) {
    return this.appointmentService.deleteAppointmentById(userId, appointmentId);
  }
}
