//
//  有意义的命名.h
//  BookNotes
//
//  Created by jansti on 2017/9/3.
//  Copyright © 2017年 jansti. All rights reserved.
//

#ifndef _______h
#define _______h

/*
 
 有意义的命名
 1. 名副其实
    一旦发现了更好的名称,就换掉旧的.
    变量,函数,类的命名,应该告诉你,它为什么会存在,做什么事情,应该怎么做,如果还需要注释,那么就不算名副其实.
    int elaspedtIimeInDays;
    int daysSinceCreation;
    int daysSinceModification;
    int fileAgeInDays;
 2. 避免误导.
    必须避免留下掩藏代码本意的错误线索.应该避免使用和本意相悖的词.
    accountList, 如果不是真的list,那么别用,因为list对程序员来说有意义.用accountGroup,或者accounts更好.
    提防使用不同之处较小的名称.XYZControllerForEfficient 和 XYZControllerForEffective 不细看谁能清楚.
    例子:单个l或者O做变量名,但是看起来确实1和0.
 3. 做有意义的区分.
    为了区分变量,添加了数字或者废话.
    数字,copyChar(char a1[], char a2[]), 明明可以用source或者destination
    废话:Product类,还有一个ProductInfo类和ProductData类.但是它们的意义几乎相同.废话都是冗余信息.例如,NameString和Name.难道name
 会不是一个字符串.
    moneyAmount和money, customerinfo和customer, accountData和account, theMessage和message. 都一样!
 4. 使用读的出来的名字
    如果名字不读出来,程序员交流的时候就很傻. 比如genymdhms是什么,generationTimeStamp但是不解释谁知道.这妨碍的交流.
 5. 使用可以搜索的名称.
    单个字母名称和数字常量有很大的问题,就是很难搜索.单个字母名称仅用于短方法的本地变量.
    名称的长短,应该和变量的作用于大小相对应.如果可能多处使用,那么应该赋予便于搜索的名称.
 6. 避免使用编码(把类型或者作用域编写到名称里面) 这些,算作逻辑以外的数据.
    1.混乱的缩写.
    2.使用前缀.
        使用m做成员变量前缀,首先,类应该足够小,再者现在的IDE都有不同颜色辨识(to_more_think)
    3.接受IAttributed,作者喜欢不加修饰的接口,I算作了干扰.用户不应该知道,是接口还是实现.
 7. 类名,对象名应该是名词或者名词短语.不应该是动词.
 8. 方法名,应该是动词或者动词短语.重载构造器的时候,使用描述了参数的静态工厂方法名.
    例如,Complex.FromR额按了Number(2.3) 好过了 new Complex(23.0)
 9. 别扮可爱,使用自以为是的好词.例如,起什么圣殿骑士自己感兴趣的东西写到工作代码里来.
 10. 抽象概念,对应一个词.--->一以贯之.
    抽象概念,用一个词,并且坚持那个词.fetch,retrieve,get都是取,用一个,一直用.函数名应该独一无二并且保持一致.
 11. 别用双关语.
    避免,同一个单词用作不同的目的.同一个术语,用作不同的概念,就是双关语,例如add,看起来好像是给类里面增加信息,应该把参数存储到类里面,
 但是,addNewString 可能是链接一个新string,返回一个新stirng.这样,前面那种添加到自己内部的就应该叫做insert
 12. 避免用业务所在领域的名称命名
    医药系统用医生那一套,但是维护代码的是程序,程序怎么理解一个医药方面的词汇.
 13. 避免添加没用的语境.
    例如address类,添加GSDAccountAddress. GSD是工程名,这在OC里面没有办法,但是,确实不应该添加这种东西到业务逻辑上去.
 
 */

#endif /* _______h */
