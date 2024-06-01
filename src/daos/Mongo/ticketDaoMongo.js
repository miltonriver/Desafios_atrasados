import ticketModel from "./models/ticket.model.js";

class TicketDaoMongo {
    constructor(){
        this.ticketModel = ticketModel
    }
    async get()                       {
        return await this.ticketModel.find({})
    }
    async getBy(tid)                  {
        return await this.ticketModel.findOne(tid)
    }
    async create(newTicket)           {
        return await this.ticketModel.create(newTicket)
    }
    async update(tid, ticketToUpdate) {
        return await this.ticketModel.findOneAndUpdate({_id: tid}, ticketToUpdate, {new: true})
    }
    async delete(tid)                 {
        return await this.ticketModel.findOneAndDelete(tid)
    }
}

export default TicketDaoMongo
