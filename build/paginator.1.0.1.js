/* Version 1.0.1 */

(function(){
    var Paginator = Widget.extend({

        /**
         * 可选配置项
         */
        attrs: {
            // 总条数
            totalItems: {
                value: 0,
                setter: function(val) {
                    return this.__getIntValue(val, {'default': 0});
                }
            },
            // 每页条数
            itemsPerPage: {
                value: 10,
                setter: function(val) {
                    return this.__getIntValue(val, {'default': 10});
                }
            },
            // 当前显示第几页
            page: {
                value: 0,
                setter: function(val) {
                    return this.__getIntValue(val, {'default': 0, max: this.__totalPages - 1, min: 0});
                }
            },
            // 最多同时显示多少页
            pageSpan: {
                value: 10,
                setter: function(val) {
                    return this.__getIntValue(val, {'default': 10});
                }
            },
            prevNext: true,             // 是否显示上一页/下一页
            firstLast: false,           // 是否显示首页/尾页
            showTotal: false,           // 是否显示总条数
            psConfigurable: false,      // 每页显示条数是否可配置，若可配置，则传入支持条数的数组，如[20, 50, 100]
            template: '<div class="ui-pagination"></div>',
            classNames: {
                page: 'ui-page',
                current: 'current',
                disabled: 'disabled',
                total: 'total',
                pagesize: 'config-ps'
            }
        },

        /**
         * 初始化分页组件
         */
        setup: function() {
            this.__bindEvents();
            this.render();
            this.updateUI();
        },

        /**
         * 属性改变后，刷新UI
         */
        updateUI: function() {
            // 计算分页
            this.__calculateTotalPage();
            // render
            this.$element.html(this.__getMarkup());
        },

        /**
         * 下一页
         */
        next: function() {
            var page = (this.get('page') + 1) % (this.__totalPages);
            this.set('page', page);
        },

        /**
         * 上一页
         */
        prev: function() {
            var page = (this.get('page') - 1 + this.__totalPages) % (this.__totalPages);
            this.set('page', page);
        },

        /**
         * 绑定事件
         */
        __bindEvents: function() {
            var paginator = this;

            // 点击页码
            paginator.delegateEvents('click .' + paginator.get('classNames.page'), function(e) {
                e.preventDefault();
                var target = $(e.target),
                    page,
                    currentClass = paginator.get('classNames.current'),
                    disabledClass = paginator.get('classNames.disabled');
                if (target.hasClass(currentClass) || target.hasClass(disabledClass)) {
                    return;
                }
                page = target.data('page');
                paginator.set('page', page);
            });

            // 改变每页显示条数
            paginator.delegateEvents('change .' + paginator.get('classNames.pagesize') + ' select', function(e) {
                var target = $(e.target);
                paginator.set('itemsPerPage', target.val());
                paginator.set('page', 0);
            });

            // 属性改变
            paginator.on('change:totalItems change:page change:prevNext', function(){
                paginator.updateUI();
            });

        },

        /**
         * 计算总页数
         */
        __calculateTotalPage: function() {
            var paginator = this;
            paginator.__totalPages = Math.ceil(paginator.get('totalItems') / paginator.get('itemsPerPage'));
        },

        /**
         * 获取整数值
         */
        __getIntValue: function(rawValue, options) {
            var value = parseInt(rawValue);
            if (isNaN(value)) {
                value = options['default'] || 0;
            }
            if (typeof options.max !== 'undefined' && value > options.max) {
                value = options.max;
            }
            if (typeof options.min !== 'undefined' && value < options.min) {
                value = options.min;
            }
            return value;
        },

        /**
         * 生成所有分页的HTML结构
         */
        __getMarkup: function() {
            var paginator = this,
                totalItems = paginator.get('totalItems'),
                totalPages = paginator.__totalPages,
                page = Math.min(paginator.get('page'), totalPages),
                pageSpan = paginator.get('pageSpan'),
                markup = '',
                half = (paginator.get('pageSpan') / 2) | 0,
                disabled = false,
                start1, end1, start2, end2, i;

            // 不足一页的不显示哦
            if (totalPages <= 1) {
                return markup;
            }

            // 总条数
            if(paginator.get('showTotal')) {
                markup += '<span class="' + paginator.get('classNames.total') + '">共<em>' + paginator.get('totalItems') + '</em>条</span>';
            }

            //首页
            if (paginator.get('firstLast')) {
                disabled = page <= 0;
                markup += paginator.__getPageMarkup(0, '首页', disabled);
            }

            //上一页
            if (paginator.get('prevNext')) {
                disabled = page === 0;
                markup += paginator.__getPageMarkup(page - 1, '上一页', disabled);
            }

            //当前页之前的分页链接，半闭区间[start1, end1)
            start1 = Math.max(Math.min(page - half, totalPages - pageSpan), 0);
            end1 = page;
            for (i = start1; i < end1; i++) {
                markup += paginator.__getPageMarkup(i);
            }

            //当前页
            markup += '<em class="ui-page current">' + (page + 1) + '</em>';

            //当前页之后的分页链接，半闭区间[start2, end2)
            start2 = page + 1;
            end2 = Math.min(Math.max(page + half, start1 + pageSpan), totalPages);
            for (i = start2; i < end2; i++) {
                markup += paginator.__getPageMarkup(i);
            }

            //下一页
            if (paginator.get('prevNext')) {
                disabled = page >= totalPages - 1;
                markup += paginator.__getPageMarkup(page + 1, '下一页', disabled);
            }

            //末页
            if (paginator.get('firstLast')) {
                disabled = page >= totalPages - 1;
                markup += paginator.__getPageMarkup(totalPages - 1, '末页', disabled);
            }

            // 配置每页显示条数
            if (paginator.get('psConfigurable')) {
                var sizes = paginator.get('psConfigurable');

                markup += '<span class="' + paginator.get('classNames.pagesize') + '">每页显示<select name="itemsPerPage">';
                for(var i = 0, len = sizes.length; i < len; i++) {
                    markup += '<option value="' + sizes[i] + '" ' + (sizes[i] === paginator.get('itemsPerPage') ? 'selected' : '') + '>' + sizes[i] + '</option>'; 
                    console.log('<option value="' + sizes[i] + '" ' + (sizes[i] === paginator.get('itemsPerPage') ? 'selected' : '') + '>' + sizes[i] + '</option>'); 
                }
                markup += '</select>条';
            }
            return markup;
        },

        /**
         * 生成某一页的HTML结构
         */
        __getPageMarkup: function(page, text, disabled) {
            var classNames = [ this.get('classNames.page') ];
            if (disabled) {
                classNames.push(this.get('classNames.disabled'));
            }
            text = text || page + 1;
            return '<a href="#" class="' + classNames.join(' ') + '" data-page="' + page + '">' + text + '</a>';
        }

    });
    this.Paginator = Paginator;
})();
