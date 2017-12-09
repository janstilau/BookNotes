# conflictReview

## 代码逻辑

函数是判断被检测层(为了区分以下简称选中层)和其余的可见检测层是否有冲突, 现有四种情况

1. 选中层某图块为1的面积, 检测层某图块1的面积
2. 选中层某图块为>1的面积, 检测层某图块1的面积
3. 选中层某图块为1的面积, 检测层某图块>1的面积
4. 选中层某图块为>1的面积, 检测层某图块>1的面积

现在代码有两种判断

1. 在检测层的图块范围里, 判断选中层在这个范围的某个位置上有没有图块, 如果有判断一下冲突.

``` Cpp
auto &curCell = layerToCheck->cellAt(i, j);
if (curCell.isEmpty()) { continue; }
```

上面的代码, 可以看做是把选中层的图块都认为是面积为1的单位, 这个方法是之前的代码, 意图在于, 在遍历检测层某图块的范围的时候, 如果这个位置选中层上没数据, 就略过, 有才做检测. 并且在在这个方法里有着记录选中层图块范围的一句代码`if(posRect.width() > 1 || posRect.height() > 1){记录选中层范围}`, 这里也是只记录的图块范围大于1的范围. 上面两个略过的地方, 使得两个方法逻辑分离.

2. 记录选中层和检测层的各个图块范围, 然后判断这个范围有没有相交, 如果相交, 判断相交点对应的选中层图块和检测层图块是不是冲突

那么其实可以都用下面的范围判断的方法, 这样逻辑能够统一.

并且, 如果都用这种判断方法, 还可以做某些优化:

* 提前遍历选中层, 将选中层的范围存在QMultiMap<int, int> cover里面, 然后在遍历检测层的时候, 就可以仅仅检测层上面某图块的范围在不在cover里, 例如(1-1, 1-2, 2-1, 2-2)这四个坐标生成的key值存储在cover吗? 这样可以减少运算. 按照现在的算法, 在循环的后面, `for(auto checkCoverPos : coverCheckLayer.keys()) { ... if(layerCoverPos.contains(checkCoverPos){...}     ...} `中应该会有重复的运算.

## businessutl.cpp

```CPP
bool BusinessUtil::isCompatible(bool isTerrainLayer1, const Tile *tile1, bool isTerrainLayer2, const Tile *tile2)
{
    if (!isTerrainLayer1 && !isTerrainLayer2) { return true; } // 这逻辑是不是反了, 都不是地形层应该冲突
    if (!tile1 || !tile2) return true;
    auto exType1 = getPropertyEx(tile1);
    auto exType2 = getPropertyEx(tile2);
    if (exType1 != exType2) { // 这里下面的判断感觉没有作用, 不相等返回false就可以
        if (!exType1.isEmpty() || !exType2.isEmpty()) {
            return false;
        }
    }
    return true;
}
```

## cleartilelayerconflict.cpp

* 45行的if和for循环缩进
* 命名问题,例如:
    1. 89行的`auto coverCheckLayer = cover[layerToCheck];`, 这是一个multiMap, 用layer在下面阅读的时候有歧义
    2. QMap<TileLayer *, QMultiMap<int, int>> cover; cover的意义太宽了, 因为这个代码段好多类似cover的变量, 这个命名可以详细些, layerCovers, 一般这种短小的词语在某个功能代码块里面出现合适.
