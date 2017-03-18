$("document").ready(function() {
// $( function() {
  $( "#expression" ).resizable({
    alsoResize: "#history"
  });
  $( "#history" ).resizable();

} );

var hist = [];
var currHistIndex = -1;
var histUI;
var histColors = { current: "SkyBlue", odd: "LightGrey", even: "WhiteSmoke" };
function calculate() {
  // document.getElementById("expression").style.color = "red";
  var message = "";
  try {
    //var expression = document.getElementById("expression").value;
    let expression = document.getElementById("expression").value === undefined ? undefined :
      document.getElementById("expression").value.replace(/(\s+\n\s+)*$/,'').trim();
    if (expression === undefined || expression === "") {
      message = "Nothing to calculate";
      return;
    }
    let cResult = eval(expression); // calculated result
    if (expression == cResult) { // eg "36" == 36, "36" !== 36
      message = "Expression can't be simplified";
      return;
    }
    let cHistIndex = hist.map(x => x[0]).indexOf(expression);
    if (cHistIndex !== -1) {
      message = `This expression is already in the history(${cHistIndex+1}).`;
    } else {
        // add expression to history - remove trailing white space (and empty lines)
        hist.push([expression,cResult]);
        currHistIndex = hist.length - 1;
        histUI = document.getElementById("history");
        renderHist();
        histUI.scrollTop = histUI.scrollHeight;

        // render the expression to be the result
        document.getElementById("expression").value = cResult;
    }
  }
  catch(ex) {
    console.log(ex)
    if (ex instanceof SyntaxError) {
      message = ex.message;
    } else if (ex instanceof ReferenceError) {
      message = ex.message;
    } else {
      message = ex;
      throw ex;
    }
  }
  finally {
    document.getElementById("message").innerHTML = message;
    return false;
  }
}

function renderHist() {
  // rerender the history
  histUI.innerHTML = "<pre>" +
    hist.reduce(function(acc, x, i) {
      let bgColor = (i == currHistIndex) ? histColors.current : (i % 2 == 0 ? histColors.even : histColors.odd);
      return acc.concat(`<div class="histElem" id='hist${i}' style='background-color:${bgColor};'>${i+1}> ${x[0]}<br/>=> ${x[1]}<br/></div>`)
        .replace(/\n/g,"<br/>&nbsp;&nbsp;&nbsp;"); }, "")
    + "</pre>";

  // add clickable mouse selector for history elements using jquery
  $(".histElem").click(function () {
      selectHistElem($(this).attr("id").replace(/hist/,''));
  });
}

function selectHistElem(histElem) {

  currHistIndex = histElem;
  renderHist();
  document.getElementById("expression").value = hist[currHistIndex][0];

}
