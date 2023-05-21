using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Data.SQLite;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace codegen_generic_v2.Controllers
{
    public class ViewController : Controller
    {
        private readonly ILogger<ViewController> _logger;

        public ViewController(ILogger<ViewController> logger)
        {
            _logger = logger;
        }


        [Route("[controller]/Top")]
        public IActionResult Top()
        {
            return View("/Views/Top.cshtml");
        }


        [Route("[controller]/Gen")]
        public IActionResult Gen()
        {
            return View("/Views/Gen.cshtml");
        }
    }
}
