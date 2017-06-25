import { fetch, addTask } from 'domain-task';
import { Action, ActionCreator } from 'redux';
import * as SudokuStore from '../store/Sudoku';
import { AppThunkAction } from '../store/';
import * as i18n from '../i18n/';

interface RequestGameAction {
    type: 'REQUEST_GAME';
}

interface RequestGameCompletedAction {
    type: 'REQUEST_GAME_COMPLETED';
    game: SudokuStore.SudokuGame;
}

interface CheckSolutionAction {
    type: 'CHECK_SOLUTION';
}

interface CheckSolutionCompletedAction {
    type: 'CHECK_SOLUTION_COMPLETED';
    result: string;
}

interface RevealCellValueAction {
    type: 'REVEAL_CELL_VALUE';
}

interface RevealCellValueCompletedAction {
    type: 'REVEAL_CELL_VALUE_COMPLETED',
    row: number;
    column: number;
    value: number;
}

interface SelectCellAction {
    type: 'SELECT_CELL';
    row: number;
    column: number;
}

interface SetCellValueAction {
    type: 'SET_CELL_VALUE';
    value: number;
}

interface SetMessageAction {
    type: 'SET_MESSAGE';
    value: string;
}

type CheckResult = 'COMPLETE' | 'INCOMPLETE' | 'HAS_ERRORS';

function mapCheckResultToMessage(messages: i18n.locale.messages, checkResult: CheckResult) {
    const map = {
        'COMPLETE': messages.checkComplete,
        'INCOMPLETE': messages.checkIncomplete,
        'HAS_ERRORS': messages.checkHasErrors
    };
    return map[checkResult];
}

export type KnownAction = RequestGameAction | RequestGameCompletedAction | CheckSolutionAction | CheckSolutionCompletedAction | RevealCellValueAction | RevealCellValueCompletedAction | SelectCellAction | SetCellValueAction | SetMessageAction;

export type SelectCellActionType = (row: number, column: number) => void;
export type SetCellValueActionType = (value: number) => void;
export type RequestBoardActionType = () => void;
export type RevealCellValueActionType = () => void;
export type CheckSolutionActionType = () => void;

const baseUri = '/api/sudoku/';

const fetchHeaders = {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json'
}

export const actionCreators = {
    requestBoardAction: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const playedGameIds = getState().sudoku.playedGameIds;

        const fetchTask = fetch(baseUri + 'newgame', {
            headers: fetchHeaders,
            method: 'POST',
            body: JSON.stringify(playedGameIds)
        })
            .then(response => response.json() as Promise<SudokuStore.SudokuGame>)
            .then((game: SudokuStore.SudokuGame) => {
                dispatch({ type: 'REQUEST_GAME_COMPLETED', game });
            })
            .catch(() => {
                setConnectionErrorMessage(dispatch, getState().sudoku.locale.messages);
            });

        addTask(fetchTask);
        dispatch({ type: 'REQUEST_GAME' });
    },

    selectCellAction: (row: number, column: number) => <SelectCellAction>{ type: 'SELECT_CELL', row, column },

    setCellValueAction: (value: number) => <SetCellValueAction>{ type: 'SET_CELL_VALUE', value },

    revealCellValueAction: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const currentState = getState().sudoku;
        const selectedCellRowIndex = currentState.selectedCellRowIndex;
        const selectedCellColumnIndex = currentState.selectedCellColumnIndex;
        if (selectedCellRowIndex === null || selectedCellColumnIndex === null ||
            currentState.game.board[selectedCellRowIndex][selectedCellColumnIndex] !== 0) {
            return;
        }
        const playedGameIds = currentState.playedGameIds;
        const gameId = currentState.game.id;

        const fetchTask = fetch(baseUri + `revealcell?gameId=${gameId}&rowIndex=${selectedCellRowIndex}&columnIndex=${selectedCellColumnIndex}`)
            .then(response => response.json() as Promise<number>)
            .then((value: number) => {
                if (getState().sudoku.game.id === gameId) {
                    dispatch({ type: 'REVEAL_CELL_VALUE_COMPLETED', row: selectedCellRowIndex, column: selectedCellColumnIndex, value });
                }
            })
            .catch(() => {
                setConnectionErrorMessage(dispatch, getState().sudoku.locale.messages);
            });

        dispatch({ type: 'REVEAL_CELL_VALUE' });
    },

    checkSolutionAction: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const game = getState().sudoku.game;
        const gameId = game.id;

        const fetchTask = fetch(baseUri + 'check', {
            headers: fetchHeaders,
            method: 'POST',
            body: JSON.stringify(game)
        })
            .then(response => response.json() as Promise<string>)
            .then((result: CheckResult) => {
                if (getState().sudoku.game.id === gameId) {
                    const message = mapCheckResultToMessage(getState().sudoku.locale.messages, result);
                    dispatch({ type: 'CHECK_SOLUTION_COMPLETED', result: message });
                }
            })
            .catch(() => {
                setConnectionErrorMessage(dispatch, getState().sudoku.locale.messages);
            });

        dispatch({ type: 'CHECK_SOLUTION' });
    }
};

function setConnectionErrorMessage(dispatch: (action: SetMessageAction) => void, messages: i18n.locale.messages) {
    dispatch({ type: 'SET_MESSAGE', value: messages.connectionError });
}