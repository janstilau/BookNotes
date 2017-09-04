
//
//  10_Dom.h
//  BookNotes
//
//  Created by jansti on 2017/9/4.
//  Copyright © 2017年 jansti. All rights reserved.
//

#ifndef _0_Dom_h
#define _0_Dom_h
/*
 
    Dom将XML描绘成为多借点构成的结构.不同的类型,代表着不同的信息和标记.每个节点拥有自己的特点,数据和方法,并且和其他节点有着不同的关系.
 节点之间的关系,构成了层次,而所有的页面标记,则为一个特定节点为根节点的树形结构.
    文档节点,是每个文档的根节点.HTML中,文档节点只有一个子节点,就是<HTML>元素,被称为文档元素.文档元素是文档的最外层元素,文档中其他的
 所有元素都包含在这个文档元素中.每个文档只能有一个文档元素.HTML中,这个文档元素就是html元素,XML中可以自定义文档元素.
    每一段标记都可以通过树中的一个节点表示. 最常用的就是元素节点和文本节点.
    Node类型.接口,所有的节点共享基本属性和方法.
    .nodeType   返回节点类型
    .nodeName   .nodeValue 这两个值取决于类型.对于元素节点,name为标签名,value为null.
    节点关系
    .childNodes     每一个节点都有一个childNodes的属性,保存着一个NodeList对象.保存一组有序的节点,可以通过位置来访问.
    .parentNode     父节点
    .previousSibling .nextSibling 前一个后一个同胞节点.
    .firstChild .lastChild 第一个子节点和最后一个子节点.
    .ownerDocument  整个文档的文档节点.
    操作节点    操作节点的办法,都需要取得他们的父元素.
    appendChild() 向childNodes列表的末尾添加一个节点.添加节点之后,相应的关系都会更新.append返回新增的节点.
                    如果appendChild的节点已经是节点的一部分了,那么就是将该节点从原来的位置,转移到新的位置.
    insertBefore()  两个参数,将前一个节点插入到后一个节点之前.如果后一个null,则appendChild
    replaceNode()   替换节点.
    removeChild()   删除节点. 这连个方法,消失的节点还归文档所有,但是没有他们的位置了.
 
    cloneNode() 复制节点.参数为bool值,yes为深复制,no为浅复制. 复制完的为孤儿节点,不被append的话就没有位置.不会复制添加的js属性,例如事件处理程序.
 
    Document 类型.
    表示HTML页面或者其他XML文档.
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 */
#endif /* _0_Dom_h */
