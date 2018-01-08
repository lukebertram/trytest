$(document).ready(function() {
  $('#submittedNumber').click(function() {
    const inputtedNumber = parseInt($('#number').val());
    $('#number').val("");

    function checkNumber(number) {
      if (isNaN(number) || number < 0) {
        return new Error("Not a valid number!");
      } else {
        return true;
      }
    }

    try {
      const isNumberValid = checkNumber(inputtedNumber);
      if (isNumberValid instanceof Error) {
        console.error(isNumberValid.message);
        throw RangeError("Not a valid number!");
      } else {
        console.log("Try was successful, so no need to catch!");
        $('#displayNumber').text("This number is valid. You may continue.");
      }
    } catch(error) {
      console.error(`A wild error appears: ${error.message}`)
    }
  });
});
