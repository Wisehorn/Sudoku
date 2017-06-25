import * as React from 'react';
import * as SudokuState from '../../store/Sudoku';
import * as SudokuActions from '../../actions/Sudoku';
import Cell from './Cell';

interface FieldProps {
    board: SudokuState.Board;
    initialBoard: SudokuState.Board;
    selectCellAction: SudokuActions.SelectCellActionType;
    setCellValueAction: SudokuActions.SetCellValueActionType;
    selectedRowIndex: number;
    selectedColumnIndex: number;
    isCellValueChangedByReveal: boolean;
}

export default class Board extends React.Component<FieldProps, {}> {
    public componentDidMount() {
        window && window.addEventListener('keypress', this.handleKeyPress.bind(this));
    }

    public componentWillUnmount() {
        window && window.removeEventListener('keypress', this.handleKeyPress);
    }

    private handleKeyPress(e) {
        const key = parseInt(e.key);
        if (isNaN(key) || key === 0) {
            return;
        }
        this.props.setCellValueAction(key);
    }

    public render() {
        return <div className="board" onKeyDown={ (e) => this.handleKeyPress(e) }>
            { this.props.board.map((row, rowIndex) => this.renderRow(row, rowIndex)) }
        </div>;
    }

    private renderRow(row, rowIndex) {
        return row.map((cellValue, columnIndex) =>
            <Cell
                isSelected={this.isCellSelected(rowIndex, columnIndex)}
                selectCellAction={this.props.selectCellAction}
                value={cellValue}
                rowIndex={rowIndex}
                columnIndex={columnIndex}
                isCellValueChangedByReveal={this.props.isCellValueChangedByReveal}
                isReadOnly={this.isCellReadOnly(rowIndex, columnIndex)} ></Cell>);
    }

    private isCellReadOnly(rowIndex: number, columnIndex: number) {
        return this.props.initialBoard[rowIndex][columnIndex] !== 0;
    }

    private isCellSelected(row: number, column: number) {
        return row === this.props.selectedRowIndex && column === this.props.selectedColumnIndex;
    }
}