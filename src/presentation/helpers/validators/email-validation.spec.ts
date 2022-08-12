import { InvalidParamError } from "../../errors"
import { EmailValidator } from "../../protocols/email-validator"
import { EmailValidation } from "./email-validation"

interface SubTypes {
    sut: EmailValidation,
    emailValidatorStub: EmailValidator
}

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid (email: string): boolean {
            return true
        }
    }
    return new EmailValidatorStub()
}

const makeSut = (): SubTypes => {
    const emailValidatorStub = makeEmailValidator()
    const sut = new EmailValidation('email', emailValidatorStub)
    return {
        sut,
        emailValidatorStub
    }
}

describe('Email Validation', () => {

    test('Should retur an error if EmailValidator return false', () => {
        const { sut , emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
        const error = sut.validate({ email : 'any_email@email.com'})
        expect(error).toEqual(new InvalidParamError('email'))
    })

    test('Should call EmailValidator with correct email', () => {
        const { sut , emailValidatorStub } = makeSut()
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
        sut.validate({ email : 'any_email@email.com'})
        expect(isValidSpy).toHaveBeenCalledWith('any_email@email.com')
    })

    test('Should throw if emailValidator throws', () => {
        const { sut , emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error()
        })
        expect(sut.validate).toThrow()
    })
})