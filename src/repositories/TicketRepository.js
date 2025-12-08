import TicketManager from '../dao/managers/TicketManager.js';

const ticketManager = new TicketManager();

export default class TicketRepository {
  async create(ticketData) {
    return await ticketManager.create(ticketData);
  }

  async findByCode(code) {
    return await ticketManager.findByCode(code);
  }
}