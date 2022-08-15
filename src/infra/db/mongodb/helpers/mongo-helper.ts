import { Collection, MongoClient } from "mongodb"

export const MongoHelper = {
    client: null as MongoClient,
    uri: null as string,
    connected: null as boolean,

    async connect (uri: string): Promise<void> {
        this.uri = uri
        this.client = await MongoClient.connect(uri)
        this.connected = true
    },
    async disconnect () {
        await this.client?.close()
        this.client = null
        this.connected = false
    },
    async getCollection (name: string): Promise<Collection> {
        if(this.client == null || this.connected == null || !this.connected){
            await this.client.connect(this.uri)
            this.connected = true
        }
        return this.client.db().collection(name)
    },
    map: (collection: any): any => {
        const { _id, ...collectionWithoutId } = collection
        return { id: _id.toHexString(), ...collectionWithoutId }
    }
}