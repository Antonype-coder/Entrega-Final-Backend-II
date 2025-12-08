import TicketRepository from '../repositories/TicketRepository.js';

const ticketRepository = new TicketRepository();

export default class TicketService {
  async createTicket(amount, purchaser) {
    return await ticketRepository.create({
      amount,
      purchaser
    });
  }

  async getTicketByCode(code) {
    return await ticketRepository.findByCode(code);
  }
}