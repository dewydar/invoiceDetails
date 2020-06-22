using SalesTask.Models;
using SalesTask.Models.VM;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SalesTask.Controllers
{
    public class SalesController : Controller
    {
        static SalesDBEntities db = new SalesDBEntities();
        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult GetInvoiceNo(int invoiceID)
        {
            var datainvoice = db.Invoices.Find(invoiceID);
            return Json(datainvoice, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetStore()
        {
            var datas = db.Stores.Select(z => new
            {
                z.id,
                z.storeName
            }).ToList();
            return Json(datas, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetItemData()
        {
            var datai = db.Items.Select(z => new
            {
                z.id,
                z.itemName
            }).ToList();
            return Json(datai, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetUnit()
        {
            var datai = db.Units.Select(z => new
            {
                z.id,
                z.unitName
            }).ToList();
            return Json(datai, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult AddData(storeVM obj)
        {
            try
            {
                db.Invoices.Add(obj.invoice);
                db.SaveChanges();
                for (int i = 0; i < obj.invoiceDetail.Count(); i++)
                {
                    obj.invoiceDetail[i].invoiceID = obj.invoice.id;
                    db.InvoceDetails.Add(obj.invoiceDetail[i]);
                }
                db.SaveChanges();
                return Json(new { add = true, message = "Bell data Saved succesfully" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception)
            {
                return Json(new { add = false, message = "data can`t br Saved" }, JsonRequestBehavior.AllowGet);

            }
        }
        public ActionResult GetAllInvoice()
        {
            return View(db.Invoices.ToList());
        }
        public ActionResult GetInvoiceDetails(int id)
        {
            try
            {
                ViewBag.invoiceid = id;
                ViewBag.invoicedate = db.Invoices.Find(id).saleDate;
                ViewBag.storename = db.Invoices.Find(id).Store.storeName;
                var result = db.InvoceDetails.Where(z => z.invoiceID == id).ToList();
                return View(result);
            }
            catch (Exception)
            {
                return RedirectToAction("index");
            }
        }
    }
}