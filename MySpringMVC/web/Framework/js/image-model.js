/**
 * description 图片处理模型,用于点击图片中相对位置的逻辑处理
 * author lvyangxu
 * 2015-08-11
 */

///根据元素被点击时的对于自身的相对位置,来判断是否执行一个函数，用于图片中的按钮点击，参数分别为元素Id,开始的x坐标百分比（最大为1）,开始的y坐标百分比（最大为1）,结束的x坐标百分比（最大为1）,结束的y坐标百分比（最大为1）,在范围内执行的回调
function doImgRelativePositionFunction(id, startXPercent, endXPercent, startYPercent, endYPercent, clickCallback) {
    $("#" + id).on("click", function (e) {
        var pointX = e.pageX;
        var pointY = e.pageY;
        var x = pointX - $("#" + id).offset().left;
        var y = pointY - $("#" + id).offset().top;
        var xPercent = x / $("#" + id).width();
        var yPercent = y / $("#" + id).height();
        if (startXPercent <= xPercent && xPercent <= endXPercent && startYPercent <= yPercent && yPercent <= endYPercent) {
            clickCallback();
        }
    });
}