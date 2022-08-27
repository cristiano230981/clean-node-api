import { Collection } from "mongodb"
import request from "supertest"
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper"
import app from "../config/app"

let surveyCollection: Collection

describe('Login Routes', () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        surveyCollection = await MongoHelper.getCollection('surveys')
        await surveyCollection.deleteMany({})
    })
    describe('POST /surveys', () => {
        test('Should return an 204 on add Survey success', async () => {
            await request(app)
                .post('/api/surveys')
                .send({
                    question: 'Question',
                    answers: [{
                        answer: 'Answer 1',
                        image: 'http://image-name.com'
                    },
                    {
                        answer: 'Answer 1'
                    }]
                })
                .expect(204)
        })
    })

})