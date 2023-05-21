using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Data.SQLite;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace template_web.Controllers
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
      }
}
