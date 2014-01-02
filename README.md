# Paginator 分页组件

一个简单的JavaScript分页组件，基于[WidgetCore](https://github.com/novawidgets/widgetcore)实现。使用它可以实现在网页上展示数字页码；在页码被点击时，会发出一个事件让开发者进行相应的处理。

## 创建分页

要使用本组件展示一个分页，需要创建一个`Paginator`实例，并给它指定一些属性，比如总的数据条数、每页显示多少条及显示的位置等。

```js
var pg = new Paginator({
    totalItems: 65,
    itemsPerPage: 10,
    element: '#pagination'
});
```

以上代码将会在`#pagination`元素中显示一个分页，总的数据条数为`65`条，每页显示`10`条。

### 可选的配置项

选项             | 类型    | 说明
-----------------|---------|--------------------------------------
**element**      | Number  | 分页显示的位置，一个jQuery选择器或元素
**totalItems**   | Number  | 总的数据条数
**itemsPerPage** | Number  | 每页显示多少条数据，默认为`10`
**page**         | Number  | 当前显示第几页，**从0开始算起**
**pageSpan**     | Number  | 最多同时显示多少个页码，默认为`10`
**prevNext**     | Boolean | 是否显示「上一页」和「下一页」，默认为`true`
**firstLast**    | Boolean | 是否显示「首页」和「尾页」，默认为`false`
**classNames**   | JSON    | 生成分页时，给元素附加的`CSS`类名，详情如下

```js
/* classNames的默认值 */
{
    page: 'ui-page',      // 页码的类名
    current: 'current',   // 给当前页附加的类名
    disable: 'disabled'   // 控件(比如下一页)不可用时附加的类名
}
```

#### 注意事项：

> * 当分页总页数只有一页时，分页不显示
> * 如果想让不可以用的控件隐藏，请使用CSS

### 更新分页信息

对于已经创建的`Paginator`实例，可以通过设置其属性来更新分页的显示：

```js
/* 设置当前选中第3页 */
pg.set('page', 2);
/* 同时设置总条数和每页显示条数 */
pg.set({
    totalItems: 24,
    itemsPerPage: 5
});
```

设置`totalItems`、`page`等属性时，分页的显示会自动更新。如果不希望显示更新，可以在调用`set`方法时，将第三个参数传入 `{slient: true}`。例如：

```js
pg.set('page', 3, {silent: true});
```

如果想手工触发分页显示的更新，可以调用`updateUI`方法。事实上，改变分页的属性时，组件也是通过自动调用`updateUI`方法来实现的。

## 获取页码切换的事件

当用户通过点击页码改变当前选中的分页时，可以通过实例的`change:page`事件来监听到这一变化。

```js
pg.on('change:page', function(evt, page){
    console.log('current page is ' + page);
});
```




