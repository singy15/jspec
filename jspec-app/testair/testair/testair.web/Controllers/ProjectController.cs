
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.SQLite;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using testair.web.Util;

namespace testair.web.Controllers
{
    public class ProjectController : Controller
    {
        private readonly ILogger<ViewController> _logger;

        private readonly IDbUtil _dbutil;

        public ProjectController(ILogger<ViewController> logger, IDbUtil dbutil)
        {
            _logger = logger;
            _dbutil = dbutil;
        }

        [HttpGet]
        [Route("[controller]")]
        public IActionResult GetAll()
        {
            using (var tx = _dbutil.CreateTransaction())
            {
                var dt = _dbutil.Query(tx, "select * from project;");
                tx.Commit();
                return Content(JsonConvert.SerializeObject(dt), "application/json");
            }
        }

        [HttpGet]
        [Route("[controller]/{project_id}")]
        public IActionResult FindByPrimaryKey(int project_id)
        {
            using (var tx = _dbutil.CreateTransaction())
            {
                var dt = _dbutil.Query(tx, $"select * from project where project_id='{project_id.ToString()}'");
                tx.Commit();
                return Content(JsonConvert.SerializeObject(dt), "application/json");
            }
        }

        [HttpPost]
        [Route("[controller]")]
        public IActionResult Insert([FromBody] Dictionary<string, object> body)
        {
            using (var tx = _dbutil.CreateTransaction())
            {
                var result = _dbutil.Insert(tx, "project", body);
                tx.Commit();
                return Content(JsonConvert.SerializeObject(result), "application/json");
            }
        }

        [HttpPut]
        [Route("[controller]/{project_id}")]
        public IActionResult Update(int project_id, [FromBody] Dictionary<string, object> body)
        {
            using (var tx = _dbutil.CreateTransaction())
            {
                var key = new Dictionary<string, object>();
                key.Add("project_id", project_id);

                var result = _dbutil.Update(tx, "project", body, key);
                tx.Commit();
                return Content(JsonConvert.SerializeObject(result), "application/json");
            }
        }

        [HttpDelete]
        [Route("[controller]/{project_id}")]
        public IActionResult Delete(int project_id)
        {
            using (var tx = _dbutil.CreateTransaction())
            {
                var key = new Dictionary<string, object>();
                key.Add("project_id", project_id);

                var result = _dbutil.Delete(tx, "project", key);
                tx.Commit();
                return Content(JsonConvert.SerializeObject(result), "application/json");
            }
        }

    }
}


