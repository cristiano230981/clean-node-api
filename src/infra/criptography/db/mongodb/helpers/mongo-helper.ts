import { Collection, MongoClient } from "mongodb"
import { AccountModel } from "../../../../../domain/models/account"

export const MongoHelper = {
    client: null as MongoClient,
    async connect (uri: string): Promise<void> {
        this.client = await MongoClient.connect(process.env.MONGO_URL)
    },
    async disconnect () {
        await this.client.close()
    },
    getCollection (name: string): Collection {
        return this.client.db().collection(name)
    },
    map: (connection: any, id: any): any => {
        return Object.assign({}, connection, { id: id.insertedId.id.toString() })
    }
}