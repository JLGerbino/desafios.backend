import ticketModel from "../models/ticket.model.js";

export default class TicketManagerDB {
  constructor(){
    this.model = ticketModel;
  }
  createTicket = async (ticket) => {
    try{
      const ticketCreated = await this.model.create(ticket)
      return ticketCreated;    
    }    
     catch(error){
      throw new Error("no se pudo generar el ticket")
    }
  }

  async getTicketById(ticketId) {
    try {
      const ticket = await ticketModel.findById(ticketId);
      return ticket;
    } catch (error) {
      console.error('Error al obtener el ticket:', error);
      throw new Error('Error al obtener el ticket');
    }
  }
}
