using Microsoft.AspNetCore.Mvc;
using Sudoku.Models;
using Sudoku.Services;
using System;
using System.Collections.Generic;

namespace Sudoku.Controllers
{
    [Route("api/Sudoku")]
    public class SudokuApiController : Controller
    {
        private readonly ISudokuService _sudokuService;

        public SudokuApiController(ISudokuService sudokuService)
        {
            _sudokuService = sudokuService;
        }

        [HttpPost("newgame")]
        public SudokuGame GetNewGame([FromBody]int[] playedGameIds = null)
        {
            return _sudokuService.GetNewGame(playedGameIds);
        }

        [HttpGet("revealcell")]
        public IActionResult RevealCellValue(int gameId, byte rowIndex, byte columnIndex)
        {
            try
            {
                return Json(_sudokuService.GetCellValue(gameId, rowIndex, columnIndex));
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (ArgumentException)
            {
                return BadRequest();
            }
        }

        [HttpPost("check")]
        public IActionResult CheckSolution([FromBody]SudokuGame game)
        {
            try
            {
                return Json(CheckResultToMessageMap[_sudokuService.CheckSolution(game)]);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (ArgumentException)
            {
                return BadRequest();
            }
        }

        Dictionary<SolutionCheckResult, string> CheckResultToMessageMap = new Dictionary<SolutionCheckResult, string>
        {
            { SolutionCheckResult.Complete, "COMPLETE" },
            { SolutionCheckResult.HasErrors, "HAS_ERRORS" },
            { SolutionCheckResult.NotComplete, "INCOMPLETE" }
        };
    }
}
