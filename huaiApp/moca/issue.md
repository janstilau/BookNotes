# 问题

1. 当初为了什么要把接口设计成为从initDomain中读取其他接口的domain信息, 这样写有什么好处. 
    * 为了可以在之后切换接口? 是因为之前有人攻击接口吗?
    * 这样还是必须保持一个init接口必须是联通状态的啊.

    为什么要找一个timer不断地initSpreadChanel
    spreadManager里面, 为什么没有和用户进行事件ID的交互.