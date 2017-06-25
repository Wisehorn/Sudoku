export interface controlLabels {
    newGameButton: string;
    checkSolutionButton: string;
    revealCellValueButton: string;
}

export interface messages {
    cellRevealing: string;
    loading: string;
    checkingSolution: string;
    checkComplete: string;
    checkHasErrors: string;
    checkIncomplete: string;
    connectionError: string;
}

export interface locale {
    language: 'ru-ru';
    header: string;
    controlLabels: controlLabels,
    messages: messages
}