using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SalesTask.Models.VM
{
    public class storeVM
    {
        public Invoice invoice { get; set; }
        public List<InvoceDetail> invoiceDetail { get; set; }
    }
}