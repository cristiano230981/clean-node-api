import { Collection, MongoClient, ObjectId } from "mongodb"

export const MongoHelper = {
    client: null as MongoClient,
    uri: null as string,

    async connect (uri: string): Promise<void> {
        this.uri = uri
        this.client = await MongoClient.connect(uri)
        this.connected = true
    },
    async disconnect () {
        await this.client?.close()
        this.client = null
    },
    async getCollection (name: string): Promise<Collection> {
        if(this.client == null){
            await this.client.connect(this.uri)
        }
        return this.client.db().collection(name)
    },
    map: (collection: any): any => {
        const { _id, ...collectionWithoutId } = collection
        return { id: _id.toHexString(), ...collectionWithoutId }
    },
    toObjectId: (value: string): ObjectId => {
        return new ObjectId(value)
    }
}