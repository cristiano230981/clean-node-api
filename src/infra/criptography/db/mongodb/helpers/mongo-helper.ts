import { Collection, MongoClient } from "mongodb"

export const MongoHelper = {
    client: null as MongoClient,
    uri: null as string,

    async connect (uri: string): Promise<void> {
        this.uri = uri
        this.client = await MongoClient.connect(uri)
    },
    async disconnect () {
        //await this.client.close()
        this.client = null
    },
    async getCollection (name: string): Promise<Collection> {
        if(!this.client == null){
            await this.client.connect(this.uri)
        }
        return this.client.db().collection(name)
    },
    map: (connection: any, id: any): any => {
        return Object.assign({}, connection, { id: id.insertedId.id.toString() })
    }
}