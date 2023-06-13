$(document).ready(function () {
  // Initialize DataTables for search results and card transactions tables

  const searchResultsTable = $("#List_SearchedUsers").DataTable({
    data: [],
    columns: [
      // Add your column definitions for the search results table here
      { data: "cCardNumber" },
      { data: "Name" },
      { data: "cEmailAddress" },
      { data: "cCompany" },
      { data: "cCellPhone" },
      // ...
    ],
  });

  const cardTransTable = $("#CardTrans").DataTable({
    dom: "Bfrtip",
    buttons: ["copy", "csv", "excel", "pdf", "print"],
    data: [],
    columns: [
      // Add your column definitions for the card transactions table here
      { data: "Date" },
      { data: "RecordType" },
      { data: "Gallons" },
      { data: "Points" },
      { data: "Showers" },
      // ...
    ],
  });
  function resetForm() {
    $(":input")
      .not(":button, :submit, :reset, :hidden")
      .val("")
      .prop("checked", false)
      .prop("selected", false);

    // Clear the tables
    $("#List_SearchedUsers").DataTable().clear().draw();
    $("#CardTrans").DataTable().clear().draw();
  }

  // Handle Reset button click
  $("#Btn_Reset").on("click", function (e) {
    e.preventDefault();
    resetForm();
  });
  // Handle search button click
  $("#Btn_SearchSubmit").on("click", function (e) {
    e.preventDefault();
    console.log("Btn Pressed");
    // Get search parameters from the form
    const cardNumber = $("input[name='CardNumber']").val();
    const lastName = $("input[name='LName']").val();
    const company = $("input[name='Company']").val();
    const phone = $("input[name='Phone']").val();
    const email = $("input[name='Email']").val();

    // Call the API with search parameters
    $.ajax({
      url: "https://prod-145.westus.logic.azure.com:443/workflows/c6e1868899f3485dbc4924a0b7638917/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=RHZKh71hVopN4PrnDqay0Rg6XWQ4R9l599r-83j1zOA",
      type: "POST",
      data: { cardNumber, lastName, company, phone, email },
      success: function (data) {
        // Clear and populate search results table with new data

        searchResultsTable.clear().rows.add(data).draw();
      },
      error: function (error) {
        console.error("Error fetching search results:", error);
      },
    });
  });

  // Handle search results table row click
  $("#List_SearchedUsers tbody").on("click", "tr", function () {
    const rowData = searchResultsTable.row(this).data();

    rowjson = {
      action: "GatherUserDetails",
      cardNumber: rowData.cCardNumber,
    };

    // Call the API with the selected user data
    $.ajax({
      url: "https://prod-139.westus.logic.azure.com:443/workflows/7bdc089d541d424eabe86ab4fc3fadef/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=T-PvshJjVDp55xvPshsYx8CY45BzNokKkbKmKUwkRTI",
      type: "GET",
      data: rowjson, // Use the appropriate user identifier from rowData
      success: function (data) {
        console.log(data[1]["value"]);
        // Populate user details form with the returned data
        $("input[name='CCNumber']").val(data[0].cCardNumber);
        $("input[name='FName']").val(data[0].cFirst);
        $("input[name='LName']").val(data[0].cLast);
        $("input[name='Company']").val(data[0].cCompany);
        $("input[name='Address']").val(data[0].cStreetAddress);
        $("select[name='State']").val(data[0].cCardNumber);
        $("input[name='Zip']").val(data[0].cZip);
        $("input[name='Email']").val(data[0].cEmailAddress);
        $("input[name='Phone']").val(data[0].cCellPhone);
        // Clear and populate card transactions table with new data
        cardTransTable.clear().rows.add(data[1]["value"]).draw();
      },
      error: function (error) {
        console.error(
          "Error fetching user details and card transactions:",
          error
        );
      },
    });
  });
});
