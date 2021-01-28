import ISendMailDTO from '@shared/container/providers/MailProvider/dtos/ISendMailDTO';

export default interface iMailProvider {
    sendMail(data: ISendMailDTO): Promise<void>;
}