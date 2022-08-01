import { AddAccountRepository } from "../../../../../data/protocols/add-account-repository";
import { AccountModel } from "../../../../../domain/models/account";
import { AddAccountModel } from "../../../../../domain/usecases/add-account";
import { MongoHelper } from "../helpers/mongo-helper";

export class AccountMongoRepository implements AddAccountRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
        const accountCollection = MongoHelper.getCollection('accounts')
        const results = await accountCollection.insertOne(accountData)
        const account = Object.assign({}, accountData, { id: results.insertedId.id.toString() })
        return account
    }
}