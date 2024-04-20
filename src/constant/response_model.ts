export interface ResponseModelWithData {
    status: number;
    data: any;
    error: boolean;
    message: string;
}

export interface ResponseModelOnlyMessage {
    status: number;
    error: boolean;
    message: string;
}

export interface ResponseWhenError {
    status: number;
    error: boolean;
    message: string;
}

export interface ResponseModelWithToken {
    status: number;
    token: string;
    message: string;
    error:boolean;
}

export interface ResponseFailedValidation {
    status: number;
    error: boolean;
    message: string;
}