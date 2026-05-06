# MaaFgo Agent

基于 MaaFramework 的 FGO（Fate/Grand Order）游戏自动化脚本 Agent。

## 功能特性

- **BBC 战斗系统**：通过 TCP 连接 BBC Server 执行自动化战斗，支持多种战斗类型（连续出击、爬塔、幕间、自由本、主线等）
- **事件驱动弹窗处理**：自动处理助战排序、队伍配置等确认对话框
- **Chaldea 队伍导入**：从 Chaldea 分享链接/ID 获取队伍数据并转换为 BBC 配置文件
- **大地图导航**：基于 OpenCV 图像匹配的章节关卡自动导航
- **模拟器连接管理**：支持 MuMu、雷电、ADB 等多种模拟器类型

## 目录结构

```
maa-fgo-agent/
├── main.py                    # 主入口文件
├── chaldea_converter.py       # Chaldea 队伍转换工具
├── custom/                    # 自定义 Action 模块
│   ├── bbc_action.py          # BBC 战斗任务执行
│   ├── bbc_connection_manager.py  # BBC TCP 连接管理器
│   ├── bbc_start.py           # BBC 启动 Action
│   ├── bbc_stop.py            # BBC 停止 Action
│   ├── chaldea_import_action.py   # Chaldea 队伍导入
│   ├── general_navigation_action.py  # 通用大地图导航
│   ├── mictlan_navigation_action.py  # 纳维·米克特兰专用导航
│   └── mfaalog.py             # 日志输出模块
├── chaldea/                   # Chaldea API 客户端
│   ├── chaldea_client.py      # Chaldea API 调用
│   ├── bbc_formatter.py       # BBC 配置格式化
│   └── game_data.py           # 游戏数据模型
├── mission_solver/            # 任务求解器
│   ├── solver.py              # 任务匹配算法
│   └── models.py              # 数据模型
└── utils/                     # 工具资源
    ├── map_coordinates.json   # 地图坐标映射
    └── Chaldea/               # Chaldea 数据文件
```

## 依赖环境

- **Python**: 3.8+
- **MaaFramework**: 最新版
- **OpenCV**: opencv-python
- **NumPy**: numpy
- **psutil**: psutil

## 使用方式

### 1. 安装依赖

```bash
pip install opencv-python numpy psutil
```

确保已安装 MaaFramework。

### 2. 配置 BBC

BBC (BBchannel) 是 FGO 自动化战斗的核心组件，需要单独下载和配置。

### 3. 运行 Agent

```bash
python main.py
```

## 核心模块说明

### BBC Action (`custom/bbc_action.py`)

执行 BBC 战斗任务的主模块，支持：
- 自动重试机制（最多 2 次）
- 游戏异常检测与自动重启
- 模拟器参数匹配验证
- 心跳检查（每 30 秒）

### 连接管理器 (`custom/bbc_connection_manager.py`)

管理 BBC TCP 连接和回调监听：
- TCP 命令通道（端口 25001）
- 回调监听线程（端口 25002）
- 进程级单例模式
- 消息队列缓存

### 大地图导航 (`custom/general_navigation_action.py`)

基于图像匹配的章节关卡导航：
- OpenCV 模板匹配定位当前位置
- 多边形可视区域检测
- 自动滑动直到目标可见
- 支持所有章节（冬木、奥尔良、卡美洛等）

### Chaldea 导入 (`custom/chaldea_import_action.py`)

从 Chaldea 网站导入队伍配置：
- 支持分享链接/ID/压缩数据
- 自动转换为 BBC 配置文件
- 保存到 BBchannel/settings 目录

## 注意事项

- 需要预先配置好 BBC 和模拟器环境
- 大地图导航需要对应的章节模板图片（存放在 `resource/base/image/map/`）
- Chaldea 导入需要网络连接访问 Chaldea API

## 相关项目

- [MaaFgo](https://github.com/xlxyvergil/MaaFgo) - 主项目仓库
- [MaaFramework](https://github.com/MaaXYZ/MaaFramework) - 自动化框架
- [BBchannel](https://github.com/xxx/BBchannel) - FGO 战斗脚本

## 许可证

本项目遵循原 MaaFgo 项目的许可证。
