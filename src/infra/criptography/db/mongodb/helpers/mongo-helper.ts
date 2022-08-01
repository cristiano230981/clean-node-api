import { MongoClient } from "mongodb"

export const MongoHelper = {
    client: null as MongoClient,
    connect (uri: string): Promise<void> {
        this.client = await MongoClient.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    },
    async disconnect () {
        await this.client.close()
    }
}