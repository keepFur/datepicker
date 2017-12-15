(function() {
    var datepicker = {},
        monthData, wrapper = document.createElement('div'),
        defaults = {
            showFormat: '-', //时间显示格式，默认使用-分隔
            isTodayHeightLight: false, //今天是否高亮显示
            initDate: new Date(), //初始化的时间
            max: '', //最小时间
            min: '' //最大时间
        };
    wrapper.className = 'ui-datepicker-wrapper';
    datepicker.getMonthData = function(year, month) {
        var ret = [];
        // 如果是没有传年份和月份的话  默认是用当前日期
        if (!year || !month) {
            var today = new Date();
            year = today.getFullYear();
            month = today.getMonth() + 1;
        }
        //获取当月的第一天 
        var firstDay = new Date(year, month - 1, 1);
        console.log('获取当月的第一天:' + firstDay);
        //获取当月的第一天是星期几
        var firstDayWeekDay = firstDay.getDay();
        console.log('获取当月的第一天是星期几:' + firstDayWeekDay);
        if (firstDayWeekDay === 0) {
            //由于星期天是每个星期的第一天    所以等于0的时候强制为7
            firstDayWeekDay = 7;
        }
        year = firstDay.getFullYear(); //获取年份
        month = firstDay.getMonth() + 1; //获取月份
        //获取上个月的最后一天  传0的话是  利用了日期自动退位的功能
        var lastDayOfLastMonth = new Date(year, month - 1, 0);
        //用一个变量存储下
        var lastDateOfLastMonth = lastDayOfLastMonth.getDate();
        console.log('获取上个月的最后一天：' + lastDateOfLastMonth);
        //上一个月的天数   例如本月的第一天是星期一的话   那么preMonthDayCount 就是0
        var preMonthDayCount = firstDayWeekDay - 1;
        console.log(preMonthDayCount)
            //当月的最后一天
        var lastDay = new Date(year, month, 0);
        var lastDate = lastDay.getDate();
        console.log('当月的最后一天' + lastDate);
        //直接获取六周的数据
        for (var i = 0; i < 7 * 6; i++) {
            var date = i + 1 - preMonthDayCount;
            var showDate = date;
            var thisMonth = month;
            if (date <= 0) {
                //上一月
                thisMonth = month - 1;
                showDate = lastDateOfLastMonth + date;
            } else if (date > lastDate) {
                // 下一月
                thisMonth = month + 1;
                showDate = showDate - lastDate;
            }
            //当月份等于0的时候，说明月份已经越界了
            if (thisMonth === 0) {
                thisMonth = 12;
            }
            //当月份等于13的时候，说明是第二年的一月份
            if (thisMonth == 13) {
                thisMonth = 1;
            }
            ret.push({
                date: date,
                showDate: showDate,
                month: thisMonth,
            });
        }
        return {
            days: ret, //当月的所有数据
            month: month, //当月的月份
            year: year, //当月的年份
            lastDate: lastDate, //当月的最后一天
            firstDate: firstDay.getDate() //获取当月的第一天
        };
    };
    // 构建ui函数
    datepicker.buildUI = function(year, month) {
        monthData = datepicker.getMonthData(year, month);
        var month = monthData.month; //月份
        var year = monthData.year, //年分
            today = new Date(), //今天
            firstDate = monthData.firstDate, //获取当月的第一天
            lastDate = monthData.lastDate //当月的最后一天
        ;

        var hmtltemplate = '<div class="ui-datepicker-header">' +
            '<a href="#" class="ui-datepicker-btn ui-datepicker-prev-btn ui-datepicker-prevmonth-btn">&lt;</a>' +
            '<a href="#" class="ui-datepicker-btn ui-datepicker-prev-btn ui-datepicker-prevyear-btn">&lt;</a>' +
            '<a href="#" class="ui-datepicker-btn  ui-datepicker-next-btn ui-datepicker-nextmonth-btn">&gt;</a>' +
            '<a href="#" class="ui-datepicker-btn ui-datepicker-next-btn ui-datepicker-nextyear-btn">&gt;</a>' +
            '<span class="ui-datepicker-curr-month">' + year + '-' + month + '</span>' +
            '</div>' +
            '<div class="ui-datepicker-body">' +
            '<table>' +
            '<thead>' +
            '<tr>' +
            '<th>一</th>' +
            '<th>二</th>' +
            '<th>三</th>' +
            '<th>四</th>' +
            '<th>五</th>' +
            '<th>六</th>' +
            '<th>日</th>' +
            '</tr>' +
            ' </thead>' +
            '<tbody>';
        for (var i = 0; i < monthData.days.length; i++) {
            //   星期天
            if (i % 7 === 0) {
                hmtltemplate += '<tr>';
            }
            if (defaults.isTodayHeightLight && today.getDate() == monthData.days[i].showDate && today.getMonth() + 1 == month && today.getFullYear() == year) {
                hmtltemplate += '<td data-date="' + monthData.days[i].date + '" class="datepicker-ui-todayHeightLight">' + monthData.days[i].showDate + '</td>'
            } else if (i < firstDate) {
                hmtltemplate += '<td data-date="' + monthData.days[i].date + '">' + monthData.days[i].showDate + '</td>'
            }
            //星期六
            if (i % 7 === 6) {
                hmtltemplate += '</tr>';
            }
        }
        hmtltemplate += '</tbody></table><div class="ui-datepicker-footer">' +
            '<input type="button" class="ui-datepicker-footer-clear" value="清空"/>' +
            '<input type="button" class="ui-datepicker-footer-close" value="关闭"/>' +
            '<input type="button" class="ui-datepicker-footer-today" value="今天"/>' +
            '</div> </div>';
        return hmtltemplate;
    };
    //页面渲染函数
    datepicker.rander = function(direction) {
        var month,
            year;
        if (monthData) {
            month = monthData.month;
            year = monthData.year;
        }
        if (direction == 'prev') {
            month--;
            wrapper.classList.add('ui-datepicker-wrapper-show');
        } else if (direction == 'next') {
            month++;
        } else if (direction == 'prevyear') {
            year--;
        } else if (direction == 'nextyear') {
            year++;
        }
        var hmtltemplate = datepicker.buildUI(year, month);
        wrapper.innerHTML = hmtltemplate;
        document.body.appendChild(wrapper);
    };
    //初始化函数  暴露出去的接口
    datepicker.datepicker = function(input, options) {
        datepicker.rander();
        var inputele = document.querySelector(input);
        var isOpen = false;
        //为输入框添加监听事件
        inputele.addEventListener('click', function() {
            if (isOpen) {
                wrapper.classList.remove('ui-datepicker-wrapper-show');
                isOpen = !isOpen;
            } else {
                var top = inputele.offsetTop,
                    left = inputele.offsetLeft,
                    heigth = inputele.offsetHeight;
                wrapper.style.top = top + heigth + 2 + 'px';
                wrapper.style.left = left;
                wrapper.classList.add('ui-datepicker-wrapper-show');
                isOpen = !isOpen;
            }
        }, false);

        //为月份绑定点击事件   之所以绑定在wrapper上面，是因为wrapper不会变化   其他元素会发生变化，需要每次初始化的时候重新添加事件
        wrapper.addEventListener('click', function(e) {
            var target = e.target;
            //不包含月份按钮的话  直接推出
            if (!target.classList.contains('ui-datepicker-btn')) {
                return;
            }
            if (target.classList.contains('ui-datepicker-prevmonth-btn')) {
                //上一个月
                datepicker.rander('prev');
            } else if (target.classList.contains('ui-datepicker-nextmonth-btn')) {
                //  下一个月
                datepicker.rander('next');
            }
        }, false);

        //为年份绑定事件
        wrapper.addEventListener('click', function(e) {
            var target = e.target;
            //不包含年份按钮的话  直接推出
            if (!target.classList.contains('ui-datepicker-btn')) {
                return;
            }
            if (target.classList.contains('ui-datepicker-prevyear-btn')) {
                //上一年
                datepicker.rander('prevyear');
            } else if (target.classList.contains('ui-datepicker-nextyear-btn')) {
                //下一年
                datepicker.rander('nextyear');
            }
        }, false);
        // 点击日期选中事件
        wrapper.addEventListener('click', function(e) {
            var target = e.target;
            if (target.tagName.toLowerCase() !== 'td') {
                return;
            }
            var date = new Date(monthData.year, monthData.month, target.dataset.date);
            inputele.value = datepicker.format(date);
            wrapper.classList.remove('ui-datepicker-wrapper-show');
            isOpen = !isOpen;
        }, false);
        //清空按钮事件
        wrapper.addEventListener('click', function(e) {
            var target = e.target;
            if (!target.classList.contains('ui-datepicker-footer-clear')) {
                return;
            }
            inputele.value = '';
            inputele.focus();
        }, false);
        //关闭按钮
        wrapper.addEventListener('click', function(e) {
            var target = e.target;
            if (!target.classList.contains('ui-datepicker-footer-close')) {
                return;
            }
            wrapper.classList.remove('ui-datepicker-wrapper-show');
            isOpen = !isOpen;
        }, false);
        //选择今天的按钮
        wrapper.addEventListener('click', function(e) {
            var target = e.target;
            if (!target.classList.contains('ui-datepicker-footer-today')) {
                return;
            }
            var date = new Date();
            inputele.value = datepicker.format(date);
            wrapper.classList.remove('ui-datepicker-wrapper-show');
            isOpen = !isOpen;
        }, false);
    };

    datepicker.format = function(date) {
        function padding(num) {
            if (num <= 9) {
                return '0' + num;
            }
            return num;
        }
        var ret = '';
        ret += padding(date.getFullYear()) + '-';
        ret += padding(date.getMonth() + 1) + '-';
        ret += padding(date.getDate());
        return ret;
    };
    //暴露出接口
    window.datepicker = datepicker.datepicker;
})()