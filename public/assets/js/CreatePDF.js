//function saveAspdf()// {
//    console.log(document.getElementById("ReportBody"))
//var pdf = new jsPDF();
//pdf.addHTML(document.getElementById("ReportBody"),function() {
   // pdf.save('web.pdf');
//});
//}

$(document).ready( function () {
  $('#example').DataTable(
    {
      dom: 'Bfrtip',
      buttons: [
          'copy', 'csv', 'excel', 'pdf', 'print'
      ],
      stateSave: true
    }
  );
} );

function saveAspdf() {
var source = document.getElementById("ReportBody");
    var pdf = new jsPDF();
pdf.fromHTML(
    source,
    15,
    15,
    {
      'width': 180
    });
    pdf.save('web.pdf')
}

