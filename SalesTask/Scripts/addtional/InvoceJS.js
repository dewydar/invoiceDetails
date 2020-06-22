var listOfInvoiceDetails = [];
function LoadItems() {
    $.ajax({
        url: '/Sales/GetItemData',
        method: 'GET',
        success: function (datai) {
            var rows = '';
            $.each(datai, function (i, item) {
                rows += '<option value="' + item.id + '">';
                rows += item.itemName;
                rows += '</option>';
            })
            $(' #itemsddl').append(rows);

        }
    });
}
function LoadStores() {
    $.ajax({
        url: '/Sales/Getstore',
        method: 'GET',
        success: function (datas) {
            var rows = '';
            $.each(datas, function (i, item) {
                rows += '<option value="' + item.id + '">';
                rows += item.storeName;
                rows += '</option>';
            })
            $('#addForm #storeddl').append(rows);
        }
    });
}
function LoadUnit() {
    $.ajax({
        url: '/Sales/GetUnit',
        method: 'GET',
        success: function (datau) {
            var rows = '';
            $.each(datau, function (i, item) {
                rows += '<option value="' + item.id + '">';
                rows += item.unitName;
                rows += '</option>';
            })
            $(' #unitddl').append(rows);
        }
    });
}
function rowvalidation() {
    if ($("#itemsddl").valid() && $("#unitddl").valid() && $("#Price").valid() && $("#Qty").valid() && $("#Discount").valid()) {
        return false;
    }
    else {
        return true;
    }
}
function rowDelete(id) {
    listOfInvoiceDetails= listOfInvoiceDetails.filter(obj => (obj.id != id));
    
}
$(document).ready(function () {
    //variables
    LoadStores();
    var id = 1;
    //Binding Html Att
    $('#ClientName').change(function () {
        var cliNo = $(this).val();
        $('#SelectedItems #cliName').html(cliNo);
        $('#SelectedItems #cliName').css('opacity', '1');
    });

    $('#SalesDate').change(function () {
        var cliDate = $(this).val();
        $('#SelectedItems #cliDate').html(cliDate);
        $('#SelectedItems #cliDate').css('opacity', '1');
    });

    $('#storeddl').change(function () {
        var cliStor = $('#storeddl option:selected').val();
        $('#SelectedItems #cliStore').html(cliStor);
        $('#SelectedItems #cliStore').css('opacity', '1');
    });

    $('#btnAdd').on('click', function () {
        LoadItems();
        LoadUnit();
        if ($('#rowlength').length) {
            return false;
        }

        $('#tblItem tbody').append('<tr id="rowlength"><td id="rowID" name="rowID"></td>'+
            '<td><select id="itemsddl" name="itemsddl" class="form-control" style="width:130px"><option value="' +
            '" disabled selected hidden>- Select item -</option></select></td>'
            + '<td><select id="unitddl" name="unitddl" class="form-control" style="width:130px"><option value="' +
            '" disabled selected hidden>- Select item -</option></select></td>'
            +
            '<td><input type="number" placeholder="Price" min="0" id="Price" name="Price" style="border:none" class="form-control"/></td>' +
            '<td><input type="number" placeholder="Qty" min="0" id="Qty" name="Qty" style="border:none" class="form-control"/></td>' +
            '<td><input type="number" placeholder="Total" min="0" id="Total" name="Total" disabled style="border:none" class="form-control"/></td>' +
            '<td><input type="number" placeholder="Discount" min="0" id="Discount" name="Discount" style="border:none" class="form-control"/></td>' +
            '<td><input type="number" placeholder="Net" min="0" id="Net" name="Net" disabled style="border:none" class="form-control NetNet"/></td>' +
            '<td class="last"></td><td><a class="btn btn-success success">Add</a></td>' +
            '<td class="last"></td><td><a class="btn btn-danger remove">Delete</a></td></tr > '
        );
        $('a.remove').on('click', function () {
            $(this).closest('tr').remove();
            removedd = $(this).closest('tr').children('td.last').text();
        });

    });

    $(document).on("change", "#Qty", function () {
        if ($("#Price").val() === "") {
            $("#Price").val(0);
        }
        if ($("#Discount").val() === "") {
            $("#Discount").val(0);
        }
        var newtotal = parseFloat($("#Price").val()) * parseFloat($(this).val());
        $("#Total").val(parseFloat(newtotal));
        var newNet = parseFloat(newtotal) - ((parseFloat($("#Discount").val()) / 100) * parseFloat($("#Price").val()));
        $("#Net").val(newNet);
    });

    $(document).on("change", "#Price", function () {
        if ($("#Discount").val() === "") {
            $("#Discount").val(0);
        }
        if ($("#Qty").val() === "") {
            $("#Qty").val(0);
        }
        var newtotal = parseFloat($(this).val()) * parseFloat($("#Qty").val());
        $("#Total").val(parseFloat(newtotal));
        var newNet = parseFloat(newtotal) - ((parseFloat($("#Discount").val()) / 100) * parseFloat($(this).val()));
        $("#Net").val(parseFloat(newNet));
    });

    $(document).on("change", "#tax", function () {
        if ($("#Totalbefourtax").val() === "") {
            $("#Totalbefourtax").val(0);
        }
        var newTotalAftertax = parseFloat($("#Totalbefourtax").val()) + ((parseFloat($(this).val()) / 100) * parseFloat($("#Totalbefourtax").val()));
        $("#TotalAftertax").val(parseFloat(newTotalAftertax));
    });

    $(document).on("change", "#Discount", function () {
        var newNet = parseFloat($("#Total").val()) - ((parseFloat($(this).val()) / 100) * parseFloat($("#Price").val()));
        $("#Net").val(parseFloat(newNet));

    });

    $(document).on("click", "a.success", function () {
        if ($("#Totalbefourtax").val() === "") {
            $("#Totalbefourtax").val(0);
        }
        if ($("#TotalAftertax").val() === "") {
            $("#TotalAftertax").val(0);
        }
        if ($("#tax").val() === "") {
            $("#tax").val(0);
        }
        var tbt = parseFloat($("#Net").val()) + parseFloat($("#Totalbefourtax").val());
        var tat = parseFloat(tbt) + ((parseFloat($("#tax").val()) / 100) * parseFloat(tbt));
        var tr = $(this).parent().parent();
        if (rowvalidation()) {
            return false;
        }
        var newId = id;
        var newitem = tr.find($("#itemsddl option:selected")).text();
        var newunit = tr.find($("#unitddl option:selected")).text();
        var newPrice = tr.find($("#Price")).val();
        var newQty = tr.find($("#Qty")).val();
        var newTotal = tr.find($("#Total")).val();
        var newDiscount = tr.find($("#Discount")).val();
        var newNet = tr.find($("#Net")).val();
        var Insertrow = '<tr><td>' + newId + '</td><td><text class="form-control">' + newitem + '</text></td>' +
            '<td><text class="form-control">' + newunit + '</text></td>' +
            '<td><text class="form-control">' + parseFloat(newPrice) + '</text></td>' +
            '<td><text class="form-control">' + parseFloat(newQty) + '</text></td>' +
            '<td><text class="form-control">' + parseFloat(newTotal) + '</text></td>' +
            '<td><text class="form-control">' + parseFloat(newDiscount) + '</text></td>' +
            '<td><text class="form-control">' + parseFloat(newNet) + '</text></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td class="last"></td><td><a id="removerow" class="btn btn-danger removerow">Delete</a></td> </tr >';

        var objRow = {
            id: newId,
            itemID: tr.find($("#itemsddl option:selected")).val(),
            unitID: tr.find($("#unitddl option:selected")).val(),
            price: parseFloat(newPrice),
            quantity: parseFloat(newQty),
            total: parseFloat(newTotal),
            discount: parseFloat(newDiscount),
            net: parseFloat(newNet)
        }
        $("tbody").append(Insertrow);
        $("#Totalbefourtax").val(parseFloat(tbt));
        $("#TotalAftertax").val(parseFloat(tat));
        listOfInvoiceDetails.push(objRow);
        ++id;
        console.log(listOfInvoiceDetails)
    });

    $(document).on("click", "#removerow", function () {
        var tbt = -parseFloat($("#Net").val()) + parseFloat($("#Totalbefourtax").val());
        var tat = parseFloat(tbt) + ((parseFloat($("#tax").val()) / 100) * parseFloat(tbt));
        $("#Totalbefourtax").val(parseFloat(tbt));
        $("#TotalAftertax").val(parseFloat(tat));
        //listOfInvoiceDetails.pull($(this).closest('tr'));
        var row = $(this).closest('tr');
        var tr = row.children(':first-child').text();
        row.remove();
        rowDelete(tr);
        console.log(listOfInvoiceDetails)
    });
    $('#addForm').validate({
        rules: {
            ClientName: {
                required: true,
                digits: true
            },
            SalesDate: { required: true },
            storeddl: { required: true },
            itemsddl: { required: true },
            unitddl: { required: true },
            Price: {
                required: true,
                digits: true

            },
            Qty: {
                required: true,
                digits: true
            },
            Discount: {
                required: true,
                digits: true
            },
            tax: {
                required: true,
                digits: true
            }
        },
        messages: {
            ClientName: {
                required: "Enter Valid Invoce Number",
                digits: jQuery.validator.format("That is Not A valid Invoce Number Please Enter Valid Invoce Number.")
            },
            SalesDate: {
                required: "Please Enter Date"
            },
            storeddl: {
                required: "Please Select Store"
            },
            itemsddl: {
                required: "Please Select Item"
            },
            unitddl: {
                required: "Please Select Unit"
            },
            Price: {
                required: "Enter Valid Price",
                digits: jQuery.validator.format("That is Not A valid Price Please Enter Valid Price.")
            },
            Qty: {
                required: "Enter Valid Qty",
                digits: jQuery.validator.format("That is Not A valid Qty Please eEnter Valid Qty.")
            },
            Discount: {
                required: "Enter Valid Discount",
                digits: jQuery.validator.format("That is Not A valid Discount Enter Valid Discount.")
            },
            tax: {
                required: "Enter Valid Tax",
                digits: jQuery.validator.format("That is Not A valid Tax Please Enter Valid Tax.")
            }
        },
        submitHandler: function () {
            var invoice = {
                invoiceId: $('#ClientName').val(),
                saleDate: $('#SalesDate').val(),
                totalAfterTax: parseFloat($("#TotalAftertax").val()),
                totalBefourTax: parseFloat($("#Totalbefourtax").val()),
                tax: parseFloat($("#tax").val()),
                storeID: $('#storeddl option:selected').val(),
            }
            
            var invoiceDetail =listOfInvoiceDetails
            
            $.ajax({
                url: '/Sales/AddData',
                method: 'POST',
                data: {
                    invoice,
                    invoiceDetail
                },
            }).done(function (response) {
                if (response.add === true) {
                    $('#msg').addClass('alert alert-success');
                    $('#msg').text(response.message);
                    window.location.href = "/Sales/GetAllInvoice"
                    return;
                } else {
                    $('#msg').addClass('alert alert-danger');
                    $('#msg').text(response.message);
                    window.location.href = "/Sales/Index"
                    return;
                }
            })
        }
    });
});