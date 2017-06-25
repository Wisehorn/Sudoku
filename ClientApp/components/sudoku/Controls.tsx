import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import * as SudokuState from '../../store/Sudoku';
import * as SudokuActions from '../../actions/Sudoku';
import { locale } from '../../i18n/';

interface ControlsProps {
    requestBoardAction: SudokuActions.RequestBoardActionType;
    revealCellValueAction: SudokuActions.RevealCellValueActionType;
    checkSolutionAction: SudokuActions.CheckSolutionActionType;
    locale: locale.controlLabels;
}

    

export default class Controls extends React.Component<ControlsProps, {}> {
    public render() {
        return <div className="controls text-center">
            <input type="button" className="btn btn-default" value={this.props.locale.newGameButton} onClick={e => this.props.requestBoardAction()} />
            <input type="button" className="btn btn-default" value={this.props.locale.checkSolutionButton} onClick={e => this.props.checkSolutionAction()} />
            <input type="button" className="btn btn-default" value={this.props.locale.revealCellValueButton} onClick={e => this.props.revealCellValueAction()} />
        </div>;
    }
}