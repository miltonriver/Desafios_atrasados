import TicketDto      from "../dto/ticketDto.js";
import TicketDaoMongo from "../daos/Mongo/ticketDaoMongo.js";

class TicketRepository {
    constructor() {
        this.dao = new TicketDaoMongo()
    }

    getTickets   = async ()          => await this.dao.get()
    getTicket    = async (filter)    => await this.dao.getBy(filter)
    createTicket = async (newTicket) => {
        const newTicketDto = new TicketDto(newTicket)
        return await this.dao.create(newTicketDto)
    }
    updateTicket = async (tid, ticketToUpdate) => {
        await this.dao.update({_id: tid}, ticketToUpdate, {new: true})
    }
    deleteTicket = async (tid)       => await this.dao.delete({_id: tid})
}

export default TicketRepository