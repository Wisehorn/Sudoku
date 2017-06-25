import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import SudokuContainer from './components/Sudoku/Container';

export const routes = <Layout>
    <Route exact path='/' component={ SudokuContainer } />
</Layout>;
