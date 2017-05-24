$(function() {

  qualities = newMap([
    {naive: 1},
    {green: 2},
    {skilled: 3},
    {professional: 4},
    {artisan: 5}
  ]);

  races = newMap([
    {giant: 1},
    {human: 2},
    {goblin: 3}
  ]);

  matrix = newMap([
    {1: 1}, // naive giant
    {1: 2}, // naive human
    {1: 3}, // naive goblin
    {2: 1}, // green giant
    {2: 2}, // green human
    {2: 3}, // green goblin
    {3: 1}, // skilled giant
    {3: 2}, // skilled human
    {3: 3}, // skilled goblin
    {4: 1}, // professional giant
    {4: 2}, // professional human
    {4: 3}, // professional goblin
    {5: 1}, // artisan giant
    {5: 2}, // artisan human
    {5: 3} // artisan goblin
  ]);

  $("input[type='number']").on("propertychange change click keyup input paste", function() {
    var $this = $(this);
    var $parent = $this.parent();
    var $row = $parent.parent();

    var race = get(races, $parent.attr("id"));
    var quality = get(qualities, $row.attr("id"));

    $this.parent().find("label").text($this.val());
    setUrlParameter(quality+"."+race, $this.val());

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
    $(this).trigger("change");
  });

  $("input#scrollable").on("change", function () {
    var $checked = $(this).attr('checked');
    if(typeof $checked == typeof undefined || $checked == false) {
      $(this).attr('checked', "");
    } else {
      $(this).attr('checked', null);
    }
  });

  $("input#colored").on("change", function () {
    var $checked = $(this).attr('checked');
    if(typeof $checked == typeof undefined || $checked == false) {
      $(this).attr('checked', "");
      $("table").addClass("colored");
      Cookies.set("setting_colored", "true", { expires: 999 });
    } else {
      $(this).attr('checked', null);
      $("table").removeClass("colored");
      Cookies.remove("setting_colored");
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

  $("#clear").click(function(e) {
    var conf = confirm("Are you sure you would like to clear the current data?");
    if(conf) {
      window.location.href = window.location.hostname;
    }
  });

  $(".race").each(function() {
    var $this = $(this);
    var $input = $(this).find("input[type='number']");
    $(this).find("label").text($input.val());

    var race = get(races, $this.attr("id"));
    var quality = get(qualities, $this.parent().attr("id"));

    var value = getUrlParameter(quality+"."+race);
    if(typeof value !== typeof undefined) {
      $input.val(parseInt(value));
      $input.trigger("change");
    }
  });

  if(typeof Cookies.get("setting_colored") !== typeof undefined) {
    $("input#colored").prop("checked", true);
    $("input#colored").trigger("change");
  }

});

function setUrlParameter(paramName, paramValue, reload) {
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

  if(!reload) {
    window.history.pushState("object or string", "Bonfyre's Worker Roll Counter", url + hash);
  } else {
    window.location.href = url + hash;
  }
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

function get(map, key) {
  return map[key][key];
}

function newMap(array) {
  var hash = Object.create(null);
  array.forEach(function (object) {
    hash[Object.keys(object)[0]] = object;
  });
  return hash;
}