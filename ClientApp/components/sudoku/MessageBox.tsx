import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as SudokuState from '../../store/Sudoku';

interface MessageBoxProps {
    message: string;
}

export default class MessageBox extends React.Component<MessageBoxProps, {}> {
    public render() {
        return <div className="messagebox text-center">
            { this.props.message }
        </div>;
    }
}