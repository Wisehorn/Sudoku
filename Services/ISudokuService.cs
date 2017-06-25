using Sudoku.Models;

namespace Sudoku.Services
{
    public interface ISudokuService
    {
        SolutionCheckResult CheckSolution(SudokuGame game);
        byte GetCellValue(int gameId, byte row, byte column);
        SudokuGame GetNewGame(int[] playedGameIds = null);
    }
}