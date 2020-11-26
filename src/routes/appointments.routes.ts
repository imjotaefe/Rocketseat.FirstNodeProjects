import { Request, Response, Router } from 'express';
import { startOfHour, parseISO } from 'date-fns';
import AppointmentsReposity from '../repositories/AppointmentsRepository';

const appointmentsRouter = Router();

const appointmentsRepository = new AppointmentsReposity();

appointmentsRouter.post('/', (request: Request, response: Response) => {
  const { provider, date } = request.body;

  const parsedDate = startOfHour(parseISO(date));

  const findAppointmentInSameDate = appointmentsRepository.findByDate(
    parsedDate,
  );

  if (findAppointmentInSameDate) {
    return response
      .status(400)
      .json({ message: 'This appointment is already booked' });
  }

  const appointment = appointmentsRepository.create(provider, parsedDate);

  return response.json(appointment);
});

appointmentsRouter.get('/', (request: Request, response: Response) => {
  const appointments = appointmentsRepository.all();

  return response.json(appointments);
});

export default appointmentsRouter;
