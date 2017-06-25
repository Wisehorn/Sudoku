import { Reducer } from 'redux';
import * as SudokuStore from '../store/Sudoku';
import { KnownAction } from '../actions/Sudoku';
import * as i18n from '../i18n/';
// -----------------
// STATE - This defines the type of data maintained in the Redux store.
export type Board = Array<Array<number>>;

export interface SudokuGame {
    board: Board;
    id: number;
}

//export interface Sudoku

export interface SudokuState {
    locale: i18n.locale.locale,
    isLoading: boolean;
    initialGame: SudokuGame;
    game: SudokuGame;
    selectedCellRowIndex: null | number;
    selectedCellColumnIndex: null | number;
    playedGameIds: Array<number>;
    isMessageVisible: boolean;
    lastMessage: string;
    isCellValueChangedByReveal: boolean;
}

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: SudokuState = {
    locale: i18n.localeFactory.get('ru-ru'),
    initialGame: null,
    game: null,
    playedGameIds: [],
    isLoading: false,
    selectedCellRowIndex: null,
    selectedCellColumnIndex: null,
    isMessageVisible: false,
    lastMessage: '',
    isCellValueChangedByReveal: false
};

export const reducer: Reducer<SudokuState> = (state: SudokuState, action: KnownAction) => {
    switch (action.type) {
        case 'REQUEST_GAME':
            return Object.assign({}, state, { isLoading: true, lastMessage: state.locale.messages.loading });
        case 'REQUEST_GAME_COMPLETED': {
            const playedGameIds = state.playedGameIds.indexOf(action.game.id) === -1 ?
                [...state.playedGameIds, action.game.id] :
                [action.game.id];
            return Object.assign(
                {},
                state,
                {
                    initialGame: deepClone(action.game),
                    game: action.game,
                    isLoading: false,
                    selectedCellRowIndex: null,
                    selectedCellColumnIndex: null,
                    playedGameIds,
                    lastMessage: '',
                    isCellValueChangedByReveal: false
                });
        }
        case 'CHECK_SOLUTION':
            return Object.assign({}, state, { lastMessage: state.locale.messages.checkingSolution });
        case 'CHECK_SOLUTION_COMPLETED':
            return Object.assign({}, state, { lastMessage: action.result });
        case 'SELECT_CELL':
            return Object.assign(
                {},
                state,
                {
                    selectedCellRowIndex: action.row,
                    selectedCellColumnIndex: action.column
                }
            );
        case 'REVEAL_CELL_VALUE':
            return Object.assign({}, state, { lastMessage: state.locale.messages.cellRevealing });
        case 'REVEAL_CELL_VALUE_COMPLETED': {
            const game = deepClone(state.game);
            game.board[action.row][action.column] = action.value;

            return Object.assign(
                {},
                state,
                {
                    game,
                    lastMessage: '',
                    isCellValueChangedByReveal: true
                }
            );
        }
        case 'SET_CELL_VALUE': {
            if (state.selectedCellColumnIndex === null || state.selectedCellRowIndex == null) {
                return state;
            }

            const game = deepClone(state.game);
            game.board[state.selectedCellRowIndex][state.selectedCellColumnIndex] = action.value;

            return Object.assign(
                {},
                state,
                {
                    game,
                    lastMessage: '',
                    isCellValueChangedByReveal: false
                }
            );
        }
        case 'SET_MESSAGE': {
            return Object.assign(
                {},
                state,
                {
                    lastMessage: action.value
                }
            );
        }
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};

function deepClone(object) {
    return JSON.parse(JSON.stringify(object));
}
