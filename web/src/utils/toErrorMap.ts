import {FieldError, GameFieldError} from '../generated/graphql';

type FError = FieldError[] | GameFieldError[];
export const toErrorMap = (errors: FError) => {
    const errorMap: Record<string, string> = {};
    errors.forEach(({field, message}) => {
        errorMap[field] = message;
    });
    return errorMap;
}