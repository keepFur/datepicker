(function() {
    var datepicker = window.datepicker,
        monthData, wrapper = document.createElement('div');
    wrapper.className = 'ui-datepicker-wrapper';
    datepicker.buildUI = function(year, month) {
        monthData = datepicker.getMonthData(year, month);
        var month = monthData.month; //月份
        var year = monthData.year; //年分
        var hmtltemplate = '<div class="ui-datepicker-header">' +
            '<a href="#" class="ui-datepicker-btn ui-datepicker-prev-btn">&lt;</a>' +
            '<a href="#" class="ui-datepicker-btn ui-datepicker-next-btn">&gt;</a>' +
            '<span class="ui-datepicker-curr-month">' + year + '-' + month + '</span>' +
            '</div>' +
            '<div class="ui-datepicker-body">' +
            '<table>' +
            '<thead>' +
            '<tr>' +
            ' <th>日</th>' +
            '<th>一</th>' +
            '<th>二</th>' +
            '<th>三</th>' +
            '<th>四</th>' +
            '<th>五</th>' +
            '<th>六</th>' +
            '</tr>' +
            ' </thead>' +
            '<tbody>';
        for (var i = 0; i < monthData.days.length; i++) {
            //   星期天
            if (i % 7 === 0) {
                hmtltemplate += '<tr>';
            }
            hmtltemplate += '<td data-date="' + monthData.days[i].date + '">' + monthData.days[i].showDate + '</td>'
                //星期六
            if (i % 7 === 6) {
                hmtltemplate += '</tr>';
            }
        }
        hmtltemplate += '</tbody></table> </div>';
        return hmtltemplate;
    }
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
        }
        var hmtltemplate = datepicker.buildUI(year, month);
        wrapper.innerHTML = hmtltemplate;
        document.body.appendChild(wrapper);
        // document.body.removeChild(wrapper);
    }
    datepicker.init = function(input) {
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

        //为月份绑定点击事件
        wrapper.addEventListener('click', function(e) {
            var target = e.target;
            //不包含月份按钮的话  直接推出
            if (!target.classList.contains('ui-datepicker-btn')) {
                return;
            }
            if (target.classList.contains('ui-datepicker-prev-btn')) {
                //上一个月
                datepicker.rander('prev');
            } else if (target.classList.contains('ui-datepicker-next-btn')) {
                //  下一个月
                datepicker.rander('next');
            }
        }, false);
        wrapper.addEventListener('click', function(e) {
            var target = e.target;
            if (target.tagName.toLowerCase() !== 'td') {
                return;
            }
            var date = new Date(monthData.year, monthData.month, target.dataset.date);
            inputele.value = format(date);
            wrapper.classList.remove('ui-datepicker-wrapper-show');
            isOpen = !isOpen;
        }, false)
    };

    function format(date) {
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
    }
})();