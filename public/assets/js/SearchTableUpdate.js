$(document).ready(function () {
  // Initialize DataTables for search results and card transactions tables
  // Fetch the data
  $.ajax({
    url: "https://prod-79.westus.logic.azure.com:443/workflows/c6bd16dc2a92471c82b84acc249827fa/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=hxs3s_QgGvpmSq50ioShWvnJDpM0uFfB_wesHUpOidk", // Replace with your endpoint
    type: "POST",
    success: function (data) {
      console.log(data);
      // Remove all options except the first
      $('select[name="Site"] option:gt(0)').remove();

      // Add new options
      for (let i = 0; i < data.length; i++) {
        $('select[name="Site"]').append(
          new Option(data[i]["StoreName"], data[i]["iStoreKey"])
        );
      }
    },
    error: function (error) {
      console.error("Error fetching sites:", error);
    },
  });

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
    const CardLast4 = $("input[name='CardLast4']").val();

    // Call the API with search parameters
    $.ajax({
      url: "https://prod-145.westus.logic.azure.com:443/workflows/c6e1868899f3485dbc4924a0b7638917/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=RHZKh71hVopN4PrnDqay0Rg6XWQ4R9l599r-83j1zOA",
      type: "POST",
      data: { cardNumber, lastName, company, phone, email, CardLast4 },
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
      data: rowjson,
      success: function (data) {
        console.log(data);
        // Populate user details form with the returned data
        $("input[name='cCardNumber']").val(data[0].cCardNumber);
        $("input[name='cFirst']").val(data[0].cFirst.trim());
        $("input[name='cMiddleI']").val(data[0].cMiddleI.trim());
        $("input[name='cLast']").val(data[0].cLast.trim());
        $("input[name='cCompany']").val(data[0].cCompany.trim());
        $("input[name='cCompanyPhone']").val(data[0].cCompanyPhone);
        $("input[name='cStreetAddress']").val(data[0].cStreetAddress.trim());
        $("input[name='cCity']").val(data[0].cCity.trim());
        $("select[name='cState']").val(data[0].cState.toUpperCase());
        $("input[name='cCellPhone']").val(data[0].cCellPhone);
        $("input[name='cZip']").val(data[0].cZip.trim());
        $("input[name='cEmailAddress']").val(data[0].cEmailAddress.trim());
        $("input[name='bEmailElection']").prop(
          "checked",
          data[0].bEmailElection
        );
        $("input[name='bTextElection']").prop("checked", data[0].bTextElection);
        $("input[name='Birthday']").val(data[0].Birthday);

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

  // Initialize DataTables for card transactions table on Tab 2
  const cardTransTableTab2 = $("#CardTrans_Tab2").DataTable({
    dom: "Bfrtip",
    buttons: ["copy", "csv", "excel", "pdf", "print"],
    data: [],
    columns: [
      // Add your column definitions for the card transactions table on Tab 2 here
      { data: "StoreName" },
      { data: "CardNumber" },
      { data: "Date" },
      { data: "RecordType" },
      { data: "Gallons" },
      { data: "Points" },
      { data: "Showers" },
      // ...
    ],
  });

  function resetFormTab2() {
    $(":input")
      .not(":button, :submit, :reset, :hidden")
      .val("")
      .prop("checked", false)
      .prop("selected", false);

    // Clear the table on Tab 2
    $("#CardTrans_Tab2").DataTable().clear().draw();
  }

  // Handle Reset button click on Tab 2
  $("#Btn_Reset_Tab2").on("click", function (e) {
    e.preventDefault();
    resetFormTab2();
  });
  function get90DaysAgoDate() {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split("T")[0]; // format as YYYY-MM-DD
  }

  // Handle search button click on Tab 2
  // Handle search button click on Tab 2
  $("#Btn_SearchSubmit_Tab2").on("click", function (e) {
    e.preventDefault();
    console.log("Btn Pressed on Tab 2");
    // Get search parameters from the form on Tab 2
    const site = $("select[name='Site']").val();
    let startDate = $("input[name='StartDate']").val();
    const endDate = $("input[name='EndDate']").val();
    const minPoints = $("input[name='MinPoints']").val();
    const maxPoints = $("input[name='MaxPoints']").val();

    // If no startDate is provided, use the date 90 days ago
    if (!startDate) {
      startDate = get90DaysAgoDate();
    }

    // Call the API with search parameters on Tab 2
    $.ajax({
      url: "https://prod-62.westus.logic.azure.com:443/workflows/14c4b4ecf8084620a3813b675fa84200/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=attyS310SvxKCYiMp2oN1WqTeVOmHXNqF7xiOoOZhw4",
      type: "POST",
      data: { site, startDate, endDate, minPoints, maxPoints },
      success: function (data) {
        // Clear and populate card transactions table on Tab 2 with new data
        cardTransTableTab2.clear().rows.add(data).draw();
      },
      error: function (error) {
        console.error("Error fetching card transactions on Tab 2:", error);
      },
    });
  });

  $("#btn-save").on("click", function (e) {
    e.preventDefault();

    const cCardNumber = $("input[name='cCardNumber']").val().trim();
    const cFirst = $("input[name='cFirst']").val().trim();
    const cMiddleI = $("input[name='cMiddleI']").val().trim();
    const cLast = $("input[name='cLast']").val().trim();
    const cCompany = $("input[name='cCompany']").val().trim();
    const cCompanyPhone = $("input[name='cCompanyPhone']").val().trim();
    const cStreetAddress = $("input[name='cStreetAddress']").val().trim();
    const cCellPhone = $("input[name='cCellPhone']").val().trim();
    const cCity = $("input[name='cCity']").val().trim();
    const cState = $("select[name='cState']").val().trim();
    const cZip = $("input[name='cZip']").val().trim();
    const cEmailAddress = $("input[name='cEmailAddress']").val().trim();
    const bEmailElection = $("input[name='bEmailElection']").prop("checked");
    const bTextElection = $("input[name='bTextElection']").prop("checked");
    const Birthday = $("input[name='Birthday']").val().trim();

    // AJAX POST request
    $.ajax({
      url: "https://prod-94.westus.logic.azure.com:443/workflows/bc7618dea6b3410a832e7b8a9d8f8d3b/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=_q57-5hYXePp7Ek1warSJSp6NzO2WEK6MQNdUIR0liI",
      type: "POST",
      data: {
        cCardNumber,
        cFirst,
        cMiddleI,
        cLast,
        cCompany,
        cCompanyPhone,
        cStreetAddress,
        cCity,
        cState,
        cZip,
        cEmailAddress,
        bEmailElection,
        bTextElection,
        Birthday,
        cCellPhone,
      },
      success: function (data) {
        // Add your success code here
        console.log("Data saved successfully!");
      },
      error: function (error) {
        console.error("Error saving data:", error);
      },
    });
  });

  $("#btn-reset").on("click", function (e) {
    e.preventDefault();
    $("form").trigger("reset"); // Reset the form fields
  });
});
