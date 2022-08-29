import { sign } from "jsonwebtoken"
import { Collection } from "mongodb"
import request from "supertest"
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper"
import app from "../config/app"
import env from '../config/env'

let surveyCollection: Collection
let accountCollection: Collection

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
        accountCollection = await MongoHelper.getCollection('accounts')
        await accountCollection.deleteMany({})
    })
    describe('POST /surveys', () => {
        test('Should return an 403 on add Survey without accessToken', async () => {
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
                .expect(403)
        })

        test('Should return an 204 on add Survey with valir token', async () => {
            const res = await accountCollection.insertOne({
                name: 'Cristiano',
                email: 'cristiano.moura@vbsolutions.com.br',
                password: '123',
                role: 'admin'
            })
            const id = res.insertedId.toHexString()
            const _accessToken = sign({ id }, env.jwtScret)
            await accountCollection.updateOne({ _id: MongoHelper.toObjectId(id) },
                { $set: {
                    accessToken: _accessToken
                }}
            )

            await request(app)
                .post('/api/surveys')
                .set('x-access-token', _accessToken)
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