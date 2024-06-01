import { Router }       from "express";
import TicketController from "../controllers/tickets.controller.js";

const ticketsRouter    = Router()
const ticketController = new TicketController()

ticketsRouter.get   ('/',     ticketController.getTickets)
ticketsRouter.get   ('/:tid', ticketController.getTicket)
ticketsRouter.post  ('/',     ticketController.createTicket)
ticketsRouter.put   ('/:tid', ticketController.updateTicket)
ticketsRouter.delete('/:tid', ticketController.deleteTicket)

export default ticketsRouter