# BBC Battle System

BBC (BBchannel) 战斗系统，通过 TCP 连接执行 FGO 自动化战斗。

## 功能

- TCP 命令通道（端口 25001）和回调监听（端口 25002）
- 支持连续出击、爬塔、幕间、自由本、主线等多种战斗类型
- 事件驱动弹窗处理（助战排序、队伍配置等）
- 自动重试机制（最多 2 次）
- 游戏异常检测与自动重启
- 心跳检查（每 30 秒）

## 文件说明

- `bbc_action.py` - BBC 战斗任务执行主模块
- `bbc_connection_manager.py` - TCP 连接管理器（单例模式）
- `bbc_start.py` - BBC 启动 Action
- `bbc_stop.py` - BBC 停止 Action
- `mfaalog.py` - 日志输出模块

## 使用方式

```python
from bbc_action import BbcAction

action = BbcAction()
result = action.run(context, node_name, node_param)
```

## 依赖

- MaaFramework
- psutil

## 注意事项

需要预先配置 BBC Server 和模拟器环境。
