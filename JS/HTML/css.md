# CSS
Css, Cascading Style Sheets, 用来控制html的外观展示, html则是提供网页的内容和结构. 

Css可以inline, 也可以link.   
inline的话, 就是在element的属性里面, 加上style属性, 然后在属性的值上添加css的属性键值对, 例如<p stype="color: red; font-family:Aerial"></p>, 这样写的问题在于, 对于每个element, 我们都要进行样式的设计, 如果增加一个element, 就要重新添加一次, 而这里面的样式, 可能是可以通用的. 

还可以在head里面写style, 就是在<head></head>中添加<style></style>, 然后在里面添加Css的定义, 不过大部分人不这样写, 而是写一个单独的css的文件, 在文件里面, 写对于样式的定义.  在文件里面, 先是选择器, 然后是大括号, 在大括号里面写对于样式的定义. 例如
p {
    color: red;
    font-size: 20px;
}
属性的定义, 之间是分号分开. 
选择器有三种
标签选择器, 类选择器, id选择器. 
标签就之前写 p{}, 类选择器前加英文句号.(period), 而id选择器前加井号#(hashtag), 后面两种选择器, 都要在element里面添加对于属性的定义. 

class 代表类, 类的意义和之前编程语言的意义一样, 某类实物, 一个element可以设置成为多个class, 而对class 的css定义会应用到所有的该类的element中去. 
而id 则代表Id, 一个单一的元素, 就像各个数据结构中, 用id作为划分事物的主键一样, 在css中, id的css属性只会应用到这个id的元素中, 如果这个元素同时被id, class描述css, id的css描述优先. 而如果两个class中, 描述有冲突的话, 是在css中后出现的class的定义优先. 

## class 
CSS classes are meant to be reused over many elements. By writing CSS classes, you can style elements in a variety of ways by mixing classes on HTML elements.

## ID  
While classes are meant to be used many times, an ID is meant to style only one element. As we'll learn in the next exercise, **IDs override the styles of tags and classes.** Since IDs override class and tag styles, they should be used sparingly and only on elements that need to always appear the same.


## Sprcificity 
Specificity is the order by which the browser decides which CSS styles will be displayed. **A best practice in CSS is to style elements while using the lowest degree of specificity**, so that if an element needs a new style, it is easy to override.
IDs are the most specific selector in CSS, followed by classes, and finally, tags  

Over time, as files grow with code, many elements may have IDs, which can make CSS difficult to edit, since a new, more specific style must be created to change the style of an element.
这一段为什么这么讲呢, 因为一个元素的展示, 可能是class造成的, 可能是它的专属id造成的, 而这个时候, 如果想要改变它的样式的话, 应该修改哪里, 如果是修改class, 那么其他用到这个class的元素的外观都会被随着更改. 所以, 在之后修改的时候, 都会增加一个id, 然后对这个id进行专门的配置操作. 但是, 如果过多的使用id的话, 又会变成inline-style的那种问题, 就是任何一个element, 都有着专门的一个style, 想要修改模块下所有的元素, 这个模块下所有的点都要进行一次修改.  

To make styles easy to edit, it's best to style with a tag selector, if possible. If not, add a class selector. If that is not specific enough, then consider using an ID selector.
可以每一个class, 都设计的相当简单, 然后对于一个element应该是什么样式, 采用class叠加的方式, 这样, 就相当于给每个element设置了属性, 添加了一个class, 就添加了一个属性. 这样可以避免每个element重新写一遍属性的赋值语句, 又保持了灵活性, 不过就是在编写element的时候, class 的编写的时候比较繁琐. 


####
Review CSS Selectors
Throughout this lesson, you learned how to select HTML elements with CSS and apply styles to them. Let's review what you learned:

CSS can change the look of HTML elements. In order to do this, CSS must select HTML elements, then apply styles to them.
CSS can select HTML elements by tag, class, or ID.
Multiple CSS classes can be applied to one HTML element.
Classes can be reusable, while IDs can only be used once.
IDs are more specific than classes, and classes are more specific than tags. That means IDs will override any styles from a class, and classes will override any styles from a tag selector.
Multiple selectors can be chained together to select an element. This raises the specificity, but can be necessary.
Nested elements can be selected by separating selectors with a space.
The !important flag will override any style, however it should almost never be used, as it is extremely difficult to override.
Multiple unrelated selectors can receive the same styles by separating the selector names with commas.
Great work this lesson. With this knowledge, you'll be able to use CSS to change the look and feel of websites to make them look great.


## color 
### rgb(255, 255, 255) rbga(255, 255, 255, 1.0)
### hsl(360, 100%, 100%) 三个数字分别代表着色相, 饱和度, 亮度 hsla()
### #FFFFFF, rgb的十六进制表示的方法, 12代表红色, 34代表绿色, 56代表蓝色
### color: red; color: blue 可以用名字代表, 不过难记, 命名了的颜色又少 
### color代表foreColor
### background-color代表背景色

# typography 排版
## font-family: 字形, 后面的值是各个字形的英文
## font-weight: bold, normal 或者 100-900, 只能是100的整数倍.400代表normal, 700代表bold, 300代表light.

## font-style: italic, normal
## word-spacing: 单词间的差距, 默认是0.25em, em是个单位.
## letter-spacing: 0.3em  这个东西又叫做kerning
调整spacing的操作, 其实not common. 

## text-transform:uppercase 或者 lowercase.
## text-align:left / center / right .
## line-height => This property modifies the leading of text.
lineHeight == fontSize + leading  
fontSize 就是占据的高度, 而leading则是每一行之间的距离. 
而font-size 是设置好的, 所以这个值设置了, 只会更改行间距的大小. 
行间距 = lineHeight - fontSize, 所以fontSize其实就是内容的高度. 
值的设置:   
A unitless number, such as 1.2. This number is an absolute value that will compute the line height as a ratio of the font size.
A number specified by unit, such as 12px. This number can be any valid CSS unit, such as pixels, percents, ems, or rems.
Generally, the unitless ratio value is the preferred method, since it is responsive and based exclusively on the current font size. In other words, if we change the font size, a unitless line-height would automatically readjust, whereas the pixel value would remain static.


这里, 设置了px的line-heght之后发现, 无论fontSize如何变化, 行高还是不变的, 所以可以通过这些来达到字与字之间紧贴的效果. 不过, 实际上没有办法实现所有的紧贴, 因为不同的字, 占据内容框的位置不同, 而计算的时候, 是按照内容框来进行计算的. 

## Fallback Fonts
h1 {
  font-family: "Garamond", "Times", serif;
}
Use the Garamond font for all <h1> elements on the web page.
If Garamond is not available, use the Times font.
If Garamond and Times are not available, use any serif font pre-installed on the user's computer.


















