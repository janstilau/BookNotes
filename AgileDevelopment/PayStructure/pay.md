# 支付系统

 客户交流:  
 1 有些员工钟点工.每天提交工作时间卡,记录日期和工作时长.如果超过8小时,超过的部分按正常的1.5支付. 每周五支付.
 2 月薪支付.每个月的最后一个工作日支付.他们的雇员记录中有一个月薪字段.
 3 带薪雇员.根据销售支付酬薪,提供销售凭条,记录销售的日期和数量.雇员记录中有一个酬薪报酬字段.每个一周的周五支付.
 4 雇员可以选择支付方式. 支票邮寄到邮政地址 或者 保存在出纳那随时支取 或者 直接打入银行账户.
 5 雇员会加入协会.这些的雇员记录里有一个每周应付款项字段.这些要从薪水中扣除.协会有时会征收费用,协会每周会提交这些费用,这些费用,要在相应雇员的下个月薪水总额中扣除.
 6 支付程序每天工作一次,为相应的雇员支付.系统告诉雇员的支付日期,计算从上次支付日期到本次应付的钱数.
 
### 分析
这个问题,当然可以使用数据库,但是,数据库是实现的细节,应该尽可能的推迟考虑数据库,太多的程序之所以和数据库绑定在一起无法分离,就是因为一开始设计的时候就把数据库考虑在内了.请记住抽象的定义,本质部分的放大,无关紧要的部分去除.  

一种捕捉,分析系统行为的方法是创建用例.    
1. 增加新的雇员.AddEmp  
	addEmp id name  address hourly-rate  
	adEmp id name  address monthly-rate  
	adEmp id name  address monthly-rate commisstion-rate  
	异常: 如果操作不正确,打印错误并不执行处理.
	这里面,隐含着一个抽象,就是共享了id,name,address. 可以用command模式创建一个addEmpCommand,然后派生三个各自的command.通过把每项工作,放到自己的类中,遵循了单一原则.如果把这些放在一个模块了,用switch区分,虽然可以减少类的数目,但是所有操作集中在一起,很容易出错.  
	这三个command里面都是添加雇员的操作.雇员的对象模型是什么.现在看来,应该有着三种不同的雇员.command和employee是一个平行继承体系.  
2. 删除雇员.DelEmp  
	delEmp id  
	异常:如果id格式不正确,或者id没有在数据库找到,打印出错,不进行处理.  
3. 登记时间卡  
	timeCard id date hours  
	异常: 如果不是钟点工,打印出错,不进行处理  如果结构有误,打印出错,不进行处理.  
	一些操作只能用在特殊类上,也加强了不同种类不同类的观点.同时,也暗示需要一个时间卡类和钟点工之间的关联.  
4. 登记销售凭条.  
	SaleReceipt id date amount  
	异常: 不是销售人员, 打印出错,不进一步处理  如果结构有误,打印出错,不进行处理.  
	和3差不多,暗示需要一个凭条类.  
5. 登记写会服务费.   
	serviceCharge memberId amount   
	异常: 打印出错,不进行处理  
	首先memberId和id不是一个东西,协会那里的memberID和我们的id需要进行映射.   
6. 更改明细.  
	ChangeEmp id name  
	ChangeEmp id address  
	ChangeEmp id hourly-rate  
	ChangeEmp id saraly  
	ChangeEmp id saraly commission-rate  酬金  
	ChangeEmp id hold 支票     
	ChangeEmp id bank amount  银行  
	ChangeEmp id name mail 邮寄    
	ChangeEmp id memberid organization  加入协会  
	ChangeEmp id nomember 退出协会  
	如果,可以更改雇员的类型,那么我们将雇员用三个子类进行表示的模型就有问题.因为对于雇员这个类来说,它只能改变自己的内在数据,不能更改自己的类所属.而3, 4 根据不同类型进行不同的操作,这可以分为策略,emp类可以拥有一个策略类,这样的好处在于,可以动态的更改雇员的薪水相关的操作.因为在静态语言里,不能更改对象类型,就算动态类型可以更改,为了业务去做这种黑魔法也很不友好.  
	三种PaymentClassification.hourly,salaried以及commissioned. hour保存着小时报酬和一个timeCard列表,salaried保存着月薪,commisstioned保存着月薪,酬金报酬和saleReceipt列表.  
	同样的支付方式,也应该用组合的方式,paymentInterface 下面有着三个不同的子类,分别代表着邮寄,支取以及银行.更换不同的对象代表着不同的支付方式.  
	最后,协会成员关系用了nullObject模式.如果雇员的协会对象是nullobject,那么他的薪水不受协会影响,如果真正拥有一个协会,那么协会对象里面有着对于这个雇员的服务费用以及固定的会费.
	
7. 发薪 
	系统寻找今日发薪的雇员,计算扣款,按照方式发薪.
	pay date
	首先,自然是寻找操作,寻找出需要发薪的雇员,但是计算薪水这个工作放在那里呢.现在看来,代理给他的paymentClassification对象是可以的.三种不同的薪酬类型,每一个种payment之中,有着不同的计算策略.   
	
	
## 抽象策略  
paymentClassification里面,有着什么抽象呢,那就是所有的雇员都要发薪水,但是策略不同.所以,payment被抽象出来,不同的发薪策略放在实现层.

		
	
	


 
 
 	