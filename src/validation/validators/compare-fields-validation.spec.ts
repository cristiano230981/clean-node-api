import { InvalidParamError } from "../../presentation/errors"
import { CompareFieldsValidations } from "./compare-fields-validation"

const makeSut = (): CompareFieldsValidations => {
    return new CompareFieldsValidations('field', 'fieldToCompare')
}

describe('CompareFields Validation', () => {
    test('Should return a InvalidParamError if validation fails', () => {
        const sut = makeSut()
        const error = sut.validate({ 
            field: 'any_value' ,
            fieldToCompare: 'wrong_value'
        })
        expect(error).toEqual(new InvalidParamError('fieldToCompare'))
    })

    test('Should not return if validation success', () => {
        const sut = makeSut()
        const error = sut.validate({ 
            field: 'any_value' ,
            fieldToCompare: 'any_value'
         })
        expect(error).toBeFalsy()
    })
})