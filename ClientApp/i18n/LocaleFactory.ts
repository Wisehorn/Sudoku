import { locale } from './locale';

import localeRuRu from './locales/ru-ru';

export default class LocaleFactory {
    public static get(language): locale {
        return locales[language] || localeRuRu;
    }
}

const locales = {
    'ru-ru': localeRuRu
}