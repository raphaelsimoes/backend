import { container } from 'tsyringe';

import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';
import HandlebarsMailTempleteProvider from '@shared/container/providers/MailTemplateProvider/implementations/HandlebarsMailTemplateProvider';

const providers = {
    handlebars: HandlebarsMailTempleteProvider,
}

container.registerSingleton<IMailTemplateProvider>('MailTemplateProvider', providers.handlebars);