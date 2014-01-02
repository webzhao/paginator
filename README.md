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

## 页码切换时

