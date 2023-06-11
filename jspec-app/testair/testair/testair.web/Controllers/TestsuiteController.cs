
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
    public class TestsuiteController : Controller
    {
        private readonly ILogger<ViewController> _logger;

        private readonly IDbUtil _dbutil;

        public TestsuiteController(ILogger<ViewController> logger, IDbUtil dbutil)
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
                var dt = _dbutil.Query(tx, "select * from testsuite;");
                tx.Commit();
                return Content(JsonConvert.SerializeObject(dt), "application/json");
            }
        }

        [HttpGet]
        [Route("[controller]/{testsuite_id}")]
        public IActionResult FindByPrimaryKey(int testsuite_id)
        {
            using (var tx = _dbutil.CreateTransaction())
            {
                var dt = _dbutil.Query(tx, $"select * from testsuite where testsuite_id='{testsuite_id.ToString()}'");
                tx.Commit();
                return Content(JsonConvert.SerializeObject(dt), "application/json");
            }
        }


        [HttpGet]
        [Route("[controller]/FindByProjectId/{project_id}")]
        public IActionResult FindByProjectId(int project_id)
        {
            using (var tx = _dbutil.CreateTransaction())
            {
                var dt = _dbutil.Query(tx, $"select * from testsuite where project_id='{project_id.ToString()}'");
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
                var result = _dbutil.Insert(tx, "testsuite", body);
                tx.Commit();
                return Content(JsonConvert.SerializeObject(result), "application/json");
            }
        }

        [HttpPut]
        [Route("[controller]/{testsuite_id}")]
        public IActionResult Update(int testsuite_id, [FromBody] Dictionary<string, object> body)
        {
            using (var tx = _dbutil.CreateTransaction())
            {
                var key = new Dictionary<string, object>();
                key.Add("testsuite_id", testsuite_id);

                var result = _dbutil.Update(tx, "testsuite", body, key);
                tx.Commit();
                return Content(JsonConvert.SerializeObject(result), "application/json");
            }
        }

        [HttpDelete]
        [Route("[controller]/{testsuite_id}")]
        public IActionResult Delete(int testsuite_id)
        {
            using (var tx = _dbutil.CreateTransaction())
            {
                var key = new Dictionary<string, object>();
                key.Add("testsuite_id", testsuite_id);

                var result = _dbutil.Delete(tx, "testsuite", key);
                tx.Commit();
                return Content(JsonConvert.SerializeObject(result), "application/json");
            }
        }


    }
}


