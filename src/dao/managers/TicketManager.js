import Ticket from '../models/Ticket.js';

export default class TicketManager {
  async create(ticketData) {
    try {
      const ticket = await Ticket.create(ticketData);
      return ticket;
    } catch (error) {
      throw error;
    }
  }

  async findByCode(code) {
    try {
      return await Ticket.findOne({ code });
    } catch (error) {
      throw error;
    }
  }
}