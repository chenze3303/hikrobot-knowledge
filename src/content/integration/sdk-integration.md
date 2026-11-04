---
title: SDK 二次开发入门：把读码能力嵌进业务系统
summary: "需要自定义触发、结果处理和图像保存时，用 SDK。本文给出通用架构与伪代码。"
tags: [SDK, 二次开发, 集成, API]
level: 进阶
updated: 2026-10-20
order: 4
---

# SDK 二次开发入门

当标准通讯协议不够用，或者需要把读码能力嵌进 MES、WMS、检测软件时，SDK 是更灵活的选择。

## 一、先确认 SDK 能力

- 设备枚举与连接
- 软触发
- 结果回调
- 图像回调
- 参数读写
- 固件/版本查询
- 多设备管理

从官方下载中心获取对应版本的 SDK 和示例代码，不要混用不同大版本。

## 二、通用架构

```text
初始化 SDK
  → 枚举设备
  → 打开设备
  → 注册结果/图像回调
  → 配置触发与参数
  → 启动采集
  → 业务处理
  → 停止采集
  → 关闭设备
  → 释放 SDK
```

## 三、伪代码

```csharp
var devices = Sdk.EnumerateDevices();
var device = Sdk.Open(devices[0]);
device.OnResult += (result) => {
    if (result.Ok) {
        Business.Save(result.Text, result.Timestamp);
    } else {
        Log.Warn("read failed");
    }
};
device.SetTriggerMode(TriggerMode.Software);
device.Start();
device.Trigger();
// ...
device.Stop();
device.Close();
```

> 以上为通用示意，实际类名和方法以 SDK 文档为准。

## 四、工程化要点

- 回调里不要做耗时业务，转交队列处理。
- 多设备时区分设备 ID 和工位号。
- 处理断线、重连和设备异常。
- 回调线程与 UI 线程分离。
- 记录原始结果和图像路径。
- SDK 版本与固件版本要匹配。

## 五、部署注意

- 目标机器安装对应运行时。
- 确认 32/64 位一致。
- 防火墙与网卡配置。
- 长时间运行的内存与句柄监控。
- 升级 SDK 前做回归测试。

## 六、常见问题

- **枚举不到设备**：网段、权限、SDK 版本。
- **回调不触发**：未启动采集或触发模式错误。
- **图像回调卡顿**：回调里做了重活。
- **程序退出后设备仍占用**：未正确关闭/释放。
