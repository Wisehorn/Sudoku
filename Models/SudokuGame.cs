using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sudoku.Models
{
    public class SudokuGame
    {
        public int Id { get; set; }
        public byte[,] Board { get; set; }
    }
}
