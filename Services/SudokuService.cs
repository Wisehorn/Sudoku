using Sudoku.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sudoku.Services
{
    public enum SolutionCheckResult
    {
        NotComplete,
        HasErrors,
        Complete
    }
    public class SudokuService : ISudokuService
    { 

        public SudokuGame GetNewGame(int[] playedGameIds = null)
        {
            if (playedGameIds == null || playedGameIds.Length == 0)
            {
                return _newGames.First();
            }
            var notPlayedGames = GetNotPlayedGames(playedGameIds);
            if(notPlayedGames.Any())
            {
                return notPlayedGames.First();
            }

            return GetNewGame(null);
        }

        private List<SudokuGame> GetNotPlayedGames(int[] playedGameIds)
        {
            HashSet<int> playedGameIdsSet = new HashSet<int>(playedGameIds);
            return _newGames.Where(game => !playedGameIdsSet.Contains(game.Id)).ToList();
        }

        public SolutionCheckResult CheckSolution(SudokuGame game)
        {
            ValidateBoard(game);
            SudokuGame solvedGame = _solvedGames[game.Id];
            SolutionCheckResult result = CheckBoard(game, solvedGame);
            return result;
        }

        private static void ValidateBoard(SudokuGame game)
        {
            if (game.Board == null)
            {
                throw new ArgumentNullException(nameof(game.Board));
            }

            if (game.Board.GetLength(0) != SUDOKU_BOARD_SIZE &&
               game.Board.GetLength(1) != SUDOKU_BOARD_SIZE)
            {
                throw new ArgumentOutOfRangeException(nameof(game.Board));
            }
        }

        private static SolutionCheckResult CheckBoard(SudokuGame game, SudokuGame solvedGame)
        {
            var result = SolutionCheckResult.Complete;
            for (var i = 0; i < SUDOKU_BOARD_SIZE; i++)
            {
                for (var j = 0; j < SUDOKU_BOARD_SIZE; j++)
                {
                    if (game.Board[i, j] == 0)
                    {
                        result = SolutionCheckResult.NotComplete;
                    }
                    else if (game.Board[i, j] != solvedGame.Board[i, j])
                    {
                        result = SolutionCheckResult.HasErrors;
                        break;
                    }
                }
                if (result == SolutionCheckResult.HasErrors)
                {
                    break;
                }
            }

            return result;
        }

        public byte GetCellValue (int gameId, byte row, byte column)
        {
            ValidateCell(row, column);
            var solvedGame = _solvedGames[gameId];
            return solvedGame.Board[row, column];
        }

        private static void ValidateCell(byte row, byte column)
        {
            if (row < 0 || row >= SUDOKU_BOARD_SIZE)
            {
                throw new ArgumentOutOfRangeException(nameof(row));
            }
            if (column < 0 || column >= SUDOKU_BOARD_SIZE)
            {
                throw new ArgumentOutOfRangeException(nameof(column));
            }
        }


        const int SUDOKU_BOARD_SIZE = 9;
        private static List<SudokuGame> _newGames { get; } = new List<SudokuGame>
        {
            new SudokuGame
                {
                    Id = 0,
                    Board = new byte [SUDOKU_BOARD_SIZE, SUDOKU_BOARD_SIZE]
                    {
                        { 0, 0, 0, 2, 6, 0, 7, 0, 1 },
                        { 6, 8, 0, 0, 7, 0, 0, 9, 0 },
                        { 1, 9, 0, 0, 0, 4, 5, 0, 0 },
                        { 8, 2, 0, 1, 0, 0, 0, 4, 0 },
                        { 0, 0, 4, 6, 0, 2, 9, 0, 0 },
                        { 0, 5, 0, 0, 0, 3, 0, 2, 8 },
                        { 0, 0, 9, 3, 0, 0, 0, 7, 4 },
                        { 0, 4, 0, 0, 5, 0, 0, 3, 6 },
                        { 7, 0, 3, 0, 1, 8, 0, 0, 0 }
                    }
            },
            new SudokuGame
                {
                    Id = 1,
                    Board = new byte [SUDOKU_BOARD_SIZE, SUDOKU_BOARD_SIZE]
                    {
                        { 1, 0, 0, 4, 8, 9, 0, 0, 6 },
                        { 7, 3, 0, 0, 0, 0, 0, 4, 0 },
                        { 0, 0, 0, 0, 0, 1, 2, 9, 5 },
                        { 0, 0, 7, 1, 2, 0, 6, 0, 0 },
                        { 5, 0, 0, 7, 0, 3, 0, 0, 8 },
                        { 0, 0, 6, 0, 9, 5, 7, 0, 0 },
                        { 9, 1, 4, 6, 0, 0, 0, 0, 0 },
                        { 0, 2, 0, 0, 0, 0, 0, 3, 7 },
                        { 8, 0, 0, 5, 1, 2, 0, 0, 4 }
                    }
            },
            new SudokuGame
                {
                    Id = 2,
                    Board = new byte [SUDOKU_BOARD_SIZE, SUDOKU_BOARD_SIZE]
                    {
                        { 0, 0, 7, 1, 2, 0, 6, 0, 0 },
                        { 5, 0, 0, 7, 0, 3, 0, 0, 8 },
                        { 0, 0, 6, 0, 9, 5, 7, 0, 0 },
                        { 1, 0, 0, 4, 8, 9, 0, 0, 6 },
                        { 7, 3, 0, 0, 0, 0, 0, 4, 0 },
                        { 0, 0, 0, 0, 0, 1, 2, 9, 5 },
                        { 0, 2, 0, 0, 0, 0, 0, 3, 7 },
                        { 9, 1, 4, 6, 0, 0, 0, 0, 0 },
                        { 8, 0, 0, 5, 1, 2, 0, 0, 4 }
                    }
                },
            new SudokuGame
                {
                    Id = 3,
                    Board = new byte [SUDOKU_BOARD_SIZE, SUDOKU_BOARD_SIZE]
                    {
                        {  2, 6, 0, 0, 0, 0, 7, 0, 1 },
                        {  0, 7, 0, 6, 8, 0, 0, 9, 0 },
                        {  0, 0, 4, 1, 9, 0, 5, 0, 0 },
                        {  1, 0, 0, 8, 2, 0, 0, 4, 0 },
                        {  6, 0, 2, 0, 0, 4, 9, 0, 0 },
                        {  0, 0, 3, 0, 5, 0, 0, 2, 8 },
                        {  3, 0, 0, 0, 0, 9, 0, 7, 4 },
                        {  0, 5, 0, 0, 4, 0, 0, 3, 6 },
                        {  0, 1, 8, 7, 0, 3, 0, 0, 0 }
                    }
                },
            new SudokuGame
                {
                    Id = 4,
                    Board = new byte [SUDOKU_BOARD_SIZE, SUDOKU_BOARD_SIZE]
                    {
                        {  0, 7, 0, 6, 8, 0, 0, 9, 0 },
                        {  2, 6, 0, 0, 0, 0, 7, 0, 1 },
                        {  0, 0, 4, 1, 9, 0, 5, 0, 0 },
                        {  3, 0, 0, 0, 0, 9, 0, 7, 4 },
                        {  0, 5, 0, 0, 4, 0, 0, 3, 6 },
                        {  0, 1, 8, 7, 0, 3, 0, 0, 0 },
                        {  1, 0, 0, 8, 2, 0, 0, 4, 0 },
                        {  6, 0, 2, 0, 0, 4, 9, 0, 0 },
                        {  0, 0, 3, 0, 5, 0, 0, 2, 8 }
                    }
                }
        };

        private static Dictionary<int, SudokuGame> _solvedGames { get; } = new Dictionary<int, SudokuGame>
        {
            { 0, new SudokuGame
                {
                    Id = 0,
                    Board = new byte [SUDOKU_BOARD_SIZE, SUDOKU_BOARD_SIZE]
                    {
                        { 4, 3, 5, 2, 6, 9, 7, 8, 1 },
                        { 6, 8, 2, 5, 7, 1, 4, 9, 3 },
                        { 1, 9, 7, 8, 3, 4, 5, 6, 2 },
                        { 8, 2, 6, 1, 9, 5, 3, 4, 7 },
                        { 3, 7, 4, 6, 8, 2, 9, 1, 5 },
                        { 9, 5, 1, 7, 4, 3, 6, 2, 8 },
                        { 5, 1, 9, 3, 2, 6, 8, 7, 4 },
                        { 2, 4, 8, 9, 5, 7, 1, 3, 6 },
                        { 7, 6, 3, 4, 1, 8, 2, 5, 9 }
                    }
                }
            },
            { 1, new SudokuGame
                {
                    Id = 1,
                    Board = new byte [SUDOKU_BOARD_SIZE, SUDOKU_BOARD_SIZE]
                    {
                        { 1, 5, 2, 4, 8, 9, 3, 7, 6 },
                        { 7, 3, 9, 2, 5, 6, 8, 4, 1 },
                        { 4, 6, 8, 3, 7, 1, 2, 9, 5 },
                        { 3, 8, 7, 1, 2, 4, 6, 5, 9 },
                        { 5, 9, 1, 7, 6, 3, 4, 2, 8 },
                        { 2, 4, 6, 8, 9, 5, 7, 1, 3 },
                        { 9, 1, 4, 6, 3, 7, 5, 8, 2 },
                        { 6, 2, 5, 9, 4, 8, 1, 3, 7 },
                        { 8, 7, 3, 5, 1, 2, 9, 6, 4 }
                    }
                }
            },
            { 2, new SudokuGame
                {
                    Id = 2,
                    Board = new byte [SUDOKU_BOARD_SIZE, SUDOKU_BOARD_SIZE]
                    {
                        { 3, 8, 7, 1, 2, 4, 6, 5, 9 },
                        { 5, 9, 1, 7, 6, 3, 4, 2, 8 },
                        { 2, 4, 6, 8, 9, 5, 7, 1, 3 },
                        { 1, 5, 2, 4, 8, 9, 3, 7, 6 },
                        { 7, 3, 9, 2, 5, 6, 8, 4, 1 },
                        { 4, 6, 8, 3, 7, 1, 2, 9, 5 },
                        { 6, 2, 5, 9, 4, 8, 1, 3, 7 },
                        { 9, 1, 4, 6, 3, 7, 5, 8, 2 },
                        { 8, 7, 3, 5, 1, 2, 9, 6, 4 }
                    }
                }
            },
            { 3, new SudokuGame
                {
                    Id = 3,
                    Board = new byte [SUDOKU_BOARD_SIZE, SUDOKU_BOARD_SIZE]
                    {
                        { 2, 6, 9, 4, 3, 5, 7, 8, 1 },
                        { 5, 7, 1, 6, 8, 2, 4, 9, 3 },
                        { 8, 3, 4, 1, 9, 7, 5, 6, 2 },
                        { 1, 9, 5, 8, 2, 6, 3, 4, 7 },
                        { 6, 8, 2, 3, 7, 4, 9, 1, 5 },
                        { 7, 4, 3, 9, 5, 1, 6, 2, 8 },
                        { 3, 2, 6, 5, 1, 9, 8, 7, 4 },
                        { 9, 5, 7, 2, 4, 8, 1, 3, 6 },
                        { 4, 1, 8, 7, 6, 3, 2, 5, 9 }
                    }
                }
            },
            { 4, new SudokuGame
                {
                    Id = 4,
                    Board = new byte [SUDOKU_BOARD_SIZE, SUDOKU_BOARD_SIZE]
                    {
                        { 5, 7, 1, 6, 8, 2, 4, 9, 3 },
                        { 2, 6, 9, 4, 3, 5, 7, 8, 1 },
                        { 8, 3, 4, 1, 9, 7, 5, 6, 2 },
                        { 3, 2, 6, 5, 1, 9, 8, 7, 4 },
                        { 9, 5, 7, 2, 4, 8, 1, 3, 6 },
                        { 4, 1, 8, 7, 6, 3, 2, 5, 9 },
                        { 1, 9, 5, 8, 2, 6, 3, 4, 7 },
                        { 6, 8, 2, 3, 7, 4, 9, 1, 5 },
                        { 7, 4, 3, 9, 5, 1, 6, 2, 8 }
                    }
                }
            }
        };
    }
}
