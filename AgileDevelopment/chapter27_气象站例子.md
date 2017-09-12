# 气象站  

要求开发一套程序,这套程序对应的硬件系统,和硬件系统的api会改变.

## 设计过程

气象站的程序很简单.程序定时从传感器sensor读取数据,然后显示数据到显示器上面.    


* 最初的设计,不是书里的设计,而是自己的  
	界面上有两个label,然后在控制器里面设置两个timer,一个timer1秒执行,一个timer5秒执行.读取硬件的api铁定是第三方api,在各个timer的timerout里面,利用第三方的api读取数据,然后将读取的数据赋值到label的text上,完成显示.   
	
	
这个程序有什么问题.这里iOS的mvc被用到了.所以,最大的问题就是,所有的逻辑,都写在了controller里面,但是会不会有变化呢.1, 增加一个sensor 2, 改变一下sensor读取频率 3, 稍微复杂的界面怎么办,要是想要实现自己控制的界面逻辑,应该有一个视图类,视图类暴露public方法更改自己视图 4, 这个项目最重要的,api会升级,在2.0 的项目里面,api可以会有变化  
	上面的这些改变,无论哪一个改变,都要修改controller里面的代码.代码耦合太大,1 不符合单一原则, 2 不符合开放封闭原则 3 不符合依赖倒置
	
* 首先,编写一个视图类,视图类很简单,就两个label,然后两个public method, update temperature, updatePressure,都接受一个double值.
	然后,编写一个定时类.之前两个定时器浪费,可以将不同的sensor的时间记录在定时类里面,定时类里面有一个定时器,每次调用记录次数,到达次数后调用相应的sensor的read函数.定时类里面包含screen类.在调用完sensor的read之后,调用screen的public方法,更改screen的显示.
	不同的sensor编写不同的类,在各个类里面,将api包装进去.后面我们发现,大气压要绘制变化趋势,所以要把之前的数据记录下来.也把这些记录的数据记录在这个sensor的类中.  
	
现在的程序有什么问题? 首先,定时类里面的职责过于集中.定时类中,要知道两个sensor类,一个screen类.里面要保存每个sensor的更新时间频率,并且根据频率去调用sensor的read方法,然后调用screen的方法. 这样的集中,1, 更改频率, 2 增加sensor 3, screen 改动api 都会导致定时类变化,而定时类变化,而这个类里面包含了太多的逻辑,过于危险. 

* 解耦定时类和screen.运用观察者模式,sensor是一个接口类的子类,addObserver和removeObserver.   
Observer是一个观察者类,在sensor调用完read之后,会调用observer的update方法,在书中就是运用的这种方法,在书中,screen类的内部,建立了两个observer的子类,都实现了update方法,一个update中调用screen的updateTemp,另一个调用了screen的updatePressure.这样,当sensor的read执行完之后,调用observer的update,observer的update里面又调用screen的方法,完成数据的交换.screen里面,保存两个observer的引用.  
在oc里面,可以利用oc的消息传递的特点,sensor变换成为addObserver:foraction,和button一样,不同的button调用不同的action,这里不同的sensor调用不同的action.  


这样做的好处在于什么.中间增加了一个observer接口层.之前是定时类里面,在调用sensor的read之后,调用screen的相应方法.方法名都是硬编码在代码里.而现在通过接口层,将代码的调用注册进去,其他的代码逻辑根据接口编程,需要更改的话,仅仅更改注册的地方就可以了.这个时候,screen已经和定时类没有关系了.  

解耦定时类和sensor. sensor该多少秒刷新一次,也不应该定时类中保存.还是运用观察者模式,sensor将自己和刷新的频率注册到定时类中,然后定时类在每次timeout的时候,调用sensor的readtimeout方法.sensor的timeout里面,是自己的read调用和notifiobserver调用.这样,都是根据接口编程的.

那这样,sensor也就和定时类进行了解耦.定时类仅仅值作为一个定时器进行使用了.  

* sensor接口和实现的解耦.  
sensor的接口中,是调用第三方api进行read操作的.想象一下afn的接口,afn提供了很多的接口,1 afn的风格和自己的项目风格不同 2 afn的接口会改变,不应该每次afn改变,就改变所有调用afn的地方. 所以,我们一般对第三方的api进行包装.这种包装,可以保证,每次调用相关功能的时候,自己项目中总是同样的代码,而第三方api的变化在包装类里面.  
接口和实现的分离就是在包装类中,包含一个实现类.然后包装类中调用实现类的功能进行功能调用.为什么要这样.因为包装类中,可以也有自己本身的业务逻辑,这些业务逻辑加上第三方api调用,就会成为嘈杂的一团,将api分离出去,可以保持单一原则,而且,其实这种分离,平时也用的很多.很多情况下,通过将代码移植到实现类中,才能使得一个类具有复杂的功能.  
将sensor的接口和实现隔离开,那么在2.0的时候,我们仅仅是把sensor的实现更改,就可以实现2.0的升级.而2.0实现的代码,不用更改1.0实现的代码,新写类,替换引用,完成升级.


	
	
	
	
	

		
		
	

