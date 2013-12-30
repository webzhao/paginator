(function(){
    var Paginator = Widget.extend({

        /**
         * 可选配置项
         */
        attrs: {
            totalItems: 0,      // 总条数
            itemsPerPage: 10,   // 每页条数
            page: 0,            // 当前显示第几页
            prevNext: true,     // 是否显示上一页/下一页
            firstLast: false,   // 是否显示首页/尾页
            pageSpan: 10,       // 最多同时显示多少页
            template: '<div class="ui-pagination"></div>'
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
         * 绑定事件
         */
        __bindEvents: function() {
            var paginator = this;

            // 点击页码
            paginator.delegateEvents('click .ui-page', function(e) {
                e.preventDefault();
                var page = $(e.target).data('page');
                paginator.set('page', parseInt(page, 10));
            });

            // 属性改变
            paginator.on('change:totalItems change:page', function(){
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
         * 生成所有分页的HTML结构
         */
        __getMarkup: function() {
            var paginator = this,
                totalItems = paginator.get('totalItems'),
                totalPages = paginator.__totalPages,
                page = paginator.get('page'),
                pageSpan = paginator.get('pageSpan'),
                markup = '',
                half = (paginator.get('pageSpan') / 2) | 0,
                start1, end1, start2, end2;

            // 不足一页的不显示哦
            if (totalPages <= 1) {
                return markup;
            }

            //首页
            if (paginator.get('firstLast') && page > half && totalPages > pageSpan) {
                markup += paginator.__getPageMarkup(0, '首页');
            }

            //上一页
            if (paginator.get('prevNext') && page > 0) {
                markup += paginator.__getPageMarkup(page - 1, '上一页');
            }

            //当前页之前的分页链接，半闭区间[start1, end1)
            start1 = Math.max(Math.min(page - half, totalPages - pageSpan), 0);
            end1 = page;
            for (var i = start1; i < end1; i++) {
                markup += paginator.__getPageMarkup(i);
            }

            //当前页
            markup += '<em class="ui-page current">' + (page + 1) + '</em>';

            //当前页之后的分页链接，半闭区间[start2, end2)
            start2 = page + 1;
            end2 = Math.min(Math.max(page + half, start1 + pageSpan), totalPages);
            for (var i = start2; i < end2; i++) {
                markup += paginator.__getPageMarkup(i);
            }

            //下一页
            if (paginator.get('prevNext') && page < totalPages - 1) {
                markup += paginator.__getPageMarkup(page + 1, '下一页');
            }

            //末页
            if (paginator.get('firstLast') && page < (totalPages - half) && totalPages > pageSpan) {
                markup += getURL(total-1, '末页');
            }
            return markup;
        },

        /**
         * 生成某一页的HTML结构
         */
        __getPageMarkup: function(page, text) {
            text = text || page + 1;
            return '<a href="#" class="ui-page" data-page="' + page + '">' + text + '</a>';
        },

    });
    this.Paginator = Paginator;
})();
