# 循环引用

首先, A里面有B的一个成员变量, B里面有A的一个成员变量, 这是绝对不可能实现的. 在内存分配的时候, 就会有问题. 但是, 如果是指针的话是可以的, 因为之前的链表的生成的时候, 链表最后一项就是一个自己结构体的指针.

``` A.h
# NOT A
# DEFINE A
#include "b.h"
Class A {
    private:
    B b;
}
# ENDIF A
```

``` B.h
# NOT B
# DEFINE B
#include "a.h"
Class B {
    private:
    A a;
}
# ENDIF B
```

上面的两个结构展开会怎么样

```a.h
# NOT A
# DEFINE A
# NOT B
# DEFINE B

Class B {
    private:
    A a;
}

# ENDIF B

Class A {
    private:
    B b;
}
# ENDIF A
```


```a.h
# NOT B
# DEFINE B
# NOT A
# DEFINE A

Class A {
    private:
    B b;
}

# ENDIF A

Class B {
    private:
    A a;
}

# ENDIF B
```

可以看到, 上面的结构, 使得A无法找到B的信息, B无法找到A的信息. 虽然宏可以帮助无线的嵌套, 但是最后还是无法正常编译.

下面用向前声明的方式

``` A.h
# NOT A
# DEFINE A
class B
Class A {
    private:
    B b;
}
# ENDIF A
```

``` B.h
# NOT B
# DEFINE B
#include "a.h"
Class B {
    private:
    A a;
}
# ENDIF B
```
展开

```A.h
# NOT A
# DEFINE A
class B
Class A {
    private:
    B b;
}
# ENDIF A
```

```B.h
# NOT B
# DEFINE B

# NOT A
# DEFINE A
class B
Class A {
    private:
    B b;
}
# ENDIF A

Class B {
    private:
    A a;
}
# ENDIF B
```

可以看到, A里面还是没有B的信息, 但是有了一个向前声明, 而A的cpp文件里面, 一定要引入b.h, 所以
```A.cpp
#include "a.h"
#inclue "b.h"

展开式

# NOT A
# DEFINE A
class B
Class A {
    private:
    B b;
}
# ENDIF A

# NOT B
# DEFINE B
Class B {
    private:
    A a;
}
# ENDIF B
```

所以A.cpp里面, 是会拿到所有的信息的. 而B.h中, 是可以拿到所有的信息的. A.h拿不到所有的信息, 但是有class的向前声明, 编译的时候, 不会报错.

如果都用class

```A.h
# NOT A
# DEFINE A
class B
Class A {
    private:
    B b;
}
# ENDIF A
```

```B.h
# NOT B
# DEFINE B
class A
Class B {
    private:
    A a;
}
# ENDIF B
```

展开式 完全一样

```A.h
# NOT A
# DEFINE A
class B
Class A {
    private:
    B b;
}
# ENDIF A
```

```B.h
# NOT B
# DEFINE B
class A
Class B {
    private:
    A a;
}
# ENDIF B
```

实现文件中

```A.cpp
#include "a.h"
#include "b.h"

展开为

# NOT A
# DEFINE A
class B
Class A {
    private:
    B b;
}
# ENDIF A

# NOT B
# DEFINE B
class A
Class B {
    private:
    A a;
}
# ENDIF B
```

但是上面的一定会报错的, 内存的相互包含是不可能成功的.

clas 就是告诉编译器, 先不要报错, 之后一定会有向前声明的类的 头文件. 而直接A里面包含B, B里面包含A, 由于宏, 会导致每个头文件里面信息不全, 又没有class的向前声明. 编译器就会报错了.




