interface ResponseMessage<T = unknown> {
    message: string;
    status?: number;
    data?: T;
}

export default ResponseMessage;