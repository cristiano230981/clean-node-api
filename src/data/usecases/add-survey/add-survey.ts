import { AddSurvey, AddSurveyModel, AddSurveyRepository } from "./add-survey-protocols";

export class DbAddSurvey implements AddSurvey {
    constructor(private readonly addSurveyRepository: AddSurveyRepository) {}
    async add(data: AddSurveyModel): Promise<void> {
        this.addSurveyRepository.add(data)
    }
}