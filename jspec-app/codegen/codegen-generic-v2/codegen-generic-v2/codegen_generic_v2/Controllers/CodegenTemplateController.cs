using codegen_generic_v2.Util;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.SQLite;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace codegen_generic_v2.Controllers
{
    public class CodegenTemplateController : Controller
    {
        private readonly ILogger<CodegenTemplateController> _logger;

        private readonly IDbUtil _dbutil;

        public CodegenTemplateController(ILogger<CodegenTemplateController> logger, IDbUtil dbutil)
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
                var dt = _dbutil.Query(tx, "select * from codegen_template;");
                tx.Commit();
                return Content(JsonConvert.SerializeObject(dt), "application/json");
            }
        }

        [HttpGet]
        [Route("[controller]/{codegen_template_id}")]
        public IActionResult FindByPrimaryKey(int codegen_template_id)
        {
            using (var tx = _dbutil.CreateTransaction())
            {
                var dt = _dbutil.Query(tx, $"select * from codegen_template where codegen_template_id='{codegen_template_id.ToString()}'");
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
                var result = _dbutil.Insert(tx, "codegen_template", body);
                tx.Commit();
                return Content(JsonConvert.SerializeObject(result), "application/json");
            }
        }

        [HttpPut]
        [Route("[controller]/{codegen_template_id}")]
        public IActionResult Update(int codegen_template_id, [FromBody] Dictionary<string, object> body)
        {
            using (var tx = _dbutil.CreateTransaction())
            {
                var key = new Dictionary<string, object>();
                key.Add("codegen_template_id", codegen_template_id);

                var result = _dbutil.Update(tx, "codegen_template", body, key);
                tx.Commit();
                return Content(JsonConvert.SerializeObject(result), "application/json");
            }
        }

        [HttpDelete]
        [Route("[controller]/{codegen_template_id}")]
        public IActionResult Delete(int codegen_template_id)
        {
            using (var tx = _dbutil.CreateTransaction())
            {
                var key = new Dictionary<string, object>();
                key.Add("codegen_template_id", codegen_template_id);

                var result = _dbutil.Delete(tx, "codegen_template", key);
                tx.Commit();
                return Content(JsonConvert.SerializeObject(result), "application/json");
            }
        }

    }
}
