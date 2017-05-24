$(function() {

  $("input[type='number']").on("propertychange change click keyup input paste", function() {
    var $this = $(this);
    var $parent = $this.parent();
    var $row = $parent.parent();

    var race = $parent.attr("id");
    var quality = $row.attr("id");

    setUrlParameter(quality+"_"+race, $this.val());

    var $new = 0;

    // combine relative
    $row.find(".race").each(function() {
      $new += parseInt($(this).find("input[type='number']").val());
    });

    $total = $row.find("#total label");
    $total.text($new);

    // combine total
    $new = 0;
    $(".row #total label").each(function() {
      $new += parseInt($(this).text());
    });
    $("#overall label").text($new);

    $("#energy label").text($new * 5);
  });

  $("input[type='number']").hover(function() {
    $(this).focus();
  }, function() {
    $(this).blur();
  }).on("mousewheel", function(event) {
    event.preventDefault();
    var $scrollable = $("#scrollable").attr("checked");
    if(typeof $scrollable == typeof undefined || $scrollable == false) {
      return;
    }
    var $this = $(this);
    var $inc = parseFloat($this.attr('step'));
    var $max = parseFloat($this.attr('max'));
    var $min = parseFloat($this.attr('min'));
    var $currVal = parseFloat($this.val());

    // If blank, assume value of 0
    if (isNaN($currVal)) {
      $currVal = 0.0;
    }

    // Increment or decrement numeric based on scroll distance
    if (event.deltaFactor * event.deltaY > 0) {
      if (isNaN($max) || $currVal + $inc <= $max) {
        $this.val($currVal + $inc);
      }
    } else {
      if (isNaN($min) || $currVal - $inc >= $min) {
        $this.val($currVal - $inc);
      }
    }
    $this.parent().find("label").text($this.val());
    $(this).trigger("change");
  });

  $("#scrollable").click(function () {
    var $checked = $(this).attr('checked');
    if(typeof $checked == typeof undefined || $checked == false) {
      $(this).attr('checked', "");
    } else {
      $(this).attr('checked', null);
    }
  });

  $("#export").click(function(e) {
    e.preventDefault();

    //getting data from our table
    var data_type = 'data:application/vnd.ms-excel';
    var table_div = document.getElementById('wrapper');
    var table_html = table_div.outerHTML.replace(/ /g, '%20');

    var a = document.createElement('a');
    a.href = data_type + ', ' + table_html;
    a.download = 'exported_worker_rolls_' + Math.floor((Math.random() * 9999999) + 1000000) + '.xls';
    a.click();
  });

  $(".race").each(function() {
    var $this = $(this);
    var $input = $(this).find("input[type='number']");
    $(this).find("label").text($input.val());

    var race = $this.attr("id");
    var quality = $this.parent().attr("id");

    var value = getUrlParameter(quality+"_"+race);
    if(typeof value !== typeof undefined) {
      $input.val(parseInt(value));
      $input.trigger("change");
    }
  });

});

function setUrlParameter(paramName, paramValue) {
  var url = window.location.href;
  var hash = location.hash;
  url = url.replace(hash, '');
  if (url.indexOf("?") >= 0) {
    var params = url.substring(url.indexOf("?") + 1).split("&");
    var paramFound = false;
    params.forEach(function(param, index) {
      var p = param.split("=");
      if (p[0] == paramName) {
        params[index] = paramName + "=" + paramValue;
        paramFound = true;
      } 
    });
    if (!paramFound) params.push(paramName + "=" + paramValue);
    url = url.substring(0, url.indexOf("?")+1) + params.join("&");
  } else {
    url += "?" + paramName + "=" + paramValue;
  }

  window.history.pushState("object or string", "Bonfyre's Worker Roll Counter", url + hash);
  //window.location.href = url + hash;
}

function getUrlParameter(sParam) {
  var sPageURL = decodeURIComponent(window.location.search.substring(1)),
    sURLVariables = sPageURL.split('&'),
    sParameterName,
    i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? true : sParameterName[1];
    }
  }
};
