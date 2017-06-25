import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as SudokuState from '../../store/Sudoku';
import * as SudokuActions from '../../actions/Sudoku';

interface FieldProps {
    rowIndex: number;
    columnIndex: number;
    value: number;
    isReadOnly: boolean;
    isSelected: boolean;
    isCellValueChangedByReveal: boolean;

    selectCellAction: SudokuActions.SelectCellActionType;
}

export default class Cell extends React.Component<FieldProps, { shouldFlip: boolean }> {
    constructor() {
        super()
        this.state = {
            shouldFlip: false
        }
    }

    public componentWillReceiveProps(nextProps: FieldProps) {
        if (nextProps.value !== this.props.value && nextProps.isCellValueChangedByReveal) {
            this.setState({ shouldFlip: true });
        }
    }

    componentDidUpdate() {
        if (this.state.shouldFlip) {
            setTimeout(
                () => this.setState({ shouldFlip: false }),
                300);
        }
    }

    public render() {
        const classNames = [
            'board__cell',
            this.isOddSquare(this.props.rowIndex, this.props.columnIndex) ? 'board__cell--odd-square' : '',
            this.props.isReadOnly ? 'board__cell--readonly' : '',
            this.props.isSelected ? 'board__cell--selected' : '',
            this.state.shouldFlip ? 'board__cell--flip' : ''
        ];

        return <div
            className={classNames.filter(cn => !!cn).join(' ')} onClick={_ => this.handleClick()}>{this.props.value || ''}</div>;
    }

    private handleClick() {
        if (this.props.isReadOnly || this.props.isSelected) {
            return;
        }
        this.props.selectCellAction(this.props.rowIndex, this.props.columnIndex)
    }

    private isOddSquare(rowIndex: number, columnIndex: number): boolean {
        return this.getSquare(rowIndex, columnIndex) % 2 !== 0;
    }

    private getSquare(i, j) {
        const a = Math.floor(i / 3) * 3;
        const b = Math.floor(j / 3) + 1;
        return a + b;
    }
}