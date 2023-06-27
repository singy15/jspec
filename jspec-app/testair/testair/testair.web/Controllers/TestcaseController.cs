
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
    public class TestcaseController : Controller
    {
        private readonly ILogger<ViewController> _logger;

        private readonly IDbUtil _dbutil;

        public TestcaseController(ILogger<ViewController> logger, IDbUtil dbutil)
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
                var dt = _dbutil.Query(tx, "select * from testcase;");
                tx.Commit();
                return Content(JsonConvert.SerializeObject(dt), "application/json");
            }
        }

        [HttpGet]
        [Route("[controller]/FindByTestsuiteId/{testsuite_id}")]
        public IActionResult FindByTestsuiteId(int testsuite_id)
        {
            using (var tx = _dbutil.CreateTransaction())
            {
                var dt = _dbutil.Query(tx, $"select * from testcase where testsuite_id='{testsuite_id.ToString()}'");
                tx.Commit();
                return Content(JsonConvert.SerializeObject(dt), "application/json");
            }
        }

        [HttpGet]
        [Route("[controller]/MaxSortOrderByTestsuiteId/{testsuite_id}")]
        public IActionResult MaxSortOrderByTestsuiteId(int testsuite_id)
        {
            using (var tx = _dbutil.CreateTransaction())
            {
                var dt = _dbutil.Query(tx, $"select max(testcase_id) as sort_order from testcase");
                tx.Commit();
                if (dt.Rows[0]["sort_order"] is DBNull)
                {
                    return Content(JsonConvert.SerializeObject(0), "application/json");
                }
                else
                {
                    return Content(JsonConvert.SerializeObject((Int64)(dt.Rows[0]["sort_order"]) * 100), "application/json");
                }
            }
        }


        [HttpGet]
        [Route("[controller]/{testcase_id}")]
        public IActionResult FindByPrimaryKey(int testcase_id)
        {
            using (var tx = _dbutil.CreateTransaction())
            {
                var dt = _dbutil.Query(tx, $"select * from testcase where testcase_id='{testcase_id.ToString()}'");
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
                var result = _dbutil.Insert(tx, "testcase", body);
                tx.Commit();
                return Content(JsonConvert.SerializeObject(result), "application/json");
            }
        }


        [HttpPut]
        [Route("[controller]/{testcase_id}")]
        public IActionResult Update(int testcase_id, [FromBody] Dictionary<string, object> body)
        {
            using (var tx = _dbutil.CreateTransaction())
            {
                var key = new Dictionary<string, object>();
                key.Add("testcase_id", testcase_id);

                var result = _dbutil.Update(tx, "testcase", body, key);
                tx.Commit();
                return Content(JsonConvert.SerializeObject(result), "application/json");
            }
        }

        public class Foo
        {
            public string testcase_cd { get; set; }

            public string testcase_name { get; set; }
            public string desc_action { get; set; }
            public string desc_condition { get; set; }
            public string desc_expected { get; set; }

            public string result_success { get; set; }
        }

        [HttpPut]
        [Route("[controller]/ByTestsuiteId/{testsuite_id}")]
        public IActionResult UpdateByTestsuiteId(int testsuite_id, [FromBody] IEnumerable<Dictionary<string, object>> body)
        {
            using (var tx = _dbutil.CreateTransaction())
            {
                var keyDel = new Dictionary<string, object>();
                keyDel.Add("testsuite_id", testsuite_id);
                _dbutil.Delete(tx, "testcase", keyDel);

                foreach (var testcase in body)
                {
                    _dbutil.Insert(tx, "testcase", testcase);
                }

                tx.Commit();

                return Content(JsonConvert.SerializeObject(body.Count()), "application/json");
            }
        }

        [HttpDelete]
        [Route("[controller]/{testcase_id}")]
        public IActionResult Delete(int testcase_id)
        {
            using (var tx = _dbutil.CreateTransaction())
            {
                var key = new Dictionary<string, object>();
                key.Add("testcase_id", testcase_id);

                var result = _dbutil.Delete(tx, "testcase", key);
                tx.Commit();
                return Content(JsonConvert.SerializeObject(result), "application/json");
            }
        }


    }
}


