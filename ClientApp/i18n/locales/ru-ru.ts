import { locale } from '../locale';

export default <locale> {
    language: 'ru-ru',
    header: 'Судоку №',
    controlLabels: {
        newGameButton: 'Новая игра',
        checkSolutionButton: 'Проверить',
        revealCellValueButton: 'Открыть ячейку'
    },
    messages: {
        cellRevealing: 'Открывается ячейка...',
        checkingSolution: 'Проверяется решение...',
        loading: 'Загрузка...',
        checkComplete: 'Поздравляю Вас! Вы правильно решили Судоку.',
        checkHasErrors: 'В решении есть ошибки.',
        checkIncomplete: 'В решении нет ошибок.',
        connectionError: 'Не удалось подключиться к серверу.'
    }
}