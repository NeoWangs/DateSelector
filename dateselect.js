// +----------------------------------------------------------------------+
// | DateSelector.js   日期选择控件
// +----------------------------------------------------------------------+
// | Author: Neoxone
// +----------------------------------------------------------------------+
// | Site: www.cssass.com
// +----------------------------------------------------------------------+
function DateSelector(wrap,options) {
    this.options = {//默认值
        year:		0,//年
        month:		0,//月
        day:		0,//日
        minYear:	1969,//最小年份
        maxYear:	new Date().getFullYear(),//最大年份
        onChange:	function(){}//日期改变时执行
    };
    if(options && options.data){
        var data = options.data.split(/[\/-]/);
        options.year = data[0];
        options.month = data[1];
        options.day = data[2];
    };
    extendCopy(options || {}, this.options);  //对象拷贝继承
    this.wrap = wrap;
    this.create();
    this.init();
}

DateSelector.prototype = {
    create : function(){
        var wrapBox = document.createDocumentFragment();
        this.SelYear = document.createElement("SELECT");
        this.SelYear.options[0] = new Option("年",-1);
        this.SelYear.name = "year";
        wrapBox.appendChild(this.SelYear);
        this.SelMonth = document.createElement("SELECT");
        this.SelMonth.options[0] = new Option("月",-1);
        this.SelMonth.name = "month";
        wrapBox.appendChild(this.SelMonth);
        this.SelDay = document.createElement("SELECT");
        this.SelDay.options[0] = new Option("日",-1);
        this.SelDay.name = "day";
        wrapBox.appendChild(this.SelDay);
        this.SelDate = document.createElement("INPUT");
        this.SelDate.type = "hidden";
        this.SelDate.name = "date";
        wrapBox.appendChild(this.SelDate);
        this.wrap.appendChild(wrapBox);
    },
    init : function(){
        var dt = new Date(),
            iMonth = parseInt(this.options.month),
            iDay = parseInt(this.options.day),
            iMinYear = parseInt(this.options.minYear),
            iMaxYear = parseInt(this.options.maxYear);
        this.Year = parseInt(this.options.year) || dt.getFullYear();
        this.Month = 1 <= iMonth && iMonth <= 12 ? iMonth : dt.getMonth() + 1;
        this.Day = iDay > 0 ? iDay : dt.getDate();
        this.MinYear = iMinYear && iMinYear < this.Year ? iMinYear : this.Year;
        this.MaxYear = iMaxYear && iMaxYear > this.Year ? iMaxYear : this.Year;
        this.onChange = this.options.onChange;
        this.setSelect(this.SelYear, this.MinYear, this.MaxYear - this.MinYear + 1, this.Year - this.MinYear + 1);
        this.setSelect(this.SelMonth, 1, 12, this.Month );
        this.getDays();
        this.bind();
    },
    bind : function(){
        var self = this;
        //日期改变事件
        events.addEvent(this.SelYear, "change", function(){
            self.Year = self.SelYear.value;
            self.getDays();
        });
        events.addEvent(this.SelMonth, "change", function(){
            self.Month = self.SelMonth.value;
            self.getDays();
        });
        events.addEvent(this.SelDay, "change", function(){
            self.Day = self.SelDay.value;
        });
        events.addEvent($tag("select",this.wrap), "change", function(){
            self.getTime();
            self.onChange();
        });
        this.getTime();
    },
    getDays: function() { //取得月份天数
        var daysInMonth = new Date(this.Year, this.Month, 0).getDate();
        if(this.Day > daysInMonth) this.Day = daysInMonth;
        this.setSelect(this.SelDay, 1, daysInMonth, this.Day);
    },
    getTime: function(){ //获取时间戳
        var timeStamp = new Date(this.Year, this.Month - 1, this.Day).getTime(); //月份从0开始
        this.SelDate.value = timeStamp;
    },
    setSelect: function(oSelect, iStart, iLength, iIndex) {
        if(oSelect.length - 1 < iLength){
            for (var i = oSelect.length-1; i < iLength; i++) {
                oSelect.options[i+1] = new Option(iStart + i ,iStart + i );
            }
        }else{
            //删除多余的日期
            var len = oSelect.length - iLength - 1;
            for(var i = 0; i < len ; i++){
                oSelect[oSelect.length - 1].remove();
            }
        }
        oSelect.selectedIndex = iIndex;
    }
};