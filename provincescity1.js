(function (root, factory) {
  /* CommonJS */
  if (typeof exports == "object") module.exports = factory();
  /* AMD module */
  else if (typeof define == "function" && define.amd) define(factory);

  /* 修改: 将 wwclassName 改为元素标识 */
  else root.provincescity1 = factory();
}(this, function () {
  "use strict";

  /* 修改: 将 wwclassName 改为元素标识 */
  var wwclassName = /*INSBEGIN:WWCLSNAME*/
    "provincescity1"
    /*INSEND:WWCLSNAME*/
    ;

  // BEGIN: 加载依赖部分
  // 无依赖资源请使用本函数
  function loadDependence(fncallback) {
    //* 有依赖资源请使用本段代码
    // 添加标识以避免重复加载
    if (!window.wwload.distpicker) {
      window.wwload.distpicker = "wait";
      requirejs.config({
        "paths": {
          "distpicker": "libs/distpicker/dist/distpicker.min"
        }
      });
      require(["distpicker"], function () {
        window.wwload.distpicker = true;
        replace();
        fncallback();
      });
    } else if (window.wwload.distpicker === "wait") {
      setTimeout(function () {
        loadDependence(fncallback);
      }, 100);
    } else {
      replace();
      fncallback();
    }

    function replace() {
      loadDependence = function (fncallback) {
        fncallback();
      }
    }
  }


  // BEGIN: 元素首次初始化处理
  var init = function () {
    // 重写初始化函数
    init = function () {
      return true;
    };
    $.wwclass.addEvtinHandler(wwclassName, evtInHandler);

    // 如有初始化动作, 请在下方添加
  };
  // END: 元素首次初始化处理


  /**
   * 解析地点字符串为地点对象, 如果错误则返回false
   * @param  {string} placeStr          地点字符串,格式, 省名-市名-区名
   * @return {object|false} placeObj    地点对象, 如果是 false 表示获取失败
   * @return {string} placeObj.province 省
   * @return {string} placeObj.city     市
   * @return {string} placeObj.distric  区
   */
  function parsePlace(placeStr) {
    var placeObj = {};
    if (!placeStr) {
      return placeObj;
    }
    placeStr = placeStr.split("-");
    if (placeStr.length !== 3) {
      return placeObj;
    }
    placeObj.province = placeStr[0];
    placeObj.city = placeStr[1];
    placeObj.district = placeStr[2];
    return placeObj;
  }

  /**
   * 生成当前元素的省市区字符串, 使用 "-" 连接
   * @param  {jquery element} $ele 需要取值的元素
   * @return {string}      省市区字符串
   */
  function getPlaceStr($ele) {
    var placeStr = [];
    $ele.find("select").each(function (index, targetDom) {
      placeStr.push($(targetDom).val());
    });
    return placeStr.join("-");
  }

  /*
   * @description 初始化每个元素
   * @param {jQuery object} $ele - 需要初始化的元素
   */
  function place_btn($ele) {
    var placeData = $ele.attr("data--city");

    var placeObj = parsePlace(placeData);
    var place = placeObj;

    for (var name in placeObj) {
      $.wwclass.helper.updateProp($ele, "data-x-" + name, placeObj[name]);
    }
    if (placeData == "") {
      $ele.distpicker();
    } else {
      $ele.distpicker(place);
    }

    $ele.on("change", "select", function (e) {
      var $ele = $(e.delegateTarget);
      var $select = $(e.currentTarget);
      // 改变控制属性, 内部改变控制属性 添加data标识
      var provincecode = $ele.find("select[data-type='province']").find("option:selected").attr("data-code");
      var citycode = $ele.find("select[data-type='city']").find("option:selected").attr("data-code");
      var districtcode = $ele.find("select[data-type='district']").find("option:selected").attr("data-code");
      $.wwclass.helper.updateProp($ele, "data-x-provincecode", provincecode);
      $.wwclass.helper.updateProp($ele, "data-x-citycode", citycode);
      $.wwclass.helper.updateProp($ele, "data-x-districtcode", districtcode);
      $ele.data("interne", true);
      var placeStr = getPlaceStr($ele);
      $.wwclass.helper.updateProp($ele, "data--city", getPlaceStr($ele));
      // 改变输出属性
      var placeObj = parsePlace(placeStr);
      for (var name in placeObj) {
        $.wwclass.helper.updateProp($ele, "data-x-" + name, placeObj[name]);

      }
      // 发出数据更改的输出事件
      setTimeout(function () {
        $.wwclass.helper.anijsTrigger($ele, "datachange");
      });
    });
  }


  function processElement($ele) {
    // 对 $ele 元素做对应处理
    setTimeout(function () {
      place_btn($ele)
    }, 100)
  };

  /*
   * @description 析构每个元素, 也就是该元素该删除时的处理代码
   * @param {jQuery object} $ele - 需要处理的元素
   */
  function finalizeElement($ele) {
    // 对 $ele 元素做对应处理
  };

  // BEGIN: 监听属性处理
  /*
   * @description 监听函数, 元素的控制属性(data--)改变时处理
   * @param {jQuery object} $ele - 控制属性改变的元素
   * @param {string} attribute - 控制属性的名称
   * @param {string} value - 控制属性改变为何值
   */
  var evtInHandler = function ($ele, attribute, value) {
    switch (attribute) {
      case "data--city":
        // if ($ele.data("interne")) {
        //     $ele.data("interne", false);
        //     return;
        // }
        $ele.distpicker("destroy");
        var placeData = $ele.attr("data--city");
        var placeObj = parsePlace(placeData);
        var place = placeObj;
        for (var name in placeObj) {
          $.wwclass.helper.updateProp($ele, "data-x-" + name, placeObj[name]);
        }
        if (placeData == "") {
          $ele.distpicker();
        } else {
          $ele.distpicker(place);
        }


        break;
      case "finalize":
        finalizeElement($ele);
        break;
      default:
        console.info("监听到 \"" + $ele.attr("data-wwclass") + "\" 元素的 \"" + attribute + "\" 属性值改变为 \"" + value + "\", 但是无对应处理动作.");
    }
  };
  // END: 监听属性处理

  // 以下部分不需要修改
  if (!$.wwclass) {
    console.error("Can not use without wwclass.js");
    return false;
  }

  var ret = /*INSBEGIN:WWCLSHANDLER*/
    function (set) {
      if (set.length > 0) {
        loadDependence(function () {
          init();
          $(set).each(function (index, targetDom) {
            processElement($(targetDom));
          });
        });
      }
    }
    /*INSEND:WWCLSHANDLER*/
    ;

  return ret;

}));
