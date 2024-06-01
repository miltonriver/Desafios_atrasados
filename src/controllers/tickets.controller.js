import { ticketService } from "../services/index.js";
import { logger } from "../utils/logger.js";

class TicketController {
    constructor(){
        this.ticketService = ticketService
    }

    getTickets   =async (req, res) => {}
    getTicket    =async (req, res) => {}
    createTicket =async (req, res) => {}
    updateTicket =async (req, res) => {}
    deleteTicket =async (req, res) => {}
}

export default TicketController