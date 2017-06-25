import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store/';
import * as SudokuActions from '../../actions/Sudoku';
import * as SudokuState from '../../store/Sudoku';
import Board from './Board';
import Controls from './Controls';
import MessageBox from './MessageBox';

type ContainerProps =
    SudokuState.SudokuState        
    & typeof SudokuActions.actionCreators
    & RouteComponentProps<{}>;


class Container extends React.Component<ContainerProps, {}> {
    componentWillMount() {
        if (!this.props.game) {
            this.props.requestBoardAction();
        }
    }

    public render() {
        return <div className="text-center">
            <div className="row">
                <div className="col-xs-12">
                    <h1>{this.props.locale.header}{this.props.game && this.props.game.id}</h1>
                </div>
            </div>
            <div className="row">
                <div className="col-xs-12">
                    {this.props.game && <Board
                        setCellValueAction={this.props.setCellValueAction}
                        selectedRowIndex={this.props.selectedCellRowIndex}
                        selectedColumnIndex={this.props.selectedCellColumnIndex}
                        selectCellAction={this.props.selectCellAction}
                        initialBoard={this.props.initialGame.board}
                        board={this.props.game.board}
                        isCellValueChangedByReveal={this.props.isCellValueChangedByReveal}>
                    </Board>}
                </div>
            </div>
            <div className="row">
                <div className="col-xs-12">
                    <Controls
                        locale={this.props.locale.controlLabels}
                        requestBoardAction={this.props.requestBoardAction}
                        revealCellValueAction={this.props.revealCellValueAction}
                        checkSolutionAction={this.props.checkSolutionAction}>
                    </Controls>
                </div>
            </div>
            <div className="row">
                <div className="col-xs-12">
                    <MessageBox message={ this.props.lastMessage }></MessageBox>
                </div>
            </div>
        </div>;
    }
}

export default connect(
    (state: ApplicationState) => state.sudoku, // Selects which state properties are merged into the component's props
    SudokuActions.actionCreators                 // Selects which action creators are merged into the component's props
)(Container) as typeof Container;