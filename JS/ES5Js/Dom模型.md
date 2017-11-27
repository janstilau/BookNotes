# Dom模型
## 基本概念
### Dom释义
DOM 是 JavaScript 操作网页的接口，全称为“文档对象模型”（Document Object Model）。它的作用是将网页转为一个 JavaScript 对象，从而可以用脚本进行各种操作（比如增删内容）。
浏览器会根据 DOM 模型，将结构化文档（比如 HTML 和 XML）解析成一系列的节点，再由这些节点组成一个树状结构（DOM Tree）。所有的节点和最终的树状结构，都有规范的对外接口。所以，DOM 可以理解成网页的编程接口。DOM 有自己的国际标准，目前的通用版本是DOM 3，下一代版本DOM 4正在拟定中。
严格地说，DOM 不属于 JavaScript，但是操作 DOM 是 JavaScript 最常见的任务，而 JavaScript 也是最常用于 DOM 操作的语言。本章介绍的就是 JavaScript 对 DOM 标准的实现和用法。

### 节点
DOM的最小组成单位叫做节点（node）。文档的树形结构（DOM树），就是由各种不同类型的节点组成。每个节点可以看作是文档树的一片叶子
节点的类型有七种:
Document：整个文档树的顶层节点
DocumentType：doctype标签（比如<!DOCTYPE html>）
Element：网页的各种HTML标签（比如<body>、<a>等）
Attribute：网页元素的属性（比如class="right"）
Text：标签之间或标签包含的文本
Comment：注释
DocumentFragment：文档的片段

### 节点树 
一个文档的所有节点，按照所在的层级，可以抽象成一种树状结构。这种树状结构就是DOM。

最顶层的节点就是document节点，它代表了整个文档。文档里面最高一层的HTML标签，一般是<html>，它构成树结构的根节点（root node），其他HTML标签节点都是它的下级。

除了根节点以外，其他节点对于周围的节点都存在三种关系。
父节点关系（parentNode）：直接的那个上级节点
子节点关系（childNodes）：直接的下级节点
同级节点关系（sibling）：拥有同一个父节点的节点

DOM提供操作接口，用来获取三种关系的节点。其中，子节点接口包括firstChild（第一个子节点）和lastChild（最后一个子节点）等属性，同级节点接口包括nextSibling（紧邻在后的那个同级节点）和previousSibling（紧邻在前的那个同级节点）属性。

## 特征相关的属性
所有节点对象都是浏览器内置的Node对象的实例，继承了Node属性和方法。这是所有节点的共同特征。

### Node.nodeName，Node.nodeType
nodeName属性返回节点的名称，nodeType属性返回节点类型的常数值。具体的返回值，可查阅下方的表格。

类型	nodeName	nodeType
ELEMENT_NODE	大写的HTML元素名	1
ATTRIBUTE_NODE	等同于Attr.name	2
TEXT_NODE	#text	3
COMMENT_NODE	#comment	8
DOCUMENT_NODE	#document	9
DOCUMENT_FRAGMENT_NODE	#document-fragment	11
DOCUMENT_TYPE_NODE	等同于DocumentType.name	10

以document节点为例，它的nodeName属性等于#document，nodeType属性等于9。
document.nodeName // "#document"
document.nodeType // 9

如果是一个<p>节点，它的nodeName是P，nodeType是1。文本节点的nodeName是#text，nodeType是3。
通常来说，使用nodeType属性确定一个节点的类型，比较方便。
document.querySelector('a').nodeType === 1
// true
document.querySelector('a').nodeType === Node.ELEMENT_NODE
// true


### Node.nodeValue
Node.nodeValue属性返回一个字符串，表示当前节点本身的文本值，该属性可读写。
由于只有Text节点、Comment节点、XML文档的CDATA节点有文本值，因此只有这三类节点的nodeValue可以返回结果，其他类型的节点一律返回null。同样的，也只有这三类节点可以设置nodeValue属性的值。对于那些返回null的节点，设置nodeValue属性是无效的。































